import { useState, useMemo } from "react";
import { Link } from "react-router";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Building2
} from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
import { useStore } from "../lib/store";
import { IMAGES } from "../lib/data";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

import { CardSkeleton } from "../components/ui/LoadingState";

function formatDateShort(iso: string) {
  if (!iso) return "";
  if (iso.includes("T")) {
    const pts = iso.split("T")[0].split("-");
    if (pts.length === 3) return `${pts[2]}/${pts[1]}/${pts[0]}`;
  }
  return iso;
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
          (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
  }, [projects, search]);

  const featured = visible.find((p) => p.isFeatured) || visible[0];
  const rest = visible.filter((p) => p !== featured);

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
        <div className="mx-auto max-w-[1240px] px-6">

          {/* Search Input Bar Only */}
          <Reveal>
            <div className="mb-10 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm công trình theo tên, vị trí..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 py-3 text-[14px] font-medium text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          {isLoading ? (
            <CardSkeleton count={6} />
          ) : (
            <>
              {/* Featured Hero Project */}
          {featured && (
            <Reveal>
              <div className="mb-14">
                <Link
                  to={`/du-an/${featured.slug}`}
                  className="group flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-[0_24px_64px_rgba(86,2,19,0.12)] hover:border-red-900/30"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 lg:aspect-[16/10] lg:w-[48%] lg:shrink-0">
                    <ImageWithFallback
                      src={featured.image}
                      alt={featured.name}
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col justify-between p-8 lg:p-10 flex-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                          <MapPin className="h-3.5 w-3.5" />
                          {featured.location}
                        </span>
                        {featured.completedDate && (
                          <span className="flex items-center gap-1.5 font-medium text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            Hoàn thành: {formatDateShort(featured.completedDate)}
                          </span>
                        )}
                      </div>

                      <h2
                        className="text-foreground transition-colors group-hover:text-primary"
                        style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 800, lineHeight: 1.25, fontFamily: "var(--font-display)" }}
                      >
                        {featured.name}
                      </h2>

                      {featured.shortDescription && (
                        <p className="mt-4 text-[15px] leading-relaxed text-slate-600 line-clamp-3">
                          {featured.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                      <span className="text-[12.5px] font-semibold text-slate-400">Sử dụng gạch Tuynel Thuận Lợi</span>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[13.5px] font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                        Khám phá công trình <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Reveal>
          )}

          {/* Grid of Remaining Projects */}
          {rest.length > 0 && (
            <div>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <motion.div key={p.id} variants={staggerItem}>
                    <Link
                      to={`/du-an/${p.slug}`}
                      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_16px_40px_rgba(86,2,19,0.08)] hover:-translate-y-1.5 hover:border-red-900/30"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <ImageWithFallback
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        {p.completedDate && (
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-2">
                            <Calendar className="h-3.5 w-3.5 text-primary/70" />
                            {formatDateShort(p.completedDate)}
                          </div>
                        )}

                        <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors text-[1.05rem]">
                          {p.name}
                        </h3>

                        {p.shortDescription && (
                          <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600 line-clamp-2">
                            {p.shortDescription}
                          </p>
                        )}

                        <div className="mt-6 flex-1" />

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[13px] font-semibold text-primary">
                          <span>Xem chi tiết dự án</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </Stagger>
            </div>
          )}

          {/* Empty Search Result */}
          {visible.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium text-base">Không tìm thấy công trình nào phù hợp với từ khóa "{search}".</p>
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

