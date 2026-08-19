import { useState, useEffect } from "react";
import { Sun, Bot, Image as ImageIcon } from "lucide-react";
import { Stagger, staggerItem, motion } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";

const SOLAR_IMAGES = [
  "/images/nang_luong_mat_troi_1.jpg",
  "/images/nang_luong_mat_troi_2.jpg",
];

// Icon Cối Nhào Công Nghiệp (Industrial Pugmill / Mixing Vat Icon)
function PugmillIcon({ className = "h-5 w-5 text-primary" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Thùng / Cối nhào */}
      <path d="M4 7h16" />
      <path d="M5 7l1.5 10a2 2 0 0 0 2 1.7h7a2 2 0 0 0 2-1.7L19 7" />
      {/* Trục nhào & cánh khuấy bên trong cối */}
      <path d="M12 3v6" />
      <path d="M8 11.5h8" />
      <path d="M9.5 15h5" />
    </svg>
  );
}

export function TechShowcase() {
  const [solarIdx, setSolarIdx] = useState(0);

  // Auto alternate solar energy image every 10 seconds (seamless without UI overlays)
  useEffect(() => {
    const timer = setInterval(() => {
      setSolarIdx((prev) => (prev === 0 ? 1 : 0));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const technologies = [
    {
      id: "canh-tay-robot",
      icon: <Bot className="h-5 w-5 text-primary" />,
      name: "Cánh Tay Robot",
      desc: "Cánh tay robot công nghiệp tự động xếp gạch, bốc dỡ và sắp xếp sản phẩm với độ chính xác cao, loại bỏ sai sót thủ công.",
      type: "single-image",
      imageSrc: "/images/cach_tay_robot.jpg",
    },
    {
      id: "nang-luong-mat-troi",
      icon: <Sun className="h-5 w-5 text-primary" />,
      name: "Năng Lượng Mặt Trời",
      desc: "Hệ thống điện mặt trời áp mái công suất lớn vận hành toàn nhà máy, giảm phát thải carbon và tiết kiệm chi phí.",
      type: "slideshow",
    },
    {
      id: "coi-nhao",
      icon: <PugmillIcon className="h-5 w-5 text-primary" />,
      name: "Cối Nhào Hiện Đại",
      desc: "Hệ thống cối nhào luyện đất sét công nghệ cao trộn đều nguyên liệu với độ ẩm lý tưởng, đảm bảo độ nén bền vững.",
      type: "empty",
    },
  ];

  return (
    <section id="technology" className="relative bg-secondary/30 py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 h-[600px] w-[400px] -translate-y-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="absolute top-0 left-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-1/3 h-px w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Công nghệ sản xuất"
          title={
            <>
              Hệ Thống Công Nghệ
              <br />
              Hiện Đại Tại Nhà Máy
            </>
          }
          desc="Gạch Thuận Lợi đầu tư mạnh vào công nghệ sản xuất tiên tiến — từ tự động hóa dây chuyền đến năng lượng sạch — nhằm nâng cao chất lượng, tiết kiệm năng lượng và bảo vệ môi trường."
          align="center"
        />

        <Stagger className="mt-16 grid gap-8 md:grid-cols-3 max-w-[1280px] mx-auto">
          {technologies.map((tech) => (
            <motion.div
              key={tech.id}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-md transition-all duration-300 hover:border-primary/40 hover:shadow-2xl"
            >
              {/* Top Image Section - Increased height to 360px for large, crisp viewing */}
              {tech.type === "single-image" && (
                <div className="relative h-[340px] md:h-[360px] w-full overflow-hidden bg-slate-900">
                  <img
                    src={tech.imageSrc}
                    alt={tech.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30" />
                </div>
              )}

              {tech.type === "slideshow" && (
                <div className="relative h-[340px] md:h-[360px] w-full overflow-hidden bg-slate-900">
                  {/* Alternating Images with Smooth Fade every 10s */}
                  {SOLAR_IMAGES.map((src, i) => (
                    <motion.img
                      key={src}
                      src={src}
                      alt={`Năng lượng mặt trời ${i + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: i === solarIdx ? 1 : 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30" />
                </div>
              )}

              {tech.type === "empty" && (
                <div className="relative flex h-[340px] md:h-[360px] w-full flex-col items-center justify-center border-b border-dashed border-slate-200 bg-slate-50/80 p-6 text-center transition-colors group-hover:bg-primary/5">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
                    <ImageIcon className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Khu vực hình ảnh cối nhào</span>
                  <span className="mt-1 text-xs text-slate-400">(Chưa cập nhật hình ảnh)</span>
                </div>
              )}

              {/* Bottom Card Content - Compact & refined description */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                <div className="flex flex-col gap-2.5">
                  {/* Icon & Title Row */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 transition-transform duration-300 group-hover:scale-105">
                      {tech.icon}
                    </div>
                    <h3 className="text-lg font-bold leading-snug text-foreground">
                      {tech.name}
                    </h3>
                  </div>

                  {/* Description - Concise 2 lines */}
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {tech.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
