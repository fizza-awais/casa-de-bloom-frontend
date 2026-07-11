export type RegistrationGender = "Male" | "Female";

export const REGISTRATION_GENDER_OPTIONS: {
  label: RegistrationGender;
  value: RegistrationGender;
}[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export const REGISTRATION_GENDER_ERROR =
  "Gender must be Male or Female.";

export function normalizeRegistrationGender(
  value: string | null | undefined,
): RegistrationGender | "" {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "male") return "Male";
  if (normalized === "female") return "Female";

  return "";
}
