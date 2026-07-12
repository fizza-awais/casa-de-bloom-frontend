import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const modal = fs.readFileSync("components/dashboard/RegisterForEventModal.tsx", "utf8");
const service = fs.readFileSync("lib/services/register.ts", "utf8");

test("dashboard event registration supports guest and volunteer roles per event", () => {
  assert.match(modal, /type RegistrationRole = "guest" \| "volunteer"/);
  assert.match(modal, /participant_type: role/);
  assert.match(modal, /Attend as Guest/);
  assert.match(modal, /Help as Volunteer/);
  assert.match(modal, /availability: availability\.trim\(\)/);
  assert.match(modal, /attending_as: attendanceMode/);
});

test("dashboard asks only for event-specific guest and volunteer details", () => {
  assert.match(modal, /bringing_to_grill: potluckContribution/);
  assert.match(modal, /service_offering: serviceOffering/);
  assert.match(modal, /willing_to_share_social: shareSocial/);
  assert.match(modal, /skills_offered: skillsOffered/);
  assert.match(modal, /can_capture_media: captureMedia/);
  assert.doesNotMatch(modal, /How did you hear about Casa de Bloom/);
});

test("current consent is reused while missing or stale consent is explicitly collected", () => {
  assert.match(modal, /community_guidelines_version === GUIDELINES_VERSION/);
  assert.match(modal, /!hasCurrentConsent && \(/);
  assert.match(modal, /hasCurrentConsent \? undefined : confirmations\.realityShow/);
  assert.match(service, /reality_show_understood\?: boolean/);
  assert.match(service, /community_guidelines_accepted\?: boolean/);
});

test("dashboard registration keeps actions fixed while event questions scroll", () => {
  assert.match(modal, /flex max-h-\[calc\(100dvh-1\.5rem\)\]/);
  assert.match(modal, /flex-1 space-y-5 overflow-y-auto/);
  assert.match(modal, /shrink-0 flex-col-reverse/);
});
