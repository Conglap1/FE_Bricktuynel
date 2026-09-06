import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion, Stagger, staggerItem } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SectionHeading } from "./SectionHeading";
import { useStore, stripHtml } from "../../lib/store";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

import { NewsCardSkeleton } from "../ui/LoadingState";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

export function News() {
  const { news: NEWS, isLoading } = useStore();
  const visible = NEWS.filter((n) => n.isActive);

  return (
    <section id="news" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading eyebrow="Tin tức & Sự kiện" title={<>Cập nhật mới nhất<br />từ Thuận Lợi</>} />
          <Link to="/tin-tuc" className="group hidden shrink-0 items-center gap-2 text-[14px] font-semibold text-primary md:inline-flex">
            Xem tất cả
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-14">
            <NewsCardSkeleton count={3} />
          </div>
        ) : (
          <Stagger className="mt-14 grid gap-6 md:grid-cols-3">
          {visible.map((n) => (
            <motion.div key={n.id} variants={staggerItem}>
            <Link
              to={`/tin-tuc/${n.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[0_18px_50px_rgba(0,0,0,0.07)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <ImageWithFallback
                  src={n.thumbnailPath}
                  alt={n.title}
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                {n.publishedAt && (
                  <span className="text-[12px] font-medium text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                    {formatDate(n.publishedAt)}
                  </span>
                )}
                <h3 className="mt-2 text-foreground transition-colors group-hover:text-primary" style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.3 }}>
                  {n.title}
                </h3>
                {n.summary && (
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
                    {stripHtml(n.summary)}
                  </p>
                )}
                <div className="flex-1" />
                <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-primary">
                  Đọc tiếp
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
            </motion.div>
          ))}
        </Stagger>
        )}
      </div>
    </section>
  );
}
