# Firebase & Google Drive Integration - Complete Documentation

## Project: Bharat Insurance

---

## 1. FIREBASE CREDENTIALS (Complete)

```
File: .env

VITE_FIREBASE_API_KEY=AIzaSyCb33rq5m2GAdf0ln4T05ZHHvY8FwwOgBk
VITE_FIREBASE_AUTH_DOMAIN=royalwebdeveloping-2beda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=royalwebdeveloping-2beda
VITE_FIREBASE_STORAGE_BUCKET=royalwebdeveloping-2beda.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=741920745658
VITE_FIREBASE_APP_ID=1:741920745658:web:7a7f4df8d68bea3174fa83
VITE_FIREBASE_MEASUREMENT_ID=G-1GBYMN78K7
```

| Field                | Value                                            |
| -------------------- | ------------------------------------------------ |
| Project ID           | `royalwebdeveloping-2beda`                       |
| Auth Domain          | `royalwebdeveloping-2beda.firebaseapp.com`       |
| Storage Bucket       | `royalwebdeveloping-2beda.firebasestorage.app`   |
| API Key              | `AIzaSyCb33rq5m2GAdf0ln4T05ZHHvY8FwwOgBk`       |
| Messaging Sender ID  | `741920745658`                                   |
| App ID               | `1:741920745658:web:7a7f4df8d68bea3174fa83`      |
| Measurement ID       | `G-1GBYMN78K7`                                   |

### Firebase Services Used:
- **Firestore** - Database (leads, services, settings, sliderImages collections)
- **Firebase Storage** - Available but NOT used for images (Google Drive is used instead)
- **Firebase Auth** - Authentication
- **Firebase Cloud Messaging (FCM)** - Push notifications

---

## 2. GOOGLE DRIVE CREDENTIALS (Complete)

```
File: src/services/googleDrive.js

CLIENT_ID     = 'YOUR_GOOGLE_CLIENT_ID'
CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'
DRIVE_FOLDER_ID = '1y5PxouYuTN8k0z3VpPjCRXcTvslcxtIV'
SCOPES        = 'https://www.googleapis.com/auth/drive.file'
TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
```

| Field            | Value                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| OAuth Client ID  | `YOUR_GOOGLE_CLIENT_ID` |
| Client Secret    | `YOUR_GOOGLE_CLIENT_SECRET`                                 |
| Drive Folder ID  | `1y5PxouYuTN8k0z3VpPjCRXcTvslcxtIV`                                    |
| API Scope        | `https://www.googleapis.com/auth/drive.file`                            |
| Token Endpoint   | `https://oauth2.googleapis.com/token`                                   |

---

## 3. COMPLETE PROCESS FLOW (Image Upload to Display)

```
+---------------------------+
|   Admin Panel (Slider)    |
|   User selects image      |
+-------------+-------------+
              |
              v
+---------------------------+
|   Image Crop (16:5 ratio) |
|   react-easy-crop         |
|   Output: JPEG Blob 0.85q |
+-------------+-------------+
              |
              v
+---------------------------+
|   STEP 1: Upload to       |
|   Google Drive             |
|   POST multipart request   |
|   to googleapis.com        |
|   Returns: fileId          |
+-------------+-------------+
              |
              v
+---------------------------+
|   STEP 2: Set Permission   |
|   role: 'reader'           |
|   type: 'anyone'           |
|   (Public access)          |
+-------------+-------------+
              |
              v
+---------------------------+
|   STEP 3: Generate URL     |
|   Format:                  |
|   https://lh3.google       |
|   usercontent.com/d/{ID}   |
+-------------+-------------+
              |
              v
+---------------------------+
|   STEP 4: Save to Firebase |
|   Firestore Collection:    |
|   'sliderImages'           |
|   Fields:                  |
|   - title                  |
|   - imageUrl (GD URL)      |
|   - driveFileId            |
|   - order                  |
|   - createdAt              |
+-------------+-------------+
              |
              v
+---------------------------+
|   STEP 5: Homepage Display |
|   HeroSlider component     |
|   Fetches from Firestore   |
|   Loads images from GD URL |
|   referrerPolicy:          |
|     "no-referrer"          |
+---------------------------+
```

### Delete Process:
```
1. Google Drive se image DELETE  -->  DELETE https://www.googleapis.com/drive/v3/files/{fileId}
2. Firestore se document DELETE  -->  deleteDoc(sliderImages/{docId})
```

---

## 4. URL FORMAT (Google Drive Image)

```
Format:  https://lh3.googleusercontent.com/d/{FILE_ID}

Example: https://lh3.googleusercontent.com/d/1y5PxouYuTN8k0z3VpPjCRXcTvslcxtIV
```

**Note:** Yeh URL tab work karti hai jab file ki permission `anyone with the link can view` set ho. Code me yeh automatically set hota hai upload ke baad.

