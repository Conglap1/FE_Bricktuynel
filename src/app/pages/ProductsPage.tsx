import { useState, useMemo } from "react";
import { PageHeader } from "../components/site/PageHeader";
import { CTABand } from "../components/site/CTABand";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { useStore } from "../lib/store";
import { IMAGES } from "../lib/data";
import { Link } from "react-router";
import { ArrowRight, Phone, Search } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";
import { CardSkeleton } from "../components/ui/LoadingState";
import type { Product } from "../lib/data";

function buildSpecs(p: Product) {
  return [
    { label: "Kích thước", value: `${p.length}×${p.width}×${p.height} mm` },
    p.brickGrade ? { label: "Mác gạch", value: p.brickGrade } : null,
    p.compressionStrength != null ? { label: "Cường độ nén (AVG)", value: `${p.compressionStrength} MPa` } : null,
    p.flexuralStrength != null ? { label: "Cường độ uốn (AVG)", value: `${p.flexuralStrength} MPa` } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);
}

export function ProductsPage() {
  const { products, isLoading } = useStore();
  const [search, setSearch] = useState("");
  const activeProducts = products.filter((p) => p.isActive);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.brickGrade && p.brickGrade.toLowerCase().includes(q))
      );
    });
  }, [activeProducts, search]);

  return (
    <>
      <PageHeader
        crumb="Sản phẩm"
        eyebrow="Tất cả sản phẩm"
        title={`${activeProducts.length > 0 ? `${activeProducts.length} dòng` : "Các dòng"} gạch đất sét nung Thuận Lợi`}
        desc="Toàn bộ sản phẩm được sản xuất tại lò Tuynel 1.050°C, đạt chuẩn QCVN 16:2023/BXD, kèm thông số kỹ thuật minh bạch."
        image={IMAGES.aboutBanner}
      />

      <section className="bg-slate-50/50 py-12 md:py-20">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">

          {/* Search Input Bar (Synchronized with NewsPage & ProjectsPage) */}
          <Reveal>
            <div className="mb-10 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên, mác gạch, kích thước..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 py-3 text-[14px] font-medium text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          {isLoading ? (
            <CardSkeleton count={10} />
          ) : (
            <>
              <Stagger className="flex flex-wrap justify-center gap-4" gap={0.08}>
                {filteredProducts.map((p) => {
                  const specs = buildSpecs(p);
                  return (
                    <motion.div
                      key={p.id}
                      variants={staggerItem}
                      whileHover={{ y: -10 }}
                      transition={{ type: "spring", stiffness: 280, damping: 22 }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_2px_18px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)] w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)] max-w-[320px] sm:max-w-none"
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

              {filteredProducts.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                  <p className="text-slate-500 font-medium text-base">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{search}".</p>
                  <button
                    onClick={() => setSearch("")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    Xóa từ khóa tìm kiếm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <LogoMarquee />
      <CTABand />
    </>
  );
}
