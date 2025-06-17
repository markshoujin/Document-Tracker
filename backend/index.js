import express from "express";
import session from 'express-session';
import clientRoute from "./routes/route.js";
import path from "path";
import cors from "cors";
import http from 'http';
import fs from 'fs';
import https from 'https';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = http.createServer(app);
app.use(session({
  secret: '100100',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax',
  }
}));
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
app.use(cors({
  origin: '*',  // your React app origin
  credentials: true,                 // allow cookies to be sent
}));
// Setup socket.io with CORS configuration for frontend

console.log(__dirname);

// API Routes
app.use("/auth/", clientRoute);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Start server
https.createServer(options, app).listen(4400, () => {
  console.log(`✅ HTTPS server running at https://<your-ip>:4400`);
});


