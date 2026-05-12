require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const {
  uploadToGoogleDrive,
  deleteFromGoogleDrive,
  health,
} = require('./helpers/drive');

const PORT = parseInt(process.env.PORT || '8000', 10);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.get('/api/drive/health', async (_req, res) => {
  const result = await health();
  res.status(result.ok ? 200 : 500).json(result);
});

app.post('/api/drive/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'file field is required (multipart/form-data)' });
    }
    const fileName = req.body.fileName || req.file.originalname || `image_${Date.now()}`;
    const mimeType = req.file.mimetype || 'application/octet-stream';
    const result = await uploadToGoogleDrive(req.file.buffer, fileName, mimeType);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('[drive] upload failed:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/drive/files/:id', async (req, res) => {
  try {
    await deleteFromGoogleDrive(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('[drive] delete failed:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error('[server] error:', err.message);
  res.status(err.status || 500).json({ ok: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`[drive-backend] listening on http://localhost:${PORT}`);
  console.log(`[drive-backend] CORS origin: ${FRONTEND_ORIGIN}`);
});
