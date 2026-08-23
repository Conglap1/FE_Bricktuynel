import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Share2, 
  Check, 
  Clock, 
  User, 
  PhoneCall, 
  MessageSquare, 
  ChevronRight,
  Sparkles,
  List,
  ThumbsUp,
  ThumbsDown,
  Layers,
  Award,
  Tag,
  ExternalLink,
  ShieldCheck,
  Building2
} from "lucide-react";
import { useStore, getImageUrl } from "../lib/store";
import { IMAGES } from "../lib/data";
import { useQuote } from "../components/site/QuoteContext";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch {
    return iso;
  }
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

        let label = "Liên kết";
        try {
          const parsed = new URL(cleanUrl);
          const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
          if (host.includes("youtube.com") || host.includes("youtu.be")) {
            label = "YouTube";
          } else if (host.includes("facebook.com") || host.includes("fb.watch")) {
            label = "Facebook";
          } else if (host.includes("tiktok.com")) {
            label = "TikTok";
          } else if (host.includes("zalo.me")) {
            label = "Zalo";
          } else {
            label = host;
          }
        } catch {
          label = "Liên kết";
        }

        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center font-semibold text-[#810C00] hover:text-[#560213] underline underline-offset-2 transition-colors cursor-pointer" title="${cleanUrl}">${label}</a>${trailing}`;
      });
    })
    .join("");
}

