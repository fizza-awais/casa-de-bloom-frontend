"use client";

import { Suspense, useCallback, useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  Calendar,
  Ticket,
  Mail,
  Home,
  AlertCircle,
  Download,
  User,
  Phone,
  PartyPopper,
} from "lucide-react";
import Button from "@/components/ui/Button";
import {
  fetchRegistrationRecordDetail,
  RegistrationDetail,
  VolunteerDetail,
} from "@/lib/services/register";
import { verifyToken } from "@/lib/services/auth";
import { formatEventDate } from "@/lib/date";
import { downloadInvitationPdf } from "@/lib/downloadInvitationPdf";

interface ConfettiPiece {
  id: number;
  left: number;
  drift: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
  size: number;
}

const CONFETTI_COLORS = [
  "#FF3F82",
  "#99CC00",
  "#33C9DC",
  "#FFD23F",
  "#B32B5C",
  "#1F1B24",
];

function buildConfettiBurst(): ConfettiPiece[] {
  return Array.from({ length: 38 }, (_, index) => ({
    id: Date.now() + index,
    left: 7 + Math.random() * 86,
    drift: -95 + Math.random() * 190,
    delay: Math.random() * 0.25,
    duration: 1.7 + Math.random() * 1.3,
    rotate: -260 + Math.random() * 520,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    size: 7 + Math.random() * 7,
  }));
}

