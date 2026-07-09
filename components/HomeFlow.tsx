"use client";

import { useState } from "react";
import HomeLanding from "@/components/HomeLanding";
import GuestRegistration from "@/app/register/guest/page";
import VolunteerRegistration from "@/app/register/volunteer/page";
import { DonationView } from "@/app/register/donation/page";
import RootConfirmation from "@/components/RootConfirmation";
import { RegisterResponse } from "@/lib/services/register";
import { RegistrationFlowDetails } from "@/lib/registrationFlow";

type FlowScreen = "landing" | "guest" | "volunteer" | "donation" | "confirmation";

function buildDetails(result: RegisterResponse, formData: Record<string, any>): RegistrationFlowDetails {
  return {
    invitationNumber: result.invitation_number,
    cbId: result.cb_id,
    name: `${formData.firstName ?? ""} ${formData.lastName ?? ""}`.trim(),
    eventDate: formData.eventDate ?? "",
    participantType: result.participant_type,
    recordType: result.record_type,
    recordId: result.record_id,
    registrationId: result.registration_id ?? "",
    volunteerId: result.volunteer_id ?? "",
    email: formData.email ?? "",
    phone: formData.phone ?? "",
  };
}

export default function HomeFlow() {
  const [screen, setScreen] = useState<FlowScreen>("landing");
  const [details, setDetails] = useState<RegistrationFlowDetails | null>(null);

  const handleRegistrationComplete = (result: RegisterResponse, formData: Record<string, any>) => {
    setDetails(buildDetails(result, formData));
    setScreen("donation");
  };

  if (screen === "guest") {
    return <GuestRegistration onRegistrationComplete={handleRegistrationComplete} />;
  }

  if (screen === "volunteer") {
    return <VolunteerRegistration onRegistrationComplete={handleRegistrationComplete} />;
  }

  if (screen === "donation" && details) {
    return <DonationView details={details} onContinue={() => setScreen("confirmation")} />;
  }

  if (screen === "confirmation" && details) {
    return <RootConfirmation details={details} />;
  }

  return (
    <HomeLanding
      onGuest={() => setScreen("guest")}
      onVolunteer={() => setScreen("volunteer")}
    />
  );
}
