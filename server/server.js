// Timesheet Bulk Mailer - Backend
// Deploy this on Render / Railway / Fly.io (NOT GitHub Pages - that's static-only).
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors()); // lock this down to your GitHub Pages origin in production
const upload = multer({ storage: multer.memoryStorage() });

// SMTP config comes from environment variables (never hardcode credentials).
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp.office365.com or smtp.gmail.com
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,      // use an app password, not your real password
  },
});

app.get('/', (req, res) => res.send('Timesheet mailer backend is running.'));

app.post('/send-email', upload.single('attachment'), async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !req.file) return res.status(400).send('Missing "to" or attachment.');

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: subject || 'Timesheet',
      text: body || '',
      attachments: [{ filename: req.file.originalname, content: req.file.buffer }],
    });

    res.status(200).send('sent');
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
