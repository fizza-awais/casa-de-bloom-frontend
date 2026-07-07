"use client";

import { useEffect, useMemo, useState } from "react";
import { User, Mail, Phone, Clock, Wrench } from "lucide-react";
import MultiStepRegistrationForm, { CustomStep } from "@/components/forms/MultiStepRegistrationForm";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";

const INITIAL_FORM_DATA = {
  eventDate: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  instagram: "",
  availabilityTime: "",
  skillsContribution: "",
  takePhotos: false,
};

function buildVolunteerSteps(eventOptions: EventOption[]): CustomStep[] {
  return [
    {
      key: "profile",
      label: "Identity Profile",
      img: "/assets/images/beautiful-lilies-with-pink-background.jpeg",
      fields: [
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
        {
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
        },
      ],
    },
    {
      key: "logistics",
      label: "Deployment & Logistics",
      img: "/assets/images/spa-elements-pink.jpeg",
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

export default function VolunteerRegistration() {
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        const events = await fetchEvents();
        if (active) {
          setEventOptions(events.map(formatEventOption));
        }
      } catch {
        if (active) {
          setEventsError("We could not load the event list right now.");
        }
      }
    };

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const steps = useMemo(() => buildVolunteerSteps(eventOptions), [eventOptions]);

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

  return (
    <MultiStepRegistrationForm
      title="Volunteer Registration"
      participantType="volunteer"
      steps={steps}
      initialFormData={INITIAL_FORM_DATA}
    />
  );
}
