"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeLanding from "@/components/HomeLanding";
import GuestRegistration from "@/app/register/guest/page";
import VolunteerRegistration from "@/app/register/volunteer/page";

type FlowScreen = "landing" | "guest" | "volunteer";

export default function HomeFlow() {
  const router = useRouter();
  const [screen, setScreen] = useState<FlowScreen>("landing");

  const handleRegistrationComplete = () => {
    router.push("/dashboard");
  };

  if (screen === "guest") {
    return <GuestRegistration onRegistrationComplete={handleRegistrationComplete} />;
  }

  if (screen === "volunteer") {
    return <VolunteerRegistration onRegistrationComplete={handleRegistrationComplete} />;
  }

  return (
    <HomeLanding
      onGuest={() => setScreen("guest")}
      onVolunteer={() => setScreen("volunteer")}
    />
  );
}
