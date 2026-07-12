"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CalendarPlus,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  TicketCheck,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useDashboardProfile } from "@/lib/context/DashboardContext";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";
import {
  checkRegistrationEmail,
  registerMember,
  RegistrationApiError,
} from "@/lib/services/register";
import { CasaMonogram, FloralFrame } from "@/components/branding/CasaBranding";

const GUIDELINES_VERSION = "1.0";
const ATTENDANCE_OPTIONS = [
  { label: "Attending Alone", value: "alone" },
  { label: "With a Partner", value: "partner" },
  { label: "Bringing a Friend", value: "friend" },
];
const CONFIRMATIONS = [
  ["realityShow", "I understand Casa de Bloom is a community-centered Reality Show experience."],
  ["photoRelease", "I agree to the photo and video release."],
  ["positiveExperience", "I agree to help create a positive experience for everyone."],
  ["ageConfirmed", "I confirm that I am at least 21 years old."],
  ["guidelinesAccepted", "I have read and accept the Community Guidelines & Terms."],
] as const;

type RegistrationRole = "guest" | "volunteer";
type ConfirmationKey = (typeof CONFIRMATIONS)[number][0];
type ConfirmationState = Record<ConfirmationKey, boolean>;

const EMPTY_CONFIRMATIONS: ConfirmationState = {
  realityShow: false,
  photoRelease: false,
  positiveExperience: false,
  ageConfirmed: false,
  guidelinesAccepted: false,
};

function fieldLabel(options: EventOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "";
}

