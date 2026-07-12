import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("guest form removes the Give & Take question but keeps social sharing", () => {
  const guestSource = read("app/register/guest/page.tsx");
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.doesNotMatch(guestSource, /giveTakeContribution|What might you bring for the Give & Take Table/);
  assert.doesNotMatch(formSource, /getOptionalStringValue\("giveTakeContribution"\)/);
  assert.match(guestSource, /Open to sharing Casa de Bloom with your community\?/);
});

test("business questions use explicit conditional Yes and No choices", () => {
  const guestSource = read("app/register/guest/page.tsx");
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(guestSource, /name: "ownsBusiness"[\s\S]{0,240}type: "binary-choice"[\s\S]{0,120}required: true/);
  assert.match(guestSource, /name: "interestedInBusinessPodcast"[\s\S]*?visibleWhen: \{ field: "ownsBusiness", equals: true \}/);
  assert.match(formSource, /case "binary-choice"/);
  assert.match(formSource, /selectedValue === option\.value/);
  assert.match(formSource, /filter\(\(field\) => isFieldVisible\(field, formData\)\)/);
});

test("hidden podcast answers are cleared and omitted from guest payload", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(formSource, /if \(field\.visibleWhen && !isFieldVisible\(field, updated\)\) \{\s*updated\[field\.name\] = null;/);
  assert.match(formSource, /base\.owns_business =/);
  assert.match(formSource, /base\.business_name =\s*formData\.ownsBusiness === true/);
  assert.match(formSource, /formData\.ownsBusiness === true &&[\s\S]{0,160}formData\.interestedInBusinessPodcast/);
});

test("guest dashboard profile can update business and podcast answers", () => {
  const profileSource = read("app/dashboard/profile/page.tsx");
  const formSource = read("components/forms/FormComponent.tsx");

  assert.match(profileSource, /const hasGuestRegistration = \(profile\?\.registrations\?\.length \?\? 0\) > 0/);
  assert.match(profileSource, /Business & Creative Work/);
  assert.match(profileSource, /name: "owns_business"[\s\S]*?type: "binary-choice"/);
  assert.match(profileSource, /name: "interested_in_business_podcast"[\s\S]*?visibleWhen: \{ field: "owns_business", equals: true \}/);
  assert.match(profileSource, /requestData\.set\("owns_business", String\(ownsBusiness\)\)/);
  assert.match(formSource, /case "binary-choice"/);
  assert.match(formSource, /fields\.filter\(\(field\) => isFieldVisible\(field, formData\)\)/);
});

test("registration keeps actions visible and scrolls to the first inline error", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");
  const complianceSource = read("components/forms/ComplianceStep.tsx");
  const uploaderSource = read("components/forms/ProfileImageUploader.tsx");

  assert.match(formSource, /ref=\{formScrollRef\}[\s\S]{0,180}overflow-y-auto/);
  assert.match(formSource, /ref=\{formScrollRef\}[\s\S]*?key=\{`mobile-\$\{s\.key\}`\}/);
  assert.match(formSource, /Actions stay visible while the current step scrolls/);
  assert.match(formSource, /shrink-0 border-t[\s\S]{0,180}backdrop-blur-xl/);
  assert.match(formSource, /querySelector<HTMLElement>\([\s\S]{0,100}data-registration-error/);
  assert.match(formSource, /scrollToRegistrationError\(\)/);
  assert.match(complianceSource, /data-registration-error="true"/);
  assert.match(uploaderSource, /id="profile-images-error"[\s\S]{0,100}data-registration-error="true"/);
});
