import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Bloom Celebration owns all celebration generation and rendering", () => {
  const sharedSource = read("components/effects/BloomCelebration.tsx");
  const confirmationSource = read("app/register/confirmation/page.tsx");
  const dashboardSource = read("components/dashboard/WelcomeEventBriefing.tsx");

  assert.match(sharedSource, /"petal"[\s\S]*"sparkle"[\s\S]*"heart"[\s\S]*"pearl"[\s\S]*"ribbon"/);
  assert.match(sharedSource, /const MOBILE_PIECE_COUNT = 24/);
  assert.match(sharedSource, /const DESKTOP_PIECE_COUNT = 32/);
  assert.match(confirmationSource, /components\/effects\/BloomCelebration/);
  assert.match(dashboardSource, /components\/effects\/BloomCelebration/);
  assert.doesNotMatch(`${confirmationSource}\n${dashboardSource}`, /ConfettiPiece|buildConfettiBurst|fireConfetti|confetti-fall/);
});

test("guest and volunteer variants use the same balanced luxury-tropical mix", () => {
  const sharedSource = read("components/effects/BloomCelebration.tsx");

  assert.match(sharedSource, /guest:[\s\S]*?\["petal", 0\.4\][\s\S]*?\["sparkle", 0\.3\][\s\S]*?\["heart", 0\.1\][\s\S]*?\["pearl", 0\.15\][\s\S]*?\["ribbon", 0\.05\]/);
  assert.match(sharedSource, /volunteer:[\s\S]*?\["petal", 0\.4\][\s\S]*?\["sparkle", 0\.3\][\s\S]*?\["heart", 0\.1\][\s\S]*?\["pearl", 0\.15\][\s\S]*?\["ribbon", 0\.05\]/);
  assert.match(sharedSource, /function buildShapePool/);
  assert.match(sharedSource, /#ff3f82/);
  assert.match(sharedSource, /#d6a84b/);
  assert.match(sharedSource, /#f3d9a4/);
  assert.match(sharedSource, /#fffaf5/);
});

test("Bloom Celebration uses soft motion and respects reduced motion", () => {
  const sharedSource = read("components/effects/BloomCelebration.tsx");
  const cssSource = read("app/globals.css");

  assert.match(sharedSource, /duration: randomBetween\(5\.2, 7\.4\)/);
  assert.match(sharedSource, /drift = randomBetween\(-58, 58\)/);
  assert.match(sharedSource, /fall = randomBetween\(82, 112\)/);
  assert.match(sharedSource, /prefers-reduced-motion: reduce/);
  assert.match(cssSource, /@keyframes bloom-celebration-fall/);
  assert.match(cssSource, /animation-timing-function: linear/);
  assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.bloom-celebration-piece[\s\S]*?animation: none !important/);
});

test("automatic celebration remains gated by the registration session key", () => {
  const confirmationSource = read("app/register/confirmation/page.tsx");
  const dashboardSource = read("components/dashboard/WelcomeEventBriefing.tsx");

  assert.match(confirmationSource, /sessionStorage\.getItem\(REGISTRATION_CELEBRATION_KEY\) === "1"/);
  assert.match(dashboardSource, /sessionStorage\.getItem\(REGISTRATION_CELEBRATION_KEY\) === "1"/);
  assert.match(dashboardSource, /sessionStorage\.removeItem\(REGISTRATION_CELEBRATION_KEY\)/);
  assert.match(confirmationSource, /celebrationRef\.current\?\.celebrate\(\)/);
  assert.match(dashboardSource, /celebrationRef\.current\?\.celebrate\(\)/);
});
