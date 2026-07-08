"use client";

import { useRef, useState } from "react";
import { UserCheck, Share2, Loader2, User, Phone, MapPin, Briefcase, Building, ShieldAlert, FileText } from "lucide-react";
import { useDashboardProfile } from "@/lib/context/DashboardContext";
import FormComponent, { FormField, FormComponentRef } from "@/components/forms/FormComponent";
import { patchMemberProfile } from "@/lib/services/auth";

export default function ProfilePage() {
  const profile = useDashboardProfile();
  const latestReg = profile?.registrations?.[0] || {};

  const profileFormRef = useRef<FormComponentRef>(null);
  const socialsFormRef = useRef<FormComponentRef>(null);
  const [globalSaving, setGlobalSaving] = useState(false);

  // --- 1. PROFILE CONFIG ---
  const profileInitialData = {
    email: profile?.email || "",
    age_range: profile?.age_range || "",
    gender: profile?.gender || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    city: profile?.city || "",
    profession: profile?.profession || "",
    business_name: profile?.business_name || "",
    emergency_contact: latestReg.emergency_contact || "",
    dietary_restrictions: latestReg.food_allergies || "",
  };

  const profileFields: FormField[] = [
    { 
      name: "email", 
      label: "Account Email", 
      type: "email", 
      isEditable: false, 
      colSpan: 2 
    },
    { 
      name: "first_name", 
      label: "First Name", 
      type: "text", 
      required: true, 
      placeholder: "First Name",
      icon: <User size={16} />,
      requiredMessage: "First name is required."
    },
    { 
      name: "last_name", 
      label: "Last Name", 
      type: "text", 
      required: true, 
      placeholder: "Last Name",
      icon: <User size={16} />,
      requiredMessage: "Last name is required."
    },
    { 
      name: "age_range", 
      label: "Age Range", 
      type: "select", 
      placeholder: "-- Select Age Range --",
      options: [
        { label: "21-29", value: "21-29" },
        { label: "31-39", value: "31-39" },
        { label: "41-49", value: "41-49" },
        { label: "51-59", value: "51-59" }
      ]
    },
    { 
      name: "gender", 
      label: "Gender", 
      type: "select", 
      placeholder: "-- Select Gender --",
      options: [
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
        { label: "Non-Binary", value: "Non-Binary" },
        { label: "Prefer not to say", value: "Prefer not to say" }
      ]
    },
    { 
      name: "phone", 
      label: "Phone Number", 
      type: "tel", 
      placeholder: "e.g. +1 555-0199",
      icon: <Phone size={16} />
    },
    { 
      name: "city", 
      label: "Current City", 
      type: "text", 
      placeholder: "e.g. San Diego, CA",
      icon: <MapPin size={16} />
    },
    { 
      name: "profession", 
      label: "Profession", 
      type: "text", 
      placeholder: "e.g. Designer",
      icon: <Briefcase size={16} />
    },
    { 
      name: "business_name", 
      label: "Business Name", 
      type: "text", 
      placeholder: "e.g. Design Studio",
      icon: <Building size={16} />
    },
    { 
      name: "emergency_contact", 
      label: "Emergency Contact", 
      type: "text", 
      placeholder: "Name & Phone", 
      colSpan: 2,
      icon: <ShieldAlert size={16} />
    },
    { 
      name: "dietary_restrictions", 
      label: "Dietary Restrictions", 
      type: "textarea", 
      placeholder: "Allergies / Diets", 
      colSpan: 2,
      icon: <FileText size={16} />
    },
  ];

  // --- 2. SOCIALS CONFIG ---
  const socialsInitialData = {
    instagram: profile?.instagram || "",
    linkedin: profile?.linkedin || "",
    facebook: profile?.facebook || "",
    website: profile?.website || "",
  };

  const socialsFields: FormField[] = [
    { 
      name: "instagram", 
      label: "Instagram", 
      type: "text", 
      placeholder: "@handle", 
      colSpan: 1,
      icon: <img src="/instagram-logo.svg" alt="Instagram" className="w-4 h-4 object-contain opacity-70" />
    },
    { 
      name: "linkedin", 
      label: "LinkedIn", 
      type: "url", 
      placeholder: "LinkedIn URL", 
      colSpan: 1,
      icon: <img src="/linkedin.svg" alt="LinkedIn" className="w-4 h-4 object-contain opacity-70" />,
      invalidMessage: "Please provide a valid URL for your LinkedIn profile."
    },
    { 
      name: "facebook", 
      label: "Facebook", 
      type: "text", 
      placeholder: "Facebook Profile", 
      colSpan: 1,
      icon: <img src="/facebook.svg" alt="Facebook" className="w-4 h-4 object-contain opacity-70" />
    },
    { 
      name: "website", 
      label: "Website", 
      type: "url", 
      placeholder: "https://...", 
      colSpan: 1,
      icon: <img src="/website.svg" alt="Website" className="w-4 h-4 object-contain opacity-70" />,
      invalidMessage: "Please provide a valid URL."
    },
  ];

  const handleGlobalSave = async () => {
    if (!profileFormRef.current || !socialsFormRef.current) return;

    const isProfileValid = profileFormRef.current.validate();
    const isSocialsValid = socialsFormRef.current.validate();

    if (!isProfileValid || !isSocialsValid) return; 

    setGlobalSaving(true);
    profileFormRef.current.setExternalApiError(null);
    socialsFormRef.current.setExternalApiError(null);
    profileFormRef.current.setExternalSuccess(false);
    socialsFormRef.current.setExternalSuccess(false);

    try {
      const profileData = profileFormRef.current.getData();
      const socialsData = socialsFormRef.current.getData();

      await patchMemberProfile({
        ...profileData,
        ...socialsData,
      });

      profileFormRef.current.setExternalSuccess(true);
      socialsFormRef.current.setExternalSuccess(true);
    } catch (err: any) {
      const fallbackMsg = err?.message ?? "Failed to save profile structural updates.";
      profileFormRef.current.setExternalApiError(fallbackMsg);
      socialsFormRef.current.setExternalApiError(fallbackMsg);
    } finally {
      setGlobalSaving(false);
    }
  };

  return (
    <div className="space-y-8 mx-auto">
      <div className="flex flex-col gap-8">
        {/* Personal Details Row Container */}
        <div className="w-full bg-white/70 backdrop-blur-md border border-ui-border rounded-3xl p-6 md:p-8 shadow-sm">
          <FormComponent
            ref={profileFormRef}
            title={
              <>
                <UserCheck className="text-brand-primary" size={20} />
                Personal Details
              </>
            }
            subtitle="Manage your primary informational attributes and settings."
            fields={profileFields}
            initialData={profileInitialData}
            submitLabel={null} 
            successMessage="Personal details updated successfully!"
            onSubmit={() => {}}
          />
        </div>

        {/* Social Links Row Container */}
        <div className="w-full bg-white/70 backdrop-blur-md border border-ui-border rounded-3xl p-6 md:p-8 shadow-sm">
          <FormComponent
            ref={socialsFormRef}
            title={
              <>
                <Share2 className="text-brand-primary" size={20} />
                Social Links
              </>
            }
            subtitle="Connect your online handles and websites."
            fields={socialsFields}
            initialData={socialsInitialData}
            submitLabel={null}
            successMessage="Social profiles updated successfully!"
            onSubmit={() => {}}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          disabled={globalSaving}
          onClick={handleGlobalSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-primary text-white font-semibold shadow-lg hover:bg-brand-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {globalSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving Profile Updates...
            </>
          ) : (
            "Save Profile Details"
          )}
        </button>
      </div>
    </div>
  );
}