**Important:** Image load karte waqt `referrerPolicy="no-referrer"` use karna zaroori hai, warna CORS issues aate hain.

---

## 5. FIRESTORE DOCUMENT STRUCTURES

### Collection: `sliderImages`
```json
{
  "id": "auto-generated-doc-id",
  "title": "Slide 1",
  "imageUrl": "https://lh3.googleusercontent.com/d/1A2B3C4D5E6F...",
  "driveFileId": "1A2B3C4D5E6F...",
  "order": 0,
  "createdAt": "Timestamp"
}
```

### Collection: `settings` / Document: `googleDriveAuth`
```json
{
  "id": "googleDriveAuth",
  "refreshToken": "1//0gXxyz...",
  "updatedAt": "Timestamp"
}
```

---

## 6. GOOGLE DRIVE AUTHENTICATION FLOW

### One-Time Setup (First time only):
```
1. Admin clicks "Setup Google Drive (one-time)" button
2. Google Identity Services (GIS) popup opens
3. User grants permission
4. Auth code received from Google
5. Auth code exchanged for access_token + refresh_token
6. refresh_token saved to Firestore (settings/googleDriveAuth)
7. access_token stored in memory for current session
```

### Silent Auth (Every page load):
```
1. Page loads -> getDriveToken() -> Firestore se refresh_token fetch
2. refresh_token ko TOKEN_ENDPOINT pe POST
3. New access_token milta hai (short-lived)
4. access_token memory me store hota hai
5. Google Drive ready for uploads/deletes
```

---

## 7. GOOGLE DRIVE COMPLETE CODE

**File: `src/services/googleDrive.js`**

```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const DRIVE_FOLDER_ID = '1y5PxouYuTN8k0z3VpPjCRXcTvslcxtIV';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

let accessToken = null;
let codeClient = null;

/**
 * Initialise the GIS code client (needed for first-time authorization only).
 */
export const initGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services not loaded'));
      return;
    }
    // We only need the code client for the one-time setup flow
    codeClient = window.google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      ux_mode: 'popup',
      callback: () => {}, // overwritten per call
    });
    resolve();
  });
};

/**
 * ONE-TIME: Trigger Google consent popup -> exchange auth code for refresh token.
 * Returns the refresh_token string to be stored in Firebase.
 */
export const authorizeAndGetRefreshToken = () => {
  return new Promise((resolve, reject) => {
    if (!codeClient) {
      reject(new Error('Call initGoogleAuth() first'));
      return;
    }

    codeClient.callback = async (response) => {
      if (response.error) {
        reject(new Error(response.error));
        return;
      }

      try {
        // Exchange auth code for tokens
        const tokenRes = await fetch(TOKEN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: response.code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: window.location.origin,
            grant_type: 'authorization_code',
          }),
        });

        const data = await tokenRes.json();
        if (data.error) {
          reject(new Error(data.error_description || data.error));
          return;
        }

        accessToken = data.access_token;
        resolve(data.refresh_token);
      } catch (err) {
        reject(err);
      }
    };

    codeClient.error_callback = (err) => {
      reject(new Error(err.message || 'Google authorization failed'));
    };

    codeClient.requestCode();
  });
};

/**
 * SILENT: Use a stored refresh token to get a fresh access token.
 * No user interaction needed - call this on every page load.
 */
export const silentAuth = async (refreshToken) => {
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
    throw new Error(data.error_description || data.error);
  }

  accessToken = data.access_token;
  return accessToken;
};

/**
 * Check if we have a valid access token.
 */
export const isReady = () => Boolean(accessToken);

/**
 * Upload an image file (Blob/File) to the configured Google Drive folder.
 * Sets the file to "anyone with the link can view".
 * Returns the Drive file ID.
 */
export const uploadImage = async (file, fileName) => {
  if (!accessToken) throw new Error('Google Drive not authenticated');

  const metadata = {
    name: fileName || file.name || `slider_${Date.now()}.jpg`,
    mimeType: file.type || 'image/jpeg',
    parents: [DRIVE_FOLDER_ID],
  };

  // Build multipart request body
  const boundary = '-------bharatinsurance';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Read file as base64
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const multipartBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${metadata.mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    closeDelimiter;

  // Upload
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

  // Set public permission so anyone can view
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    }
  );

  return fileId;
};

/**
 * Delete a file from Google Drive by its file ID.
 */
export const deleteImage = async (fileId) => {
  if (!accessToken) throw new Error('Google Drive not authenticated');

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  // 204 = success, 404 = already gone (treat as success)
  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Delete failed (${res.status})`);
  }

  return true;
};

/**
 * Return the publicly-viewable image URL for a Drive file ID.
 */
