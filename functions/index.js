const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { getMessaging } = require('firebase-admin/messaging');
const { Readable } = require('stream');

initializeApp();

// ── Google Drive config (from environment variables) ──
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

/**
 * Get a fresh Google Drive access token using the stored refresh token.
 * - In production: reads refresh token from Firestore (settings/googleDriveAuth)
 * - In development: reads from functions/driveToken.json (if exists) to avoid Firestore dependency
 */
const getRefreshToken = async () => {
  // Try local file first (works in dev and production)
  try {
    // Clear require cache so updated file is read
    delete require.cache[require.resolve('./driveToken.json')];
    const tokenData = require('./driveToken.json');
    if (tokenData.refreshToken) return tokenData.refreshToken;
  } catch {}

  // Fall back to Firestore with 5s timeout
  try {
    const db = getFirestore();
    const doc = await Promise.race([
      db.collection('settings').doc('googleDriveAuth').get(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 5000)),
    ]);
    if (doc.exists && doc.data().refreshToken) return doc.data().refreshToken;
  } catch (err) {
    console.warn('Firestore read failed:', err.message);
  }

  throw new Error('Google Drive refresh token not found. Click "Connect Google Drive" in Settings.');
};

const getDriveAccessToken = async () => {
  const refreshToken = await getRefreshToken();

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Token refresh failed: ${data.error_description || data.error}`);
  }

  return data.access_token;
};

/**
 * Upload file to Google Drive using access token (multipart upload).
 */
const uploadToGoogleDrive = async (accessToken, buffer, fileName, mimeType) => {
  const boundary = '-------bharatinsurance' + Date.now();
  const metadata = JSON.stringify({
    name: fileName,
    mimeType: mimeType,
    parents: [DRIVE_FOLDER_ID],
  });

  const base64Data = buffer.toString('base64');

  const multipartBody =
    `\r\n--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    metadata +
    `\r\n--${boundary}\r\n` +
    `Content-Type: ${mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    `\r\n--${boundary}--`;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed (${uploadRes.status})`);
  }

  const { id: fileId } = await uploadRes.json();

  // Set public permission
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });

  return fileId;
};

// ── Exchange OAuth auth code for refresh token (one-time setup) ──
exports.exchangeDriveAuthCode = onCall({ memory: '128MiB', timeoutSeconds: 60 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in.');
  }

  const { authCode } = request.data;
  if (!authCode || typeof authCode !== 'string') {
    throw new HttpsError('invalid-argument', 'authCode is required.');
  }

  try {
    // Exchange auth code for tokens — redirect_uri=postmessage is for GIS popup mode
    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: authCode,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: 'postmessage',
        grant_type: 'authorization_code',
      }),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error_description || data.error);
    }

    if (!data.refresh_token) {
      throw new Error('No refresh token received. Make sure prompt=consent was used.');
    }

    console.log('Refresh token received successfully!');

    // Save to local file (works in both dev and production)
    try {
      const fs = require('fs');
      const path = require('path');
      const tokenPath = path.join(__dirname, 'driveToken.json');
      fs.writeFileSync(tokenPath, JSON.stringify({ refreshToken: data.refresh_token }, null, 2));
      console.log('Refresh token saved to driveToken.json');
    } catch (fsErr) {
      console.warn('Could not save to local file:', fsErr.message);
    }

    // Also try saving to Firestore with 5s timeout (may hang in emulator)
    try {
      const db = getFirestore();
      await Promise.race([
        db.collection('settings').doc('googleDriveAuth').set({
          refreshToken: data.refresh_token,
          updatedAt: new Date(),
          updatedBy: request.auth.uid,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 5000)),
      ]);
      console.log('Refresh token saved to Firestore');
    } catch (dbErr) {
      console.warn('Firestore save skipped (using local file):', dbErr.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Auth code exchange failed:', error.message);
    throw new HttpsError('internal', 'Failed to connect Google Drive: ' + error.message);
  }
});

