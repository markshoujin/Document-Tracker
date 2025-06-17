const fs = require('fs');

const packageJson = {
  name: "my-express-app",
  version: "1.0.0",
  main: "index.js",
  scripts: {
    start: "node index.js",
    dev: "nodemon index.js"
  },
  dependencies: {
    express: "^4.18.2",
    cors: "^2.8.5",
    multer: "^1.4.5-lts.1"
  },
  devDependencies: {
    nodemon: "^2.0.22"
  }
};

const indexJs = `const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

let documents = [];

app.post('/upload', upload.single('file'), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;
  if (!title || !file) return res.status(400).json({ message: 'Title and file required.' });

  const doc = {
    id: documents.length + 1,
    title,
    description: description || '',
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
  };
  documents.push(doc);
  res.status(201).json({ message: 'Uploaded', document: doc });
});

app.get('/search', (req, res) => {
  const query = (req.query.query || '').toLowerCase();
  const results = documents.filter(d => d.title.toLowerCase().includes(query));
  res.json(results);
});

app.get('/documents/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const doc = documents.find(d => d.id === id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.set({
    'Content-Disposition': \`attachment; filename="\${doc.fileName}"\`,
    'Content-Type': doc.mimeType,
  });
  res.send(doc.buffer);
});

app.listen(PORT, () => console.log(\`Server running on http://localhost:\${PORT}\`));
`;

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
fs.writeFileSync('index.js', indexJs);

console.log("✔ Express app generated. Run:");
console.log("  npm install");
console.log("  npm run dev");
