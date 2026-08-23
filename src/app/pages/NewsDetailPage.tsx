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
  ChevronRight
} from "lucide-react";
import { useStore, getImageUrl } from "../lib/store";
import { IMAGES } from "../lib/data";
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
        let iconSvg = `<svg class="w-3.5 h-3.5 inline-block shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;

        try {
          const parsed = new URL(cleanUrl);
          const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
          if (host.includes("youtube.com") || host.includes("youtu.be")) {
            label = "YouTube";
            iconSvg = `<svg class="w-4 h-4 inline-block text-red-600 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
          } else if (host.includes("facebook.com") || host.includes("fb.watch")) {
            label = "Facebook";
            iconSvg = `<svg class="w-4 h-4 inline-block text-blue-600 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
          } else if (host.includes("tiktok.com")) {
            label = "TikTok";
            iconSvg = `<svg class="w-4 h-4 inline-block text-slate-900 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12.525 0h3.08c.012.633.064 1.258.283 1.868.228.636.598 1.228 1.08 1.71.49.49 1.08.85 1.714 1.08.61.22 1.235.27 1.868.28v3.13a7.84 7.84 0 0 1-5.01-1.78v7.66a6.83 6.83 0 0 1-1.32 4.14 6.87 6.87 0 0 1-3.69 2.51 6.82 6.82 0 0 1-4.45-.36 6.84 6.84 0 0 1-3.26-3.08 6.82 6.82 0 0 1-.58-4.32c.32-1.45 1.1-2.73 2.22-3.64A6.8 6.8 0 0 1 7.42 12c.76 0 1.5.15 2.19.43v3.2a3.63 3.63 0 0 0-1.89-.52 3.65 3.65 0 0 0-2.58 1.06 3.64 3.64 0 0 0-1.06 2.58c0 .97.38 1.89 1.06 2.58a3.64 3.64 0 0 0 2.58 1.06c.97 0 1.89-.38 2.58-1.06a3.64 3.64 0 0 0 1.06-2.58V0z"/></svg>`;
          } else if (host.includes("zalo.me")) {
            label = "Zalo";
            iconSvg = `<svg class="w-4 h-4 inline-block text-blue-500 shrink-0 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.12-1.31A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>`;
          } else {
            label = host;
          }
        } catch {
          label = "Liên kết";
        }

        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 font-semibold text-[#810C00] hover:text-[#560213] underline underline-offset-2 transition-colors cursor-pointer" title="${cleanUrl}">${iconSvg}<span>${label}</span></a>${trailing}`;
      });
    })
    .join("");
}

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { news, contact } = useStore();
  const [copied, setCopied] = useState(false);

  const activeNews = news.filter((n) => n.isActive);
  const article = activeNews.find((n) => n.slug === slug);
  const others = activeNews.filter((n) => n.slug !== slug).slice(0, 6);

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

  // Generate Schema.org JSON-LD for NewsArticle SEO
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

  return (
    <>
      {/* Inject SEO JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Hero Banner using Article Thumbnail */}
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

        <div className="relative mx-auto max-w-[920px] px-6">
          {/* Breadcrumbs navigation pill */}
          <Reveal>
            <nav className="inline-flex items-center flex-wrap gap-2 text-[13px] font-semibold rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 border border-white/20 text-white shadow-lg mb-6">
              <Link to="/tin-tuc" className="text-white/80 transition-colors hover:text-white">
                Tin tức & Sự kiện
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/60" />
              <span className="text-white font-bold truncate max-w-[200px] sm:max-w-[380px] md:max-w-[500px]">
                {article.title}
              </span>
            </nav>
          </Reveal>

          {/* Meta Information Tags */}
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-3.5 mb-5 text-[13px] text-white/90">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[11.5px] font-extrabold tracking-wider text-white uppercase shadow-md">
                TIN TỨC
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

          {/* Article Title */}
          <Reveal delay={0.08}>
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] drop-shadow-lg mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {article.title}
            </h1>
          </Reveal>

          {/* Share Utility & Back Button Bar */}
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

      {/* Main Content Layout - Centered Single Reader Column */}
      <section className="bg-white py-10 md:py-16">
        <div className="mx-auto max-w-[920px] px-6">
          <main>
            <article itemscope itemtype="https://schema.org/NewsArticle">
              
              {/* Sapo / Lead Summary */}
              {article.summary && (
                <Reveal delay={0.12}>
                  <div className="mb-8 rounded-2xl bg-secondary/25 p-6 border-l-4 border-primary shadow-sm">
                    <div className="text-[17px] sm:text-[18px] font-semibold leading-relaxed text-foreground space-y-3">
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

              {/* Main Article Top Images (if any attached directly to article) */}
              {article.images && article.images.length > 0 && (
                <div className="space-y-6 my-8">
                  {article.images.map((img, imgIdx) => (
                    <figure key={img.id || imgIdx} className="overflow-hidden rounded-2xl border border-border/60 bg-slate-50 p-2 shadow-sm">
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

              {/* Structured Sections (Question + Answer + Section Images with Captions) */}
              {article.sections && article.sections.length > 0 ? (
                <div className="space-y-10 my-8">
                  {article.sections.map((section, idx) => (
                    <Reveal key={section.id || idx} delay={0.15 + idx * 0.05}>
                      <div className="space-y-4 pt-6 border-t border-slate-100 first:border-0 first:pt-0">
                        {section.question && (
                          <h2 
                            className="text-xl sm:text-2xl font-bold text-foreground tracking-tight" 
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {section.question}
                          </h2>
                        )}

                        {section.answer && (
                          <div className="text-[16.5px] leading-[1.85] text-slate-800 space-y-4">
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
                              <figure key={img.id || imgIdx} className="overflow-hidden rounded-2xl border border-border/60 bg-slate-50 p-2 shadow-sm">
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

            </article>
          </main>
        </div>
      </section>


      {/* Bottom Section: Expanded Related Articles */}
      {others.length > 0 && (
        <section className="bg-secondary/30 py-14 md:py-20 border-t border-border">
          <div className="mx-auto max-w-[1240px] px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary mb-2">
                  Khám phá thêm
                </span>
                <h2 className="text-[1.5rem] md:text-[1.8rem] font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  Các tin tức khác bạn có thể quan tâm
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
              {others.map((n) => (
                <motion.div key={n.id} variants={staggerItem}>
                  <Link
                    to={`/tin-tuc/${n.slug}`}
                    className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                  >
                    {n.thumbnailPath && (
                      <div className="aspect-[16/10] overflow-hidden bg-secondary">
                        <ImageWithFallback
                          src={n.thumbnailPath}
                          alt={n.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {n.publishedAt && (
                        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-2">
                          <Calendar className="h-3.5 w-3.5 text-primary/70" />
                          {formatDateShort(n.publishedAt)}
                        </div>
                      )}
                      <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors" style={{ fontSize: "1.05rem" }}>
                        {n.title}
                      </h3>
                      {n.summary && (
                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                          {n.summary}
                        </p>
                      )}
                      <div className="mt-5 flex-1" />
                      <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary pt-2 border-t border-border/50">
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
