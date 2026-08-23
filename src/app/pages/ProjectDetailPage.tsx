import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Award,
  Maximize2,
  X,
  PhoneCall,
  FileCheck
} from "lucide-react";
import { useStore } from "../lib/store";
import { PageHeader } from "../components/site/PageHeader";
import { CTABand } from "../components/site/CTABand";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { SectionHeading } from "../components/site/SectionHeading";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";

function autoLinkify(text: string) {
  if (!text) return "";
  return text.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) => {
      let label = "Xem liên kết";
      if (url.includes("youtube.com") || url.includes("youtu.be")) label = "YouTube";
      else if (url.includes("facebook.com") || url.includes("fb.watch")) label = "Facebook";
      else if (url.includes("tiktok.com")) label = "TikTok";
      else if (url.includes("zalo.me")) label = "Zalo";
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="font-bold text-primary underline hover:text-[#560213] inline-flex items-center gap-1">${label}</a>`;
    }
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useStore();

  const project = projects.find((p) => p.slug === slug && p.isActive);
  const otherProjects = projects.filter((p) => p.isActive && p.id !== project?.id).slice(0, 3);

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const allImages = project
    ? (project.images && project.images.length > 0
        ? project.images
        : (project.image ? [project.image] : []))
    : [];

  useEffect(() => {
    setSelectedIdx(0);
  }, [project?.id, project?.slug]);

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

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Dự án không tồn tại</h1>
        <Link to="/du-an" className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách dự án
        </Link>
      </div>
    );
  }

  const currentImg = allImages[selectedIdx] || project.image;

  return (
    <>
      <PageHeader
        crumb={project.name}
        parentCrumb="Dự án"
        parentLink="/du-an"
        eyebrow="Chi tiết công trình"
        title={project.name}
        desc={project.shortDescription || `Công trình tại ${project.location}${project.completedDate ? `, hoàn thành ${project.completedDate}` : ""}.`}
      />

      <section className="bg-white py-10 md:py-16">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <Link to="/du-an" className="inline-flex items-center gap-2 text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Tất cả dự án
              </Link>
              {allImages.length > 1 && (
                <div className="text-[13px] font-mono text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  Ảnh {selectedIdx + 1} / {allImages.length}
                </div>
              )}
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* 1. KHỐI THUMBNAIL / SLIDER THẬT BỰ Ở TRÊN CÙNG (HERO MEDIA) */}
          {/* ============================================================ */}
          <Reveal>
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-sm group">
                <ImageWithFallback
                  src={currentImg}
                  alt={project.name}
                  className="h-full w-full aspect-[16/9] md:aspect-[21/9] object-cover transition-all duration-700 group-hover:scale-[1.02]"
                />



                {/* Fullscreen view button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 grid h-10 w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
                  title="Xem ảnh phóng to"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>

                {/* Large Widescreen Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImg}
                      className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-white hover:scale-110 active:scale-95 shadow-2xl cursor-pointer border border-white/20"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="h-7 w-7" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImg}
                      className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-white hover:scale-110 active:scale-95 shadow-2xl cursor-pointer border border-white/20"
                      aria-label="Ảnh tiếp theo"
                    >
                      <ChevronRight className="h-7 w-7" />
                    </button>
                  </>
                )}


              </div>

              {/* Thumbnails strip beneath hero image */}
              {allImages.length > 1 && (
                <div className="flex items-center justify-center gap-3 pt-3 overflow-x-auto pb-2">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
                        selectedIdx === idx
                          ? "border-primary ring-4 ring-primary/20 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                      }`}
                    >
                      <ImageWithFallback
                        src={imgUrl}
                        alt={`${project.name} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Lightbox Modal for enlarged image */}
          {isLightboxOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl">
                <ImageWithFallback
                  src={currentImg}
                  alt={project.name}
                  className="max-h-[85vh] w-auto object-contain rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. LAYOUT NỘI DUNG CHI TIẾT DỰ ÁN                           */}
          {/* ============================================================ */}
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12 items-start">

            {/* Cột Trái: Chi tiết & Mô tả dự án */}
            <div className="space-y-8 min-w-0">

              {/* Tên dự án + mô tả */}
              <Reveal>
                <div className="pb-6 border-b border-border">
                  <h1
                    className="text-foreground"
                    style={{
                      fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                      fontWeight: 800,
                      lineHeight: 1.2,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {project.name}
                  </h1>
                  {(project.shortDescription) && (
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      {project.shortDescription}
                    </p>
                  )}
                </div>
              </Reveal>

              {/* Tổng quan công trình */}
              <Reveal delay={0.08}>
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-[17px] font-bold text-foreground">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </span>
                    Tổng quan &amp; Quy mô công trình
                  </h2>
                  <div className="prose-article text-[15.5px] leading-[1.85] text-slate-700 pl-2 sm:pl-4">
                    {project.description ? (
                      project.description.includes("<") ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: autoLinkify(project.description)
                          }}
                        />
                      ) : (
                        project.description.split(/\n\s*\n/).map((para, pIdx) => (
                          <p
                            key={pIdx}
                            className="mb-4 text-justify"
                            dangerouslySetInnerHTML={{ __html: autoLinkify(para) }}
                          />
                        ))
                      )
                    ) : (
                      <>
                        <p>
                          Dự án <strong className="text-foreground">{project.name}</strong> tọa lạc tại{" "}
                          <strong className="text-foreground">{project.location}</strong> là một trong những công trình
                          hạ tầng / kiến trúc trọng điểm sử dụng giải pháp gạch nung &amp; gạch bê tông chất lượng từ
                          Thuận Lợi.
                        </p>
                        <p>
                          Toàn bộ sản phẩm phục vụ công trình đều trải qua 9 bước sản xuất nghiêm ngặt tại nhà máy, từ
                          khâu ủ nguyên liệu đến nung lò tuynel công nghệ cao, đảm bảo độ chịu lực, chống xói mòn và
                          chuẩn kích thước tuyệt đối.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Cột Phải: Sidebar sticky */}
            <div className="space-y-5 lg:sticky lg:top-24">

              {/* Card thông tin công trình */}
              <Reveal delay={0.05}>
                <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                  <div className="bg-secondary/60 px-5 py-3.5 border-b border-border">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      Thông tin công trình
                    </p>
                  </div>
                  <div className="divide-y divide-border/60">
                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Building2 className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Tên dự án</p>
                        <p className="text-[13.5px] font-semibold text-foreground truncate">{project.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Địa điểm triển khai</p>
                        <p className="text-[13.5px] font-semibold text-foreground">{project.location}</p>
                      </div>
                    </div>

                    {project.completedDate && (
                      <div className="flex items-center gap-3 px-5 py-4">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground">Thời gian hoàn thành</p>
                          <p className="text-[13.5px] font-semibold text-foreground">
                            {project.completedDate.includes("-")
                              ? (() => {
                                  const pts = project.completedDate.split("T")[0].split("-");
                                  return pts.length === 3 ? `${pts[2]}/${pts[1]}/${pts[0]}` : project.completedDate;
                                })()
                              : project.completedDate}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Nhà cung cấp gạch</p>
                        <p className="text-[13.5px] font-semibold text-foreground">Công ty Gạch Thuận Lợi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Other Projects (Các dự án khác) */}
      {otherProjects.length > 0 && (
        <section className="bg-secondary/30 py-16 md:py-24 border-t border-border">
          <div className="mx-auto max-w-[1240px] px-6">
            <SectionHeading eyebrow="Dự án khác" title="Khám phá công trình tiêu biểu khác" align="center" />

            <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((p) => (
                <motion.div
                  key={p.id}
                  variants={staggerItem}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
                >
                  <Link to={`/du-an/${p.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
                    <ImageWithFallback
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <Link to={`/du-an/${p.slug}`}>
                      <h3 className="font-bold text-foreground hover:text-primary transition-colors leading-snug text-[1.1rem]">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {p.location}
                      </span>
                      {p.completedDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {p.completedDate.includes("-")
                            ? (() => {
                                const pts = p.completedDate.split("T")[0].split("-");
                                return pts.length === 3 ? `${pts[2]}/${pts[1]}/${pts[0]}` : p.completedDate;
                              })()
                            : p.completedDate}
                        </span>
                      )}
                    </div>
                    {p.shortDescription && (
                      <p className="mt-3 text-[14px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                    )}

                    <div className="mt-5 flex-1" />

                    <Link
                      to={`/du-an/${p.slug}`}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-transform group-hover:translate-x-1"
                    >
                      Xem chi tiết <ArrowRight className="h-4 w-4" />
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
