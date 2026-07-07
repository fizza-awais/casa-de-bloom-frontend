export type BadgeVariant = "success" | "info" | "warning" | "danger" | "neutral";

export interface StatusBadgeProps {
  /** The text string (e.g., "Paid", "On Leave") or boolean (true/false) status to display */
  status: string | boolean | null | undefined;
  /** The explicit UI semantic color path */
  variant?: BadgeVariant;
  /** Custom Tailwind classes to override or append styles on the fly */
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  info:    "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  warning: "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  danger:  "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  neutral: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

export default function StatusBadge({ 
  status, 
  variant = "neutral", 
  className = "" 
}: StatusBadgeProps) {
  
  if (status === undefined || status === null || status === "") return null;

  // Process booleans uniformly into standard text representations
  const displayStatus = typeof status === "boolean" 
    ? (status ? "Active" : "Inactive") 
    : status;

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border inline-flex items-center justify-center transition-colors ${variantStyles[variant]} ${className}`}
    >
      {displayStatus}
    </span>
  );
}
