import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const assets = [
  "floral-corner.png",
  "floral-garland.png",
  "logo-horizontal.png",
  "logo-vertical.png",
  "monogram-seal.png",
  "monogram-tile.png",
  "villa-landscape.png",
  "villa-portrait.png",
];

test("Casa branding assets are bundled under one stable public path", () => {
  assets.forEach((asset) => {
    assert.equal(
      fs.existsSync(`public/assets/branding/${asset}`),
      true,
      asset,
    );
  });
});

test("shared branding components own decorative asset paths", () => {
  const branding = fs.readFileSync(
    "components/branding/CasaBranding.tsx",
    "utf8",
  );

  [
    "floral-corner.png",
    "floral-garland.png",
    "logo-horizontal.png",
    "logo-vertical.png",
    "monogram-seal.png",
    "monogram-tile.png",
  ].forEach((asset) => assert.match(branding, new RegExp(asset.replace(".", "\\."))));
  assert.match(branding, /alt=\{decorative \? "" : "Casa de Bloom"\}/);
  assert.match(branding, /pointer-events-none/);
});

test("branding is placed on celebratory surfaces without entering field definitions", () => {
  const confirmation = fs.readFileSync(
    "app/register/confirmation/page.tsx",
    "utf8",
  );
  const form = fs.readFileSync(
    "components/forms/MultiStepRegistrationForm.tsx",
    "utf8",
  );

  assert.match(confirmation, /FloralFrame/);
  assert.match(confirmation, /CasaMonogram/);
  assert.match(form, /isLastStep &&/);
  assert.doesNotMatch(form, /icon:\s*<CasaMonogram/);
});
