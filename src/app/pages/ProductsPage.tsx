import { PageHeader } from "../components/site/PageHeader";
import { CTABand } from "../components/site/CTABand";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { useStore } from "../lib/store";
import { Link } from "react-router";
import { ArrowRight, Phone } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Stagger, staggerItem, motion } from "../lib/motion";
import type { Product } from "../lib/data";

function buildSpecs(p: Product) {
  return [
    { label: "Kích thước", value: `${p.length}×${p.width}×${p.height} mm` },
    p.holeCount != null
      ? { label: "Số lỗ", value: `${p.holeCount} lỗ` }
      : p.weight != null
      ? { label: "Trọng lượng", value: `${p.weight} kg/viên` }
      : null,
    p.compressionStrength != null
      ? { label: "Cường độ nén", value: `≥ ${p.compressionStrength} kG/cm²` }
      : null,
    p.waterAbsorption != null
      ? { label: "Độ hút nước", value: `≤ ${p.waterAbsorption}%` }
      : p.weight != null && p.holeCount != null
      ? { label: "Trọng lượng", value: `${p.weight} kg/viên` }
      : null,
  ].filter((s): s is { label: string; value: string } => s !== null);
}

export function ProductsPage() {
  const { products } = useStore();
  const activeProducts = products.filter((p) => p.isActive);

  return (
    <>
      <PageHeader
        crumb="Sản phẩm"
        eyebrow="Tất cả sản phẩm"
        title={`${activeProducts.length > 0 ? `${activeProducts.length} dòng` : "Các dòng"} gạch đất sét nung Thuận Lợi`}
        desc="Toàn bộ sản phẩm được sản xuất tại lò Tuynel 1.050°C, đạt chuẩn QCVN 16:2023/BXD, kèm thông số kỹ thuật minh bạch."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
          <Stagger className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" gap={0.08}>
            {activeProducts.map((p) => {
              const specs = buildSpecs(p);
              return (
                <motion.div
                  key={p.id}
                  variants={staggerItem}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_18px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)]"
                >
                  <Link to={`/san-pham/${p.slug}`} className="relative block aspect-[5/4] overflow-hidden bg-secondary">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                    />
                    {p.isFeatured && (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md">
                        Nổi bật
                      </span>
                    )}
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

          {activeProducts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              Đang cập nhật danh sách sản phẩm.
            </div>
          )}
        </div>
      </section>

      <LogoMarquee />
      <CTABand />
    </>
  );
}
