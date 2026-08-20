import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Phone, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "../lib/store";
import { PageHeader } from "../components/site/PageHeader";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";
import { SectionHeading } from "../components/site/SectionHeading";

function buildAllSpecs(p: ReturnType<typeof useStore>["products"][number]) {
  return [
    { label: "Chiều dài", value: `${p.length} mm`, unit: "L" },
    { label: "Chiều rộng", value: `${p.width} mm`, unit: "W" },
    { label: "Chiều cao", value: `${p.height} mm`, unit: "H" },
    p.brickGrade ? { label: "Mác gạch", value: p.brickGrade, unit: "M" } : null,
    p.compressionStrength != null ? { label: "Cường độ nén (AVG)", value: `${p.compressionStrength} MPa`, unit: "Rn" } : null,
    p.flexuralStrength != null ? { label: "Cường độ uốn (AVG)", value: `${p.flexuralStrength} MPa`, unit: "Ru" } : null,
  ].filter((s): s is { label: string; value: string; unit: string } => s !== null);
}

const HIGHLIGHTS = [
  "Nung lò Tuynel liên tục tại 1.050°C",
  "Đạt hợp quy QCVN 16:2023/BXD",
  "Kiểm định từng lô trước khi xuất hàng",
  "Giao hàng toàn quốc, đóng pallet quấn màng",
];

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useStore();

  const product = products.find((p) => p.slug === slug && p.isActive);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // Consolidate images
  const allImages = product
    ? (product.images && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : []))
    : [];

  useEffect(() => {
    setSelectedIdx(0);
  }, [product?.id, product?.slug]);

  const nextImg = useCallback(() => {
    if (allImages.length <= 1) return;
    setSelectedIdx((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImg = useCallback(() => {
    if (allImages.length <= 1) return;
    setSelectedIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // 10s auto-slide timer
  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % allImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [allImages.length]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Sản phẩm không tồn tại</h1>
        <Link to="/san-pham" className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const specs = buildAllSpecs(product);
  const otherProducts = products.filter((p) => p.isActive && p.id !== product.id).slice(0, 4);
  const currentImg = allImages[selectedIdx] || product.image;

  return (
    <>
      <PageHeader
        crumb={product.name}
        eyebrow="Sản phẩm"
        title={product.name}
        desc={product.shortDescription}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-6">
          {/* Breadcrumb */}
          <Reveal>
            <Link to="/san-pham" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-10">
              <ArrowLeft className="h-4 w-4" /> Tất cả sản phẩm
            </Link>
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20 items-start">
            {/* Image Gallery */}
            <Reveal>
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-[0_24px_60px_rgba(0,0,0,0.06)] group">
                  <ImageWithFallback
                    src={currentImg}
                    alt={product.name}
                    className="aspect-[4/3] w-full object-cover transition-all duration-500"
                  />

                  {/* Navigation arrows (only if multiple images) */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImg}
                        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95 shadow-lg"
                        aria-label="Ảnh trước"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>

                      <button
                        type="button"
                        onClick={nextImg}
                        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95 shadow-lg"
                        aria-label="Ảnh tiếp theo"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Multiple Images thumbnails if available */}
                {allImages.length > 1 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedIdx(idx)}
                        className={`h-16 w-20 overflow-hidden rounded-xl border-2 transition-all ${
                          selectedIdx === idx
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-border opacity-70 hover:opacity-100"
                        }`}
                      >
                        <ImageWithFallback
                          src={imgUrl}
                          alt={`${product.name} ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Info */}
            <div>
              <Reveal>
                <h1 className="text-foreground" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, lineHeight: 1.1, fontFamily: "var(--font-display)" }}>
                  {product.name}
                </h1>
                {product.description ? (
                  <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">{product.description}</p>
                ) : (
                  <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">{product.shortDescription}</p>
                )}
              </Reveal>

              {/* Specs table */}
              {specs.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="mt-8 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 p-5 shadow-lg shadow-amber-500/5 ring-1 ring-black/5">
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-200/80">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                        <h2 className="text-[13px] font-bold uppercase tracking-wider text-amber-900 font-mono">
                          Thông Số Kỹ Thuật Chi Tiết
                        </h2>
                      </div>
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800 font-mono">
                        QCVN 16:2023
                      </span>
                    </div>

                    <div className="divide-y divide-amber-100/80 rounded-xl overflow-hidden border border-amber-200/80 bg-white shadow-xs">
                      {specs.map((s, i) => (
                        <div
                          key={s.label}
                          className={`flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-amber-50/60 ${
                            i % 2 === 0 ? "bg-amber-50/30" : "bg-white"
                          }`}
                        >
                          <span className="text-[14px] font-semibold text-foreground/85 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            {s.label}
                          </span>
                          <span className="text-[14px] font-extrabold font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/25 shadow-xs">
                            {s.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Highlights */}
              <Reveal delay={0.18}>
                <ul className="mt-8 space-y-2.5">
                  {HIGHLIGHTS.map((h) => (
                    <li key={h} className="flex items-center gap-3 text-[14px] text-foreground">
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-primary" strokeWidth={2.2} />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* CTA */}
              <Reveal delay={0.26}>
                <Link
                  to="/lien-he"
                  className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-[15px] font-semibold text-primary-foreground shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-shadow hover:shadow-[0_18px_48px_rgba(0,0,0,0.26)] sm:w-auto"
                >
                  <Phone className="h-5 w-5" />
                  Liên hệ báo giá
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Other products (Sản phẩm khác) */}
      {otherProducts.length > 0 && (
        <section className="bg-secondary/30 py-16 md:py-24 border-t border-border">
          <div className="mx-auto max-w-[1240px] px-6">
            <SectionHeading eyebrow="Sản phẩm khác" title="Khám phá thêm" align="center" />

            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {otherProducts.map((p) => (
                <motion.div
                  key={p.id}
                  variants={staggerItem}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
                >
                  <Link to={`/san-pham/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <Link to={`/san-pham/${p.slug}`}>
                      <h3 className="font-bold text-foreground hover:text-primary transition-colors leading-snug" style={{ fontSize: "1rem" }}>
                        {p.name}
                      </h3>
                    </Link>
                    <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-2">{p.shortDescription}</p>

                    <div className="mt-4 flex-1" />

                    <Link
                      to={`/san-pham/${p.slug}`}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-primary"
                    >
                      Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <LogoMarquee />
      <CTABand />
    </>
  );
}
