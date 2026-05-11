import nodemailer from "nodemailer";

interface EnrollmentData {
  course: string;
  session: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  taxId?: string;
  referral?: string;
  note?: string;
}

function buildEmailHtml(data: EnrollmentData): string {
  const logoUrl = "https://262academy.com/logo.png";
  const rows = [
    ["課程名稱", data.course],
    ["上課場次", data.session],
    ["姓　　名", data.name],
    ["聯絡電話", data.phone],
    ["電子郵件", data.email],
    ["公司名稱", data.company || "—"],
    ["統一編號", data.taxId || "—"],
    ["介紹人", data.referral || "—"],
    ["備　　註", data.note || "—"],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;background:#f0f4fa;font-weight:600;color:#1B3A6B;width:110px;border-bottom:1px solid #e4e8f0;white-space:nowrap;">${label}</td>
        <td style="padding:10px 16px;color:#333;border-bottom:1px solid #e4e8f0;">${value}</td>
      </tr>`
    )
    .join("");

  const now = new Date().toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B3A6B 0%,#2557a7 100%);padding:32px 40px;text-align:center;">
            <img src="${logoUrl}" alt="262學習基地" height="56" style="display:inline-block;max-width:180px;object-fit:contain;" onerror="this.style.display='none'">
            <p style="margin:12px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:1px;">262學習基地</p>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:28px 40px 8px;border-bottom:2px solid #e8ecf4;">
            <h2 style="margin:0;font-size:20px;color:#1B3A6B;font-weight:700;">&#x1F4CB; 新報名通知</h2>
            <p style="margin:6px 0 0;font-size:13px;color:#888;">收到時間：${now}</p>
          </td>
        </tr>

        <!-- Enrollment Details -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #e4e8f0;">
              ${rowsHtml}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fc;padding:20px 40px;text-align:center;border-top:1px solid #e8ecf4;">
            <p style="margin:0;font-size:12px;color:#aaa;">262學習基地 · 台中西屯</p>
            <p style="margin:4px 0 0;font-size:12px;color:#aaa;">此信件由系統自動發送，請勿直接回覆。</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendEnrollmentNotification(data: EnrollmentData): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.NOTIFY_EMAIL || "liangchiahao1214@gmail.com";

  if (!user || !pass) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set, skipping email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"262學習基地報名系統" <${user}>`,
    to,
    subject: `【新報名】${data.name} 報名 ${data.course}`,
    html: buildEmailHtml(data),
  });

  console.log(`[email] Notification sent to ${to}`);
}
