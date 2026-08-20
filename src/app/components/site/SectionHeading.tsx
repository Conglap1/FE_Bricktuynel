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
            dark ? "text-amber-400" : "text-primary"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className={`h-px w-6 ${dark ? "bg-amber-400" : "bg-primary"}`} />
          {eyebrow}
          {align === "center" && <span className={`h-px w-6 ${dark ? "bg-amber-400" : "bg-primary"}`} />}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-4 ${dark ? "text-white" : "text-foreground"}`}
          style={{ fontSize: "clamp(1.35rem, 3.6vw, 2.8rem)", lineHeight: 1.1, fontWeight: 800 }}
        >
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-[17px] leading-relaxed ${dark ? "text-white/90" : "text-slate-700"}`}>
            {desc}
          </p>
        </Reveal>
      )}
    </div>
  );
}
