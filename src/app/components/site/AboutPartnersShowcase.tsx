import { useStore, getImageUrl } from "../../lib/store";
import { SectionHeading } from "./SectionHeading";
import { Stagger, staggerItem, motion } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function AboutPartnersShowcase() {
  const { partners } = useStore();

  const activePartners = partners.filter((p) => p.isActive);

  const list = activePartners;
  if (list.length === 0) return null;

  return (
    <section id="about-partners" className="relative bg-secondary/40 py-20 md:py-28 border-t border-border">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading
          eyebrow="Đối tác chiến lược"
          title={<>Những tập đoàn & nhà thầu<br />tin dùng gạch Thuận Lợi</>}
          desc="Đồng hành cùng những đơn vị xây dựng uy tín hàng đầu Việt Nam để tạo nên các công trình bền vững."
          align="center"
        />

        {/* Horizontal Layout: Logo on LEFT, Partner Name on RIGHT */}
        <Stagger className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p) => {
            const logoUrl = getImageUrl(p.logoPath) || (p as any).fallbackImage;

            const CardContent = (
              <motion.div
                variants={staggerItem}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-4 md:p-5 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md cursor-pointer h-full"
              >
                {/* Logo Container on LEFT */}
                <div className="flex h-16 w-24 md:w-28 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-secondary/30 p-2.5 transition-colors group-hover:bg-white group-hover:border-primary/30">
                  <ImageWithFallback
                    src={logoUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=300&h=180&fit=crop&q=80"}
                    alt={p.name}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Partner Name on RIGHT */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-foreground text-[15px] md:text-[16px] leading-snug group-hover:text-primary transition-colors line-clamp-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.name}
                  </h3>
                </div>
              </motion.div>
            );

            return p.website ? (
              <a
                key={p.id}
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-decoration-none"
                title={`Ghé thăm website ${p.name}`}
              >
                {CardContent}
              </a>
            ) : (
              <div key={p.id}>{CardContent}</div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
