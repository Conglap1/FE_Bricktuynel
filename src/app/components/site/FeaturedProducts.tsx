import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router";
import { motion, Stagger, staggerItem } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SectionHeading } from "./SectionHeading";
import { useStore } from "../../lib/store";
import type { Product } from "../../lib/data";

function buildSpecs(p: Product) {
  return [
    { label: "Kích thước", value: `${p.length}×${p.width}×${p.height} mm` },
    p.brickGrade ? { label: "Mác gạch", value: p.brickGrade } : null,
    p.compressionStrength != null ? { label: "Nén (TB)", value: `${p.compressionStrength} MPa` } : null,
    p.flexuralStrength != null ? { label: "Uốn (TB)", value: `${p.flexuralStrength} MPa` } : null,
    p.bulkDensity != null ? { label: "Thể tích", value: `${p.bulkDensity} g/cm³` } : null,
    p.waterAbsorption != null ? { label: "Hút nước", value: `${p.waterAbsorption}%` } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);
}

export function FeaturedProducts() {
  const { products: PRODUCTS } = useStore();
  const featuredProducts = PRODUCTS.filter((p) => p.isActive && p.isFeatured);

  return (
    <section id="products" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <SectionHeading
          eyebrow="Dòng sản phẩm chủ lực"
          title={<>{featuredProducts.length > 0 ? `${featuredProducts.length} loại gạch` : "Gạch"} nung Tuynel nổi bật<br />cho mọi hạng mục công trình</>}
          desc="Các sản phẩm gạch nung Tuynel chất lượng cao sản xuất tại lò Tuynel 1.050°C, đạt chuẩn QCVN 16:2023/BXD, thông số kỹ thuật minh bạch."
          align="center"
        />

        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" gap={0.08}>
          {featuredProducts.map((p) => {
            const specs = buildSpecs(p);
            return (
              <motion.div
                key={p.id}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_18px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)]"
              >
                {/* Image — clickable to detail */}
                <Link to={`/san-pham/${p.slug}`} className="relative block aspect-[5/4] overflow-hidden bg-secondary">
                  <ImageWithFallback
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                  />
                </Link>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <Link to={`/san-pham/${p.slug}`}>
                    <h3 className="text-foreground hover:text-primary transition-colors line-clamp-1" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                      {p.name}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                    {p.shortDescription}
                  </p>

                  {specs.length > 0 && (
                    <dl className="mt-4 grid grid-cols-2 gap-1 overflow-hidden rounded-xl border border-amber-200/80 bg-amber-50/40 p-1">
                      {specs.map((s) => (
                        <div key={s.label} className="rounded-lg bg-white p-2 border border-amber-100 shadow-2xs">
                          <dt className="text-[9px] font-bold uppercase tracking-wider text-amber-900/80 truncate font-mono">
                            {s.label}
                          </dt>
                          <dd className="mt-0.5 text-[11px] font-extrabold text-primary truncate font-mono">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-4 flex-1" />

                  <Link
                    to={`/san-pham/${p.slug}`}
                    className="mb-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:gap-2 transition-all"
                  >
                    Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    to="/lien-he"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3.5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Liên hệ báo giá
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
