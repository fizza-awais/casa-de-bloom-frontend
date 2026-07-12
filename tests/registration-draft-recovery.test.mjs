import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const form = fs.readFileSync("components/forms/MultiStepRegistrationForm.tsx", "utf8");
const compliance = fs.readFileSync("components/forms/ComplianceStep.tsx", "utf8");
const draft = fs.readFileSync("lib/registrationDraft.ts", "utf8");
const login = fs.readFileSync("app/login/page.tsx", "utf8");

test("registration drafts exclude passwords and legal confirmations", () => {
  for (const field of [
    "password",
    "confirmPassword",
    "reality_show_understood",
    "photoReleaseAccepted",
    "positive_experience_agreed",
    "ageConfirmed",
    "guidelinesAccepted",
  ]) {
    assert.match(draft, new RegExp(`"${field}"`));
  }
  assert.match(draft, /SENSITIVE_FIELDS/);
  assert.match(draft, /sanitizeRegistrationDraftData/);
  assert.match(form, /password: ""/);
  assert.match(form, /guidelinesAccepted: false/);
});

test("registration answers, current step, and photo files survive refresh", () => {
  assert.match(form, /loadRegistrationDraft\(participantType\)/);
  assert.match(form, /loadRegistrationDraftPhotos\(participantType\)/);
  assert.match(form, /saveRegistrationDraft\(participantType, formData, currentIndex\)/);
  assert.match(form, /saveRegistrationDraftPhotos/);
  assert.match(draft, /window\.indexedDB\.open/);
  assert.match(draft, /48 \* 60 \* 60 \* 1000/);
});

test("saved later steps pause for password and then resume", () => {
  assert.match(form, /draftResumeIndexRef\.current = savedIndex/);
  assert.match(form, /currentIndex === 0 && draftResumeIndexRef\.current > 0/);
  assert.match(form, /return you to your saved step/);
});

test("community guidelines remain inside the mounted registration flow", () => {
  assert.doesNotMatch(compliance, /target="_blank"/);
  assert.match(compliance, /onOpenGuidelines/);
  assert.match(form, /isGuidelinesOpen/);
  assert.match(form, /CommunityGuidelinesContent/);
  assert.match(form, /Your registration is safely waiting behind this window/);
});

test("existing accounts get actionable login and alternate-email choices", () => {
  assert.match(form, /You already have a Casa de Bloom account/);
  assert.match(form, /Log In to Continue/);
  assert.match(form, /Use a Different Email/);
  assert.match(form, /returnTo: "\/dashboard#events"/);
  assert.match(form, /registrationDraft: participantType/);
  assert.match(form, /const showExistingAccountActions/);
  assert.match(form, /showExistingAccountActions \? \(/);
  assert.ok(
    form.indexOf("await checkRegistrationEmail") <
      form.indexOf("return validateStep(key)"),
    "account lookup should happen before profile-photo validation",
  );
  assert.match(form, /await saveRegistrationDraftPhotos/);
});

test("successful login safely honors dashboard return and clears the public draft", () => {
  assert.match(login, /requestedReturn\.startsWith\("\/"\)/);
  assert.match(login, /!requestedReturn\.startsWith\("\/\/"\)/);
  assert.match(login, /await clearRegistrationDraft/);
  assert.match(login, /router\.replace\(returnTo\)/);
});

test("successful registration and start over clear text and photo drafts", () => {
  assert.match(form, /await clearRegistrationDraft\(participantType\)/);
  assert.match(form, /const handleStartOver = async/);
  assert.match(form, /draftSavingPausedRef\.current = true/);
  assert.match(form, /Welcome back\. We restored your progress/);
});