export const getImageUrl = (fileId) => {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};
```

---

## 8. FIREBASE RELATED CODE (Google Drive Token + Slider Images)

**File: `src/services/firebase/firestore.js` (Relevant sections only)**

### Google Drive Token Management:
```javascript
const DRIVE_TOKEN_DOC_ID = 'googleDriveAuth';

/**
 * Get the stored Google Drive refresh token from Firebase.
 * Returns the refresh token string or null if not set up yet.
 */
export const getDriveToken = async () => {
  if (!db) return null;

  const docRef = doc(db, COLLECTIONS.SETTINGS, DRIVE_TOKEN_DOC_ID);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data().refreshToken || null;
};

/**
 * Save the Google Drive refresh token to Firebase (one-time setup).
 */
export const saveDriveToken = async (refreshToken) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, COLLECTIONS.SETTINGS, DRIVE_TOKEN_DOC_ID);
  await setDoc(docRef, {
    refreshToken,
    updatedAt: serverTimestamp(),
  });
  return true;
};
```

### Slider Images CRUD:
```javascript
/**
 * Add a new slider image document to Firestore
 * @param {{ title: string, imageUrl: string, driveFileId: string, order: number }} data
 */
export const addSliderImage = async (data) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = await addDoc(collection(db, COLLECTIONS.SLIDER_IMAGES), {
    title: data.title || '',
    imageUrl: data.imageUrl || '',
    driveFileId: data.driveFileId || '',
    order: data.order ?? 0,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...data,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Get all slider images ordered by `order` field
 */
export const getSliderImages = async () => {
  if (!db) throw new Error('Firebase not configured');

  const q = query(
    collection(db, COLLECTIONS.SLIDER_IMAGES),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const d = docSnap.data();
    return {
      id: docSnap.id,
      title: d.title || '',
      imageUrl: d.imageUrl || '',
      driveFileId: d.driveFileId || '',
      order: d.order ?? 0,
      createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt || '',
    };
  });
};

/**
 * Update a slider image document (title, order, etc.)
 */
export const updateSliderImage = async (id, updates) => {
  if (!db) throw new Error('Firebase not configured');

  const docRef = doc(db, COLLECTIONS.SLIDER_IMAGES, id);
  const updateData = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.order !== undefined) updateData.order = updates.order;
  if (updates.imageUrl !== undefined) updateData.imageUrl = updates.imageUrl;
  if (updates.driveFileId !== undefined) updateData.driveFileId = updates.driveFileId;

  await updateDoc(docRef, updateData);
  return { id, ...updates };
};

/**
 * Delete a slider image document from Firestore
 */
export const deleteSliderImage = async (id) => {
  if (!db) throw new Error('Firebase not configured');
  await deleteDoc(doc(db, COLLECTIONS.SLIDER_IMAGES, id));
  return true;
};
```

---

## 9. FIREBASE INITIALIZATION CODE

**File: `src/services/firebase/firebase.js`**

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if Firebase is properly configured
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error.message);
    console.warn('The app will continue using localStorage fallback.');
  }
} else {
  console.warn(
    'Firebase environment variables are not set. ' +
    'The app will use localStorage as a fallback. ' +
    'To enable Firebase, set VITE_FIREBASE_* variables in your .env file.'
  );
}

export { db, storage, auth, isFirebaseConfigured };
export default app;
```

---

## 10. SAMPLE USAGE - Admin Slider Page me kaise use ho raha hai

**File: `src/pages/admin/Slider.jsx`**

### Imports:
```javascript
import {
  initGoogleAuth,
  authorizeAndGetRefreshToken,
  silentAuth,
  isReady,
  uploadImage,
  deleteImage,
  getImageUrl,
} from '../../services/googleDrive';

import {
  addSliderImage,
  getSliderImages,
  updateSliderImage,
  deleteSliderImage,
  getDriveToken,
  saveDriveToken,
} from '../../services/firebase/firestore';
```

### Page Load pe Silent Authentication:
```javascript
useEffect(() => {
  const init = async () => {
    // Load slides from Firebase
    const data = await getSliderImages();
    setSlides(data);

    // Check for stored refresh token -> silently get access token
    const refreshToken = await getDriveToken();
    if (refreshToken) {
      await silentAuth(refreshToken);
      setDriveReady(true);
    } else {
      // No token stored - need one-time setup
      await initGoogleAuth();
      setNeedsSetup(true);
    }
  };
  init();
}, []);
```

### One-Time Google Drive Setup:
```javascript
const handleDriveSetup = async () => {
  const refreshToken = await authorizeAndGetRefreshToken();
  await saveDriveToken(refreshToken);      // Firebase me save
  setDriveReady(true);
  setNeedsSetup(false);
};
```

