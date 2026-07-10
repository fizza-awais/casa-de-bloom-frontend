"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, User, Calendar, Lock, Phone } from "lucide-react";
import MultiStepRegistrationForm, { CustomStep, RegistrationFormData } from "@/components/forms/MultiStepRegistrationForm";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";
import { fetchMemberMe } from "@/lib/services/auth";
import { RegisterResponse } from "@/lib/services/register";
import type { ProfileImage } from "@/lib/profileImages";

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
  giveTakeContribution: "",
  serviceOffering: "",
  spreadTheWord: false,
};

function buildGuestSteps(eventOptions: EventOption[], isReturningUser: boolean): CustomStep[] {
  const step1Fields: CustomStep["fields"] = [
    {
      name: "eventDate",
      label: "Choose Your Casa de Bloom Event",
      type: "select",
      required: true,
      colSpan: 2,
      options: eventOptions,
      placeholder: eventOptions.length ? "Select an upcoming gathering" : "Loading events...",
      icon: <Calendar size={16} />,
      requiredMessage: "Please choose the Casa de Bloom event you want to attend.",
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
      requiredMessage: "Phone number is required so we can reach you about event details.",
    },
  ];

  // Password only for new users — placed immediately after email
  if (!isReturningUser) {
    step1Fields.push({
      name: "password",
      label: "Create Your Login Password",
      type: "password",
      required: true,
      colSpan: 2,
      icon: <Lock size={16} />,
      requiredMessage: "Create a password so you can return to your dashboard.",
    });
    step1Fields.push({
      name: "confirmPassword",
      label: "Confirm Your Password",
      type: "password",
      required: true,
      colSpan: 2,
      icon: <Lock size={16} />,
      requiredMessage: "Please confirm your password.",
    });
  }

  // Age Range + Gender always last in step 1
  step1Fields.push(
    {
      name: "ageRange",
      label: "Public Age Range",
      type: "select",
      required: true,
      colSpan: 1,
      placeholder: "Select age range",
      options: [
        { label: "21+", value: "21+" },
        { label: "30+", value: "30+" },
        { label: "40+", value: "40+" },
        { label: "50+", value: "50+" },
        { label: "60+", value: "60+" },
        { label: "70+", value: "70+" },
      ],
      requiredMessage: "Please choose the age range shown with your profile.",
      helperText: "This is the age range used publicly in the Casa de Bloom community.",
    },
    {
      name: "exactAge",
      label: "Exact Age (Private)",
      type: "number",
      required: true,
      colSpan: 1,
      placeholder: "21",
      requiredMessage: "Please share your exact age for private event records.",
      invalidMessage: "Exact age must be a whole number between 21 and 120.",
      helperText: "Only the Casa de Bloom team uses this for check-in and event records.",
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
      requiredMessage: "Please select the option that feels right for you.",
    }
  );

  const steps: CustomStep[] = [
    {
      key: "identity",
      label: "Your Invitation Details",
      subtitle: "Choose your gathering and tell us who we are welcoming.",
      img: "/assets/images/WhatsApp Image 2026-06-16 at 2.57.07 AM (20).jpeg",
      fields: step1Fields,
    },
    {
      key: "community",
      label: "How You'll Join the Experience",
      subtitle: "Help us prepare the room, the potluck, and the Give & Take table.",
      img: "/assets/images/WhatsApp Image 2026-06-16 at 2.57.07 AM (2).jpeg",
      fields: [
        {
          name: "attendanceMode",
          label: "How are you planning to attend?",
          type: "select",
          required: true,
          colSpan: 2,
          placeholder: "Choose how you are arriving",
          options: [
            { label: "Coming Solo", value: "alone" },
            { label: "With a Partner", value: "partner" },
            { label: "Bringing a Friend", value: "friend" },
          ],
          requiredMessage: "Please tell us how you plan to attend.",
        },
        {
          name: "hearAboutUs",
          label: "How did you hear about Casa de Bloom?",
          type: "textarea",
          colSpan: 2,
          helperText: "Optional, but it helps us understand how the community is growing.",
        },
        {
          name: "whyAttend",
          label: "What are you hoping to experience or connect with?",
          type: "textarea",
          colSpan: 2,
          helperText: "Optional. Share what would make the day meaningful for you.",
        },
        {
          name: "communityGrill",
          label: "What dish or drink are you excited to bring for the Community Potluck?",
          type: "textarea",
          colSpan: 2,
          helperText: "This helps us build one generous table together. You can update your plan later.",
        },
        {
          name: "giveTakeContribution",
          label: "What beautiful item might you bring for the Give & Take Table?",
          type: "textarea",
          colSpan: 2,
          helperText: "Optional. Choose something someone else may love.",
        },
        {
          name: "serviceOffering",
          label: "Any service, giveaway, collaboration, or creative contribution you'd love to offer?",
          type: "textarea",
          colSpan: 2,
          helperText: "Optional. Demos, samples, games, wellness, beauty, art, hosting, or anything generous counts.",
        },
        {
          name: "spreadTheWord",
          label: "Open to sharing Casa de Bloom with your community?",
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
  const [initialProfileImages, setInitialProfileImages] = useState<ProfileImage[]>([]);
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
            giveTakeContribution: latestReg.give_take_contribution || "",
            serviceOffering: latestReg.service_offering || "",
            spreadTheWord: latestReg.willing_to_share_social || false,
          });
          setInitialProfileImages(profile.images ?? []);
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
          <h1 className="text-2xl font-extrabold text-ui-text-main">Your Casa de Bloom Invitation</h1>
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
          <span className="text-sm font-semibold text-ui-text-muted">Preparing your invitation details...</span>
        </div>
      </main>
    );
  }

  return (
    <MultiStepRegistrationForm
      key={isReturningUser ? "returning" : "new"}
      title="Your Casa de Bloom Invitation"
      participantType="guest"
      steps={steps}
      initialFormData={initialData}
      initialProfileImages={initialProfileImages}
      onRegistrationComplete={onRegistrationComplete}
      finalSubmitLabel="Create My Invitation"
    />
  );
}
