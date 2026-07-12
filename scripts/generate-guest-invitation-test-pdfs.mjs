import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { jsPDF } from "jspdf";

const root = path.resolve(import.meta.dirname, "..");
const rendererPath = path.join(root, "lib", "guestInvitationPdf.js");
const rendererSource = await fs.readFile(rendererPath, "utf8");
const rendererUrl = `data:text/javascript;base64,${Buffer.from(rendererSource).toString("base64")}`;
const {
  GUEST_INVITATION_TEMPLATE,
  registerGuestInvitationFonts,
  renderGuestInvitationArtworkPdf,
} = await import(rendererUrl);

const artworkPath = path.join(root, "public", "assets", "images", "guest-invitation-template.png");
const artwork = `data:image/png;base64,${(await fs.readFile(artworkPath)).toString("base64")}`;
const outputDirectory = path.join(root, "output", "pdf");
await fs.mkdir(outputDirectory, { recursive: true });
const fontData = Object.fromEntries(
  await Promise.all(
    Object.entries(GUEST_INVITATION_TEMPLATE.fonts).map(async ([key, font]) => [
      key,
      (await fs.readFile(path.join(root, "public", font.path))).toString("base64"),
    ]),
  ),
);

const cases = [
  {
    slug: "01-short-values",
    eventName: "Bloom Brunch",
    eventDate: "Wednesday, July 15, 2026",
    eventTime: "3:00 PM – 9:00 PM",
    eventLocation: "Kiwi Spa",
    invitationNumber: "CDB-2048",
    cbId: "CB-1030",
  },
  {
    slug: "02-long-values",
    eventName: "Casa de Bloom Summer Energy Exchange and Community Celebration",
    eventDate: "Wednesday, July 15, 2026",
    eventTime: "3:00 PM – 9:00 PM",
    eventLocation: "The Private Oceanfront Garden and Poolside Estate in North San Diego County",
    invitationNumber: "CDB-2048",
    cbId: "CB-1030",
  },
  {
    slug: "03-private-location-fallback",
    eventName: "Casa de Bloom Energy Exchange",
    eventDate: "Wednesday, July 15, 2026",
    eventTime: "3:00 PM – 9:00 PM",
    eventLocation: "",
    invitationNumber: "CDB-2048",
    cbId: "CB-1030",
  },
  {
    slug: "04-long-invitation-number",
    eventName: "Casa de Bloom Energy Exchange",
    eventDate: "Wednesday, July 15, 2026",
    eventTime: "3:00 PM – 9:00 PM",
    eventLocation: "Private Estate, San Diego",
    invitationNumber: "CASA-DE-BLOOM-GUEST-2026-0000123456789",
    cbId: "CB-1030",
  },
  {
    slug: "05-production-style",
    eventName: "Casa de Bloom Energy Exchange",
    eventDate: "Wednesday, July 15, 2026",
    eventTime: "3:00 PM – 9:00 PM",
    eventLocation: "Details provided to registered guests",
    invitationNumber: "CDB-2026-1030",
    cbId: "CB-1030",
  },
];

const report = [];
for (const testCase of cases) {
  const pdf = new jsPDF({
    unit: "px",
    format: [GUEST_INVITATION_TEMPLATE.source.width, GUEST_INVITATION_TEMPLATE.source.height],
    orientation: "portrait",
    hotfixes: ["px_scaling"],
    compress: false,
  });
  registerGuestInvitationFonts(pdf, fontData);
  const result = renderGuestInvitationArtworkPdf(pdf, artwork, testCase);
  const outputPath = path.join(outputDirectory, `${testCase.slug}.pdf`);
  await fs.writeFile(outputPath, Buffer.from(pdf.output("arraybuffer")));
  report.push({
    file: pathToFileURL(outputPath).pathname,
    page: {
      width: pdf.internal.pageSize.getWidth(),
      height: pdf.internal.pageSize.getHeight(),
    },
    measurements: result.measurements,
  });
}

const reportPath = path.join(outputDirectory, "guest-invitation-fit-report.json");
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputs: report, reportPath }, null, 2));
