import { Link } from "react-router";
import { Calendar, ArrowRight } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { CTABand } from "../components/site/CTABand";
import { PartnersSection } from "../components/site/PartnersSection";
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
  const visible = news.filter((n) => n.isActive).sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
  );

  const [featured, ...rest] = visible;

  return (
    <>
      <PageHeader
        crumb="Tin tức"
        eyebrow="Tin tức & Sự kiện"
        title="Cập nhật mới nhất từ Thuận Lợi"
        desc="Thông tin về hoạt động sản xuất, sản phẩm mới và các chứng nhận chất lượng của công ty."
        image={IMAGES.newsBanner}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1240px] px-6">

          {/* Featured article */}
          {featured && (
            <Reveal>
              <Link
                to={`/tin-tuc/${featured.slug}`}
                className="group mb-14 flex gap-8 flex-col overflow-hidden rounded-3xl border border-border bg-secondary/30 transition-shadow hover:shadow-[0_24px_64px_rgba(0,0,0,0.08)] lg:flex-row"
              >
                {featured.thumbnailPath && (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-secondary lg:aspect-auto lg:w-[44%] lg:shrink-0">
                    <ImageWithFallback
                      src={featured.thumbnailPath}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center p-8 lg:pr-10">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-primary">
                    Tin mới nhất
                  </span>
                  {featured.publishedAt && (
                    <div className="mt-3 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <Calendar className="h-4 w-4" />{formatDate(featured.publishedAt)}
                    </div>
                  )}
                  <h2 className="mt-3 text-foreground" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)", fontWeight: 800, lineHeight: 1.2, fontFamily: "var(--font-display)" }}>
                    {featured.title}
                  </h2>
                  {featured.summary && (
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground line-clamp-3">{featured.summary}</p>
                  )}
                  <div className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
                    Đọc bài viết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((n) => (
                <motion.div key={n.id} variants={staggerItem}>
                  <Link
                    to={`/tin-tuc/${n.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                  >
                    {n.thumbnailPath && (
                      <div className="aspect-[16/9] overflow-hidden bg-secondary">
                        <ImageWithFallback
                          src={n.thumbnailPath}
                          alt={n.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {n.publishedAt && (
                        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />{formatDate(n.publishedAt)}
                        </div>
                      )}
                      <h3 className="mt-2 font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors" style={{ fontSize: "1.05rem" }}>
                        {n.title}
                      </h3>
                      {n.summary && (
                        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">{n.summary}</p>
                      )}
                      <div className="mt-4 flex-1" />
                      <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                        Đọc tiếp <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </Stagger>
          )}

          {visible.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">Chưa có bài viết nào.</p>
          )}
        </div>
      </section>

      <LogoMarquee />
      <CTABand />
    </>
  );
}
