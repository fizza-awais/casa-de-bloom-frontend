import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("registration gender options are limited to Male and Female", () => {
  const genderSource = read("lib/registrationGender.ts");
  const guestSource = read("app/register/guest/page.tsx");
  const volunteerSource = read("app/register/volunteer/page.tsx");

  assert.match(genderSource, /value:\s*"Male"/);
  assert.match(genderSource, /value:\s*"Female"/);
  assert.doesNotMatch(`${genderSource}\n${guestSource}\n${volunteerSource}`, /Non-Binary|Prefer not to say|Other/);
  assert.match(guestSource, /options:\s*REGISTRATION_GENDER_OPTIONS/);
  assert.match(volunteerSource, /options:\s*REGISTRATION_GENDER_OPTIONS/);
});

test("registration submit path normalizes gender to exact backend values", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");
  const serviceSource = read("lib/services/register.ts");

  assert.match(formSource, /gender:\s*normalizeRegistrationGender\(getStringValue\("gender"\)\)\s*\|\|\s*undefined/);
  assert.match(serviceSource, /gender:\s*normalizedGender\s*\|\|\s*payload\.gender/);
});

test("backend gender errors render inline instead of as a generic banner", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");
  const serviceSource = read("lib/services/register.ts");

  assert.match(serviceSource, /class RegistrationApiError extends Error/);
  assert.match(formSource, /err instanceof RegistrationApiError && err\.fieldErrors\.gender/);
  assert.match(formSource, /setErrors\(\{\s*gender:\s*err\.fieldErrors\.gender\s*\}\)/);
  assert.match(formSource, /setApiError\(null\)/);
  assert.match(formSource, /scrollToRegistrationError\("gender-error"\)/);
});

test("gender quota error is preserved from API field response", () => {
  const serviceSource = read("lib/services/register.ts");

  assert.match(serviceSource, /Object\.entries\(errorData\)\.forEach\(\(\[field,\s*val\]\)/);
  assert.match(serviceSource, /fieldErrors\[field\]\s*=\s*message/);
  assert.match(serviceSource, /throw new RegistrationApiError\(errorMessage,\s*fieldErrors\)/);
});

test("quota endpoint is called after selecting an event", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");
  const serviceSource = read("lib/services/register.ts");

  assert.match(serviceSource, /api\/registration\/quota\//);
  assert.match(serviceSource, /url\.searchParams\.set\("event_id",\s*params\.eventId\)/);
  assert.match(serviceSource, /url\.searchParams\.set\("event_date",\s*params\.eventDate\)/);
  assert.match(formSource, /const selectedEventId = eventDateField\?\.options\?\.find/);
  assert.match(formSource, /fetchRegistrationQuota\(\s*\{\s*eventId:\s*selectedEventId,\s*eventDate:\s*selectedEventDate\s*\}/);
  assert.match(formSource, /\},\s*\[formData\.eventDate,\s*isSpecialInvite,\s*steps\]\)/);
});

test("both genders full disables Continue", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(formSource, /function allRegistrationGendersUnavailable/);
  assert.match(formSource, /genderCannotRegister\(quota,\s*"Male"\)/);
  assert.match(formSource, /genderCannotRegister\(quota,\s*"Female"\)/);
  assert.match(formSource, /isRegistrationClosed\s*\|\|\s*isSelectedGenderUnavailable/);
  assert.match(formSource, /REGISTRATION_CLOSED_MESSAGE = "Registration is closed for this event\."/);
});

test("one gender full blocks only that selected gender", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(formSource, /const isSelectedGenderUnavailable\s*=[\s\S]{0,120}quotaIsForSelectedEvent &&[\s\S]{0,120}genderCannotRegister\(quota,\s*getStringValue\("gender"\)\)/);
  assert.match(formSource, /if \(!isSpecialInvite && genderCannotRegister\(quota,\s*textValue\)\)/);
  assert.match(formSource, /return GENDER_QUOTA_UNAVAILABLE_MESSAGE/);
  assert.match(formSource, /"This gender cannot register because its quota is full\."/);
});

test("no quota message is shown when selected gender can register", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(formSource, /return unavailable \|\| quota\[key\]\?\.can_register === false/);
  assert.match(formSource, /if \(genderError\) \{\s*nextErrors\.gender = genderError;\s*\} else \{\s*delete nextErrors\.gender;/);
  assert.doesNotMatch(formSource, /quota\[key\]\?\.can_register === true[\s\S]{0,120}GENDER_QUOTA_UNAVAILABLE_MESSAGE/);
});

