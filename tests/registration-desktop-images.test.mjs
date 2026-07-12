import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const form = fs.readFileSync("components/forms/MultiStepRegistrationForm.tsx", "utf8");
const guest = fs.readFileSync("app/register/guest/page.tsx", "utf8");
const volunteer = fs.readFileSync("app/register/volunteer/page.tsx", "utf8");

test("registration uses dedicated portrait artwork only in the desktop panel", () => {
  assert.match(form, /desktopImg\?: string/);
  assert.match(form, /src=\{s\.desktopImg \?\? s\.img\}/);
  assert.match(form, /registration_desktop_confirmations\.webp/);
  assert.match(form, /lg:block/);
  assert.match(form, /lg:hidden/);
  assert.match(form, /src=\{s\.img\}/);
});

test("guest and volunteer steps share the matching desktop artwork sequence", () => {
  for (const source of [guest, volunteer]) {
    assert.match(source, /registration_desktop_welcome\.webp/);
    assert.match(source, /registration_desktop_community\.webp/);
  }
});
