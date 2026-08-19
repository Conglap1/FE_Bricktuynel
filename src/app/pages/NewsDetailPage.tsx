import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ArrowRight, Calendar, Share2, Check } from "lucide-react";
import { useStore } from "../lib/store";
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
  const { news } = useStore();
  const [copied, setCopied] = useState(false);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const activeNews = news.filter((n) => n.isActive);
  const article = activeNews.find((n) => n.slug === slug);
  const others = activeNews.filter((n) => n.slug !== slug).slice(0, 6);

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
        <Link to="/tin-tuc" className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Quay lại tin tức
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero image */}
      <div className="relative h-[56vh] min-h-[340px] w-full overflow-hidden bg-secondary">
        {article.thumbnailPath && (
          <ImageWithFallback
            src={article.thumbnailPath}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[840px] px-6 pb-10">
          {article.publishedAt && (
            <Reveal>
              <div className="flex items-center gap-2 text-[13px] font-medium text-white/70 mb-4">
                <Calendar className="h-4 w-4" />
                {formatDate(article.publishedAt)}
              </div>
            </Reveal>
          )}
          <Reveal delay={0.06}>
            <h1 className="text-white" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 800, lineHeight: 1.15, fontFamily: "var(--font-display)" }}>
              {article.title}
            </h1>
          </Reveal>
        </div>
      </div>

      {/* Article body */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-[840px] px-6">
          <Reveal>
            <Link to="/tin-tuc" className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Tất cả tin tức
            </Link>
          </Reveal>

          {/* Summary / lead */}
          {article.summary && (
            <Reveal delay={0.08}>
              <p className="mb-8 text-[18px] font-medium leading-relaxed text-foreground border-l-4 border-primary pl-5 py-1">
                {article.summary}
              </p>
            </Reveal>
          )}

          {/* Article content */}
          <Reveal delay={0.14}>
            <div 
              className="prose-like space-y-5 text-[16px] leading-[1.85] text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </Reveal>

          {/* Share */}
          <Reveal delay={0.22}>
            <div className="mt-12 flex items-center gap-3 border-t border-border pt-8">
              <span className="text-[13px] text-muted-foreground">Chia sẻ:</span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">Đã sao chép link!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-primary" />
                    <span>Chia sẻ bài viết</span>
                  </>
                )}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom Section: Expanded Related Articles */}
      {others.length > 0 && (
        <section className="bg-secondary/40 py-14 md:py-20 border-t border-border">
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

