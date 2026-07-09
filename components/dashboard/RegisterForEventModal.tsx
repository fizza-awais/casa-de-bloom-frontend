"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarPlus, CheckCircle2, Loader2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useDashboardProfile } from "@/lib/context/DashboardContext";
import { fetchEvents, formatEventOption, EventOption } from "@/lib/services/events";
import { checkRegistrationEmail, registerMember } from "@/lib/services/register";

const ATTENDANCE_OPTIONS = [
  { label: "Attending Alone", value: "alone" },
  { label: "With a Partner", value: "partner" },
  { label: "Bringing a Friend", value: "friend" },
];

function fieldLabel(options: EventOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "";
}

export default function RegisterForEventModal() {
  const router = useRouter();
  const profile = useDashboardProfile();
  const latestRegistration = profile.registrations?.[0] || {};

  const [isOpen, setIsOpen] = useState(false);
  const [eventOptions, setEventOptions] = useState<EventOption[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [attendanceMode, setAttendanceMode] = useState(latestRegistration.attending_as || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEventLabel = useMemo(() => fieldLabel(eventOptions, eventDate), [eventOptions, eventDate]);

  useEffect(() => {
    if (!isOpen || eventOptions.length > 0) return;

    let active = true;
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      setError(null);
      try {
        const events = await fetchEvents();
        if (!active) return;

        const options = events.map(formatEventOption);
        setEventOptions(options);
        setEventDate((current) => current || options[0]?.value || "");

        if (options.length === 0) {
          setError("No upcoming Casa de Bloom events are open for registration right now.");
        }
      } catch {
        if (active) {
          setError("Unable to load upcoming events right now. Please try again.");
        }
      } finally {
        if (active) {
          setIsLoadingEvents(false);
        }
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

    if (!attendanceMode) {
      setError("Please choose how you plan to attend.");
      return;
    }

    setIsSubmitting(true);
    try {
      const availability = await checkRegistrationEmail(profile.email, eventDate, "guest");
      if (availability.isRegistered) {
        setError("This email is already registered for the selected event.");
        return;
      }

      await registerMember({
        participant_type: "guest",
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone: profile.phone || undefined,
        age_range: profile.age_range || undefined,
        exact_age: profile.exact_age ?? undefined,
        gender: profile.gender || undefined,
        event_date: eventDate,
        community_guidelines_accepted: true,
        community_guidelines_version: "1.0",
        photo_video_release_accepted: true,
        age_confirmed_21_plus: true,
        attending_as: attendanceMode,
      });

      setSuccess(`You are registered for ${selectedEventLabel || "the selected event"}.`);
      router.refresh();
    } catch {
      setError("Unable to register you for this event right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-hover active:bg-brand-dark"
      >
        <CalendarPlus size={16} />
        Register for New Event
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-text-main/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-ui-text-main">Register for a New Event</h2>
                <p className="mt-1 text-sm text-ui-text-muted">
                  Choose an event and confirm the event-specific details.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-ui-text-muted transition-colors hover:bg-brand-light/40 hover:text-ui-text-main"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="dashboard-event-date" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">
                  Event
                </label>
                <select
                  id="dashboard-event-date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={isLoadingEvents || isSubmitting}
                  className="mt-1 w-full rounded-xl border border-ui-border bg-brand-light/20 px-4 py-3 text-sm font-semibold text-ui-text-main outline-none transition focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10"
                >
                  {isLoadingEvents ? (
                    <option value="">Loading events...</option>
                  ) : (
                    <>
                      <option value="" disabled>
                        Select an event
                      </option>
                      {eventOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="dashboard-attendance-mode" className="text-xs font-bold uppercase tracking-wider text-ui-text-muted">
                  Attending As
                </label>
                <select
                  id="dashboard-attendance-mode"
                  value={attendanceMode}
                  onChange={(e) => setAttendanceMode(e.target.value)}
                  disabled={isSubmitting}
                  className="mt-1 w-full rounded-xl border border-ui-border bg-brand-light/20 px-4 py-3 text-sm font-semibold text-ui-text-main outline-none transition focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10"
                >
                  <option value="" disabled>
                    Select attendance
                  </option>
                  {ATTENDANCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 p-3 text-sm font-semibold text-danger-600">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div role="status" className="flex items-start gap-2 rounded-xl border border-status-active/30 bg-status-active/10 p-3 text-sm font-semibold text-status-active">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" rounded="2xl" onClick={closeModal} disabled={isSubmitting}>
                  {success ? "Close" : "Cancel"}
                </Button>
                {!success && (
                  <Button type="submit" rounded="2xl" disabled={isSubmitting || isLoadingEvents || eventOptions.length === 0}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Registering...
                      </span>
                    ) : (
                      "Register"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
