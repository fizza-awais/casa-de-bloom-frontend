export const GUEST_INVITATION_TEMPLATE = Object.freeze({
  imagePath: "/assets/images/guest-invitation-template.png",
  fonts: {
    detail: { path: "/assets/fonts/Poppins-Medium.ttf", file: "Poppins-Medium.ttf", family: "Poppins", style: "normal" },
    member: { path: "/assets/fonts/Poppins-SemiBold.ttf", file: "Poppins-SemiBold.ttf", family: "Poppins", style: "bold" },
    invitation: { path: "/assets/fonts/CormorantGaramond-SemiBold.ttf", file: "CormorantGaramond-SemiBold.ttf", family: "Cormorant Garamond", style: "bold" },
  },
  source: { width: 946, height: 1663 },
  colors: {
    detail: "#5A352A",
    invitation: "#B52B5C",
    member: "#5A352A",
  },
  fields: {
    date: { x: 117, y: 733, width: 152, height: 122, padding: 9, font: "Poppins", style: "normal", maxSize: 16, minSize: 8, lineHeight: 1.25 },
    time: { x: 316, y: 733, width: 146, height: 122, padding: 9, font: "Poppins", style: "normal", maxSize: 17, minSize: 8, lineHeight: 1.25 },
    location: { x: 515, y: 733, width: 145, height: 122, padding: 9, font: "Poppins", style: "normal", maxSize: 16, minSize: 7.5, lineHeight: 1.25 },
    event: { x: 716, y: 733, width: 152, height: 122, padding: 9, font: "Poppins", style: "normal", maxSize: 16, minSize: 7.5, lineHeight: 1.25 },
    invitationNumber: { x: 250, y: 1139, width: 471, height: 64, padding: 16, font: "Cormorant Garamond", style: "bold", maxSize: 32, minSize: 7, lineHeight: 1, charSpace: 1, singleLine: true },
    memberId: { x: 453, y: 1220, width: 141, height: 16, padding: 3, font: "Poppins", style: "bold", maxSize: 10, minSize: 6.5, lineHeight: 1, singleLine: true },
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
  const normalized = value == null ? "" : String(value).trim();
  return normalized || fallback;
}

function formatLongDate(value) {
  const normalized = present(value, "");
  if (!normalized) return GUEST_INVITATION_FALLBACKS.date;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(normalized)
    ? new Date(`${normalized}T12:00:00`)
    : new Date(normalized);

  if (Number.isNaN(date.getTime())) return normalized;

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTimePart(value) {
  const normalized = value.trim();
  if (/\b(?:AM|PM)\b/i.test(normalized)) return normalized.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
  const match = normalized.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return normalized;
  const date = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTimeRange(value) {
  const normalized = present(value, "");
  if (!normalized) return GUEST_INVITATION_FALLBACKS.time;
  const parts = normalized.split(/\s*(?:–|-|to)\s*/i).filter(Boolean);
  if (parts.length === 2) return `${formatTimePart(parts[0])} – ${formatTimePart(parts[1])}`;
  return formatTimePart(normalized);
}

export function normalizeGuestInvitationData(data) {
  return {
    date: formatLongDate(data.eventDate),
    time: formatTimeRange(data.eventTime),
    location: present(data.eventLocation, GUEST_INVITATION_FALLBACKS.location),
    event: present(data.eventName, GUEST_INVITATION_FALLBACKS.event),
    invitationNumber: present(data.invitationNumber, GUEST_INVITATION_FALLBACKS.invitationNumber),
    memberId: present(data.cbId, GUEST_INVITATION_FALLBACKS.memberId),
  };
}

function measureText(pdf, value) {
  return pdf.getTextWidth(value);
}

function withEllipsis(pdf, value, maxWidth) {
  if (measureText(pdf, value) <= maxWidth) return value;
  const ellipsis = "...";
  let trimmed = value;
  while (trimmed.length > 0 && measureText(pdf, `${trimmed}${ellipsis}`) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed ? `${trimmed}${ellipsis}` : ellipsis;
}

function fitTextToField(pdf, value, field) {
  const availableWidth = field.width - field.padding * 2;
  const availableHeight = field.height - field.padding * 2;
  let size = field.maxSize;
  let lines = [value];
  let truncated = false;

  while (size >= field.minSize) {
    pdf.setFont(field.font, field.style);
    pdf.setFontSize(size);
    pdf.setCharSpace(field.charSpace ?? 0);
    lines = field.singleLine ? [value] : wrapMeasuredText(pdf, value, availableWidth);
    const lineHeight = size * field.lineHeight;
    const widthFits = lines.every((line) => measureText(pdf, line) <= availableWidth);
    const heightFits = lines.length * lineHeight <= availableHeight;
    if (widthFits && heightFits && (!field.singleLine || lines.length === 1)) break;
    size -= 0.5;
  }

  size = Math.max(size, field.minSize);
  pdf.setFont(field.font, field.style);
  pdf.setFontSize(size);
  pdf.setCharSpace(field.charSpace ?? 0);

  if (field.singleLine) {
    lines = [withEllipsis(pdf, value, availableWidth)];
    truncated = lines[0] !== value;
  } else {
    lines = wrapMeasuredText(pdf, value, availableWidth);
    const lineHeight = size * field.lineHeight;
    const maxLines = Math.max(1, Math.floor(availableHeight / lineHeight));
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[lines.length - 1] = withEllipsis(pdf, lines[lines.length - 1], availableWidth);
      truncated = true;
    }
  }

  return { size, lines, truncated };
}

function wrapMeasuredText(pdf, value, maxWidth) {
  const words = value.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const chunks = splitLongWord(pdf, word, maxWidth);
    chunks.forEach((chunk) => {
      const candidate = current ? `${current} ${chunk}` : chunk;
      if (!current || measureText(pdf, candidate) <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = chunk;
      }
    });
  });
  if (current) lines.push(current);
  return lines.length ? lines : [value];
}

function splitLongWord(pdf, word, maxWidth) {
  if (measureText(pdf, word) <= maxWidth) return [word];

  const chunks = [];
  let current = "";
  Array.from(word).forEach((char) => {
    const next = `${current}${char}`;
    if (!current || measureText(pdf, next) <= maxWidth) {
      current = next;
    } else {
      chunks.push(current);
      current = char;
    }
  });
  if (current) chunks.push(current);
  return chunks;
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

  return {
    fontSize: fitted.size,
    lineCount: fitted.lines.length,
    truncated: fitted.truncated,
    lines: fitted.lines,
  };
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
