const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const isEmailEnabled = Boolean(smtpHost && smtpPort && smtpUser && smtpPass);
const isSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const emailConfig = {
  fromName: process.env.EMAIL_FROM_NAME || 'KeyCrafter',
  fromAddress: process.env.EMAIL_FROM_ADDRESS || smtpUser || 'no-reply@keycrafter.local',
};

emailConfig.from = `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`;

const transporter = isEmailEnabled
  ? nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: isSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
  : null;

module.exports = {
  transporter,
  emailConfig,
  isEmailEnabled,
};