export function ConfirmationContent() {
  const params = useSearchParams();
  const router = useRouter();

  const invitationNumber = params.get("invitationNumber") ?? "—";
  const cbId = params.get("cbId") ?? "—";
  const name = params.get("name") ?? "Guest";
  const participantType = params.get("participantType") ?? "";
  const recordType = (params.get("recordType") ??
    (participantType === "volunteer" ? "volunteer" : "registration")) as
    | "registration"
    | "volunteer";
  const recordId =
    params.get("recordId") ??
    params.get("registrationId") ??
    params.get("volunteerId") ??
    "";

  // ── Record data ───────────────────────────────────────────────────────────
  const [record, setRecord] = useState<RegistrationDetail | VolunteerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(recordId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // ── Refresh guard ─────────────────────────────────────────────────────────
  const [redirecting, setRedirecting] = useState(false);

  const fireConfetti = useCallback(() => {
    const burst = buildConfettiBurst();
    setConfetti((current) => [...current.slice(-24), ...burst]);
    window.setTimeout(() => {
      setConfetti((current) =>
        current.filter(
          (piece) => !burst.some((newPiece) => newPiece.id === piece.id)
        )
      );
    }, 3400);
  }, []);

  useEffect(() => {
    if (recordId) return;

    setRedirecting(true);
    let active = true;

    const guard = async () => {
      try {
        const result = await verifyToken();
        if (!active) return;
        router.replace(result.valid ? "/dashboard#events" : "/login");
      } catch {
        if (active) router.replace("/login");
      }
    };

    guard();
    return () => { active = false; };
  }, [recordId, router]);

  useEffect(() => {
    if (!recordId || redirecting) return;

    const timer = window.setTimeout(fireConfetti, 350);
    return () => window.clearTimeout(timer);
  }, [fireConfetti, recordId, redirecting]);
  // ─────────────────────────────────────────────────────────────────────────

  // Fetch the registration/volunteer record details when a recordId is present
  useEffect(() => {
    if (!recordId) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await fetchRegistrationRecordDetail(recordType, recordId);
        if (active) setRecord(data);
      } catch {
        if (active) setLoadError("We could not load the saved registration details.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [recordId, recordType]);

  // Handle invitation download logic
  const handleDownloadInvitation = () => {
    downloadInvitationPdf({
      name: displayName,
      invitationNumber,
      cbId: displayCbId,
      eventName: eventLabel,
      eventDate: formattedDate,
      email: displayEmail,
      phone: displayPhone,
      role: isVolunteer ? "volunteer" : "guest",
      availability: volunteerRecord?.availability,
      contribution: volunteerRecord?.skills_offered,
    });
  };

  // Show a spinner while the guard is running
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const event = record?.event_detail ?? null;
  const formattedDate = formatEventDate(event?.event_date ?? "");
  const eventLabel = event?.name ?? "Event details";
  
  const displayName = record?.member_detail
    ? `${record.member_detail.first_name} ${record.member_detail.last_name}`.trim()
    : name;
  const displayCbId = record?.member_detail?.cb_id ?? cbId;
  const displayEmail = record?.member_detail?.email ?? params.get("email") ?? "—";
  const displayPhone = record?.member_detail?.phone ?? params.get("phone") ?? "—";

  const isVolunteer = recordType === "volunteer";
  const volunteerRecord =
    isVolunteer && record && "skills_offered" in record ? record : null;
  const pageTitle = isVolunteer
    ? "You're Confirmed as a Casa de Bloom Volunteer"
    : "Your Casa de Bloom Invitation";
  const pageSubtitle = isVolunteer
    ? "Thank you for helping create a day filled with connection, generosity, and community."
    : "We're holding your place in a day designed for connection, generosity, and community.";
  const numberLabel = isVolunteer
    ? "Your Volunteer Confirmation Number"
    : "Your Invitation Number";
  const checkInText = isVolunteer
    ? "Please show this at volunteer check-in."
    : "Please bring this invitation with you.";
  const emailText = isVolunteer
    ? "with your volunteer details has been sent. Check your inbox (and spam folder)."
    : "with your invitation details has been sent. Check your inbox (and spam folder).";
  const dashboardCta = isVolunteer
    ? "View Volunteer Details"
    : "View Before You Arrive Details";
  const downloadLabel = isVolunteer
    ? "Download Confirmation"
    : "Download Invitation";

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-x-hidden px-4 py-12 md:py-16">
      <div
        className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
        aria-hidden="true"
      >
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="absolute top-0 rounded-sm opacity-90"
            style={
              {
                left: `${piece.left}%`,
                width: `${piece.size}px`,
                height: `${piece.size * 1.45}px`,
                backgroundColor: piece.color,
                animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
                "--confetti-drift": `${piece.drift}px`,
                "--confetti-rotate": `${piece.rotate}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/assets/images/bg_image.png"
          alt="Casa de Bloom Event Vibe backdrop"
          fill
          priority
          className="object-cover object-center pointer-events-none brightness-[0.8] scale-105"
        />
        <div className="absolute inset-0 bg-transparent">
          <div className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full bg-brand-light/40 blur-[130px]" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-brand-accent/10 blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-lg md:max-w-4xl bg-white/85 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_32px_64px_rgba(31,27,36,0.2)] border border-white/60">
        <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-10">
          {/* Left — confirmation + invitation number */}
          <div className="flex-1 space-y-6 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-brand-secondary/15 flex items-center justify-center shadow-inner">
                <CheckCircle size={36} className="text-brand-secondary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-ui-text-main tracking-tight">
                  {pageTitle}
                </h1>
                <p className="text-sm text-ui-text-muted mt-1">
                  {isVolunteer ? (
                    pageSubtitle
                  ) : (
                    <>
                      This is your personal invitation,{" "}
                      <span className="font-semibold text-brand-dark">
                        {displayName}
                      </span>
                      . {pageSubtitle}
                    </>
                  )}
                </p>
              </div>
            </div>

            <hr className="border-ui-border md:hidden" />

            <div className="rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border-2 border-brand-primary/30 p-5 flex flex-col items-center gap-2 text-center shadow-inner">
              <div className="flex items-center gap-2 text-brand-primary">
                <Ticket size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {numberLabel}
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-widest text-brand-dark font-mono">
                {invitationNumber}
              </p>
              <p className="text-[11px] text-ui-text-muted font-medium">
                Member ID:{" "}
                <span className="font-bold text-ui-text-main">{displayCbId}</span>
              </p>
              <div className="mt-2 bg-brand-sunshine rounded-xl px-4 py-2">
                <p className="text-[12px] font-bold text-ui-text-main">
                  {checkInText}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-[1px] bg-ui-border shrink-0 self-stretch" />

          {/* Right — event details + actions */}
          <div className="flex-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-xl border border-ui-border bg-white/70 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Event Details
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
                    <p className="text-sm text-ui-text-muted">Loading event details...</p>
                  </div>
                ) : loadError ? (
                  <div className="flex items-start gap-3 rounded-xl border border-danger-500/30 bg-danger-500/10 p-4 text-danger-600">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-danger-500" />
                    <p className="text-sm">{loadError}</p>
                  </div>
                ) : event ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-ui-text-main">{eventLabel}</p>
                      <p className="text-sm text-ui-text-muted mt-0.5">
                        <span className="font-semibold text-ui-text-main">Date:</span> {formattedDate}
                      </p>
                    </div>
                    
                    <hr className="border-ui-border/60" />
                    
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2 text-sm text-ui-text-muted">
                        <User size={14} className="text-ui-text-muted shrink-0" />
                        <p>
                          <span className="font-semibold text-ui-text-main">Name:</span> {displayName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ui-text-muted">
                        <Mail size={14} className="text-ui-text-muted shrink-0" />
                        <p>
                          <span className="font-semibold text-ui-text-main">Email:</span> {displayEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-ui-text-muted">
                        <Phone size={14} className="text-ui-text-muted shrink-0" />
                        <p>
                          <span className="font-semibold text-ui-text-main">Phone:</span> {displayPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-ui-text-muted">No event details available.</p>
                )}
              </div>

              <div className="flex items-start gap-3 bg-brand-light/40 rounded-xl p-4">
                <Mail size={16} className="text-brand-primary mt-0.5 shrink-0" />
                <p className="text-xs text-ui-text-main leading-relaxed">
                  A confirmation email from{" "}
                  <a
                    href="mailto:casadebloomsd@gmail.com"
                    className="font-semibold text-brand-primary underline underline-offset-2"
                  >
                    casadebloomsd@gmail.com
                  </a>{" "}
                  {emailText}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                variant="primary"
                rounded="2xl"
                fullWidth
                size="lg"
                icon={<Home size={16} strokeWidth={2.5} />}
                onClick={() => router.push("/dashboard#overview")}
              >
                {dashboardCta}
              </Button>
              <Button
                variant="outline"
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
                icon={<PartyPopper size={16} strokeWidth={2.5} />}
                onClick={fireConfetti}
              >
                Celebrate
              </Button>
              <p className="text-center text-sm font-semibold text-brand-dark">
                Come ready to make someone else&apos;s day a little brighter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
