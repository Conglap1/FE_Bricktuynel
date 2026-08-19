import { useStore, getImageUrl } from "../../lib/store";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function LogoMarquee() {
  const { partners } = useStore();

  const activePartners = partners.filter((p) => p.isActive);

  const list = activePartners;
  if (list.length === 0) return null;
  const row = [...list, ...list, ...list];

  return (
    <section className="border-y border-border bg-white py-10">
      <div className="mx-auto max-w-[1240px] px-6">
        <p
          className="mb-6 text-center text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Đối tác & Nhà thầu tin tưởng
        </p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center gap-12 px-7" style={{ willChange: "transform" }}>
          {row.map((p, i) => {
            const logoUrl = getImageUrl(p.logoPath);
            const content = logoUrl ? (
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/30 px-5 py-2.5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
                <ImageWithFallback
                  src={logoUrl}
                  alt={p.name}
                  className="h-9 w-auto max-w-[140px] object-contain grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
            ) : (
              <span
                className="shrink-0 text-foreground/40 transition-colors group-hover:text-primary"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}
              >
                {p.name}
              </span>
            );

            return p.website ? (
              <a
                key={`${p.id}-${i}`}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group shrink-0 cursor-pointer text-decoration-none"
                title={`Ghé thăm website ${p.name}`}
              >
                {content}
              </a>
            ) : (
              <div key={`${p.id}-${i}`} className="group shrink-0">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

