const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Lumn" <no-reply@lumn.com>',
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendMail,
};
