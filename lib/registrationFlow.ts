export interface RegistrationFlowDetails {
  invitationNumber: string;
  cbId: string;
  name: string;
  eventDate?: string;
  participantType: string;
  recordType: "registration" | "volunteer";
  recordId: string;
  registrationId?: string;
  volunteerId?: string;
  email?: string;
  phone?: string;
}
