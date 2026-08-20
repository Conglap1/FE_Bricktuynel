import { useState } from "react";
import { Trophy, ZoomIn, X } from "lucide-react";
import { Stagger, staggerItem, motion } from "../../lib/motion";
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
    badgeText: "BẰNG KHEN UBND",
    image: "/images/bang_khen_cong_ty.jpg",
  },
  {
    id: "giay-khen-cuc-thue-2018",
    title: "Giấy Khen Hoàn Thành Tốt Nghĩa Vụ Nộp Thuế",
    issuer: "Cục Trưởng Cục Thuế Tỉnh Long An",
    year: "2018",
    badgeText: "GIẤY KHEN CỤC THUẾ",
    image: "/images/bang_khen_thue_2018.jpg",
  },
  {
    id: "san-pham-tieu-bieu-2011",
    title: "Chứng Nhận Sản Phẩm Công Nghiệp Nông Thôn Tiêu Biểu",
    issuer: "Ủy Ban Nhân Dân Huyện Mộc Hóa",
    year: "2011",
    badgeText: "SẢN PHẨM TIÊU BIỂU",
    image: "/images/bang_khen_2011.jpg",
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

        <Stagger className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {AWARDS.map((award) => (
            <motion.div
              key={award.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-400/60 hover:shadow-xl w-full"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400/15 px-3 py-1 text-[12px] font-bold text-amber-800 font-mono truncate">
                    <Trophy className="h-4 w-4 shrink-0 text-amber-600" />
                    {award.badgeText}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                    Năm {award.year}
                  </span>
                </div>

                {/* Ảnh bằng khen — nằm ngang kích thước lớn */}
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
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/80 px-4 py-2 text-[13px] font-semibold backdrop-blur-sm shadow-md">
                      <ZoomIn className="h-4 w-4" /> Phóng to toàn màn hình
                    </div>
                  </div>
                </div>

                {/* Title & Info */}
                <h3 className="mt-5 text-foreground leading-snug font-bold text-[17px]">
                  {award.title}
                </h3>
                <div className="mt-2 text-[13px] text-muted-foreground font-medium">
                  <div>{award.issuer}</div>
                </div>
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
            className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/40">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-amber-500" />
                <div>
                  <span className="font-bold text-foreground text-[16px] block leading-tight">
                    {activeItem.title}
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {activeItem.issuer} · Năm {activeItem.year}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image Content */}
            <div className="overflow-auto p-4 bg-neutral-900 flex items-center justify-center" style={{ maxHeight: "80vh" }}>
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[76vh] w-auto object-contain rounded bg-white p-2 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


