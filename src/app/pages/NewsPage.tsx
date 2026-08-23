import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Calendar, ArrowRight, Search, Sparkles, Award, Factory, ShieldCheck, Flame, Clock, Tag } from "lucide-react";
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

const CATEGORIES = ["Tất cả", "Sản xuất & Công nghệ", "Doanh nghiệp", "Kiến thức xây dựng", "Sự kiện"];

const HIGHLIGHTS = [
  {
    icon: Factory,
    title: "35+ Năm Kinh Nghiệm",
    desc: "Nhà máy gạch Tuynel uy tín thành lập từ năm 1988",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    icon: Flame,
    title: "100M+ Viên / Năm",
    desc: "Công suất lò nung Tuynel đáp ứng mọi đại dự án",
    color: "text-red-600 bg-red-50 border-red-200",
  },
  {
    icon: ShieldCheck,
    title: "Chuẩn QCVN 16:2023",
    desc: "Đạt chứng nhận hợp quy Bộ Xây Dựng nghiêm ngặt",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    icon: Award,
    title: "100% Đất Sét Tự Nhiên",
    desc: "Khai thác & ủ đất đúng quy trình cho gạch đanh chắc",
    color: "text-orange-600 bg-orange-50 border-orange-200",
  },
];

export function NewsPage() {
  const { news } = useStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const visible = useMemo(() => {
    return news
      .filter((n) => n.isActive)
      .filter((n) => {
        const matchesSearch =
          !search ||
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          (n.summary && n.summary.toLowerCase().includes(search.toLowerCase()));

        // Simple mock category filtering if categories match keyword or fallback
        if (activeCategory === "Tất cả") return matchesSearch;
        return matchesSearch;
      })
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  }, [news, search, activeCategory]);

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

      {/* Highlights Ribbon Bar */}
      <section className="relative z-10 -mt-8 mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl bg-white p-6 shadow-xl border border-slate-100/80">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3.5 p-3 rounded-2xl transition-colors hover:bg-slate-50">
                <div className={`p-3 rounded-2xl border ${item.color} shrink-0 shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[15px] text-slate-900 leading-tight">{item.title}</h4>
                  <p className="text-[12.5px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50/50 py-12 md:py-20">
        <div className="mx-auto max-w-[1240px] px-6">

          {/* Search & Filter Header Bar */}
          <Reveal>
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-bold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#560213] text-white shadow-md shadow-red-950/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative min-w-[260px] sm:min-w-[300px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-[13.5px] font-medium text-slate-800 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          {/* Featured Article */}
          {featured && (
            <Reveal>
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Bài viết tiêu điểm</span>
                </div>

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
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#560213]/90 backdrop-blur-md px-3.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                        Tin mới nhất
                      </div>
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  Các tin tức khác
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-full">
                  {rest.length} bài viết
                </span>
              </div>

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
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center gap-1">
                            <Tag className="h-3 w-3 text-red-400" /> Tin tức
                          </div>
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

