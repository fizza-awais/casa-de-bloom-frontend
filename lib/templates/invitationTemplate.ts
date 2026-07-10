export interface InvitationData {
  name: string;
  invitationNumber: string;
  cbId: string;
  eventName: string;
  eventDate: string;
  email: string;
  phone: string;
  role?: "guest" | "volunteer";
  availability?: string;
  contribution?: string;
}

export function getInvitationStyles(): string {
  return `<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    .invitation-root {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1F1B24;
      -webkit-font-smoothing: antialiased;
    }

    .invitation-wrapper {
      width: 100%;
      background: linear-gradient(180deg, #FFF8FB 0%, #FFF0F6 60%, #E9FBFA 100%);
      padding: 48px 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ticket-card {
      max-width: 520px;
      width: 100%;
      background: #FFFFFF;
      border-radius: 32px;
      border: 1px solid #E2E8F0;
      box-shadow: 0 32px 64px rgba(31, 27, 36, 0.10);
      overflow: hidden;
      margin: 0 auto;
      position: relative;
    }

    .top-accent-bar {
      height: 6px;
      width: 100%;
      background: linear-gradient(90deg, #FF3F82 0%, #33C9DC 50%, #99CC00 100%);
    }

    .ticket-header {
      padding: 28px 36px 12px 36px;
      text-align: left;
    }

    .logo-img {
      height: 62px;
      display: block;
    }

    .ticket-body {
      padding: 0 40px 20px 40px;
      text-align: center;
    }

    .guest-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #FFE3EE;
      color: #B32B5C;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      padding: 7px 16px 7px 12px;
      border-radius: 100px;
      margin-bottom: 18px;
    }

    .guest-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #99CC00;
      display: inline-block;
    }

    .title-main {
      font-size: 28px;
      font-weight: 800;
      color: #1F1B24;
      margin: 0 0 2px 0;
      letter-spacing: -0.5px;
    }

    .sub-greeting {
      font-size: 14px;
      color: #6B7280;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .sub-greeting span {
      font-weight: 700;
      color: #FF3F82;
    }

    .info-box {
      border: 1px solid #E2E8F0;
      background-color: #FFF8FB;
      border-radius: 20px;
      padding: 18px 20px;
      text-align: left;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 10px;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #33C9DC;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: #1F1B24;
      line-height: 1.4;
      text-align: right;
    }

    .info-divider {
      border-top: 1px solid #E2E8F0;
      margin: 14px 0;
    }

    .perforation-divider {
      position: relative;
      height: 24px;
      margin: 4px 0;
    }

    .perforation-line {
      border-top: 2px dashed #E2E8F0;
      position: absolute;
      top: 12px;
      left: 0;
      right: 0;
      height: 0;
    }

    .notch-left, .notch-right {
      position: absolute;
      width: 24px;
      height: 24px;
      background-color: #FFF0F6;
      border-radius: 50%;
      top: 0;
      z-index: 10;
    }

    .notch-left { left: -13px; }
    .notch-right { right: -13px; }

    .ticket-footer {
      padding: 10px 36px 22px 36px;
      text-align: center;
    }

    .invitation-box {
      background-color: #FFE3EE;
      border: 2px solid #FF3F82;
      border-radius: 20px;
      padding: 16px 18px;
      margin-bottom: 14px;
    }

    .invitation-number-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2.5px;
      color: #B32B5C;
      margin-bottom: 6px;
    }

    .invitation-number-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #1F1B24;
      margin: 0 0 2px 0;
    }

    .member-id-text {
      font-size: 12px;
      color: #6B7280;
      margin: 0;
    }

    .member-id-text strong {
      color: #1F1B24;
    }

    .status-badge {
      display: inline-block;
      background-color: #FFD23F;
      color: #1F1B24;
      font-size: 12px;
      font-weight: 800;
      padding: 10px 24px;
      border-radius: 999px;
      margin-bottom: 10px;
    }

    .instruction-text {
      font-size: 11px;
      color: #6B7280;
      line-height: 1.6;
      margin: 0 0 18px 0;
    }

    .instruction-text a {
      color: #33C9DC;
      font-weight: 600;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .footer-note {
      font-size: 10px;
      color: #6B7280;
      margin: 0;
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
      line-height: 1.35;
    }
  </style>`;
}

