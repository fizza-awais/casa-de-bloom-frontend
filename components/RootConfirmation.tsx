"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Download,
  Home,
  Mail,
  Phone,
  Ticket,
  User,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { fetchRegistrationRecordDetail, RegistrationDetail, VolunteerDetail } from "@/lib/services/register";
import { RegistrationFlowDetails } from "@/lib/registrationFlow";
import { formatEventDate } from "@/lib/date";
import { downloadInvitationPdf } from "@/lib/downloadInvitationPdf";

interface RootConfirmationProps {
  details: RegistrationFlowDetails;
}

export default function RootConfirmation({ details }: RootConfirmationProps) {
  const router = useRouter();
  const [record, setRecord] = useState<RegistrationDetail | VolunteerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(details.recordId));
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!details.recordId) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await fetchRegistrationRecordDetail(details.recordType, details.recordId);
        if (active) setRecord(data);
      } catch {
        if (active) setLoadError("We could not load the saved registration details.");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [details.recordId, details.recordType]);

  const event = record?.event_detail ?? null;
  const formattedDate = formatEventDate(event?.event_date ?? details.eventDate ?? "");
  const eventLabel = event?.name ?? "Casa de Bloom Day Club, Everyone Welcome";
  const displayName = record?.member_detail
    ? `${record.member_detail.first_name} ${record.member_detail.last_name}`.trim()
    : details.name;
  const displayCbId = record?.member_detail?.cb_id ?? details.cbId;
  const displayEmail = record?.member_detail?.email ?? details.email ?? "-";
  const displayPhone = record?.member_detail?.phone ?? details.phone ?? "-";

  const handleDownloadInvitation = () => {
    downloadInvitationPdf({
      name: displayName,
      invitationNumber: details.invitationNumber,
      cbId: displayCbId,
      eventName: eventLabel,
      eventDate: formattedDate,
      email: displayEmail,
      phone: displayPhone,
    });
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-x-hidden px-4 py-12 md:py-16">
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

      <div className="relative z-10 w-full max-w-lg md:max-w-5xl bg-white/85 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-[0_32px_64px_rgba(31,27,36,0.2)] border border-white/60">
        <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-10">
          <div className="flex-1 space-y-6 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-brand-secondary/15 flex items-center justify-center shadow-inner">
                <CheckCircle size={36} className="text-brand-secondary" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-ui-text-main tracking-tight">
                  Your Casa de Bloom Invitation
                </h1>
                <p className="text-sm text-ui-text-muted mt-1">
                  This is your personal invitation,{" "}
                  <span className="font-semibold text-brand-dark">{displayName}</span>.
                  We&apos;re holding your place in a day designed for connection,
                  generosity, and community.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border-2 border-brand-primary/30 p-5 flex flex-col items-center gap-3 text-center shadow-inner">
              <div className="flex items-center gap-2 text-brand-primary">
                <Ticket size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Your Invitation Number
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-widest text-brand-dark font-mono">
                {details.invitationNumber}
              </p>
              <p className="text-[11px] text-ui-text-muted font-medium">
                Member ID: <span className="font-bold text-ui-text-main">{displayCbId}</span>
              </p>
              <div className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-secondary px-5 py-3 text-sm font-extrabold text-ui-text-main shadow-sm">
                Please bring this invitation with you.
              </div>
            </div>
          </div>

          <div className="hidden md:block w-[1px] bg-ui-border shrink-0 self-stretch" />

          <div className="flex-1 space-y-6 flex flex-col justify-between">
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
              ) : (
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
              )}
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
                Download Invitation
              </Button>
              <Button
                variant="outline"
                rounded="2xl"
                fullWidth
                size="lg"
                icon={<Home size={16} strokeWidth={2.5} />}
                onClick={() => router.push("/dashboard#events")}
              >
                Go to My Events
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
