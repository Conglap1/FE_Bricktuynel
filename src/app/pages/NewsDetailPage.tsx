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
      "name": "Công ty TNHH Gạch Thuận Lợi"
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

      {/* Top Breadcrumbs navigation bar */}
      <div className="bg-secondary/20 border-b border-border/30 py-3.5">
        <div className="mx-auto max-w-[1240px] px-6">
          <nav className="flex items-center flex-wrap gap-2 text-[13px] text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link to="/tin-tuc" className="hover:text-primary transition-colors">Tin tức & Sự kiện</Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-foreground font-semibold truncate max-w-[280px] sm:max-w-[450px] md:max-w-[600px]">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Text-First Editorial Header */}
      <header className="bg-white pt-10 pb-8 border-b border-slate-100">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="max-w-[900px]">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3.5 mb-4">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[12px] font-bold text-primary tracking-wide uppercase">
                  TIN TỨC
                </span>
                {article.publishedAt && (
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {formatDate(article.publishedAt)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  3 phút đọc
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Tác giả: Thuận Lợi Brick
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 
                className="text-foreground text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.25] mb-6" 
                style={{ fontFamily: "var(--font-display)" }}
              >
                {article.title}
              </h1>
            </Reveal>

            {/* Share Utility Bar */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 border-y border-border/40 text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-muted-foreground">Chia sẻ bài viết:</span>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 px-3.5 py-1.5 text-[12.5px] font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Đã sao chép link!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 text-primary" />
                        <span>Sao chép liên kết</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <Link to="/tin-tuc" className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold">
                    <ArrowLeft className="h-4 w-4" /> Tất cả tin tức
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* Main Content Layout with 2 Columns (Main Article + Sidebar) */}
      <section className="bg-white py-10 md:py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid gap-12 lg:grid-cols-12">

            {/* Left Column: Main Article Body (8 cols) */}
            <main className="lg:col-span-8">
              <article itemscope itemtype="https://schema.org/NewsArticle">
                
                {/* Sapo / Lead Summary */}
                {article.summary && (
                  <Reveal delay={0.12}>
                    <div className="mb-8 rounded-2xl bg-secondary/25 p-6 border-l-4 border-primary shadow-sm">
                      <p className="text-[17px] sm:text-[18px] font-semibold leading-relaxed text-foreground">
                        {article.summary}
                      </p>
                    </div>
                  </Reveal>
                )}

                {/* Main Article Image */}
                {article.thumbnailPath && (
                  <Reveal delay={0.16}>
                    <div className="my-8 overflow-hidden rounded-2xl border border-border/60 bg-slate-50/80 p-2 shadow-sm">
                      <ImageWithFallback
                        src={article.thumbnailPath}
                        alt={article.title}
                        className="h-auto w-full max-h-[520px] object-cover rounded-xl"
                      />
                    </div>
                  </Reveal>
                )}

                {/* Main Text Content */}
                <Reveal delay={0.2}>
                  <div 
                    className="prose-article space-y-6 text-[16.5px] leading-[1.85] text-slate-800"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </Reveal>
              </article>
            </main>

            {/* Right Column: SEO Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Consultation Hotline Card */}
              <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-white via-secondary/10 to-secondary/30 p-6 shadow-sm">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">Tư vấn kỹ thuật & Báo giá</span>
                <h3 className="mt-1 text-lg font-bold text-foreground">Bạn cần tư vấn loại gạch phù hợp?</h3>
                <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                  Đội ngũ kỹ sư Thuận Lợi luôn sẵn sàng tư vấn quy cách, số lượng và báo giá cạnh tranh trực tiếp tại nhà máy cho công trình của bạn.
                </p>

                <div className="mt-5 space-y-3">
                  <a 
                    href={`tel:${contact.hotline || contact.phone || '0908555888'}`} 
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-primary/90 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4" /> Hotline: {contact.hotline || contact.phone || '0908 555 888'}
                  </a>
                  <a 
                    href={`https://zalo.me/${contact.zalo || '0908555888'}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-blue-600" /> Chat Zalo tư vấn
                  </a>
                </div>
              </div>

              {/* Related News List Widget */}
              {others.length > 0 && (
                <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-foreground border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" /> Tin cùng chuyên mục
                  </h3>
                  <div className="space-y-4">
                    {others.slice(0, 5).map((item) => (
                      <Link 
                        key={item.id} 
                        to={`/tin-tuc/${item.slug}`} 
                        className="group flex gap-3 items-start pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        {item.thumbnailPath && (
                          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
                            <ImageWithFallback 
                              src={item.thumbnailPath} 
                              alt={item.title} 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[13px] font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          {item.publishedAt && (
                            <span className="mt-1 block text-[11px] text-muted-foreground">
                              {formatDateShort(item.publishedAt)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info Badge */}
              <div className="rounded-2xl border border-border/60 bg-slate-50/70 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-foreground text-sm">Gạch Tuynel Thuận Lợi</h4>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Hơn 30 năm sản xuất & cung cấp gạch đất sét nung Tuynel chất lượng cao cho hàng ngàn dự án phía Nam.
                </p>
              </div>

            </aside>
          </div>
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