test("VIP link autofills registration form fields", () => {
  const vipSource = read("lib/vipInvite.ts");
  const guestSource = read("app/register/guest/page.tsx");
  const volunteerSource = read("app/register/volunteer/page.tsx");

  assert.match(vipSource, /searchParams\.get\("special_invite"\)/);
  assert.match(vipSource, /searchParams\.get\("email"\)/);
  assert.match(vipSource, /searchParams\.get\("event"\)/);
  assert.match(vipSource, /searchParams\.get\("first_name"\)/);
  assert.match(vipSource, /searchParams\.get\("last_name"\)/);
  assert.match(vipSource, /searchParams\.get\("phone"\)/);
  assert.match(`${guestSource}\n${volunteerSource}`, /eventDate:\s*resolveVipEventDate\(vipInvite\.event/);
  assert.match(`${guestSource}\n${volunteerSource}`, /firstName:\s*vipInvite\.firstName/);
  assert.match(`${guestSource}\n${volunteerSource}`, /lastName:\s*vipInvite\.lastName/);
  assert.match(`${guestSource}\n${volunteerSource}`, /email:\s*vipInvite\.email/);
  assert.match(`${guestSource}\n${volunteerSource}`, /phone:\s*vipInvite\.phone/);
});

test("VIP guest URL sets participant_type=guest", () => {
  const guestSource = read("app/register/guest/page.tsx");

  assert.match(guestSource, /participantType="guest"/);
  assert.match(guestSource, /isSpecialInvite=\{isSpecialInvite\}/);
});

test("VIP volunteer URL sets participant_type=volunteer", () => {
  const volunteerSource = read("app/register/volunteer/page.tsx");

  assert.match(volunteerSource, /participantType="volunteer"/);
  assert.match(volunteerSource, /isSpecialInvite=\{isSpecialInvite\}/);
});

test("VIP invite suppresses frontend closed-registration blocking", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(formSource, /isSpecialInvite = false/);
  assert.match(formSource, /if \(isSpecialInvite\) \{\s*return nextErrors;\s*\}/);
  assert.match(formSource, /const isRegistrationClosed =\s*!isSpecialInvite/);
  assert.match(formSource, /const isSelectedGenderUnavailable =\s*!isSpecialInvite/);
  assert.match(formSource, /const isQuotaBlockingCurrentStep =\s*!isSpecialInvite/);
});

test("VIP registration payload includes special_invite flag", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");
  const serviceSource = read("lib/services/register.ts");

  assert.match(serviceSource, /special_invite\?: boolean/);
  assert.match(formSource, /special_invite:\s*isSpecialInvite \? true : undefined/);
});

test("VIP autofilled fields are locked and greyed out", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");
  const guestSource = read("app/register/guest/page.tsx");
  const volunteerSource = read("app/register/volunteer/page.tsx");

  assert.match(guestSource, /const VIP_LOCKED_FIELDS = \["eventDate", "firstName", "lastName", "email", "phone"\]/);
  assert.match(volunteerSource, /const VIP_LOCKED_FIELDS = \["eventDate", "firstName", "lastName", "email", "phone"\]/);
  assert.match(`${guestSource}\n${volunteerSource}`, /lockedFields=\{isSpecialInvite \? VIP_LOCKED_FIELDS : \[\]\}/);
  assert.match(formSource, /lockedFields = \[\]/);
  assert.match(formSource, /if \(isFieldLocked\(name\)\) return/);
  assert.match(formSource, /bg-slate-100\/80/);
  assert.match(formSource, /disabled=\{isLocked\}/);
  assert.match(formSource, /readOnly=\{isLocked\}/);
});

test("normal non-VIP users still see quota and closed-registration blocking", () => {
  const formSource = read("components/forms/MultiStepRegistrationForm.tsx");

  assert.match(formSource, /REGISTRATION_CLOSED_MESSAGE = "Registration is closed for this event\."/);
  assert.match(formSource, /GENDER_QUOTA_UNAVAILABLE_MESSAGE =\s*"This gender cannot register because its quota is full\."/);
  assert.match(formSource, /!isSpecialInvite &&[\s\S]{0,180}\(quota\?\.registration_closed \|\| allRegistrationGendersUnavailable\(quota\)\)/);
  assert.match(formSource, /!isSpecialInvite &&[\s\S]{0,160}genderCannotRegister\(quota,\s*getStringValue\("gender"\)\)/);
});