// ── Upload image to Google Drive ──
exports.uploadToDrive = onCall({ memory: '256MiB', timeoutSeconds: 60 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to upload images.');
  }

  const { imageData, fileName, mimeType } = request.data;

  if (!imageData || typeof imageData !== 'string') {
    throw new HttpsError('invalid-argument', 'imageData (base64) is required.');
  }
  if (!mimeType || !mimeType.startsWith('image/')) {
    throw new HttpsError('invalid-argument', 'Valid image mimeType is required.');
  }
  if (imageData.length > 5 * 1024 * 1024) {
    throw new HttpsError('invalid-argument', 'Image is too large. Maximum 5MB.');
  }

  try {
    const accessToken = await getDriveAccessToken();
    const buffer = Buffer.from(imageData, 'base64');
    const fileId = await uploadToGoogleDrive(
      accessToken,
      buffer,
      fileName || `image_${Date.now()}.jpg`,
      mimeType
    );

    const imageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    console.log(`Image uploaded: ${fileId} by user ${request.auth.uid}`);

    return { fileId, imageUrl };
  } catch (error) {
    console.error('Drive upload failed:', error.message);
    throw new HttpsError('internal', 'Upload failed: ' + error.message);
  }
});

// ── Delete image from Google Drive ──
exports.deleteFromDrive = onCall({ memory: '128MiB', timeoutSeconds: 30 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to delete images.');
  }

  const { fileId } = request.data;

  if (!fileId || typeof fileId !== 'string') {
    throw new HttpsError('invalid-argument', 'fileId is required.');
  }

  try {
    const accessToken = await getDriveAccessToken();

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 204 = success, 404 = already gone
    if (!res.ok && res.status !== 404 && res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Delete failed (${res.status})`);
    }

    console.log(`Image deleted: ${fileId} by user ${request.auth.uid}`);
    return { success: true };
  } catch (error) {
    console.error('Drive delete failed:', error.message);
    throw new HttpsError('internal', 'Delete failed: ' + error.message);
  }
});

// ── FCM notification on new lead ──
exports.onNewLead = onDocumentCreated('leads/{leadId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const leadData = snapshot.data();
  const leadId = event.params.leadId;

  const fullName = leadData.personalInfo?.fullName || 'Unknown';
  const mobile = leadData.personalInfo?.mobile || '';
  const formType = leadData.formType || '';
  const serviceTitle = leadData.serviceTitle || formType || 'Insurance Inquiry';

  const db = getFirestore();
  const tokensSnapshot = await db.collection('fcmTokens').get();

  if (tokensSnapshot.empty) {
    console.log('No FCM tokens registered — skipping notification.');
    return;
  }

  const tokens = [];
  tokensSnapshot.forEach((doc) => {
    const token = doc.data().token;
    if (token) tokens.push(token);
  });

  if (tokens.length === 0) {
    console.log('No valid tokens found.');
    return;
  }

  const message = {
    notification: {
      title: 'New Insurance Lead!',
      body: `${fullName} — ${serviceTitle}${mobile ? ` (${mobile})` : ''}`,
    },
    data: {
      leadId: leadId,
      fullName: fullName,
      mobile: mobile,
      formType: formType,
      serviceTitle: serviceTitle,
      type: 'new_lead',
      clickAction: '/admin/leads/' + leadId,
    },
    webpush: {
      notification: {
        icon: '/logo.png',
        badge: '/logo.png',
        requireInteraction: 'true',
        actions: [
          { action: 'view', title: 'View Lead' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
      },
      fcmOptions: {
        link: '/admin/leads/' + leadId,
      },
    },
  };

  const messaging = getMessaging();

  try {
    const response = await messaging.sendEachForMulticast({
      ...message,
      tokens: tokens,
    });

    console.log(
      `FCM sent: ${response.successCount} success, ${response.failureCount} failed (total: ${tokens.length})`
    );

    const tokensToRemove = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code;
        if (
          errorCode === 'messaging/invalid-registration-token' ||
          errorCode === 'messaging/registration-token-not-registered'
        ) {
          tokensToRemove.push(tokens[idx]);
        }
      }
    });

    if (tokensToRemove.length > 0) {
      const batch = db.batch();
      for (const invalidToken of tokensToRemove) {
        const querySnapshot = await db
          .collection('fcmTokens')
          .where('token', '==', invalidToken)
          .get();
        querySnapshot.forEach((doc) => batch.delete(doc.ref));
      }
      await batch.commit();
      console.log(`Cleaned up ${tokensToRemove.length} invalid tokens.`);
    }
  } catch (error) {
    console.error('Error sending FCM:', error);
  }
});

// ── Helper: verify caller is super_admin ──
const verifySuperAdmin = async (uid) => {
  const db = getFirestore();
  const callerDoc = await db.collection('admins').doc(uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Only super admins can perform this action.');
  }
  return callerDoc.data();
};

// ── Create a new admin user (Firebase Auth + Firestore doc) ──
exports.createAdmin = onCall({ memory: '128MiB', timeoutSeconds: 30 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in.');
  }
  await verifySuperAdmin(request.auth.uid);

  const { email, password, name, mobile, role, permissions } = request.data;

  if (!email || !password || !name || !mobile) {
    throw new HttpsError('invalid-argument', 'email, password, name, and mobile are required.');
  }
  if (password.length < 6) {
    throw new HttpsError('invalid-argument', 'Password must be at least 6 characters.');
  }

  try {
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: name,
    });

    const db = getFirestore();
    await db.collection('admins').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      mobile,
      role: role || 'admin',
      permissions: permissions || [],
      companyName: '',
      isActive: true,
      avatar: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`Admin created: ${userRecord.uid} (${email}) by ${request.auth.uid}`);
    return { uid: userRecord.uid, success: true };
  } catch (error) {
    console.error('Create admin failed:', error.message);
    if (error.code === 'auth/email-already-exists') {
      throw new HttpsError('already-exists', 'An account with this email already exists.');
    }
    throw new HttpsError('internal', 'Failed to create admin: ' + error.message);
  }
});

// ── Update admin email (requires Admin SDK) ──
exports.updateAdminEmail = onCall({ memory: '128MiB', timeoutSeconds: 30 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in.');
  }
  await verifySuperAdmin(request.auth.uid);

  const { adminUid, newEmail } = request.data;
  if (!adminUid || !newEmail) {
    throw new HttpsError('invalid-argument', 'adminUid and newEmail are required.');
  }

  try {
    await getAuth().updateUser(adminUid, { email: newEmail });

    const db = getFirestore();
    await db.collection('admins').doc(adminUid).update({
      email: newEmail,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`Admin email updated: ${adminUid} -> ${newEmail} by ${request.auth.uid}`);
    return { success: true };
  } catch (error) {
    console.error('Update admin email failed:', error.message);
    if (error.code === 'auth/email-already-exists') {
      throw new HttpsError('already-exists', 'This email is already in use by another account.');
    }
    throw new HttpsError('internal', 'Failed to update email: ' + error.message);
  }
});

// ── Seed Super Admin (one-time use to promote first admin) ──
exports.seedSuperAdmin = onCall({ memory: '128MiB', timeoutSeconds: 30 }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in.');
  }

  const db = getFirestore();

  // Check if any super_admin already exists
  const existingSuper = await db.collection('admins').where('role', '==', 'super_admin').get();
  if (!existingSuper.empty) {
    throw new HttpsError('already-exists', 'A super admin already exists. Use the admin management page instead.');
  }

  // Promote the caller to super_admin
  const callerDoc = await db.collection('admins').doc(request.auth.uid).get();
  if (!callerDoc.exists) {
    throw new HttpsError('not-found', 'Your admin profile was not found.');
  }

  await db.collection('admins').doc(request.auth.uid).update({
    role: 'super_admin',
    permissions: ['dashboard', 'leads', 'services', 'slider', 'testimonials', 'settings'],
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`Super admin seeded: ${request.auth.uid}`);
  return { success: true, message: 'You are now a super admin. Please log out and log back in.' };
});
