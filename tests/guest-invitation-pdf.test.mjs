import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const renderer = fs.readFileSync("lib/guestInvitationPdf.js", "utf8");
const downloader = fs.readFileSync("lib/downloadInvitationPdf.ts", "utf8");

test("guest artwork PDF uses one source-pixel template configuration", () => {
  assert.match(renderer, /source: \{ width: 946, height: 1663 \}/);
  assert.match(renderer, /fields: \{/);
  assert.match(renderer, /invitationNumber:/);
  assert.match(renderer, /memberId:/);
  assert.match(renderer, /pdf\.addImage\([\s\S]*template\.source\.width,[\s\S]*template\.source\.height,[\s\S]*"NONE"/);
});

test("guest artwork PDF embeds the matching local Poppins and Cormorant fonts", () => {
  assert.match(renderer, /Poppins-Medium\.ttf/);
  assert.match(renderer, /Poppins-SemiBold\.ttf/);
  assert.match(renderer, /CormorantGaramond-SemiBold\.ttf/);
  assert.match(renderer, /pdf\.addFileToVFS/);
  assert.match(renderer, /pdf\.addFont/);
  assert.match(downloader, /await loadGuestInvitationFonts\(pdf\)/);
});

test("guest PDF sanitizes empty values and preserves the required location fallback", () => {
  assert.match(renderer, /Details provided to registered guests/);
  assert.match(renderer, /normalizeGuestInvitationData/);
  assert.match(renderer, /value == null \? "" : String\(value\)\.trim\(\)/);
});

test("guest template falls back to the plain PDF and volunteer remains unchanged", () => {
  assert.match(downloader, /if \(data\.role === "volunteer"\) \{\s*return downloadPlainInvitationPdf\(data\)/);
  assert.match(downloader, /catch \(error\)[\s\S]*return downloadPlainInvitationPdf\(data\)/);
});

test("text fitting measures width, wrapping, and available height", () => {
  assert.match(renderer, /wrapMeasuredText\(pdf, value, availableWidth\)/);
  assert.match(renderer, /measureText\(pdf, line\) <= availableWidth/);
  assert.match(renderer, /lines\.length \* lineHeight <= availableHeight/);
  assert.match(renderer, /splitLongWord/);
  assert.match(renderer, /singleLine: true/);
});
