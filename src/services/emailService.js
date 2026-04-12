import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/firebase';

/**
 * Queue an email to be sent via the Firestore "Trigger Email" extension.
 *
 * How this works:
 * 1. Writes a document to the `mail` collection in Firestore.
 * 2. Firebase "Trigger Email from Firestore" extension (firestore-send-email)
 *    watches this collection and sends the email via configured SMTP.
 * 3. No backend code needed — the extension is free and uses Gmail SMTP or
 *    any other SMTP provider configured during extension setup.
 *
 * Setup required (one-time, by admin):
 *   Firebase Console > Extensions > Install "Trigger Email from Firestore"
 *   Configure SMTP (Gmail with App Password works great, free).
 *   Set collection name: `mail`
 *
 * If the extension isn't installed yet, the document will still be written
 * to Firestore — it just won't be delivered until the extension is set up.
 * This is non-blocking and silent so the form submission never fails.
 */
export const queueSupportEmail = async ({ to, from, subject, html, text, replyTo }) => {
  if (!db) return { queued: false, reason: 'Firebase not configured' };
  if (!to) return { queued: false, reason: 'Missing recipient' };

  try {
    await addDoc(collection(db, 'mail'), {
      to: Array.isArray(to) ? to : [to],
      ...(from ? { from } : {}),
      ...(replyTo ? { replyTo } : {}),
      message: {
        subject: subject || 'New message from website',
        html: html || '',
        text: text || '',
      },
      createdAt: serverTimestamp(),
    });
    return { queued: true };
  } catch (error) {
    console.error('Failed to queue email:', error);
    return { queued: false, reason: error.message };
  }
};

/**
 * Build a formatted contact form email body.
 */
export const buildContactEmail = ({ fullName, mobile, email, message, brandName }) => {
  const brand = brandName || 'Insurance';
  const subject = `New contact form submission from ${fullName}`;

  const text = [
    `New contact form submission`,
    ``,
    `Name: ${fullName}`,
    `Mobile: +91 ${mobile}`,
    `Email: ${email || 'Not provided'}`,
    ``,
    `Message:`,
    message,
    ``,
    `--`,
    `Sent from ${brand} website contact form`,
  ].join('\n');

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="margin: 0; font-size: 20px;">New contact form submission</h2>
        <p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">${brand} website</p>
      </div>
      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${fullName}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Mobile</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">+91 ${mobile}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td><td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${email || '<em style="color:#94a3b8;">Not provided</em>'}</td></tr>
        </table>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <div style="color: #64748b; font-size: 13px; margin-bottom: 8px;">Message</div>
          <div style="color: #0f172a; line-height: 1.6; white-space: pre-wrap;">${(message || '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</div>
        </div>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
        Reply directly to this email to respond to the customer.
      </p>
    </div>
  `;

  return { subject, text, html };
};
