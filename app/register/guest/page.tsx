"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, User, Phone, Globe, Briefcase, MapPin, Calendar } from "lucide-react";
import MultiStepRegistrationForm, { CustomStep } from "@/components/forms/MultiStepRegistrationForm";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";

const INITIAL_FORM_DATA = {
  eventDate: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  website: "",
  profession: "",
  businessName: "",
  city: "",
  ageRange: "",
  gender: "",
  hearAboutUs: "",
  whyAttend: "",
  attendanceMode: "",
  emergencyContact: "",
  foodAllergies: "",
  communityGrill: "",
  spreadTheWord: false,
};

function buildGuestSteps(eventOptions: EventOption[]): CustomStep[] {
  return [
    {
      key: "identity",
      label: "Identity",
      img: "/assets/images/beautiful-lilies-with-pink-background.jpeg",
      fields: [
        {
          name: "eventDate",
          label: "Targeted Event",
          type: "select",
          required: true,
          colSpan: 2,
          options: eventOptions,
          placeholder: eventOptions.length ? "-- Choose an upcoming event --" : "Loading events...",
          icon: <Calendar size={16} />,
          requiredMessage: "Event selection is required.",
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
          requiredMessage: "Valid email is required.",
          invalidMessage: "Valid email is required.",
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
      ],
    },
    {
      key: "profile",
      label: "Demographic Matrix",
      img: "/assets/images/close-up-homemade-therapy-salt-spa.jpeg",
      fields: [
        {
          name: "facebook",
          label: "Facebook Handle",
          type: "text",
          colSpan: 1,
        },
        {
          name: "instagram",
          label: "Instagram Handle",
          type: "text",
          colSpan: 1,
        },
        {
          name: "linkedin",
          label: "LinkedIn URL",
          type: "text",
          colSpan: 1,
        },
        {
          name: "website",
          label: "Personal Website",
          type: "url",
          colSpan: 1,
          icon: <Globe size={16} />,
        },
        {
          name: "profession",
          label: "Profession",
          type: "text",
          colSpan: 1,
          icon: <Briefcase size={16} />,
          requiredMessage: "Profession is required.",
        },
        {
          name: "businessName",
          label: "Business Name (Optional)",
          type: "text",
          colSpan: 1,
        },
        {
          name: "city",
          label: "City",
          type: "text",
          colSpan: 1,
          icon: <MapPin size={16} />,
          requiredMessage: "City is required.",
        },
        {
          name: "ageRange",
          label: "Age Range",
          type: "select",
          colSpan: 1,
          placeholder: "Select Age Bracket",
          options: [
            { label: "21-25", value: "21-25" },
            { label: "26-34", value: "26-34" },
            { label: "35-45", value: "35-45" },
            { label: "46+", value: "46+" },
          ],
          requiredMessage: "Age bracket selection is required.",
        },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          required: true,
          colSpan: 1,
          placeholder: "Select Gender",
          options: [
            { label: "Female", value: "Female" },
            { label: "Male", value: "Male" },
            { label: "Non-Binary", value: "Non-Binary" },
          ],
          requiredMessage: "Gender declaration is mandatory.",
        },
        {
          name: "attendanceMode",
          label: "Attending Layout Status",
          type: "select",
          colSpan: 1,
          placeholder: "Composition Selection",
          options: [
            { label: "Attending Alone", value: "alone" },
            { label: "With a Partner", value: "partner" },
            { label: "Bringing a Friend", value: "friend" },
          ],
          requiredMessage: "Please select attendance composition.",
        },
      ],
    },
    {
      key: "details",
      label: "Community Details",
      img: "/assets/images/high-angle-gua-sha-sleep-mask-arrangement.jpeg",
      fields: [
        {
          name: "hearAboutUs",
          label: "How did you hear about Casa de Bloom?",
          type: "textarea",
          colSpan: 2,
        },
        {
          name: "whyAttend",
          label: "Why would you like to attend?",
          type: "textarea",
          colSpan: 2,
        },
        {
          name: "emergencyContact",
          label: "Emergency Contact",
          type: "text",
          colSpan: 1,
          icon: <Phone size={16} />,
          requiredMessage: "Emergency contact is required.",
        },
        {
          name: "foodAllergies",
          label: "Dietary Restrictions",
          type: "text",
          colSpan: 1,
        },
        {
          name: "communityGrill",
          label: "Are you bringing anything for the community grill?",
          type: "text",
          colSpan: 2,
        },
        {
          name: "spreadTheWord",
          label: "Willing to help spread the word on social media?",
          type: "toggle",
          colSpan: 2,
        },
      ],
    },
  ];
}

export default function GuestRegistration() {
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

  const steps = useMemo(() => buildGuestSteps(eventOptions), [eventOptions]);

  if (eventsError) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-ui-border bg-ui-card/80 p-6 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-ui-text-main">Guest Registration</h1>
          <p className="mt-2 text-sm text-ui-text-muted">{eventsError}</p>
        </div>
      </main>
    );
  }

  return (
    <MultiStepRegistrationForm
      title="Guest Registration"
      participantType="guest"
      steps={steps}
      initialFormData={INITIAL_FORM_DATA}
    />
  );
}
