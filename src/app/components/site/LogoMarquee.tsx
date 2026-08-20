import { useStore, getImageUrl } from "../../lib/store";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function LogoMarquee() {
  const { partners } = useStore();

  const activePartners = partners.filter((p) => p.isActive);

  const baseList = activePartners;
  if (baseList.length === 0) return null;

  // Đảm bảo danh sách đủ số lượng item để kéo dài kín màn hình rộng
  let displayList = baseList;
  while (displayList.length < 10) {
    displayList = [...displayList, ...baseList];
  }

  const renderPartnerItem = (p: typeof baseList[0], keyPrefix: string, index: number) => {
    const logoUrl = getImageUrl(p.logoPath);
    const content = logoUrl ? (
      <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/30 px-5 py-2.5 transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-md">
        <ImageWithFallback
          src={logoUrl}
          alt={p.name}
          className="h-9 w-auto max-w-[140px] object-contain transition-all duration-300 group-hover:scale-105"
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
        key={`${keyPrefix}-${p.id}-${index}`}
        href={p.website}
        target="_blank"
        rel="noopener noreferrer"
        className="group shrink-0 cursor-pointer text-decoration-none"
        title={`Ghé thăm website ${p.name}`}
      >
        {content}
      </a>
    ) : (
      <div key={`${keyPrefix}-${p.id}-${index}`} className="group shrink-0">
        {content}
      </div>
    );
  };

  return (
    <section className="border-y border-border bg-white py-10">
      <div className="mx-auto max-w-[1240px] px-6">
        <p
          className="mb-6 text-center text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Đối tác & Đại lý tin tưởng
        </p>
      </div>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] select-none">
        <div
          className="flex shrink-0 items-center gap-10 pr-10 animate-[marquee_35s_linear_infinite]"
          style={{ willChange: "transform" }}
        >
          {displayList.map((p, i) => renderPartnerItem(p, "track1", i))}
        </div>
        <div
          className="flex shrink-0 items-center gap-10 pr-10 animate-[marquee_35s_linear_infinite]"
          aria-hidden="true"
          style={{ willChange: "transform" }}
        >
          {displayList.map((p, i) => renderPartnerItem(p, "track2", i))}
        </div>
      </div>
    </section>
  );
}


