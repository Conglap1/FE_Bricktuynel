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
import { PageHeader } from "../components/site/PageHeader";
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
    image: IMAGES.clayBrick,
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

      {/* Standard Page Header Banner */}
      <PageHeader
        crumb="Chi tiết bài viết"
        parentCrumb="Tin tức & Sự kiện"
        parentLink="/tin-tuc"
        eyebrow="Tin tức"
        title={article.title}
        image={article.thumbnailPath || IMAGES.newsBanner}
      />

      {/* Main Magazine Layout: 2-Column Grid */}
      <section className="bg-slate-50/60 py-12 md:py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left / Main Article Column (8 cols) */}
            <main className="lg:col-span-8 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
              {/* Top Utility Bar (Back link & Share button) */}
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100 text-xs font-semibold">
                <Link
                  to="/tin-tuc"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Quay lại danh sách tin tức
                </Link>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Đã sao chép link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Chia sẻ bài viết</span>
                    </>
                  )}
                </button>
              </div>

              <article itemscope itemtype="https://schema.org/NewsArticle">
                
                {/* Sapo / Lead Summary Box */}
                {article.summary && (
                  <Reveal delay={0.12}>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50/80 via-white to-amber-50/50 p-6 border-l-4 border-[#810C00] shadow-sm mb-8">
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

                {/* Mobile Table of Contents */}
                {tocSections.length > 0 && (
                  <div className="lg:hidden rounded-2xl border border-slate-200/90 bg-slate-50/80 p-5 mb-8 shadow-sm">
                    <div className="flex items-center gap-2.5 font-extrabold text-slate-900 text-base mb-3 pb-2.5 border-b border-slate-200">
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

                {/* Article Footer: Publication Date */}
                {article.publishedAt && (
                  <div className="mt-10 pt-6 border-t border-slate-200 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Đăng ngày {formatDate(article.publishedAt)}</span>
                  </div>
                )}

              </article>
            </main>

            {/* Right / Sticky Sidebar Column (Desktop only: 4 cols) */}
            <aside className="hidden lg:block lg:col-span-4 space-y-8 sticky top-28 h-fit">

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

