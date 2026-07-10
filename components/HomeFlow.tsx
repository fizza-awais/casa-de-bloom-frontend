"use client";

import { useRouter } from "next/navigation";
import HomeLanding from "@/components/HomeLanding";

export default function HomeFlow() {
  const router = useRouter();

  return (
    <HomeLanding
      onGuest={() => router.push("/register/guest")}
      onVolunteer={() => router.push("/register/volunteer")}
    />
  );
}
