const fs = require('fs/promises');
const path = require('path');

const {
  transporter,
  emailConfig,
  isEmailEnabled,
} = require('../config/email');

const templatesDir = path.join(__dirname, '..', 'templates');

const getValueByPath = (obj, keyPath) => keyPath
  .split('.')
  .reduce((acc, key) => (acc ? acc[key] : ''), obj);

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatCurrencyVnd = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

const renderTemplate = async (templateName, templateData = {}) => {
  const templatePath = path.join(templatesDir, `${templateName}.html`);
  const templateHtml = await fs.readFile(templatePath, 'utf8');

  return templateHtml.replace(/\{\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}\}|\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (match, rawKey, escapedKey) => {
    const keyPath = rawKey || escapedKey;
    const value = getValueByPath(templateData, keyPath);

    if (value === undefined || value === null) {
      return '';
    }

    if (rawKey) {
      return String(value);
    }

    return escapeHtml(value);
  });
};

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  if (!to || !subject) {
    return { status: 'failed', error: 'Missing "to" or "subject"' };
  }

  if (!isEmailEnabled || !transporter) {
    return { status: 'skipped', reason: 'Email is not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: emailConfig.from,
      to,
      subject,
      html,
      text: text || undefined,
    });

    return {
      status: 'sent',
      messageId: info.messageId,
    };
  } catch (error) {
    return {
      status: 'failed',
      error: error.message,
    };
  }
};

const sendTemplateEmail = async ({
  to,
  subject,
  templateName,
  templateData = {},
  text,
}) => {
  const html = await renderTemplate(templateName, templateData);
  return sendEmail({
    to,
    subject,
    html,
    text,
  });
};

const buildOrderItemsHtml = (items = []) => items
  .map((item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatCurrencyVnd(item.price)}</td>
      </tr>
    `)
  .join('');

const buildShippingAddress = (shippingAddress = {}) => {
  const {
    name = '',
    phone = '',
    address = '',
    ward = '',
    district = '',
    city = '',
  } = shippingAddress;

  return `${name}, ${phone}, ${address}, ${ward}, ${district}, ${city}`;
};

const sendWelcomeEmail = async ({ email, name }) => sendTemplateEmail({
  to: email,
  subject: 'Welcome to KeyCrafter',
  templateName: 'welcome',
  templateData: {
    userName: name || 'Customer',
    year: new Date().getFullYear(),
  },
});

const sendForgotPasswordEmail = async ({
  email,
  name,
  resetLink,
  expiresMinutes = 15,
}) => sendTemplateEmail({
  to: email,
  subject: 'Reset your KeyCrafter password',
  templateName: 'forgot-password',
  templateData: {
    userName: name || 'Customer',
    resetLink,
    expiresMinutes,
    year: new Date().getFullYear(),
  },
});

const sendOrderCreatedEmail = async ({ user, order }) => sendTemplateEmail({
  to: user.email,
  subject: `Order created: ${order.orderCode}`,
  templateName: 'order-created',
  templateData: {
    userName: user.name || 'Customer',
    orderCode: order.orderCode,
    orderDate: new Date(order.createdAt).toLocaleString('vi-VN'),
    orderItemsHtml: buildOrderItemsHtml(order.items),
    subtotal: formatCurrencyVnd(order.subtotal),
    shippingFee: formatCurrencyVnd(order.shippingFee),
    discount: formatCurrencyVnd(order.discount),
    total: formatCurrencyVnd(order.total),
    paymentMethod: order.paymentMethod,
    shippingAddress: buildShippingAddress(order.shippingAddress),
    note: order.note || 'No note',
    year: new Date().getFullYear(),
  },
});

const sendOrderCancelledEmail = async ({ user, order }) => sendTemplateEmail({
  to: user.email,
  subject: `Order cancelled: ${order.orderCode}`,
  templateName: 'order-cancelled',
  templateData: {
    userName: user.name || 'Customer',
    orderCode: order.orderCode,
    total: formatCurrencyVnd(order.total),
    year: new Date().getFullYear(),
  },
});

const sendPaymentSuccessEmail = async ({ user, order }) => sendTemplateEmail({
  to: user.email,
  subject: `Payment successful: ${order.orderCode}`,
  templateName: 'payment-success',
  templateData: {
    userName: user.name || 'Customer',
    orderCode: order.orderCode,
    total: formatCurrencyVnd(order.total),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    year: new Date().getFullYear(),
  },
});

module.exports = {
  sendEmail,
  sendTemplateEmail,
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendOrderCreatedEmail,
  sendOrderCancelledEmail,
  sendPaymentSuccessEmail,
};
