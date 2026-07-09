"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Gift, Mail, User, Calendar, Lock, Phone, PartyPopper, UtensilsCrossed } from "lucide-react";
import MultiStepRegistrationForm, { CustomStep } from "@/components/forms/MultiStepRegistrationForm";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";
import { fetchMemberMe } from "@/lib/services/auth";
import { RegisterResponse } from "@/lib/services/register";
import Button from "@/components/ui/Button";

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

const BEFORE_YOU_ARRIVE = [
  {
    id: "reality-show",
    title: "Community-Centered Reality Show",
    summary: "Know the vibe before you arrive.",
    details:
      "Casa de Bloom is a community-centered Reality Show where transformation, creativity, generosity, and meaningful human connection come together through shared experiences.",
  },
  {
    id: "name-tag",
    title: "Name Tags",
    summary: "Wear a visible first and last name tag.",
    details:
      "Name tags help us welcome guests properly and make it easier for everyone to connect throughout the day.",
  },
  {
    id: "business-owners",
    title: "Business Owners",
    summary: "Share your work without making it feel salesy.",
    details:
      "If you run a business or offer a service, you are welcome here. We encourage short introductions, simple Marketplace sharing, and genuine conversation over hard selling.",
  },
  {
    id: "community-values",
    title: "Community Values",
    summary: "Bring kindness, respect, and generosity.",
    details:
      "Be kind. Be respectful. Be generous. Be honest. Support one another. Respect the home, the community, and each otherâ€™s belongings. Most importantly, enjoy the experience.",
  },
];

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
  onRegistrationComplete?: (result: RegisterResponse, formData: Record<string, any>) => void;
}

export default function GuestRegistration({ onRegistrationComplete }: GuestRegistrationProps = {}) {
  const router = useRouter();
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [initialData, setInitialData] = useState<Record<string, any>>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Data load failed:", err);
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
    <main className="relative min-h-screen w-full overflow-x-hidden px-4 py-8 md:py-12">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-light/30 to-brand-accent/10" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_50px_rgba(31,27,36,0.12)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-sunshine px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-ui-text-main shadow-sm">
                <PartyPopper size={14} />
                Warm welcome
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-ui-text-main md:text-4xl">
                Casa de Bloom is a community-centered Reality Show.
              </h1>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border-2 border-brand-primary/25 bg-brand-primary/10 p-4 shadow-inner">
                  <div className="flex items-center gap-2 text-brand-primary">
                    <UtensilsCrossed size={18} strokeWidth={2.4} />
                    <span className="text-xs font-bold uppercase tracking-widest">Potluck</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ui-text-main">
                    Bring a dish and a drink. This is the most important thing to remember.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-brand-secondary/25 bg-brand-secondary/10 p-4 shadow-inner">
                  <div className="flex items-center gap-2 text-brand-secondary">
                    <Gift size={18} strokeWidth={2.4} />
                    <span className="text-xs font-bold uppercase tracking-widest">Give &amp; Take Table</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ui-text-main">
                    Share small items you no longer use and help them find a new home.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-ui-border bg-white/80 p-3.5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">Before You Arrive</p>
              <div className="mt-3 space-y-2.5">
                {BEFORE_YOU_ARRIVE.map((item) => (
                  <details key={item.id} className="group rounded-xl border border-ui-border bg-white/80 px-4 py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                      <div>
                        <p className="text-sm font-bold text-ui-text-main">{item.title}</p>
                        <p className="text-xs text-ui-text-muted">{item.summary}</p>
                      </div>
                      <span className="text-brand-primary transition-transform group-open:rotate-180">
                        <ChevronDown size={16} />
                      </span>
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-ui-text-main">
                      {item.details}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              rounded="2xl"
              size="lg"
              icon={<Gift size={16} strokeWidth={2.5} />}
              onClick={() => router.push("/register/donation")}
            >
              Donate
            </Button>
            <p className="text-sm text-ui-text-muted">
              Optional donations help with setup, cleanup, Kiwi Spa, and guest gifts.
            </p>
          </div>
        </section>

        <MultiStepRegistrationForm
          key={isReturningUser ? "returning" : "new"}
          title="Guest Registration"
          participantType="guest"
          steps={steps}
          initialFormData={initialData}
          onRegistrationComplete={onRegistrationComplete}
        />
      </div>
    </main>
  );
}
