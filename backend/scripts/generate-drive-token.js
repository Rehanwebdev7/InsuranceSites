require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');

const PORT = 54321;
const REDIRECT_URI = `http://localhost:${PORT}`;
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const CRED_FILE = path.join(__dirname, '..', 'drive-credentials.json');
const OAUTH_FILE = path.join(__dirname, '..', 'oauth-client.json');

const readOAuthCreds = () => {
  if (fs.existsSync(OAUTH_FILE)) {
    const raw = JSON.parse(fs.readFileSync(OAUTH_FILE, 'utf8'));
    const inner = raw.installed || raw.web || raw;
    return {
      clientId: inner.client_id,
      clientSecret: inner.client_secret,
      source: 'oauth-client.json',
    };
  }
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    source: '.env',
  };
};

const main = async () => {
  const { clientId, clientSecret, source } = readOAuthCreds();
  if (!clientId || !clientSecret) {
    console.error('Missing client_id / client_secret. Set in backend/.env or backend/oauth-client.json');
    process.exit(1);
  }

  console.log(`[token] Using OAuth creds from: ${source}`);
  console.log(`[token] Redirect URI: ${REDIRECT_URI}`);

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

  const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });

  const server = http.createServer(async (req, res) => {
    try {
      const parsed = url.parse(req.url, true);
      const code = parsed.query.code;
      const errorParam = parsed.query.error;

      if (errorParam) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h2>Auth failed</h2><p>${errorParam}</p>`);
        console.error(`[token] OAuth error: ${errorParam}`);
        server.close();
        process.exit(1);
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h2>No code in callback</h2>');
        return;
      }

      const { tokens } = await oauth2.getToken(code);
      if (!tokens.refresh_token) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(
          '<h2>No refresh_token received</h2><p>Revoke this app at <a href="https://myaccount.google.com/permissions">https://myaccount.google.com/permissions</a> and run again.</p>'
        );
        console.error('[token] No refresh_token returned. Revoke app access at https://myaccount.google.com/permissions and retry.');
        server.close();
        process.exit(1);
      }

      fs.writeFileSync(
        CRED_FILE,
        JSON.stringify({ refreshToken: tokens.refresh_token }, null, 2)
      );

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h2>Drive token saved</h2><p>You can close this tab.</p>');
      console.log(`[token] Saved refresh token to ${CRED_FILE}`);
      console.log('[token] Restart the backend (npm start) to pick up the new token.');
      server.close();
      process.exit(0);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h2>Error</h2><pre>${err.message}</pre>`);
      console.error('[token] error:', err.message);
      server.close();
      process.exit(1);
    }
  });

  server.listen(PORT, () => {
    console.log(`\n[token] Loopback server listening on ${REDIRECT_URI}`);
    console.log('\n[token] Open this URL in your browser and authorize:\n');
    console.log(`  ${authUrl}\n`);
    console.log('[token] After authorize, browser will say "Drive token saved" — you can close the tab.\n');
    console.log('[token] If you see "redirect_uri_mismatch":');
    console.log('  1. Go to https://console.cloud.google.com/apis/credentials');
    console.log('  2. Open the OAuth client matching your CLIENT_ID');
    console.log(`  3. Add Authorized redirect URI: ${REDIRECT_URI}`);
    console.log('  4. Save, wait ~30 seconds for propagation, run "npm run token" again\n');
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
