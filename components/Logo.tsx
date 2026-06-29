import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  withIcon?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  variant = "light",
  withIcon = true,
  className,
  size = "md",
}: LogoProps) {
  const color = variant === "light" ? "#FFFFFF" : "#0C0C0E";
  const sizes = { sm: 20, md: 28, lg: 36 };
  const h = sizes[size];
  const textSize = { sm: "text-sm", md: "text-base", lg: "text-xl" };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {withIcon && (
        <svg
          width={h * 0.75}
          height={h * 0.75}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Four-point north-star / sparkle mark */}
          <path
            d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
            fill={color}
          />
        </svg>
      )}
      <span
        className={cn(
          "font-archivo font-extrabold uppercase tracking-widest leading-none",
          textSize[size]
        )}
        style={{ color, letterSpacing: "1.5px" }}
      >
        NORTHVAULT
      </span>
    </div>
  );
}

export function LogoMark({ variant = "light", size = 24 }: { variant?: "light" | "dark"; size?: number }) {
  const color = variant === "light" ? "#FFFFFF" : "#0C0C0E";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Northvault">
      <path
        d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
        fill={color}
      />
    </svg>
  );
}
