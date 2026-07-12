export const GUEST_INVITATION_TEMPLATE = Object.freeze({
  imagePath: "/assets/images/guest-invitation-template.png",
  fonts: {
    detail: { path: "/assets/fonts/Poppins-Medium.ttf", file: "Poppins-Medium.ttf", family: "Poppins", style: "normal" },
    member: { path: "/assets/fonts/Poppins-SemiBold.ttf", file: "Poppins-SemiBold.ttf", family: "Poppins", style: "bold" },
    invitation: { path: "/assets/fonts/CormorantGaramond-SemiBold.ttf", file: "CormorantGaramond-SemiBold.ttf", family: "Cormorant Garamond", style: "bold" },
  },
  source: { width: 1024, height: 1535 },
  colors: {
    detail: "#5A352A",
    invitation: "#B52B5C",
    member: "#5A352A",
  },
  fields: {
    date: { x: 126, y: 764, width: 166, height: 120, padding: 12, font: "Poppins", style: "normal", maxSize: 17, minSize: 11, lineHeight: 1.28 },
    time: { x: 343, y: 764, width: 160, height: 120, padding: 12, font: "Poppins", style: "normal", maxSize: 18, minSize: 11, lineHeight: 1.28 },
    location: { x: 559, y: 764, width: 160, height: 120, padding: 12, font: "Poppins", style: "normal", maxSize: 17, minSize: 10, lineHeight: 1.28 },
    event: { x: 775, y: 764, width: 166, height: 120, padding: 12, font: "Poppins", style: "normal", maxSize: 17, minSize: 10, lineHeight: 1.28 },
    invitationNumber: { x: 271, y: 1177, width: 509, height: 73, padding: 18, font: "Cormorant Garamond", style: "bold", maxSize: 35, minSize: 16, lineHeight: 1, charSpace: 1.05, singleLine: true },
    memberId: { x: 500, y: 1265, width: 148, height: 21, padding: 5, font: "Poppins", style: "bold", maxSize: 12, minSize: 8, lineHeight: 1, singleLine: true },
  },
});

export const GUEST_INVITATION_FALLBACKS = Object.freeze({
  date: "Date provided to registered guests",
  time: "Time provided to registered guests",
  location: "Details provided to registered guests",
  event: "Casa de Bloom Gathering",
  invitationNumber: "Pending",
  memberId: "Pending",
});

function present(value, fallback) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized || fallback;
}

export function normalizeGuestInvitationData(data) {
  return {
    date: present(data.eventDate, GUEST_INVITATION_FALLBACKS.date),
    time: present(data.eventTime, GUEST_INVITATION_FALLBACKS.time),
    location: present(data.eventLocation, GUEST_INVITATION_FALLBACKS.location),
    event: present(data.eventName, GUEST_INVITATION_FALLBACKS.event),
    invitationNumber: present(data.invitationNumber, GUEST_INVITATION_FALLBACKS.invitationNumber),
    memberId: present(data.cbId, GUEST_INVITATION_FALLBACKS.memberId),
  };
}

function fitTextToField(pdf, value, field) {
  const availableWidth = field.width - field.padding * 2;
  const availableHeight = field.height - field.padding * 2;
  let size = field.maxSize;
  let lines = [value];

  while (size >= field.minSize) {
    pdf.setFont(field.font, field.style);
    pdf.setFontSize(size);
    pdf.setCharSpace(field.charSpace ?? 0);
    lines = field.singleLine ? [value] : wrapMeasuredText(pdf, value, availableWidth);
    const lineHeight = size * field.lineHeight;
    const widthFits = lines.every((line) => pdf.getTextWidth(line) <= availableWidth);
    const heightFits = lines.length * lineHeight <= availableHeight;
    if (widthFits && heightFits && (!field.singleLine || lines.length === 1)) break;
    size -= 0.5;
  }

  return { size: Math.max(size, field.minSize), lines };
}

function wrapMeasuredText(pdf, value, maxWidth) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || pdf.getTextWidth(candidate) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  return lines.length ? lines : [value];
}

function drawCenteredField(pdf, value, field, color) {
  const fitted = fitTextToField(pdf, value, field);
  const lineHeight = fitted.size * field.lineHeight;
  const blockHeight = fitted.lines.length * lineHeight;
  const centerX = field.x + field.width / 2;
  const firstBaseline = field.y + (field.height - blockHeight) / 2 + fitted.size * 0.82;

  pdf.setFont(field.font, field.style);
  pdf.setFontSize(fitted.size);
  pdf.setCharSpace(field.charSpace ?? 0);
  pdf.setTextColor(color);
  fitted.lines.forEach((line, index) => {
    pdf.text(line, centerX, firstBaseline + index * lineHeight, { align: "center" });
  });
  pdf.setCharSpace(0);

  return { fontSize: fitted.size, lineCount: fitted.lines.length };
}

export function renderGuestInvitationArtworkPdf(pdf, imageData, data) {
  const template = GUEST_INVITATION_TEMPLATE;
  const values = normalizeGuestInvitationData(data);
  pdf.addImage(
    imageData,
    "PNG",
    0,
    0,
    template.source.width,
    template.source.height,
    undefined,
    "NONE",
  );

  const measurements = {
    date: drawCenteredField(pdf, values.date, template.fields.date, template.colors.detail),
    time: drawCenteredField(pdf, values.time, template.fields.time, template.colors.detail),
    location: drawCenteredField(pdf, values.location, template.fields.location, template.colors.detail),
    event: drawCenteredField(pdf, values.event, template.fields.event, template.colors.detail),
    invitationNumber: drawCenteredField(pdf, values.invitationNumber, template.fields.invitationNumber, template.colors.invitation),
    memberId: drawCenteredField(pdf, values.memberId, template.fields.memberId, template.colors.member),
  };

  return { values, measurements };
}

export async function loadGuestInvitationArtwork(path = GUEST_INVITATION_TEMPLATE.imagePath) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load guest invitation artwork (${response.status}).`);
  const blob = await response.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read guest invitation artwork."));
    reader.readAsDataURL(blob);
  });
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

export function registerGuestInvitationFonts(pdf, fontData) {
  Object.entries(GUEST_INVITATION_TEMPLATE.fonts).forEach(([key, font]) => {
    const base64 = fontData[key];
    if (!base64) throw new Error(`Missing embedded invitation font: ${key}`);
    pdf.addFileToVFS(font.file, base64);
    pdf.addFont(font.file, font.family, font.style);
  });
}

export async function loadGuestInvitationFonts(pdf) {
  const entries = await Promise.all(
    Object.entries(GUEST_INVITATION_TEMPLATE.fonts).map(async ([key, font]) => {
      const response = await fetch(font.path);
      if (!response.ok) throw new Error(`Unable to load ${font.family} (${response.status}).`);
      return [key, arrayBufferToBase64(await response.arrayBuffer())];
    }),
  );
  registerGuestInvitationFonts(pdf, Object.fromEntries(entries));
}
