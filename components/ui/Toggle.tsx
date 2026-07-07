import React from "react";
import Text from "./Text";

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "mint" | "brand" | "yellow" | "red";
  leftLabel?: string;
  rightLabel?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  variant = "brand",
  leftLabel,
  rightLabel,
}) => {
  const colorMap = {
    brand: "bg-slate-900",
    mint: "bg-mint-600",
    yellow: "bg-amber-500",
    red: "bg-red-600",
  };

  const activeColor = colorMap[variant];

  const hoverBorder =
    variant === "mint"
      ? "hover:border-mint-200"
      : "hover:border-primary-200";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Text
          variant="small"
          weight="bold"
          color="main"
        >
          {label}
        </Text>
      )}

      <label
        className={`flex items-center gap-3 rounded-2xl transition-all cursor-pointer group ${hoverBorder}`}
      >
        {leftLabel && (
          <Text
            variant="small"
            weight={checked ? "normal" : "bold"}
            color={checked ? "muted" : "main"}
          >
            {leftLabel}
          </Text>
        )}

        <div className="relative flex items-center">
          <input
            type="checkbox"
            className="absolute z-10 h-6 w-10 cursor-pointer opacity-0"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />

          <div
            className={`relative h-6 w-10 rounded-full transition-colors ${
              checked ? activeColor : "bg-neutral-200"
            }`}
          >
            <div
              className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                checked ? "translate-x-4" : ""
              }`}
            />
          </div>
        </div>

        {rightLabel && (
          <Text
            variant="small"
            weight={checked ? "bold" : "normal"}
            color={checked ? "main" : "muted"}
          >
            {rightLabel}
          </Text>
        )}
      </label>
    </div>
  );
};

export default Toggle;