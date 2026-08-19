import { useState } from "react";
import { Trophy, ZoomIn, X } from "lucide-react";
import { Reveal, Stagger, staggerItem, motion } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";

export type AwardCardItem = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  badgeText: string;
  image: string;
};

const AWARDS: AwardCardItem[] = [
  {
    id: "bang-khen-ubnd-2020",
    title: "Bằng Khen Doanh Nghiệp Xuất Sắc",
    issuer: "Ủy Ban Nhân Dân Tỉnh Long An",
    year: "2020",
    badgeText: "BẰNG KHEN",
    image: "/images/bang_khen_cong_ty.jpg",
  },
];

export function Awards() {
  const [activeItem, setActiveItem] = useState<AwardCardItem | null>(null);

  return (
    <section id="awards" className="relative bg-white py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Thành tích & Ghi nhận"
          title={<>Giấy Khen &amp; Bằng Khen<br />Của Công Ty</>}
          desc="Những ghi nhận từ cơ quan nhà nước, khẳng định chất lượng sản xuất và đóng góp tích cực của Gạch Thuận Lợi cho cộng đồng."
          align="center"
        />

        <Stagger className="mt-16 flex justify-center">
          {AWARDS.map((award) => (
            <motion.div
              key={award.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-4 shadow-sm transition-all duration-300 hover:border-amber-400/60 hover:shadow-xl w-full max-w-2xl"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-1.5 mb-2.5">
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 font-mono truncate">
                  <Trophy className="h-3 w-3 shrink-0" />
                  {award.badgeText}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                  Năm {award.year}
                </span>
              </div>

              {/* Ảnh bằng khen — nằm ngang */}
              <div
                onClick={() => setActiveItem(award)}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-neutral-100 cursor-pointer group-hover:border-amber-400/50 transition-colors flex items-center justify-center"
              >
                <img
                  src={award.image}
                  alt={award.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white backdrop-blur-[2px]">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm shadow-md">
                    <ZoomIn className="h-3.5 w-3.5" /> Phóng to
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <h3 className="mt-3.5 text-foreground leading-snug font-bold text-[14px] line-clamp-2">
                {award.title}
              </h3>
              <div className="mt-2 text-[11px] text-muted-foreground">
                <div className="line-clamp-1">{award.issuer}</div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>

      {/* ── LIGHTBOX XEM ẢNH TOÀN MÀN HÌNH ── */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-secondary/40">
              <div className="flex items-center gap-2.5">
                <Trophy className="h-5 w-5 text-amber-500" />
                <div>
                  <span className="font-bold text-foreground text-[15px] block leading-tight">
                    {activeItem.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {activeItem.issuer} · Năm {activeItem.year}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image Content */}
            <div className="overflow-auto p-4 bg-neutral-900 flex items-center justify-center" style={{ maxHeight: "78vh" }}>
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[72vh] w-auto object-contain rounded bg-white p-2 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
