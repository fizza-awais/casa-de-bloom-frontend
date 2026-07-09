"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, User, Calendar, Lock, Phone } from "lucide-react";
import MultiStepRegistrationForm, { CustomStep, RegistrationFormData } from "@/components/forms/MultiStepRegistrationForm";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";
import { fetchMemberMe } from "@/lib/services/auth";
import { RegisterResponse } from "@/lib/services/register";

const INITIAL_FORM_DATA = {
  eventDate: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  ageRange: "",
  exactAge: "",
  gender: "",
  attendanceMode: "",
  hearAboutUs: "",
  whyAttend: "",
  communityGrill: "",
  spreadTheWord: false,
};

function buildGuestSteps(eventOptions: EventOption[], isReturningUser: boolean): CustomStep[] {
  const step1Fields: CustomStep["fields"] = [
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
      placeholder: "you@example.com",
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
  ];

  // Password only for new users — placed immediately after email
  if (!isReturningUser) {
    step1Fields.push({
      name: "password",
      label: "Create Password",
      type: "password",
      required: true,
      colSpan: 2,
      icon: <Lock size={16} />,
      requiredMessage: "Password is required for registration.",
    });
    step1Fields.push({
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      colSpan: 2,
      icon: <Lock size={16} />,
      requiredMessage: "Confirm password is required.",
    });
  }

  // Age Range + Gender always last in step 1
  step1Fields.push(
    {
      name: "ageRange",
      label: "Public Age Bracket",
      type: "select",
      required: true,
      colSpan: 1,
      placeholder: "Select Age Bracket",
      options: [
        { label: "21+", value: "21+" },
        { label: "30+", value: "30+" },
        { label: "40+", value: "40+" },
        { label: "50+", value: "50+" },
        { label: "60+", value: "60+" },
        { label: "70+", value: "70+" },
      ],
      requiredMessage: "Age bracket selection is required.",
    },
    {
      name: "exactAge",
      label: "Exact Age (Private Stats Only)",
      type: "number",
      required: true,
      colSpan: 1,
      placeholder: "21",
      requiredMessage: "Exact age is required for internal stats.",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      colSpan: 2,
      placeholder: "Select Gender",
      options: [
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
        { label: "Non-Binary", value: "Non-Binary" },
        { label: "Prefer not to say", value: "Prefer not to say" },
      ],
      requiredMessage: "Gender declaration is mandatory.",
    }
  );

  const steps: CustomStep[] = [
    {
      key: "identity",
      label: "Identity & Demographics",
      img: "/assets/images/beautiful-lilies-with-pink-background.jpeg",
      fields: step1Fields,
    },
    {
      key: "community",
      label: "Community Details",
      img: "/assets/images/high-angle-gua-sha-sleep-mask-arrangement.jpeg",
      fields: [
        {
          name: "attendanceMode",
          label: "Attending Layout Status",
          type: "select",
          required: true,
          colSpan: 2,
          placeholder: "Select Attendance Composition",
          options: [
            { label: "Attending Alone", value: "alone" },
            { label: "With a Partner", value: "partner" },
            { label: "Bringing a Friend", value: "friend" },
          ],
          requiredMessage: "Please select attendance composition.",
        },
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

  return steps;
}

interface GuestRegistrationProps {
  onRegistrationComplete?: (result: RegisterResponse, formData: RegistrationFormData) => void;
}

export default function GuestRegistration({ onRegistrationComplete }: GuestRegistrationProps = {}) {
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [initialData, setInitialData] = useState<RegistrationFormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const events = await fetchEvents();
        if (!active) return;

        if (events.length === 0) {
          setEventsError("No upcoming Casa de Bloom events are open for registration right now.");
          setIsLoading(false);
          return;
        }

        setEventOptions(events.map(formatEventOption));
      } catch (err) {
        console.error("Event load failed:", err);
        if (active) {
          setEventsError(err instanceof Error ? err.message : "Unable to load events right now.");
          setIsLoading(false);
        }
        return;
      }

      try {
        // Check if returning user
        const profile = await fetchMemberMe();
        if (active && profile) {
          setIsReturningUser(true);
          const latestReg = profile.registrations?.[0] || {};
          setInitialData({
            eventDate: "",
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            password: "",
            confirmPassword: "",
            ageRange: profile.age_range || "",
            exactAge: profile.exact_age ? String(profile.exact_age) : "",
            gender: profile.gender || "",
            attendanceMode: latestReg.attending_as || "",
            hearAboutUs: latestReg.how_heard || "",
            whyAttend: latestReg.why_attend || "",
            communityGrill: latestReg.bringing_to_grill || "",
            spreadTheWord: latestReg.willing_to_share_social || false,
          });
        }
      } catch (err) {
        console.error("Profile load failed:", err);
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

  const steps = useMemo(() => buildGuestSteps(eventOptions, isReturningUser), [eventOptions, isReturningUser]);

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
      title="Guest Registration"
      participantType="guest"
      steps={steps}
      initialFormData={initialData}
      onRegistrationComplete={onRegistrationComplete}
    />
  );
}