// Fallback products for showcase in sticky sidebar if products list in store is empty
const MOCK_SIDEBAR_PRODUCTS = [
  {
    name: "Gạch Tuynel 4 Lỗ",
    desc: "Quy cách 80x80x180mm, Mác 75, xây tường bao 100mm/200mm đanh chắc.",
    image: "/images/quy_trinh/B9.2 Đóng sản phẩm.jpg",
  },
  {
    name: "Gạch Đờm 2 Lỗ",
    desc: "Cấu tạo lỗ rỗng cách nhiệt, cường độ nén cao, tiết kiệm xi măng.",
    image: "/images/gioithieu_anhnho.jpg",
  },
  {
    name: "Gạch Đặc Nung Cao Cấp",
    desc: "Chịu lực tối đa, chống thấm xuất sắc cho chân móng & bể nước.",
    image: "/images/gioithieu_anhlon.jpg",
  },
];

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { news, products, contact } = useStore();
  const { openQuote } = useQuote();
  const [copied, setCopied] = useState(false);

  const activeNews = news.filter((n) => n.isActive);
  const article = activeNews.find((n) => n.slug === slug);
  const others = activeNews.filter((n) => n.slug !== slug).slice(0, 5);

  // Scroll to top and set document title & meta SEO
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (article) {
      document.title = `${article.title} - Gạch Tuynel Thuận Lợi`;
    }
  }, [slug, article]);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!article) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Bài viết không tồn tại</h1>
        <p className="text-muted-foreground text-sm max-w-md">Bài viết bạn tìm kiếm có thể đã thay đổi địa chỉ hoặc không còn tồn tại trên hệ thống.</p>
        <Link to="/tin-tuc" className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline mt-2">
          <ArrowLeft className="h-4 w-4" /> Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.summary || article.title,
    "image": article.thumbnailPath ? [getImageUrl(article.thumbnailPath)] : [],
    "datePublished": article.publishedAt || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Công ty TNHH Một Thành Viên Thuận Lợi Mộc Hóa"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Gạch Tuynel Thuận Lợi",
      "url": "https://gachthuanloi.vn"
    }
  };

  // Extract sections with questions for Table of Contents
  const tocSections = (article.sections || []).filter((s) => s.question);

  return (
    <>
      {/* Inject SEO JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Hero Banner */}
      <section className="relative overflow-hidden bg-[#560213] text-white pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background Image & Layered Dark Gradient Overlays */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={article.thumbnailPath || IMAGES.newsBanner}
            alt={article.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/45 to-black/30" />
        </div>

        <div className="relative mx-auto max-w-[1240px] px-6">
          {/* Breadcrumbs */}
          <Reveal>
            <nav className="inline-flex items-center flex-wrap gap-2 text-[13px] font-semibold rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 border border-white/20 text-white shadow-lg mb-6">
              <Link to="/tin-tuc" className="text-white/80 transition-colors hover:text-white">
                Tin tức & Sự kiện
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/60" />
              <span className="text-white font-bold truncate max-w-[220px] sm:max-w-[400px] md:max-w-[600px]">
                {article.title}
              </span>
            </nav>
          </Reveal>

          {/* Meta Tags */}
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-3.5 mb-5 text-[13px] text-white/90">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11.5px] font-extrabold tracking-wider text-white uppercase shadow-md">
                TIN TỨC SẢN XUẤT
              </span>
              {article.publishedAt && (
                <span className="inline-flex items-center gap-1.5 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="h-3.5 w-3.5 text-red-400" />
                  {formatDate(article.publishedAt)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                3 phút đọc
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <User className="h-3.5 w-3.5 text-blue-400" />
                Thuận Lợi Brick
              </span>
            </div>
          </Reveal>

          {/* Title */}
          <Reveal delay={0.08}>
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] drop-shadow-lg mb-8 max-w-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {article.title}
            </h1>
          </Reveal>

          {/* Share Utility & Back Button */}
          <Reveal delay={0.12}>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/20 text-[13px]">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white/80">Chia sẻ bài viết:</span>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 text-[12.5px] font-semibold text-white hover:bg-white/25 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Đã sao chép link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-white" />
                      <span>Sao chép liên kết</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                to="/tin-tuc"
                className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-4 py-1.5 text-[12.5px] font-semibold text-white hover:bg-black/60 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-white" /> Tất cả tin tức
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Magazine Layout: 2-Column Grid */}
      <section className="bg-slate-50/60 py-12 md:py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left / Main Article Column (8 cols) */}
            <main className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
              <article itemscope itemtype="https://schema.org/NewsArticle">
                
                {/* Sapo / Lead Summary Box */}
                {article.summary && (
                  <Reveal delay={0.12}>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50/80 via-white to-amber-50/50 p-6 border-l-4 border-[#560213] shadow-sm mb-8">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary mb-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>Tóm tắt bài viết</span>
                      </div>
                      <div className="text-[16.5px] sm:text-[17.5px] font-bold leading-relaxed text-slate-800 space-y-3">
                        {article.summary.split(/\n\s*\n/).map((para, pIdx) => (
                          <div
                            key={pIdx}
                            className="whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: autoLinkify(para) }}
                          />
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* Top Attached Images */}
                {article.images && article.images.length > 0 && (
                  <div className="space-y-6 my-8">
                    {article.images.map((img, imgIdx) => (
                      <figure key={img.id || imgIdx} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
                        <ImageWithFallback
                          src={img.imagePath}
                          alt={img.caption || article.title}
                          className="h-auto w-full max-h-[550px] object-cover rounded-xl"
                        />
                        {img.caption && (
                          <figcaption className="mt-2.5 px-3 pb-1 text-center text-[13.5px] font-medium text-slate-600 italic">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}

                {/* Article Structured Sections */}
                {article.sections && article.sections.length > 0 ? (
                  <div className="space-y-10 my-8">
                    {article.sections.map((section, idx) => (
                      <Reveal key={section.id || idx} delay={0.15 + idx * 0.05}>
                        <div id={`section-${idx}`} className="space-y-4 pt-8 border-t border-slate-100 first:border-0 first:pt-0 scroll-mt-28">
                          {section.question && (
                            <h2 
                              className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-slate-900 tracking-tight" 
                              style={{ fontFamily: "var(--font-display)" }}
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-extrabold">
                                {idx + 1}
                              </span>
                              <span>{section.question}</span>
                            </h2>
                          )}

                          {section.answer && (
                            <div className="text-[16.5px] leading-[1.85] text-slate-800 space-y-4 font-normal">
                              {section.answer.split(/\n\s*\n/).map((para, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="whitespace-pre-line"
                                  dangerouslySetInnerHTML={{ __html: autoLinkify(para) }}
                                />
                              ))}
                            </div>
                          )}

                          {section.images && section.images.length > 0 && (
                            <div className="space-y-6 my-6">
                              {section.images.map((img, imgIdx) => (
                                <figure key={img.id || imgIdx} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
                                  <ImageWithFallback
                                    src={img.imagePath}
                                    alt={img.caption || section.question || article.title}
                                    className="h-auto w-full max-h-[580px] object-cover rounded-xl"
                                  />
                                  {img.caption && (
                                    <figcaption className="mt-2.5 px-3 pb-1 text-center text-[13.5px] font-medium text-slate-600 italic">
                                      {img.caption}
                                    </figcaption>
                                  )}
                                </figure>
                              ))}
                            </div>
                          )}
                        </div>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  article.content && (
                    <Reveal delay={0.2}>
                      <div className="prose-article space-y-5 text-[16.5px] leading-[1.85] text-slate-800">
                        {article.content.includes("<") ? (
                          <div dangerouslySetInnerHTML={{ __html: autoLinkify(article.content) }} />
                        ) : (
                          article.content.split(/\n\s*\n/).map((para, pIdx) => (
                            <div
                              key={pIdx}
                              className="whitespace-pre-line"
                              dangerouslySetInnerHTML={{ __html: autoLinkify(para) }}
                            />
                          ))
                        )}
                      </div>
                    </Reveal>
                  )
                )}

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t border-slate-200 space-y-6">
                  {/* Author Card */}
                  <div className="flex items-center gap-3.5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-extrabold text-lg shadow-sm shrink-0">
                      TL
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Biên tập: Ban Truyền Thông Thuận Lợi</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Công ty TNHH Một Thành Viên Thuận Lợi Mộc Hóa</p>
                    </div>
                  </div>
                </div>

              </article>
            </main>

            {/* Right / Sticky Sidebar Column (4 cols) */}
            <aside className="lg:col-span-4 space-y-8 sticky top-28 h-fit">

              {/* Widget 1: Other Related News (Tin tức khác) - On Top */}
              {others.length > 0 && (
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-base" style={{ fontFamily: "var(--font-display)" }}>
                      Tin tức khác
                    </h3>
                    <Link to="/tin-tuc" className="text-xs font-bold text-primary hover:underline">
                      Xem tất cả
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {others.map((n) => (
                      <Link
                        key={n.id}
                        to={`/tin-tuc/${n.slug}`}
                        className="group flex items-start gap-3 transition-colors hover:text-primary"
                      >
                        {n.thumbnailPath && (
                          <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <ImageWithFallback
                              src={n.thumbnailPath}
                              alt={n.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {n.title}
                          </h4>
                          {n.publishedAt && (
                            <span className="text-[11px] text-slate-400 mt-1 block">
                              {formatDateShort(n.publishedAt)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget 2: Table of Contents (Mục lục bài viết) */}
              {tocSections.length > 0 && (
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 font-extrabold text-slate-900 text-base mb-3 pb-3 border-b border-slate-100">
                    <List className="h-5 w-5 text-primary" />
                    <span>Mục lục bài viết</span>
                  </div>
                  <ul className="space-y-2.5 text-[13.5px]">
                    {tocSections.map((sec, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            const el = document.getElementById(`section-${idx}`);
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-start gap-2 text-slate-700 hover:text-primary transition-colors text-left font-medium cursor-pointer group"
                        >
                          <span className="font-extrabold text-primary text-xs mt-0.5 shrink-0">{idx + 1}.</span>
                          <span className="group-hover:underline line-clamp-2">{sec.question}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </aside>

          </div>
        </div>
      </section>

      {/* Related Articles Carousel / Grid at bottom */}
      {others.length > 0 && (
        <section className="bg-white py-14 md:py-20 border-t border-slate-200">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary mb-2">
                  Khám phá thêm
                </span>
                <h2 className="text-[1.5rem] md:text-[1.8rem] font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  Các tin tức liên quan
                </h2>
              </div>
              <Link
                to="/tin-tuc"
                className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-semibold text-primary hover:underline"
              >
                Xem tất cả tin tức
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.slice(0, 3).map((n) => (
                <motion.div key={n.id} variants={staggerItem}>
                  <Link
                    to={`/tin-tuc/${n.slug}`}
                    className="group flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-[0_16px_48px_rgba(86,2,19,0.08)] hover:-translate-y-1"
                  >
                    {n.thumbnailPath && (
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        <ImageWithFallback
                          src={n.thumbnailPath}
                          alt={n.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {n.publishedAt && (
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-400 mb-2">
                          <Calendar className="h-3.5 w-3.5 text-primary/70" />
                          {formatDateShort(n.publishedAt)}
                        </div>
                      )}
                      <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors text-[1.05rem]">
                        {n.title}
                      </h3>
                      {n.summary && (
                        <p className="mt-2 text-[13px] leading-relaxed text-slate-600 line-clamp-2">
                          {n.summary}
                        </p>
                      )}
                      <div className="mt-5 flex-1" />
                      <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary pt-2 border-t border-slate-100">
                        Đọc tiếp <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
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

