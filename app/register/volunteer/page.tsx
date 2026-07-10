"use client";

import { useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, Clock, Wrench, Lock } from "lucide-react";
import MultiStepRegistrationForm, {
  CustomStep,
  RegistrationFormData,
} from "@/components/forms/MultiStepRegistrationForm";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";
import { fetchMemberMe } from "@/lib/services/auth";
import { RegisterResponse } from "@/lib/services/register";

function buildVolunteerSteps(eventOptions: EventOption[], isReturningUser: boolean): CustomStep[] {
  const profileFields: CustomStep["fields"] = [
    {
      name: "eventDate",
      label: "Select Target Shift Event",
      type: "select",
      required: true,
      colSpan: 2,
      options: eventOptions,
      placeholder: eventOptions.length ? "-- Choose an event alignment --" : "Loading events...",
      requiredMessage: "Please select an event alignment date.",
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      colSpan: 1,
      icon: <User size={16} />,
      requiredMessage: "First name is required.",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      colSpan: 1,
      icon: <User size={16} />,
      requiredMessage: "Last name is required.",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      colSpan: 1,
      icon: <Mail size={16} />,
      requiredMessage: "Enter a valid email address.",
      invalidMessage: "Enter a valid email address.",
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      required: true,
      colSpan: 1,
      icon: <Phone size={16} />,
      requiredMessage: "Phone number is required.",
    },
  ];

  if (!isReturningUser) {
    profileFields.push({
      name: "password",
      label: "Create Password",
      type: "password",
      required: true,
      colSpan: 2,
      icon: <Lock size={16} />,
      requiredMessage: "Password is required for registration.",
    });
    profileFields.push({
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      colSpan: 2,
      icon: <Lock size={16} />,
      requiredMessage: "Confirm password is required.",
    });
  }

  profileFields.push({
    name: "instagram",
    label: "Instagram Link / Handle",
    type: "text",
    colSpan: 2,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  });

  return [
    {
      key: "profile",
      label: "Identity Profile",
      img: "/assets/images/WhatsApp Image 2026-06-16 at 2.57.07 AM (20).jpeg",
      fields: profileFields,
    },
    {
      key: "logistics",
      label: "Deployment & Logistics",
      img: "/assets/images/WhatsApp Image 2026-06-16 at 2.57.07 AM (2).jpeg",
      fields: [
        {
          name: "availabilityTime",
          label: "Shift Availability Window",
          type: "text",
          colSpan: 2,
          icon: <Clock size={16} />,
          requiredMessage: "Please specify your shift availability window hours.",
        },
        {
          name: "skillsContribution",
          label: "Skills, talents, or experience you'd like to contribute",
          type: "textarea",
          colSpan: 2,
          icon: <Wrench size={16} />,
          requiredMessage: "Please declare your specialized skills or execution talents.",
        },
        {
          name: "takePhotos",
          label: "Can you take and upload photos/videos afterwards?",
          type: "toggle",
          colSpan: 2,
        },
      ],
    },
  ];
}

interface VolunteerRegistrationProps {
  onRegistrationComplete?: (
    result: RegisterResponse,
    formData: RegistrationFormData
  ) => void;
}

export default function VolunteerRegistration({ onRegistrationComplete }: VolunteerRegistrationProps = {}) {
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<RegistrationFormData>({
    eventDate: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    instagram: "",
    availabilityTime: "",
    skillsContribution: "",
    takePhotos: false,
  });

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const events = await fetchEvents();
        if (active) {
          setEventOptions(events.map(formatEventOption));
        }

        // Check if returning user
        const profile = await fetchMemberMe();
        if (active && profile) {
          setIsReturningUser(true);
          const latestVol = profile.volunteer_details?.[0] || {};
          setInitialData({
            eventDate: "", // Always select new event
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            password: "",
            confirmPassword: "",
            instagram: profile.instagram || "",
            availabilityTime: latestVol.availability || "",
            skillsContribution: latestVol.skills_offered || "",
            takePhotos: latestVol.can_capture_media || false,
          });
        }
      } catch (err) {
        console.error("Data load failed:", err);
        if (active) {
          setEventsError("Unable to load volunteer registration details right now.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const steps = useMemo(() => buildVolunteerSteps(eventOptions, isReturningUser), [eventOptions, isReturningUser]);

  if (eventsError) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-ui-border bg-ui-card/80 p-6 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-ui-text-main">Volunteer Registration</h1>
          <p className="mt-2 text-sm text-ui-text-muted">{eventsError}</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-ui-text-muted">Loading registration details...</span>
        </div>
      </main>
    );
  }

  return (
    <MultiStepRegistrationForm
      key={isReturningUser ? "returning" : "new"}
      title="Volunteer Registration"
      participantType="volunteer"
      steps={steps}
      initialFormData={initialData}
      onRegistrationComplete={onRegistrationComplete}
    />
  );
}
