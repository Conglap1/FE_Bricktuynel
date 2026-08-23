import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Calendar, ArrowRight, Search, Sparkles, Clock, Tag } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { CTABand } from "../components/site/CTABand";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { useStore } from "../lib/store";
import { IMAGES } from "../lib/data";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
  } catch { return iso; }
}

export function NewsPage() {
  const { news } = useStore();
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return news
      .filter((n) => n.isActive)
      .filter((n) => {
        return (
          !search ||
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          (n.summary && n.summary.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  }, [news, search]);

  const [featured, ...rest] = visible;

  return (
    <>
      <PageHeader
        crumb="Tin tức"
        eyebrow="Tin tức & Sự kiện"
        title="Cập nhật mới nhất từ Thuận Lợi"
        desc="Thông tin về hoạt động sản xuất, công nghệ gạch Tuynel, kiến thức công trình và chứng nhận chất lượng."
        image={IMAGES.newsBanner}
      />

      <section className="bg-slate-50/50 py-12 md:py-20">
        <div className="mx-auto max-w-[1240px] px-6">

          {/* Search Input Bar (Synchronized with ProjectsPage) */}
          <Reveal>
            <div className="mb-10 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết theo tiêu đề, tóm tắt..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 py-3 text-[14px] font-medium text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          {/* Featured Hero Article */}
          {featured && (
            <Reveal>
              <div className="mb-14">
                <Link
                  to={`/tin-tuc/${featured.slug}`}
                  className="group flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-[0_24px_64px_rgba(86,2,19,0.12)] hover:border-red-900/30"
                >
                  {featured.thumbnailPath && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 lg:aspect-auto lg:w-[48%] lg:shrink-0">
                      <ImageWithFallback
                        src={featured.thumbnailPath}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between p-8 lg:p-10 flex-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-slate-500 mb-3">
                        {featured.publishedAt && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {formatDate(featured.publishedAt)}
                          </span>
                        )}
                        <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                          3 phút đọc
                        </span>
                      </div>

                      <h2
                        className="text-foreground transition-colors group-hover:text-primary"
                        style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 800, lineHeight: 1.25, fontFamily: "var(--font-display)" }}
                      >
                        {featured.title}
                      </h2>

                      {featured.summary && (
                        <p className="mt-4 text-[15px] leading-relaxed text-slate-600 line-clamp-3">{featured.summary}</p>
                      )}
                    </div>

                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                      <span className="text-[12.5px] font-semibold text-slate-400">Tác giả: Thuận Lợi Brick</span>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[13.5px] font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                        Xem chi tiết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Reveal>
          )}

          {/* Rest Grid */}
          {rest.length > 0 && (
            <div>
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((n) => (
                  <motion.div key={n.id} variants={staggerItem}>
                    <Link
                      to={`/tin-tuc/${n.slug}`}
                      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_16px_40px_rgba(86,2,19,0.08)] hover:-translate-y-1.5 hover:border-red-900/30"
                    >
                      {n.thumbnailPath && (
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          <ImageWithFallback
                            src={n.thumbnailPath}
                            alt={n.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        {n.publishedAt && (
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-2.5">
                            <Calendar className="h-3.5 w-3.5 text-primary/70" />
                            {formatDate(n.publishedAt)}
                          </div>
                        )}

                        <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors text-[1.05rem]">
                          {n.title}
                        </h3>

                        {n.summary && (
                          <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600 line-clamp-2">{n.summary}</p>
                        )}

                        <div className="mt-6 flex-1" />

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[13px] font-semibold text-primary">
                          <span>Đọc bài viết</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </Stagger>
            </div>
          )}

          {visible.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium text-base">Không tìm thấy bài viết nào phù hợp với từ khóa "{search}".</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("Tất cả"); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          )}
        </div>
      </section>

      <LogoMarquee />
      <CTABand />
    </>
  );
}

