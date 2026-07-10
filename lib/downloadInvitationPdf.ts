import { InvitationData } from "@/lib/templates/invitationTemplate";

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "");
}

function drawRoundedRect(
  pdf: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  style: "S" | "F" | "FD",
) {
  pdf.roundedRect(x, y, width, height, radius, radius, style);
}

function fitText(pdf: any, value: string, maxWidth: number, fontSize: number, minFontSize = 8) {
  let size = fontSize;
  pdf.setFontSize(size);

  while (pdf.getTextWidth(value) > maxWidth && size > minFontSize) {
    size -= 0.5;
    pdf.setFontSize(size);
  }
}

export async function downloadInvitationPdf(data: InvitationData) {
  const { jsPDF } = await import("jspdf");
  const isVolunteer = data.role === "volunteer";
  const documentLabel = isVolunteer ? "VOLUNTEER CONFIRMATION" : "INVITATION";
  const documentTitle = isVolunteer
    ? "You're Confirmed as a Casa de Bloom Volunteer"
    : "Your Casa de Bloom Invitation";
  const introLines = isVolunteer
    ? [
        `You're confirmed as a Casa de Bloom volunteer, ${data.name}.`,
        "Thank you for helping create a day filled with connection, generosity, and community.",
      ]
    : [
        `This is your personal invitation, ${data.name}.`,
        "We are holding your place in a day designed for connection and community.",
      ];
  const numberLabel = isVolunteer
    ? "YOUR VOLUNTEER CONFIRMATION NUMBER"
    : "YOUR INVITATION NUMBER";
  const checkInText = isVolunteer
    ? "Please show this at volunteer check-in."
    : "Please bring this invitation with you.";
  const filenamePrefix = isVolunteer ? "Casa-de-Bloom-Volunteer" : "Casa-de-Bloom";
  const pdf = new jsPDF({
    unit: "pt",
    format: "letter",
    orientation: "portrait",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const filename = `${filenamePrefix}-${sanitizeFilenamePart(data.invitationNumber)}.pdf`;

  pdf.setFillColor("#FFF8FB");
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  const cardX = 64;
  const cardY = 36;
  const cardW = pageWidth - cardX * 2;
  const cardH = pageHeight - cardY * 2;

  pdf.setFillColor("#FFFFFF");
  pdf.setDrawColor("#E2E8F0");
  pdf.setLineWidth(1);
  drawRoundedRect(pdf, cardX, cardY, cardW, cardH, 24, "FD");

  const barY = cardY;
  const barH = 6;
  pdf.setFillColor("#FF3F82");
  pdf.rect(cardX + 24, barY, (cardW - 48) / 3, barH, "F");
  pdf.setFillColor("#33C9DC");
  pdf.rect(cardX + 24 + (cardW - 48) / 3, barY, (cardW - 48) / 3, barH, "F");
  pdf.setFillColor("#99CC00");
  pdf.rect(cardX + 24 + (2 * (cardW - 48)) / 3, barY, (cardW - 48) / 3, barH, "F");

  const lift = 24;

  const badgeW = isVolunteer ? 276 : 204;
  pdf.setFillColor("#FFE3EE");
  drawRoundedRect(pdf, pageWidth / 2 - badgeW / 2, 136 - lift, badgeW, 34, 17, "F");
  pdf.setFillColor("#99CC00");
  pdf.circle(pageWidth / 2 - badgeW / 2 + 20, 153 - lift, 3, "F");
  pdf.setTextColor("#B32B5C");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text(documentLabel, pageWidth / 2, 157 - lift, {
    align: "center",
    charSpace: 2.2,
  });

  pdf.setTextColor("#1F1B24");
  pdf.setFont("helvetica", "bold");
  fitText(pdf, documentTitle, cardW - 110, 26, 17);
  pdf.text(documentTitle, pageWidth / 2, 206 - lift, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor("#6B7280");
  fitText(pdf, introLines[0], cardW - 96, 11, 8.5);
  pdf.text(introLines[0], pageWidth / 2, 232 - lift, {
    align: "center",
  });
  fitText(pdf, introLines[1], cardW - 96, 11, 8.5);
  pdf.text(introLines[1], pageWidth / 2, 248 - lift, {
    align: "center",
  });

  const infoX = cardX + 40;
  const infoY = 272 - lift;
  const infoW = cardW - 80;
  const volunteerRows = [
    data.availability ? ["AVAILABILITY", data.availability] : null,
    data.contribution ? ["CONTRIBUTION", data.contribution] : null,
  ].filter(Boolean) as string[][];
  const guestReminderRows = isVolunteer
    ? []
    : [
        ["POTLUCK", "Bring one dish and one drink."],
        ["GIVE & TAKE", "Bring one beautiful item someone else may love."],
      ];
  const rows = [
    ["EVENT", data.eventName],
    ["DATE", data.eventDate],
    ["NAME", data.name],
    ["EMAIL", data.email],
    ["PHONE", data.phone],
    ...volunteerRows,
    ...guestReminderRows,
  ];
  const infoH = 44 + rows.length * 27;
  pdf.setFillColor("#FFF8FB");
  pdf.setDrawColor("#E2E8F0");
  drawRoundedRect(pdf, infoX, infoY, infoW, infoH, 16, "FD");

  const labelX = infoX + 26;
  const valueX = infoX + infoW - 24;
  const valueMaxWidth = infoW - 150;

  rows.forEach(([label, value], index) => {
    const y = infoY + 32 + index * 27;
    if (index === 2) {
      pdf.setDrawColor("#E2E8F0");
      pdf.line(infoX + 22, y - 16, infoX + infoW - 22, y - 16);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor("#33C9DC");
    pdf.text(label, labelX, y, { charSpace: 1.4 });

    fitText(pdf, value || "-", valueMaxWidth, 11.5, 7.5);
    pdf.setTextColor("#1F1B24");
    pdf.text(value || "-", valueX, y, { align: "right" });
  });

  const dividerY = infoY + infoH + 28;
  pdf.setDrawColor("#E2E8F0");
  pdf.setLineDashPattern([5, 5], 0);
  pdf.line(cardX, dividerY, cardX + cardW, dividerY);
  pdf.setLineDashPattern([], 0);
  pdf.setFillColor("#FFF8FB");
  pdf.circle(cardX, dividerY, 10, "F");
  pdf.circle(cardX + cardW, dividerY, 10, "F");

  const inviteX = cardX + 40;
  const inviteY = dividerY + 42;
  const inviteW = cardW - 80;
  const inviteH = 92;
  pdf.setFillColor("#FFE3EE");
  pdf.setDrawColor("#FF3F82");
  pdf.setLineWidth(1.4);
  drawRoundedRect(pdf, inviteX, inviteY, inviteW, inviteH, 16, "FD");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor("#B32B5C");
  pdf.text(numberLabel, pageWidth / 2, inviteY + 28, {
    align: "center",
    charSpace: 1.8,
  });
  pdf.setFont("courier", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor("#1F1B24");
  pdf.text(data.invitationNumber, pageWidth / 2, inviteY + 58, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor("#6B7280");
  pdf.text(`Member ID: ${data.cbId}`, pageWidth / 2, inviteY + 78, { align: "center" });

  pdf.setFillColor("#FFD23F");
  drawRoundedRect(pdf, pageWidth / 2 - 160, inviteY + 112, 320, 34, 14, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor("#1F1B24");
  pdf.text(checkInText, pageWidth / 2, inviteY + 133, {
    align: "center",
  });

  pdf.setDrawColor("#E2E8F0");
  pdf.line(cardX + 40, pageHeight - 86, cardX + cardW - 40, pageHeight - 86);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor("#6B7280");
  pdf.text("Casa de Bloom - Where connections become opportunities.", pageWidth / 2, pageHeight - 61, {
    align: "center",
  });
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor("#B32B5C");
  pdf.setFontSize(9);
  pdf.text("Come ready to make someone else's day a little brighter.", pageWidth / 2, pageHeight - 46, {
    align: "center",
  });

  pdf.save(filename);
}
