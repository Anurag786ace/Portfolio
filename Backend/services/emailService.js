import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });
  }

  return transporter;
}

/**
 * Send notification to Anurag and an acknowledgment to the sender
 */
export async function sendContactNotification({ name, email, message, role = 'project', createdAt = new Date() }) {
  const mailer = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'sankhaanurag2005@gmail.com';
  const fromAddress = process.env.SMTP_FROM || `"Anurag Giri Portfolio" <${adminEmail}>`;

  const dateStr = new Date(createdAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  if (!mailer) {
    console.log('\n============================================================');
    console.log('📬 [PORTFOLIO NOTIFICATION] NEW MESSAGE RECEIVED');
    console.log(`• From:    ${name} <${email}>`);
    console.log(`• Role:    ${role}`);
    console.log(`• Time:    ${dateStr} IST`);
    console.log(`• Message: ${message}`);
    console.log('ℹ️ (SMTP credentials not yet set in .env. Stored safely in MongoDB)');
    console.log('============================================================\n');
    return { sent: false, reason: 'SMTP credentials not configured in .env' };
  }

  try {
    // 1. Send alert to Anurag
    await mailer.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: email,
      subject: `⚡ New Portfolio Message: ${name} (${role})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
          <div style="background: #191714; color: #fbfbfa; padding: 24px; text-align: left;">
            <div style="color: #b59f7b; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">PORTFOLIO DISPATCH // NOTIFICATION</div>
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">New Inquiry Received</h1>
          </div>
          <div style="padding: 24px; color: #191714;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6b665f; font-size: 13px; width: 100px;">Sender:</td>
                <td style="padding: 8px 0; font-weight: 600; font-size: 15px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b665f; font-size: 13px;">Email:</td>
                <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #9e6b47; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b665f; font-size: 13px;">Inquiry Type:</td>
                <td style="padding: 8px 0; font-size: 14px;"><span style="background: #f4efe6; color: #7d5a3c; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;">${role}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b665f; font-size: 13px;">Received:</td>
                <td style="padding: 8px 0; font-size: 13px; color: #6b665f;">${dateStr}</td>
              </tr>
            </table>

            <div style="background: #fbfbfa; border: 1px solid #ebe8e1; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
              <div style="color: #6b665f; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message Content:</div>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #191714; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re:%20Inquiry%20from%20Anurag%20Giri%20Portfolio" style="display: inline-block; background: #191714; color: #fbfbfa; text-decoration: none; padding: 12px 28px; border-radius: 999px; font-weight: 600; font-size: 14px;">Reply Directly to ${name} &rarr;</a>
            </div>
          </div>
          <div style="background: #fbfbfa; border-top: 1px solid #eaeaea; padding: 16px; text-align: center; color: #9c9689; font-size: 12px;">
            Stored in MongoDB: <code>Portfolio.messages</code>
          </div>
        </div>
      `
    });

    // 2. Send automated courtesy receipt to the user
    try {
      await mailer.sendMail({
        from: fromAddress,
        to: email,
        subject: `Message Received — Anurag Giri`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; padding: 32px; color: #191714;">
            <div style="color: #b59f7b; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">ANURAG GIRI // PORTFOLIO</div>
            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700;">Thanks for reaching out, ${name}!</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #4a453e; margin-bottom: 16px;">
              I received your message regarding <strong>${role}</strong>. I typically review incoming dispatches and reply within 24 hours.
            </p>
            <div style="background: #fbfbfa; border-left: 3px solid #b59f7b; padding: 12px 16px; margin-bottom: 24px; font-size: 14px; color: #6b665f; font-style: italic;">
              "${message}"
            </div>
            <p style="font-size: 14px; line-height: 1.6; color: #6b665f;">
              In the meantime, feel free to inspect my open-source projects on <a href="https://github.com/Anurag786ace" style="color: #9e6b47;">GitHub</a> or connect with me on <a href="https://www.linkedin.com/in/anurag-giri-334259241" style="color: #9e6b47;">LinkedIn</a>.
            </p>
            <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #ebe8e1; font-size: 13px; color: #9c9689;">
              Best regards,<br>
              <strong>Anurag Giri</strong><br>
              Creative Technologist & Full-Stack AI Engineer
            </div>
          </div>
        `
      });
    } catch (receiptErr) {
      console.warn('[Notification] Could not send receipt to user:', receiptErr.message);
    }

    return { sent: true };
  } catch (error) {
    console.error('[Notification] Error sending email notification:', error.message);
    return { sent: false, error: error.message };
  }
}

/**
 * Send notification when someone joins the subscriber circle
 */
export async function sendSubscriberNotification({ email, source = 'modal' }) {
  const mailer = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'sankhaanurag2005@gmail.com';
  const fromAddress = process.env.SMTP_FROM || `"Anurag Giri Portfolio" <${adminEmail}>`;

  if (!mailer) {
    console.log('\n============================================================');
    console.log('🌟 [PORTFOLIO SUBSCRIBER] NEW CIRCLE MEMBER');
    console.log(`• Email:  ${email}`);
    console.log(`• Source: ${source}`);
    console.log(`• Time:   ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log('============================================================\n');
    return { sent: false, reason: 'SMTP credentials not configured in .env' };
  }

  try {
    await mailer.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `🌟 New Portfolio Subscriber: ${email}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 500px; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="margin-top: 0; color: #191714;">New Circle Subscriber</h2>
          <p>A new visitor just joined your mailing circle on the portfolio:</p>
          <p style="font-size: 18px; font-weight: bold; color: #22c55e;">${email}</p>
          <p style="color: #666; font-size: 13px;">Source: ${source} | Time: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    return { sent: true };
  } catch (error) {
    console.error('[Notification] Error sending subscriber email:', error.message);
    return { sent: false, error: error.message };
  }
}