export default function RegisterForEventModal() {
  const router = useRouter();
  const profile = useDashboardProfile();
  const latestGuest = profile.registrations?.[0];
  const latestVolunteer = profile.volunteer_details?.[0];
  const latestConsent = [...(profile.consents ?? [])].sort(
    (a, b) => new Date(b.accepted_at).getTime() - new Date(a.accepted_at).getTime(),
  )[0];
  const hasCurrentConsent = Boolean(
    latestConsent &&
      latestConsent.community_guidelines_version === GUIDELINES_VERSION &&
      latestConsent.reality_show_understood &&
      latestConsent.community_guidelines_accepted &&
      latestConsent.photo_video_release_accepted &&
      latestConsent.positive_experience_agreed &&
      latestConsent.age_confirmed_21_plus,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [role, setRole] = useState<RegistrationRole>(
    profile.participant_type === "volunteer" ? "volunteer" : "guest",
  );
  const [attendanceMode, setAttendanceMode] = useState(latestGuest?.attending_as || "");
  const [potluckContribution, setPotluckContribution] = useState("");
  const [serviceOffering, setServiceOffering] = useState("");
  const [shareSocial, setShareSocial] = useState(Boolean(latestGuest?.willing_to_share_social));
  const [availability, setAvailability] = useState(latestVolunteer?.availability || "");
  const [skillsOffered, setSkillsOffered] = useState(latestVolunteer?.skills_offered || "");
  const [captureMedia, setCaptureMedia] = useState(Boolean(latestVolunteer?.can_capture_media));
  const [confirmations, setConfirmations] = useState<ConfirmationState>(EMPTY_CONFIRMATIONS);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEventLabel = useMemo(
    () => fieldLabel(eventOptions, eventDate),
    [eventOptions, eventDate],
  );

  useEffect(() => {
    if (!isOpen || eventOptions.length > 0) return;
    let active = true;
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      setError(null);
      try {
        const options = (await fetchEvents()).map(formatEventOption);
        if (!active) return;
        setEventOptions(options);
        setEventDate((current) => current || options[0]?.value || "");
        if (!options.length) {
          setError("No upcoming Casa de Bloom events are open for registration right now.");
        }
      } catch {
        if (active) setError("Unable to load upcoming events right now. Please try again.");
      } finally {
        if (active) setIsLoadingEvents(false);
      }
    };
    loadEvents();
    return () => {
      active = false;
    };
  }, [eventOptions.length, isOpen]);

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!eventDate) {
      setError("Please choose an upcoming event.");
      return;
    }
    if (role === "guest" && !attendanceMode) {
      setError("Please choose how you plan to attend.");
      return;
    }
    if (role === "volunteer" && !availability.trim()) {
      setError("Please share when you are available to help.");
      return;
    }
    if (!hasCurrentConsent && !Object.values(confirmations).every(Boolean)) {
      setError("Please complete each final confirmation before registering.");
      return;
    }

    setIsSubmitting(true);
    try {
      const registrationStatus = await checkRegistrationEmail(profile.email, eventDate, role);
      if (registrationStatus.isRegistered) {
        setError("You are already registered for the selected event.");
        return;
      }

      await registerMember({
        participant_type: role,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone || undefined,
        age_range: profile.age_range || undefined,
        exact_age: profile.exact_age ?? undefined,
        gender: profile.gender || undefined,
        event_date: eventDate,
        reality_show_understood: hasCurrentConsent ? undefined : confirmations.realityShow,
        community_guidelines_accepted: hasCurrentConsent ? undefined : confirmations.guidelinesAccepted,
        community_guidelines_version: hasCurrentConsent ? undefined : GUIDELINES_VERSION,
        photo_video_release_accepted: hasCurrentConsent ? undefined : confirmations.photoRelease,
        positive_experience_agreed: hasCurrentConsent ? undefined : confirmations.positiveExperience,
        age_confirmed_21_plus: hasCurrentConsent ? undefined : confirmations.ageConfirmed,
        ...(role === "guest"
          ? {
              attending_as: attendanceMode,
              bringing_to_grill: potluckContribution.trim() || undefined,
              service_offering: serviceOffering.trim() || undefined,
              willing_to_share_social: shareSocial,
              owns_business:
                latestGuest?.owns_business ?? Boolean(profile.business_name),
              interested_in_business_podcast:
                latestGuest?.interested_in_business_podcast ?? undefined,
            }
          : {
              availability: availability.trim(),
              skills_offered: skillsOffered.trim() || undefined,
              can_capture_media: captureMedia,
            }),
      });

      setSuccess(
        role === "volunteer"
          ? `You're confirmed to contribute at ${selectedEventLabel || "the selected event"}.`
          : `You're registered for ${selectedEventLabel || "the selected event"}.`,
      );
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof RegistrationApiError
          ? caught.message
          : "Unable to register you for this event right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-xl border border-ui-border bg-brand-light/20 px-4 py-3 text-sm font-semibold text-ui-text-main outline-none transition focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-hover active:bg-brand-dark sm:px-5"
      >
        <CalendarPlus size={16} />
        Register for New Event
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-text-main/45 p-3 backdrop-blur-sm sm:p-4">
            <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]">
              <FloralFrame className="absolute -right-8 -top-12 z-0 hidden w-96 rotate-180 opacity-[0.46] sm:block" />
              <div className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-ui-border bg-transparent px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <CasaMonogram decorative className="hidden h-12 w-12 shrink-0 sm:block" />
                  <div>
                  <h2 className="text-xl font-extrabold text-ui-text-main">Register for a New Event</h2>
                  <p className="mt-1 text-sm text-ui-text-muted">Choose how you&apos;d like to join this gathering.</p>
                  </div>
                </div>
                <button type="button" onClick={closeModal} className="rounded-full p-2 text-ui-text-muted transition-colors hover:bg-brand-light/40 hover:text-ui-text-main" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 flex min-h-0 flex-1 flex-col bg-white/96">
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                  <div>
                    <label htmlFor="dashboard-event-date" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">Event</label>
                    <select id="dashboard-event-date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} disabled={isLoadingEvents || isSubmitting} className={fieldClass}>
                      <option value="" disabled>{isLoadingEvents ? "Loading events..." : "Select an event"}</option>
                      {eventOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>

                  <fieldset>
                    <legend className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">How would you like to join?</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-brand-light/30 p-1.5">
                      {(["guest", "volunteer"] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setRole(option); setError(null); }}
                          className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-extrabold transition ${role === option ? "bg-white text-brand-primary shadow-sm" : "text-ui-text-muted hover:text-ui-text-main"}`}
                          aria-pressed={role === option}
                        >
                          {option === "guest" ? <TicketCheck size={16} /> : <HeartHandshake size={16} />}
                          {option === "guest" ? "Attend as Guest" : "Help as Volunteer"}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {role === "guest" ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="dashboard-attendance-mode" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">How will you be attending? *</label>
                        <select id="dashboard-attendance-mode" value={attendanceMode} onChange={(e) => setAttendanceMode(e.target.value)} disabled={isSubmitting} className={fieldClass}>
                          <option value="" disabled>Select attendance</option>
                          {ATTENDANCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="dashboard-potluck" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">What dish or drink are you planning to bring?</label>
                        <textarea id="dashboard-potluck" value={potluckContribution} onChange={(e) => setPotluckContribution(e.target.value)} rows={2} className={fieldClass} placeholder="Optional - you can update your plan later" />
                      </div>
                      <div>
                        <label htmlFor="dashboard-offering" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">Any service, giveaway, collaboration, or creative contribution?</label>
                        <textarea id="dashboard-offering" value={serviceOffering} onChange={(e) => setServiceOffering(e.target.value)} rows={2} className={fieldClass} placeholder="Optional - photography, wellness, beauty, products, creative support..." />
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ui-border bg-brand-light/15 p-3 text-sm font-semibold text-ui-text-main">
                        <input type="checkbox" checked={shareSocial} onChange={(e) => setShareSocial(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-primary" />
                        Open to sharing Casa de Bloom with your community?
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="dashboard-availability" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">When are you available to help? *</label>
                        <textarea id="dashboard-availability" value={availability} onChange={(e) => setAvailability(e.target.value)} rows={2} className={fieldClass} placeholder="Share your availability before, during, or after the event" />
                      </div>
                      <div>
                        <label htmlFor="dashboard-skills" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">What skills, talents, services, or support would you like to contribute?</label>
                        <textarea id="dashboard-skills" value={skillsOffered} onChange={(e) => setSkillsOffered(e.target.value)} rows={3} className={fieldClass} placeholder="Photography, wellness, setup, cleanup, hosting, games, social media..." />
                      </div>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ui-border bg-brand-light/15 p-3 text-sm font-semibold text-ui-text-main">
                        <input type="checkbox" checked={captureMedia} onChange={(e) => setCaptureMedia(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-primary" />
                        Are you open to helping capture or upload photos/videos from the event?
                      </label>
                    </div>
                  )}

                  {!hasCurrentConsent && (
                    <fieldset className="space-y-3 rounded-2xl border border-brand-primary/20 bg-brand-light/20 p-4">
                      <legend className="px-1 text-xs font-extrabold uppercase tracking-wider text-brand-primary">Final Confirmations</legend>
                      {CONFIRMATIONS.map(([key, label]) => (
                        <label key={key} className="flex cursor-pointer items-start gap-3 text-sm font-medium leading-relaxed text-ui-text-main">
                          <input type="checkbox" checked={confirmations[key]} onChange={(e) => setConfirmations((current) => ({ ...current, [key]: e.target.checked }))} className="mt-1 h-4 w-4 shrink-0 accent-brand-primary" />
                          {label}
                        </label>
                      ))}
                    </fieldset>
                  )}

                  {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 p-3 text-sm font-semibold text-danger-600"><AlertCircle size={16} className="mt-0.5 shrink-0" /><p>{error}</p></div>}
                  {success && <div role="status" className="flex items-start gap-2 rounded-xl border border-status-active/30 bg-status-active/10 p-3 text-sm font-semibold text-status-active"><CheckCircle2 size={16} className="mt-0.5 shrink-0" /><p>{success}</p></div>}
                </div>

                <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-ui-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                  <Button type="button" variant="outline" rounded="2xl" onClick={closeModal} disabled={isSubmitting}>{success ? "Close" : "Cancel"}</Button>
                  {!success && (
                    <Button type="submit" rounded="2xl" disabled={isSubmitting || isLoadingEvents || !eventOptions.length}>
                      {isSubmitting ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Registering...</span> : role === "volunteer" ? "Confirm Volunteer Place" : "Register as Guest"}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
