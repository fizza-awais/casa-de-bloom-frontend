"use client";
import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface EventDetail {
  id: string;
  name: string;
  event_type: string;
  event_date: string;
  capacity: number | null;
  created_at: string;
}

interface MemberDetail {
  cb_id?: string;
  first_name?: string;
  last_name?: string;
}

interface Registration {
  id: string;
  invitation_number: string;
  how_heard: string;
  why_attend: string;
  attending_as: string;
  emergency_contact: string;
  food_allergies: string;
  bringing_to_grill: string;
  willing_to_share_social: boolean;
  status: string;
  created_at: string;
  event_detail?: EventDetail;
  member_detail?: MemberDetail;
}

interface EventTrackerProps {
  registrations?: Registration[];
  volunteerDetails?: Registration[];
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
  recordType,
}: {
  reg: Registration;
  index: number;
  recordType: "registration" | "volunteer";
}) {
  const statusCfg = STATUS_CONFIG[reg.status] ?? STATUS_CONFIG.registered;
  const eventDate = reg.event_detail?.event_date;
  const eventName = reg.event_detail?.name ?? "Event";

  const memberFirstName = reg.member_detail?.first_name ?? "";
  const memberLastName = reg.member_detail?.last_name ?? "";
  const memberName = `${memberFirstName} ${memberLastName}`.trim() || "Guest";
  const cbId = reg.member_detail?.cb_id ?? "";

  const confirmationHref = `/register/confirmation?${new URLSearchParams({
    invitationNumber: reg.invitation_number,
    cbId,
    name: memberName,
    recordType,
    recordId: reg.id,
  }).toString()}`;

  return (
    <Link
      href={confirmationHref}
      className="group flex items-center gap-4 rounded-2xl border border-ui-border bg-white/70 backdrop-blur-sm shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:border-brand-primary/30 hover:bg-white/90"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Calendar icon */}
      <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
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
            {reg.invitation_number}
          </span>
        </div>
      </div>

      {/* Navigate arrow */}
      <ChevronRight
        size={18}
        className="shrink-0 text-ui-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all duration-200"
      />
    </Link>
  );
}

export default function EventTracker({ registrations, volunteerDetails }: EventTrackerProps) {
  const allEvents: Array<Registration & { _recordType: "registration" | "volunteer" }> = [
    ...(registrations ?? []).map((r) => ({ ...r, _recordType: "registration" as const })),
    ...(volunteerDetails ?? []).map((v) => ({ ...v, _recordType: "volunteer" as const })),
  ];

  const sorted = allEvents.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-ui-border bg-white/70 p-5 shadow-sm backdrop-blur-md md:p-6">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-ui-text-main flex items-center gap-2">
            <CalendarDays className="text-brand-accent" size={20} />
            My Events
          </h3>
          <p className="text-xs text-ui-text-muted mt-1">
            {sorted.length > 0
              ? `You have ${sorted.length} event registration${sorted.length !== 1 ? "s" : ""}`
              : "No event registrations yet"}
          </p>
        </div>
        {sorted.length > 0 && (
          <span className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1 rounded-full">
            {sorted.length} Total
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-dashed border-ui-border bg-white/30">
          <CalendarDays size={32} className="text-ui-text-muted/40 mx-auto mb-3" />
          <p className="text-sm font-semibold text-ui-text-muted">
            No events registered yet
          </p>
          <p className="text-xs text-ui-text-muted/70 mt-1">
            Use the &ldquo;Register for New Event&rdquo; button above to get started.
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
          {sorted.map((reg, i) => (
            <RegistrationCard key={reg.id} reg={reg} index={i} recordType={reg._recordType} />
          ))}
        </div>
      )}
    </div>
  );
}
