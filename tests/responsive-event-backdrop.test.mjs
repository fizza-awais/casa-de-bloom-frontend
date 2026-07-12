import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const backdrop = fs.readFileSync("components/ui/ResponsiveEventBackdrop.tsx", "utf8");
const consumers = [
  "app/login/page.tsx",
  "app/register/confirmation/page.tsx",
  "app/register/donation/page.tsx",
  "app/register/guidelines/page.tsx",
  "components/HomeLanding.tsx",
  "components/RootConfirmation.tsx",
];

test("event backgrounds switch to the portrait source only on portrait screens", () => {
  assert.match(backdrop, /bg_image_sunset_portrait_2026\.webp/);
  assert.match(backdrop, /\(max-width: 1023px\) and \(orientation: portrait\)/);
  assert.match(backdrop, /<picture>/);
  assert.match(backdrop, /<source/);
  assert.match(backdrop, /srcSet=\{portrait\.srcSet\}/);
});

test("all event background surfaces use the shared responsive implementation", () => {
  consumers.forEach((path) => {
    const source = fs.readFileSync(path, "utf8");
    assert.match(source, /ResponsiveEventBackdrop/, path);
    assert.doesNotMatch(source, /bg_image_sunset_2026\.webp/, path);
  });
});