### Image Upload (Crop -> Drive -> Firebase):
```javascript
const handleSaveCrop = async () => {
  // 1. Get cropped blob (16:5 aspect ratio, JPEG, 0.85 quality)
  const blob = await getCroppedBlob(rawImage, croppedAreaPixels);

  // 2. Upload to Google Drive
  const fileName = `slider_${Date.now()}.jpg`;
  const fileId = await uploadImage(blob, fileName);

  // 3. Generate public URL from fileId
  const imageUrl = getImageUrl(fileId);
  // imageUrl = "https://lh3.googleusercontent.com/d/{fileId}"

  // 4. Save metadata to Firebase Firestore
  const newSlide = await addSliderImage({
    title: `Slide ${slides.length + 1}`,
    imageUrl,                    // Google Drive public URL
    driveFileId: fileId,         // For future delete operations
    order: slides.length,
  });
};
```

### Image Delete (Drive first, then Firebase):
```javascript
const handleDelete = async (slide) => {
  // 1. Delete from Google Drive first
  if (slide.driveFileId && isReady()) {
    await deleteImage(slide.driveFileId);
  }

  // 2. Delete from Firebase
  await deleteSliderImage(slide.id);
};
```

### Homepage pe Display (HeroSlider component):
```javascript
// File: src/components/common/HeroSlider.jsx

useEffect(() => {
  getSliderImages()
    .then((data) => setSliderData(data))
    .catch((err) => console.error('Failed to load slider images:', err))
    .finally(() => setLoading(false));
}, []);

// Image display with no-referrer policy (CORS fix for Google Drive URLs)
<img
  src={sliderData[currentSlide]?.imageUrl}
  alt={sliderData[currentSlide]?.title || `Slide ${currentSlide + 1}`}
  className="w-full h-full object-contain sm:object-cover object-center"
  referrerPolicy="no-referrer"
/>
```

---

## 11. GOOGLE DRIVE APIs USED

| Operation          | Method   | Endpoint                                                                 |
| ------------------ | -------- | ------------------------------------------------------------------------ |
| Exchange Auth Code | `POST`   | `https://oauth2.googleapis.com/token`                                    |
| Refresh Token      | `POST`   | `https://oauth2.googleapis.com/token`                                    |
| Upload File        | `POST`   | `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`  |
| Set Permission     | `POST`   | `https://www.googleapis.com/drive/v3/files/{fileId}/permissions`         |
| Delete File        | `DELETE` | `https://www.googleapis.com/drive/v3/files/{fileId}`                     |

---

## 12. FIRESTORE COLLECTIONS SUMMARY

| Collection      | Purpose                                     |
| --------------- | ------------------------------------------- |
| `leads`         | Insurance lead/enquiry data                 |
| `services`      | Insurance service definitions               |
| `settings`      | Website settings + Google Drive auth token  |
| `sliderImages`  | Slider image metadata (title, URL, fileId)  |

---

## 13. NPM DEPENDENCIES

```json
{
  "firebase": "^12.9.0",
  "react-easy-crop": "^5.5.6"
}
```

- `firebase` - Firebase SDK (Firestore, Auth, Storage, FCM)
- `react-easy-crop` - Image cropping component (16:5 aspect ratio for slider)

---

## 14. FILE STRUCTURE

```
src/
├── services/
│   ├── googleDrive.js                    <-- Google Drive complete integration
│   ├── firebase/
│   │   ├── firebase.js                   <-- Firebase app initialization
│   │   ├── firestore.js                  <-- Firestore CRUD + Drive token management
│   │   └── fcm.js                        <-- Firebase Cloud Messaging
│   └── leadService.js                    <-- Lead management service
├── pages/
│   └── admin/
│       └── Slider.jsx                    <-- Admin slider management (upload flow)
├── components/
│   └── common/
│       └── HeroSlider.jsx                <-- Homepage slider display
└── .env                                  <-- Firebase credentials
```

---

## 15. INTEGRATION LOGIC SUMMARY (Hindi)

1. **Google Drive ko image storage ki tarah use kiya hai** - Firebase Storage ki jagah Google Drive me images store ho rahi hain
2. **OAuth 2.0 Authorization Code Flow** use ho raha hai Google Drive ke liye
3. **Refresh token ek baar generate hota hai** (one-time setup) aur Firestore me save hota hai
4. **Har page load pe** refresh token se silently new access token milta hai
5. **Image upload flow:**
   - User image select karta hai
   - Image crop hoti hai (16:5 ratio, JPEG, 85% quality)
   - Cropped image Google Drive folder me upload hoti hai
   - File ko public (anyone with link) permission milti hai
   - Google Drive fileId se public URL generate hota hai: `https://lh3.googleusercontent.com/d/{fileId}`
   - Yeh URL + fileId Firestore ke `sliderImages` collection me save hota hai
6. **Homepage pe** HeroSlider component Firestore se slider data fetch karta hai aur Google Drive URLs se images load karta hai
7. **Delete karte waqt** pehle Google Drive se file delete hoti hai, phir Firestore se document
