import type { ReactNode } from "react";
import { Reveal } from "../../lib/motion";

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "left",
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={align === "center" ? `mx-auto text-center ${className}` : `max-w-2xl ${className}`}>
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-[#C76B86]" : "text-primary"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className={`h-px w-6 ${dark ? "bg-[#C76B86]" : "bg-primary"}`} />
          {eyebrow}
          {align === "center" && <span className={`h-px w-6 ${dark ? "bg-[#C76B86]" : "bg-primary"}`} />}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-4 ${dark ? "text-white" : "text-foreground"}`}
          style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", lineHeight: 1.08, fontWeight: 800 }}
        >
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-[17px] leading-relaxed ${dark ? "text-white/70" : "text-muted-foreground"}`}>
            {desc}
          </p>
        </Reveal>
      )}
    </div>
  );
}
