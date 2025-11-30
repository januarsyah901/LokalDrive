import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create metadata file if it doesn't exist
const metadataFile = path.join(__dirname, 'files-metadata.json');
if (!fs.existsSync(metadataFile)) {
  fs.writeFileSync(metadataFile, JSON.stringify({ files: [] }));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Helper functions
const getMetadata = () => {
  const data = fs.readFileSync(metadataFile, 'utf8');
  return JSON.parse(data);
};

const saveMetadata = (data) => {
  fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));
};

const getFileType = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'IMAGE';
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'VIDEO';
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) return 'DOCUMENT';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'ARCHIVE';
  return 'OTHER';
};

// Get server IP addresses
const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  return ips;
};

// Routes

// Get server info (IP addresses)
app.get('/api/server-info', (req, res) => {
  const ips = getLocalIPs();
  res.json({
    port: PORT,
    ips: ips,
    urls: ips.map(ip => `http://${ip}:${PORT}`)
  });
});

// Get all files
app.get('/api/files', (req, res) => {
  try {
    const metadata = getMetadata();
    res.json(metadata.files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const metadata = getMetadata();
    const fileItem = {
      id: Date.now().toString(),
      name: req.file.originalname,
      size: req.file.size,
      type: getFileType(req.file.originalname),
      uploadedAt: new Date().toISOString(),
      filename: req.file.filename, // server filename
      url: `/uploads/${req.file.filename}`,
      aiAnalyzed: false,
      description: '',
      tags: []
    };

    metadata.files.unshift(fileItem);
    saveMetadata(metadata);

    res.json(fileItem);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Delete file
app.delete('/api/files/:id', (req, res) => {
  try {
    const { id } = req.params;
    const metadata = getMetadata();

    const fileIndex = metadata.files.findIndex(f => f.id === id);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = metadata.files[fileIndex];

    // Delete physical file
    const filePath = path.join(uploadsDir, file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from metadata
    metadata.files.splice(fileIndex, 1);
    saveMetadata(metadata);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Update file metadata (AI analysis results)
app.patch('/api/files/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { description, tags } = req.body;

    const metadata = getMetadata();
    const fileIndex = metadata.files.findIndex(f => f.id === id);

    if (fileIndex === -1) {
      return res.status(404).json({ error: 'File not found' });
    }

    metadata.files[fileIndex] = {
      ...metadata.files[fileIndex],
      description: description || metadata.files[fileIndex].description,
      tags: tags || metadata.files[fileIndex].tags,
      aiAnalyzed: true
    };

    saveMetadata(metadata);
    res.json(metadata.files[fileIndex]);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// Get storage stats
app.get('/api/storage-stats', (req, res) => {
  try {
    const metadata = getMetadata();
    const totalSpace = 1000000000; // 1 GB
    const used = metadata.files.reduce((acc, file) => acc + file.size, 0);

    const distribution = metadata.files.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + file.size;
      return acc;
    }, {});

    const byType = [
      { name: 'Images', value: distribution.IMAGE || 0, color: '#f43f5e' },
      { name: 'Videos', value: distribution.VIDEO || 0, color: '#8b5cf6' },
      { name: 'Docs', value: distribution.DOCUMENT || 0, color: '#3b82f6' },
      { name: 'Others', value: (distribution.ARCHIVE || 0) + (distribution.OTHER || 0), color: '#10b981' },
    ].filter(i => i.value > 0);

    res.json({
      used,
      total: totalSpace,
      byType
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get storage stats' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log(`\n🚀 LokalDrive Server is running!`);
  console.log(`\nAccess from this device:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\nAccess from other devices on your network:`);
  ips.forEach(ip => {
    console.log(`   http://${ip}:${PORT}`);
  });
  console.log(`\n📁 Files are stored in: ${uploadsDir}\n`);
});

