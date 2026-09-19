import { useState, useEffect, useMemo, useCallback, useRef, useLayoutEffect } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
import { useStore, FALLBACK_IMAGE } from "../lib/store";
import type { ProjectItem } from "../lib/data";
import { IMAGES } from "../lib/data";
import { Reveal } from "../lib/motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PageListSkeleton } from "../components/ui/LoadingState";

function formatDateShort(iso?: string) {
  if (!iso) return "";
  if (iso.includes("T")) {
    const pts = iso.split("T")[0].split("-");
    if (pts.length === 3) return `${pts[2]}/${pts[1]}/${pts[0]}`;
  }
  if (iso.includes("-")) {
    const pts = iso.split("-");
    if (pts.length === 3) return `${pts[2]}/${pts[1]}/${pts[0]}`;
  }
  return iso;
}

function autoLinkify(text: string): string {
  if (!text) return "";
  const parts = text.split(/(<a\s+[^>]*>[\s\S]*?<\/a>|<[^>]+>)/gi);
  return parts
    .map((part) => {
      if (part.startsWith("<")) return part;
      const urlRegex = /(https?:\/\/[^\s<)]+)/gi;
      return part.replace(urlRegex, (url) => {
        let cleanUrl = url;
        let trailing = "";
        if (/[.,!?)]$/.test(cleanUrl)) {
          trailing = cleanUrl.slice(-1);
          cleanUrl = cleanUrl.slice(0, -1);
        }

        let label = "Xem liên kết";
        try {
          const parsed = new URL(cleanUrl);
          const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
          if (host.includes("youtube.com") || host.includes("youtu.be")) {
            label = "Xem trên YouTube";
          } else if (host.includes("facebook.com") || host.includes("fb.watch")) {
            label = "Xem trên Facebook";
          } else if (host.includes("tiktok.com")) {
            label = "Xem trên TikTok";
          } else if (host.includes("zalo.me")) {
            label = "Liên hệ Zalo";
          } else {
            label = "Xem liên kết";
          }
        } catch {
          label = "Xem liên kết";
        }

        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="font-bold text-primary underline hover:text-[#560213] inline-flex items-center gap-1">${label}</a>${trailing}`;
      });
    })
    .join("");
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  const allImages = useMemo(() => {
    if (project.images && project.images.length > 0) {
      return project.images;
    }
    if (project.image) {
      return [project.image];
    }
    return [FALLBACK_IMAGE];
  }, [project.images, project.image]);

  const currentImg = allImages[selectedIdx] || project.image || FALLBACK_IMAGE;

  const nextImg = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setSelectedIdx((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImg = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setSelectedIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Reset trạng thái mở rộng khi đổi project
  useEffect(() => {
    setIsExpanded(false);
  }, [project.id]);

  // Tự động đo lường xem nội dung mô tả có thực sự bị tràn (overflow) quá số dòng cho phép hay không.
  // Nếu nội dung vừa đủ (không bị clamp / cắt bớt), tuyệt đối không hiển thị nút "Xem thêm chi tiết".
  useLayoutEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const checkOverflow = () => {
      if (!isExpanded) {
        // scrollHeight > clientHeight với ngưỡng chênh lệch 4px (tránh sai số sub-pixel)
        const hasOverflow = el.scrollHeight - el.clientHeight > 4;
        setIsClamped((prev) => (prev !== hasOverflow ? hasOverflow : prev));
      }
    };

    checkOverflow();

    const ro = new ResizeObserver(() => {
      checkOverflow();
    });
    ro.observe(el);

    if (document.fonts) {
      document.fonts.ready.then(checkOverflow);
    }

    return () => {
      ro.disconnect();
    };
  }, [project.description, isExpanded]);

  return (
    <div
      id={project.slug}
      className="scroll-mt-28 group relative rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:border-red-900/30 transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-stretch">
        
        {/* ============================================================ */}
        {/* CỘT 1: HÌNH ẢNH 1 BÊN (TRÁI)                                  */}
        {/* ============================================================ */}
        <div className="w-full lg:w-[48%] xl:w-[46%] lg:shrink-0 p-4 sm:p-6 flex flex-col justify-start bg-slate-50/70 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div>
            {/* Ảnh chính */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-inner group/media">
              <ImageWithFallback
                src={currentImg}
                alt={project.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/media:scale-105"
              />

              {/* Nút phóng to Lightbox */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                title="Xem ảnh phóng to"
              >
                <Maximize2 className="h-4 w-4" />
              </button>

              {/* Bộ điều hướng mũi tên Trước/Sau */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImg}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-white hover:scale-110 active:scale-95 shadow-md cursor-pointer border border-white/20"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImg}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-primary hover:text-white hover:scale-110 active:scale-95 shadow-md cursor-pointer border border-white/20"
                    aria-label="Ảnh kế tiếp"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Badge số ảnh */}
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[11.5px] font-medium text-white backdrop-blur-md shadow-sm">
                    {selectedIdx + 1} / {allImages.length} ảnh
                  </span>
                </>
              )}
            </div>

            {/* Dải ảnh thumbnail bự, rõ ràng */}
            {allImages.length > 1 && (
              <div className="mt-3.5 flex items-center gap-3 overflow-x-auto pb-1 pt-1">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`relative h-20 w-28 sm:h-22 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-2 transition-all cursor-pointer shadow-sm ${
                      selectedIdx === idx
                        ? "border-primary ring-4 ring-primary/25 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100 hover:scale-102"
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
        </div>

        {/* ============================================================ */}
        {/* CỘT 2: TÊN & THÔNG TIN 1 BÊN (PHẢI) - LÊN TRÊN CÙNG, KHÔNG LƯNG CHỪNG */}
        {/* ============================================================ */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-start">
          <div>
            {/* Tên dự án to, nổi bật, ở ngay trên cùng */}
            <h2
              className="text-slate-900 leading-snug tracking-tight text-[1.5rem] sm:text-[1.75rem] lg:text-[1.95rem] font-extrabold group-hover:text-primary transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.name}
            </h2>

            {/* Thông số vị trí, ngày tháng */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] sm:text-[13.5px] text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                {project.location}
              </span>

              {project.completedDate && (
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-400">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  Hoàn thành: {formatDateShort(project.completedDate)}
                </span>
              )}
            </div>

            {/* Mô tả ngắn nếu có */}
            {project.shortDescription && (
              <p className="mt-4 text-[14.5px] sm:text-[15px] font-semibold leading-relaxed text-slate-800 whitespace-pre-line">
                {project.shortDescription}
              </p>
            )}

            {/* Mô tả chi tiết với tính năng Thu gọn / Mở rộng */}
            {project.description ? (
              <div className="mt-3">
                <div
                  ref={descRef}
                  className={`prose-article text-[14px] sm:text-[14.5px] leading-relaxed text-slate-600 transition-all duration-300 [&_p:last-child]:mb-0 [&>*:last-child]:mb-0 ${
                    !isExpanded ? "line-clamp-3 sm:line-clamp-4" : ""
                  }`}
                >
                  {project.description.includes("<") ? (
                    <div
                      className="whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: autoLinkify(project.description)
                      }}
                    />
                  ) : (
                    project.description.split(/\n\s*\n/).map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="mb-2.5 last:mb-0 text-justify whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: autoLinkify(para) }}
                      />
                    ))
                  )}
                </div>

                {/* Nút Xem thêm / Thu gọn: Chỉ hiển thị khi nội dung thực sự bị tràn */}
                {isClamped && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isExpanded) {
                        setIsExpanded(false);
                        const cardEl = document.getElementById(project.slug);
                        if (cardEl) {
                          const rect = cardEl.getBoundingClientRect();
                          if (rect.top < 80) {
                            cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }
                      } else {
                        setIsExpanded(true);
                      }
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:text-[#560213] cursor-pointer transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Thu gọn <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Xem thêm chi tiết <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              !project.shortDescription && (
                <p className="mt-3 text-[14px] sm:text-[14.5px] leading-relaxed text-slate-600">
                  Dự án {project.name} tại {project.location} tin dùng các dòng gạch Tuynel nung lò chất lượng cao từ Thuận Lợi, đáp ứng các tiêu chuẩn kỹ thuật về độ chịu lực và độ bền vững.
                </p>
              )
            )}
          </div>
        </div>

      </div>

      {/* Lightbox phóng to ảnh toàn màn hình */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-6 w-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImg}
                className="absolute left-6 top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={nextImg}
                className="absolute right-6 top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Ảnh kế tiếp"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl">
            <ImageWithFallback
              src={currentImg}
              alt={project.name}
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function ProjectsPage() {
  const { projects, isLoading } = useStore();
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return projects
      .filter((p) => p.isActive)
      .filter((p) => {
        if (!search) return true;
        return (
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
  }, [projects, search]);

  // Cuộn mượt đến dự án nếu có hash trong URL (#slug)
  useEffect(() => {
    if (!isLoading && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const elem = document.getElementById(id);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
      }
    }
  }, [isLoading]);

  return (
    <>
      <PageHeader
        crumb="Dự án"
        eyebrow="Dự án tiêu biểu"
        title="Những công trình được xây bằng niềm tin"
        desc="Tổng hợp các dự án dân dụng, nhà xưởng công nghiệp và công trình công cộng trên khắp cả nước tin dùng gạch Tuynel Thuận Lợi."
        image={IMAGES.heroWall}
      />

      {/* Main Section */}
      <section className="bg-slate-50/50 py-12 md:py-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">

          {/* Thanh tìm kiếm công trình */}
          <Reveal>
            <div className="mb-12 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm công trình theo tên, vị trí, đặc điểm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 py-3.5 text-[14px] font-medium text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          {isLoading ? (
            <PageListSkeleton />
          ) : (
            <>
              {/* Danh sách công trình dạng 1 cột - mỗi dự án 1 thẻ trải dài ngang qua 2 bên */}
              {visible.length > 0 ? (
                <div className="space-y-8 md:space-y-10">
                  {visible.map((p) => (
                    <Reveal key={p.id}>
                      <ProjectCard project={p} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                /* Không tìm thấy kết quả */
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-slate-500 font-medium text-base">
                    Không tìm thấy công trình nào phù hợp với từ khóa "{search}".
                  </p>
                  <button
                    type="button"
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
