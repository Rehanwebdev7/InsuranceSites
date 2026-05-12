const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { Readable } = require('stream');

const CRED_FILE = path.join(__dirname, '..', 'drive-credentials.json');

const readRefreshToken = () => {
  if (process.env.DRIVE_CREDENTIALS_JSON) {
    try {
      return JSON.parse(process.env.DRIVE_CREDENTIALS_JSON).refreshToken;
    } catch (e) {
      throw new Error('DRIVE_CREDENTIALS_JSON env var is not valid JSON');
    }
  }
  if (!fs.existsSync(CRED_FILE)) {
    throw new Error(`Missing ${CRED_FILE}. Run: npm run token`);
  }
  const raw = JSON.parse(fs.readFileSync(CRED_FILE, 'utf8'));
  if (!raw.refreshToken) {
    throw new Error(`No refreshToken in ${CRED_FILE}. Run: npm run token`);
  }
  return raw.refreshToken;
};

const buildOAuth2Client = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing in env');
  }
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: readRefreshToken() });
  return oauth2;
};

const driveClient = () => google.drive({ version: 'v3', auth: buildOAuth2Client() });

const folderId = () => {
  const id = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!id) throw new Error('GOOGLE_DRIVE_FOLDER_ID missing in env');
  return id;
};

const publicUrl = (id) => `https://lh3.googleusercontent.com/d/${id}`;

const uploadToGoogleDrive = async (buffer, fileName, mimeType) => {
  const drive = driveClient();
  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType,
      parents: [folderId()],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: 'id',
  });

  const fileId = created.data.id;

  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return { id: fileId, url: publicUrl(fileId) };
};

const deleteFromGoogleDrive = async (fileId) => {
  if (!fileId) return true;
  const drive = driveClient();
  try {
    await drive.files.delete({ fileId });
    return true;
  } catch (err) {
    if (err.code === 404) return true;
    throw err;
  }
};

const health = async () => {
  try {
    const drive = driveClient();
    const about = await drive.about.get({ fields: 'user(emailAddress,displayName)' });
    return {
      ok: true,
      email: about.data.user?.emailAddress || null,
      displayName: about.data.user?.displayName || null,
      folderId: folderId(),
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message,
      code: err.code || err.response?.data?.error || null,
    };
  }
};

module.exports = {
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
  health,
  publicUrl,
};
