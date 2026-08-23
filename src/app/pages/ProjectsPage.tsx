import { useState, useMemo } from "react";
import { Link } from "react-router";
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Award, 
  Truck, 
  CheckCircle2,
  Layers,
  Tag
} from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
import { useStore } from "../lib/store";
import { IMAGES } from "../lib/data";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useQuote } from "../components/site/QuoteContext";

function formatDateShort(iso: string) {
  if (!iso) return "";
  if (iso.includes("T")) {
    const pts = iso.split("T")[0].split("-");
    if (pts.length === 3) return `${pts[2]}/${pts[1]}/${pts[0]}`;
  }
  return iso;
}

const CATEGORIES = ["Tất cả", "Dân dụng & Biệt thự", "Công nghiệp & Nhà xưởng", "Công cộng & Hạ tầng"];

const STATS = [
  {
    icon: Building2,
    title: "500+ Công Trình",
    desc: "Đồng hành cùng hàng trăm dự án trọng điểm phía Nam",
    color: "text-red-600 bg-red-50 border-red-200",
  },
  {
    icon: Award,
    title: "Mác Gạch Đạt Chuẩn",
    desc: "Cường độ nén cao, nghiệm thu đúng tiêu chuẩn QCVN 16",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    icon: Truck,
    title: "Giao Hàng Tận Nơi",
    desc: "Vận chuyển xe cẩu chuyên dụng tận chân công trình",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    icon: CheckCircle2,
    title: "100% Niềm Tin",
    desc: "35+ năm uy tín nhà máy gạch Tuynel Mộc Hóa",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
];

export function ProjectsPage() {
  const { projects } = useStore();
  const { openQuote } = useQuote();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  const visible = useMemo(() => {
    return projects
      .filter((p) => p.isActive)
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.location.toLowerCase().includes(search.toLowerCase()) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase()));

        if (activeCategory === "Tất cả") return matchesSearch;
        return matchesSearch;
      })
      .sort((a, b) => (b.displayOrder ?? 0) - (a.displayOrder ?? 0));
  }, [projects, search, activeCategory]);

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

      {/* Highlights / Achievement Ribbon Bar */}
      <section className="relative z-10 -mt-8 mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-3xl bg-white p-6 shadow-xl border border-slate-100/80">
          {STATS.map((item, idx) => {
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

      {/* Main Section */}
      <section className="bg-slate-50/50 py-12 md:py-20">
        <div className="mx-auto max-w-[1240px] px-6">

          {/* Search Bar & Category Tabs */}
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
              <div className="relative min-w-[260px] sm:min-w-[320px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên công trình, vị trí..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-[13.5px] font-medium text-slate-800 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          {/* Featured Hero Project */}
          {featured && (
            <Reveal>
              <div className="mb-14">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-primary">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Dự án tiêu điểm</span>
                </div>

                <Link
                  to={`/du-an/${featured.slug}`}
                  className="group flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-slate-200/90 bg-white transition-all duration-300 hover:shadow-[0_24px_64px_rgba(86,2,19,0.12)] hover:border-red-900/30"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 lg:aspect-auto lg:w-[50%] lg:shrink-0">
                    <ImageWithFallback
                      src={featured.image}
                      alt={featured.name}
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#560213]/90 backdrop-blur-md px-3.5 py-1 text-[11.5px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                      <Building2 className="h-3.5 w-3.5 text-amber-400" /> Dự án nổi bật
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-8 lg:p-10 flex-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500 mb-3">
                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                          <MapPin className="h-4 w-4" />
                          {featured.location}
                        </span>
                        {featured.completedDate && (
                          <span className="flex items-center gap-1.5 font-medium text-slate-400">
                            <Calendar className="h-4 w-4" />
                            Hoàn thành: {formatDateShort(featured.completedDate)}
                          </span>
                        )}
                      </div>

                      <h2
                        className="text-slate-900 transition-colors group-hover:text-primary"
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  Các công trình đồng hành khác
                </h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-full">
                  {rest.length} dự án
                </span>
              </div>

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
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11.5px] font-bold text-white flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-red-400" /> {p.location}
                        </div>
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
                onClick={() => { setSearch(""); setActiveCategory("Tất cả"); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              >
                Xóa bộ lọc tìm kiếm
              </button>
            </div>
          )}

          {/* Bottom Consultation CTA Bar for Projects */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#560213] via-red-950 to-[#560213] text-white p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                Tư vấn vật liệu gạch cho dự án
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
                Bạn đang chuẩn bị triển khai công trình?
              </h3>
              <p className="text-sm text-slate-300 max-w-xl">
                Liên hệ ngay với Thuận Lợi để nhận bảng báo giá gạch Tuynel ưu đãi trực tiếp từ nhà máy cho toàn bộ quy mô dự án.
              </p>
            </div>

            <button
              onClick={() => openQuote("Tư vấn gạch cho dự án")}
              className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#560213] shadow-lg hover:bg-amber-100 hover:scale-105 transition-all cursor-pointer active:scale-95"
            >
              Yêu cầu báo giá công trình ↗
            </button>
          </div>

        </div>
      </section>

      <LogoMarquee />
      <CTABand />
    </>
  );
}

