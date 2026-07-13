"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  Download,
  Mail,
  Phone,
  Ticket,
  Clock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { downloadInvitationPdf } from "@/lib/downloadInvitationPdf";
import { formatEventTimeRange } from "@/lib/date";
import EventDirectionsLink from "@/components/ui/EventDirectionsLink";
import { FloralFrame } from "@/components/branding/CasaBranding";

interface EventDetail {
  id?: string;
  name?: string;
  event_type?: string;
  event_date?: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string;
  google_maps_url?: string;
  capacity?: number | null;
  created_at?: string;
}

interface Registration {
  id?: string;
  invitation_number?: string;
  how_heard?: string;
  why_attend?: string;
  attending_as?: string;
  emergency_contact?: string;
  food_allergies?: string;
  bringing_to_grill?: string;
  give_take_contribution?: string;
  service_offering?: string;
  willing_to_share_social?: boolean;
  status?: string;
  skills_offered?: string;
  availability?: string;
  can_capture_media?: boolean;
  created_at?: string;
  event_detail?: EventDetail;
  recordType?: "guest" | "volunteer";
}

interface EventTrackerProps {
  registrations?: Registration[];
  volunteerDetails?: Registration[];
  participantType?: "guest" | "volunteer";
  member: {
    cbId: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  action?: React.ReactNode;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  registered: {
    label: "Registered",
    color: "text-status-active",
    bg: "bg-status-active/10",
    icon: <CheckCircle2 size={14} />,
  },
  pending: {
    label: "Pending",
    color: "text-status-late",
    bg: "bg-status-late/10",
    icon: <Clock size={14} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-status-absent",
    bg: "bg-status-absent/10",
    icon: <XCircle size={14} />,
  },
  waitlisted: {
    label: "Waitlisted",
    color: "text-status-probation",
    bg: "bg-status-probation/10",
    icon: <AlertCircle size={14} />,
  },
};

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateStr}T00:00:00`));
}

function RegistrationCard({
  reg,
  index,
  onOpen,
}: {
  reg: Registration;
  index: number;
  onOpen: (registration: Registration) => void;
}) {
  const statusCfg = STATUS_CONFIG[reg.status ?? "registered"] ?? STATUS_CONFIG.registered;
  const eventDate = reg.event_detail?.event_date;
  const eventName = reg.event_detail?.name ?? "Event";
  const isVolunteer = reg.recordType === "volunteer";

  return (
    <button
      type="button"
      onClick={() => onOpen(reg)}
      className="dashboard-shine group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-ui-border bg-white/70 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-primary/40 hover:bg-white/95 hover:shadow-md focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Calendar icon */}
      <div className="dashboard-float-icon w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
        <CalendarDays size={18} className="text-brand-primary" />
      </div>

      {/* Event info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-extrabold text-ui-text-main truncate">
          {eventName}
        </p>
        {eventDate && (
          <p className="text-xs text-ui-text-muted font-medium mt-0.5">
            {formatDate(eventDate)}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}
          >
            {statusCfg.icon}
            {statusCfg.label}
          </span>
          {/* Invitation number */}
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ui-text-muted bg-slate-50 px-2 py-0.5 rounded-full border border-ui-border">
            <Ticket size={10} />
            {reg.invitation_number ?? "Pending"}
          </span>
        </div>
      </div>

      <span className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-brand-primary px-3 py-2 text-xs font-extrabold text-white shadow-sm transition-all duration-200 group-hover:bg-brand-hover group-hover:shadow-md sm:inline-flex">
        {isVolunteer ? "View Confirmation" : "View Invite"}
        <ChevronRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary transition-all duration-200 group-hover:bg-brand-primary group-hover:text-white sm:hidden">
        <ChevronRight size={17} />
      </span>
    </button>
  );
}

export default function EventTracker({
  registrations,
  volunteerDetails,
  participantType = "guest",
  member,
  action,
}: EventTrackerProps) {
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const allEvents: Registration[] = [
    ...(registrations ?? []).map((record) => ({
      ...record,
      recordType: "guest" as const,
    })),
    ...(volunteerDetails ?? []).map((record) => ({
      ...record,
      recordType: "volunteer" as const,
    })),
  ];

  const sorted = [...allEvents].sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  );
  const volunteerFocused =
    participantType === "volunteer" &&
    (registrations?.length ?? 0) === 0;

  const memberName = `${member.firstName} ${member.lastName}`.trim() || "Guest";
  const selectedEvent = selectedRegistration?.event_detail;
  const selectedIsVolunteer = selectedRegistration?.recordType === "volunteer";
  const selectedEventName = selectedEvent?.name ?? "Casa de Bloom Event";
  const selectedEventDate = selectedEvent?.event_date
    ? formatDate(selectedEvent.event_date)
    : "Date will be shared soon";
  const trackerTitle = volunteerFocused ? "My Volunteer Events" : "My Events";
  const emptyLabel = volunteerFocused
    ? "No volunteer registrations yet"
    : "No event registrations yet";
  const countLabel = volunteerFocused
    ? `You have ${sorted.length} volunteer registration${
        sorted.length !== 1 ? "s" : ""
      }`
    : `You have ${sorted.length} event registration${
        sorted.length !== 1 ? "s" : ""
      }`;
  const modalTitle = selectedIsVolunteer
    ? "You're Confirmed as a Casa de Bloom Volunteer"
    : "Your Casa de Bloom Invitation";
  const modalSubtitle = selectedIsVolunteer
    ? "Thank you for helping create a day filled with connection, generosity, and community."
    : `This is your personal invitation, ${memberName}. We're holding your place in a day designed for connection, generosity, and community.`;
  const numberLabel = selectedIsVolunteer
    ? "Your Volunteer Confirmation Number"
    : "Your Invitation Number";
  const checkInText = selectedIsVolunteer
    ? "Please show this at volunteer check-in."
    : "Please bring this invitation with you.";
  const downloadLabel = selectedIsVolunteer
    ? "Download Confirmation"
    : "Download Invitation";

  const handleDownloadInvitation = () => {
    if (!selectedRegistration) return;

    downloadInvitationPdf({
      name: memberName,
      invitationNumber: selectedRegistration.invitation_number ?? "Pending",
      cbId: member.cbId,
      eventName: selectedEventName,
      eventDate: selectedEventDate,
      eventTime: formatEventTimeRange(selectedEvent?.start_time, selectedEvent?.end_time),
      eventLocation: selectedEvent?.location,
      email: member.email || "-",
      phone: member.phone || "-",
      role: selectedIsVolunteer ? "volunteer" : "guest",
      availability: selectedRegistration.availability,
      contribution: selectedRegistration.skills_offered,
    });
  };

  return (
    <>
      <div className="dashboard-interactive-card relative overflow-hidden rounded-3xl border border-ui-border bg-white/80 p-5 shadow-sm backdrop-blur-md md:p-6">
        <FloralFrame className="absolute -right-10 -top-16 z-0 hidden w-80 rotate-180 opacity-[0.38] md:block" />
        <div className="relative z-10 mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-ui-text-main flex items-center gap-2">
              <CalendarDays className="text-brand-accent" size={20} />
              {trackerTitle}
            </h3>
            <p className="text-xs text-ui-text-muted mt-1">
              {sorted.length > 0 ? countLabel : emptyLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {action}
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="relative z-10 text-center py-10 rounded-2xl border border-dashed border-ui-border bg-white/30">
            <CalendarDays
              size={32}
              className="text-ui-text-muted/40 mx-auto mb-3"
            />
            <p className="text-sm font-semibold text-ui-text-muted">
              {volunteerFocused ? "No volunteer events registered yet" : "No events registered yet"}
            </p>
            <p className="text-xs text-ui-text-muted/70 mt-1">
              Use the &ldquo;Register for New Event&rdquo; button to get started.
            </p>
          </div>
        ) : (
          <div className="relative z-10 max-h-[28rem] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
            {sorted.map((reg, i) => (
              <RegistrationCard
                key={reg.id}
                reg={reg}
                index={i}
                onOpen={setSelectedRegistration}
              />
            ))}
          </div>
        )}
      </div>

      {selectedRegistration &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-text-main/45 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-[2.5rem] border border-white/60 bg-white/90 p-6 shadow-[0_32px_64px_rgba(31,27,36,0.22)] backdrop-blur-xl sm:p-8 md:max-w-5xl md:p-10">
              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="absolute right-5 top-5 rounded-full p-2 text-ui-text-muted transition-colors hover:bg-brand-light/50 hover:text-ui-text-main"
                aria-label="Close invitation"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col items-stretch gap-8 md:flex-row md:gap-10">
                  <div className="flex flex-1 flex-col justify-center space-y-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary/15 shadow-inner">
                        <CheckCircle
                          size={36}
                          className="text-brand-secondary"
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-ui-text-main">
                          {modalTitle}
                        </h1>
                        <p className="mt-1 text-sm text-ui-text-muted">
                          {selectedIsVolunteer ? (
                            modalSubtitle
                          ) : (
                            <>
                              This is your personal invitation,{" "}
                              <span className="font-semibold text-brand-dark">
                                {memberName}
                              </span>
                              . We&apos;re holding your place in a day designed for
                              connection, generosity, and community.
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 p-5 text-center shadow-inner">
                      <div className="flex items-center gap-2 text-brand-primary">
                        <Ticket size={18} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          {numberLabel}
                        </span>
                      </div>
                      <p className="break-all font-mono text-3xl font-extrabold tracking-widest text-brand-dark sm:text-4xl">
                        {selectedRegistration.invitation_number ?? "Pending"}
                      </p>
                      <p className="text-[11px] font-medium text-ui-text-muted">
                        Member ID:{" "}
                        <span className="font-bold text-ui-text-main">
                          {member.cbId}
                        </span>
                      </p>
                      <div className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-secondary px-5 py-3 text-sm font-extrabold text-ui-text-main shadow-sm">
                        {checkInText}
                      </div>
                    </div>
                  </div>

                  <div className="hidden w-px shrink-0 self-stretch bg-ui-border md:block" />

                  <div className="flex flex-1 flex-col justify-between space-y-6">
                    <div className="space-y-3 rounded-xl border border-ui-border bg-white/70 p-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-brand-primary" />
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                          Event Details
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-ui-text-main">
                            {selectedEventName}
                          </p>
                          <p className="mt-0.5 text-sm text-ui-text-muted">
                            <span className="font-semibold text-ui-text-main">
                              Date:
                            </span>{" "}
                            {selectedEventDate}
                          </p>
                          <p className="mt-1 text-sm text-ui-text-muted">
                            <span className="font-semibold text-ui-text-main">
                              Location:
                            </span>{" "}
                            {selectedEvent?.location || "Details provided to registered guests"}
                          </p>
                          <EventDirectionsLink
                            href={selectedEvent?.google_maps_url}
                            className="mt-3 w-full"
                          />
                        </div>

                        <hr className="border-ui-border/60" />

                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2 text-sm text-ui-text-muted">
                            <User size={14} className="shrink-0 text-ui-text-muted" />
                            <p>
                              <span className="font-semibold text-ui-text-main">
                                Name:
                              </span>{" "}
                              {memberName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-ui-text-muted">
                            <Mail size={14} className="shrink-0 text-ui-text-muted" />
                            <p>
                              <span className="font-semibold text-ui-text-main">
                                Email:
                              </span>{" "}
                              {member.email || "-"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-ui-text-muted">
                            <Phone size={14} className="shrink-0 text-ui-text-muted" />
                            <p>
                              <span className="font-semibold text-ui-text-main">
                                Phone:
                              </span>{" "}
                              {member.phone || "-"}
                            </p>
                          </div>
                          {selectedIsVolunteer && (
                            <div className="mt-3 space-y-2 rounded-2xl border border-brand-primary/15 bg-brand-light/20 p-3">
                              <p className="text-xs font-extrabold uppercase tracking-wider text-brand-primary">
                                Volunteer Details
                              </p>
                              <p className="text-sm text-ui-text-muted">
                                <span className="font-semibold text-ui-text-main">
                                  Availability:
                                </span>{" "}
                                {selectedRegistration.availability || "Not provided yet"}
                              </p>
                              <p className="text-sm text-ui-text-muted">
                                <span className="font-semibold text-ui-text-main">
                                  Contribution:
                                </span>{" "}
                                {selectedRegistration.skills_offered || "Not provided yet"}
                              </p>
                              <p className="text-sm text-ui-text-muted">
                                <span className="font-semibold text-ui-text-main">
                                  Photo/video help:
                                </span>{" "}
                                {selectedRegistration.can_capture_media ? "Yes" : "No"}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        variant="primary"
                        rounded="2xl"
                        fullWidth
                        size="lg"
                        icon={<Download size={16} strokeWidth={2.5} />}
                        onClick={handleDownloadInvitation}
                      >
                        {downloadLabel}
                      </Button>
                      <Button
                        variant="outline"
                        rounded="2xl"
                        fullWidth
                        size="lg"
                        onClick={() => setSelectedRegistration(null)}
                      >
                        Close
                      </Button>
                      <p className="text-center text-sm font-semibold text-brand-dark">
                        Come ready to make someone else&apos;s day a little brighter.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-5 rounded-3xl border-2 border-dashed border-brand-secondary/35 bg-brand-secondary/5 p-5 sm:flex-row sm:p-6">
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand-secondary">
                      Optional Donations
                    </h2>
                    <p className="text-sm font-medium leading-6 text-ui-text-main">
                      Donations are welcome and completely optional. Your support helps
                      cover event setup, cleanup, and future Casa de Bloom experiences.
                    </p>
                  </div>
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm">
                    <Image
                      src="/assets/images/donations.webp"
                      alt="Casa de Bloom donation QR codes"
                      fill
                      sizes="128px"
                      className="object-contain p-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