export function getInvitationMarkup(data: InvitationData): string {
  const { name, invitationNumber, cbId, eventName, eventDate, email, phone } = data;
  const isVolunteer = data.role === "volunteer";
  const badgeLabel = isVolunteer ? "Volunteer Confirmation" : "Invitation";
  const title = isVolunteer
    ? "You're Confirmed as a Casa de Bloom Volunteer"
    : "Your Casa de Bloom Invitation";
  const subtitle = isVolunteer
    ? `Thank you for helping create a day filled with connection, generosity, and community, <span>${name}</span>.`
    : `This is your personal invitation, <span>${name}</span>. We are holding your place in a day designed for connection and community.`;
  const numberLabel = isVolunteer
    ? "Your Volunteer Confirmation Number"
    : "Your Invitation Number";
  const statusText = isVolunteer
    ? "Please show this at volunteer check-in."
    : "Please bring this invitation with you.";
  const volunteerRows = isVolunteer
    ? `${data.availability ? `<div class="info-row">
              <div class="info-label">Availability</div>
              <div class="info-value">${data.availability}</div>
            </div>` : ""}
            ${data.contribution ? `<div class="info-row">
              <div class="info-label">Contribution</div>
              <div class="info-value">${data.contribution}</div>
            </div>` : ""}`
    : "";
  const guestReminderRows = isVolunteer
    ? ""
    : `<div class="info-divider"></div>
            <div class="info-row">
              <div class="info-label">Potluck</div>
              <div class="info-value">Bring one dish and one drink.</div>
            </div>
            <div class="info-row">
              <div class="info-label">Give &amp; Take</div>
              <div class="info-value">Bring one beautiful item someone else may love.</div>
            </div>`;

  return `<div class="invitation-root">
    <div class="invitation-wrapper">
      <div class="ticket-card">
        <div class="top-accent-bar"></div>

        <div class="ticket-body">
          <div>
            <span class="guest-badge"><span class="dot"></span>${badgeLabel}</span>
          </div>

          <h1 class="title-main">${title}</h1>
          <p class="sub-greeting">${subtitle}</p>

          <div class="info-box">
            <div class="info-row">
              <div class="info-label">Event</div>
              <div class="info-value">${eventName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Date</div>
              <div class="info-value">${eventDate}</div>
            </div>
            
            <div class="info-divider"></div>
            
            <div class="info-row">
              <div class="info-label">Name</div>
              <div class="info-value">${name}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value">${email}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Phone</div>
              <div class="info-value">${phone}</div>
            </div>
            ${volunteerRows}
            ${guestReminderRows}
          </div>
        </div>

        <div class="perforation-divider">
          <div class="notch-left"></div>
          <div class="perforation-line"></div>
          <div class="notch-right"></div>
        </div>

        <div class="ticket-footer">
          <div class="invitation-box">
            <div class="invitation-number-label">${numberLabel}</div>
            <h2 class="invitation-number-val">${invitationNumber}</h2>
            <p class="member-id-text">Member ID: <strong>${cbId}</strong></p>
          </div>

          <div class="status-badge">${statusText}</div>

          <p class="footer-note">
            Casa de Bloom - Where connections become opportunities.<br>
            <strong>Come ready to make someone else's day a little brighter.</strong>
          </p>
        </div>
      </div>
    </div>
  </div>`;
}

export function getInvitationHtml(data: InvitationData): string {
  const title =
    data.role === "volunteer"
      ? "Casa de Bloom Volunteer Confirmation"
      : "Your Casa de Bloom Private Guest Invitation";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  ${getInvitationStyles()}
</head>
<body>
  ${getInvitationMarkup(data)}
</body>
</html>`;
}
