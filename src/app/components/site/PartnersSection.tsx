import { ExternalLink, Building2, ShieldCheck, Handshake } from "lucide-react";
import { useStore, getImageUrl } from "../../lib/store";
import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, staggerItem, motion } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";

import { Skeleton } from "../ui/skeleton";

export function PartnersSection({ title = "Đối tác & Đại lý chiến lược", showHeading = true }: { title?: string; showHeading?: boolean }) {
  const { partners, isLoading } = useStore();

  const activePartners = partners.filter((p) => p.isActive);

  const list = activePartners;
  if (!isLoading && list.length === 0) return null;

  return (
    <section id="partners-section" className="relative bg-white py-20 md:py-28 overflow-hidden border-t border-border">
      <div className="mx-auto max-w-[1240px] px-6">
        {showHeading && (
          <SectionHeading
            eyebrow="Đồng hành cùng phát triển"
            title={title}
            desc="Hợp tác chiến lược cùng các đối tác và đại lý phân phối hàng đầu Việt Nam để kiến tạo những công trình bền vững."
            align="center"
          />
        )}

        {/* Feature stats band */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-2xl border border-border/80 bg-secondary/30 p-6 md:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground font-display">50+</div>
                <div className="text-[13px] text-muted-foreground">Đối tác & Đại lý uy tín</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground font-display">100%</div>
                <div className="text-[13px] text-muted-foreground">Cam kết tiến độ cung ứng</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground font-display">Chuẩn QCVN</div>
                <div className="text-[13px] text-muted-foreground">16:2023/BXD Hợp quy</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Partners Grid */}
        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 animate-pulse">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 h-28">
                <Skeleton className="h-10 w-24 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <Stagger className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {list.map((p) => {
            const logoUrl = getImageUrl(p.logoPath);
            return (
              <motion.div
                key={p.id}
                variants={staggerItem}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
              >
                {logoUrl ? (
                  <div className="relative h-14 w-full flex items-center justify-center">
                    <ImageWithFallback
                      src={logoUrl}
                      alt={p.name}
                      className="max-h-12 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-full items-center justify-center text-center font-bold text-foreground text-sm">
                    {p.name}
                  </div>
                )}

                <div className="mt-3 text-center">
                  <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors block line-clamp-1">
                    {p.name}
                  </span>
                </div>

                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                    title={`Truy cập ${p.website}`}
                  >
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </Stagger>
        )}
      </div>
    </section>
  );
}
