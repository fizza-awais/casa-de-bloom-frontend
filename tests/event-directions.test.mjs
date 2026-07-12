import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const directions = fs.readFileSync(
  "components/ui/EventDirectionsLink.tsx",
  "utf8",
);

test("directions links are optional, safe, and open Google Maps separately", () => {
  assert.match(directions, /if \(!href\) return null/);
  assert.match(directions, /url\.protocol !== "https:"/);
  assert.match(directions, /url\.protocol !== "http:"/);
  assert.match(directions, /target="_blank"/);
  assert.match(directions, /rel="noopener noreferrer"/);
  assert.match(directions, /Open in Google Maps/);
  assert.match(directions, /Get Directions/);
});

test("confirmation and dashboard keep directions beside event details", () => {
  const consumers = [
    "app/register/confirmation/page.tsx",
    "components/dashboard/EventTracker.tsx",
    "components/dashboard/WelcomeEventBriefing.tsx",
  ];

  consumers.forEach((path) => {
    const source = fs.readFileSync(path, "utf8");
    assert.match(source, /EventDirectionsLink/, path);
    assert.match(source, /google_maps_url/, path);
  });
});

test("event dashboard receives a floral frame without changing event cards", () => {
  const tracker = fs.readFileSync(
    "components/dashboard/EventTracker.tsx",
    "utf8",
  );

  assert.match(tracker, /<FloralFrame/);
  assert.match(tracker, /pointer-events-none|FloralFrame/);
});
