import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Factory, Award, Layers, BadgeCheck } from "lucide-react";
import { motion, MagneticButton, Counter } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { IMAGES } from "../../lib/data";
import { BrandScrollCue } from "./BrandScrollCue";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[#560213]">
      {/* Parallax background image */}
      <motion.div style={{ y: yBack, scale, willChange: "transform" }} className="absolute inset-0">
        <ImageWithFallback
          src={IMAGES.heroClayBricks}
          alt="Kho gạch đất sét nung xếp pallet tại nhà máy Thuận Lợi"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: yFront, opacity: fade }}
        className="relative mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-center px-6 pt-28 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-6 inline-flex w-fit self-start items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C76B86]" />
          <span className="text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/90 whitespace-nowrap">
            Nhà sản xuất gạch Tuynel · Từ 1988
          </span>
        </motion.div>

        <h1
          className="max-w-4xl text-white"
          style={{ fontSize: "clamp(1.85rem, 5.5vw, 5.2rem)", lineHeight: 1.12, fontWeight: 800 }}
        >
          <span className="inline-block whitespace-nowrap">Nền móng vững chắc</span>{" "}
          <br className="hidden sm:block" />
          <span className="inline-block whitespace-nowrap">
            cho{" "}
            <span className="bg-gradient-to-r from-[#C76B86] to-[#e8a0b4] bg-clip-text text-transparent">
              mọi công trình
            </span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-white/75"
        >
          Chuyên sản xuất gạch đất sét nung Tuynel đạt chuẩn QCVN — cung ứng
          hàng triệu viên mỗi tháng cho các công trình dân dụng và công nghiệp
          trên toàn quốc.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            to="/san-pham"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
          >
            Khám phá sản phẩm
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton
            to="/lien-he"
            strength={0.25}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/15"
          >
            Nhận tư vấn & báo giá
          </MagneticButton>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {[
            { icon: Factory, val: <Counter to={30} suffix="+" />, label: "Năm kinh nghiệm" },
            { icon: ShieldCheck, val: <Counter to={1200} suffix="+" />, label: "Công trình cung ứng" },
            { icon: Award, val: <Counter to={2} suffix=" triệu" />, label: "Viên gạch / tháng" },
            { icon: BadgeCheck, val: <Counter to={100} suffix="%" />, label: "Đạt chuẩn xuất xưởng" },
          ].map((s, i) => (
            <div key={i}>
              <s.icon className="mb-2 h-5 w-5 text-[#C76B86]" strokeWidth={2} />
              <div className="text-white" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, lineHeight: 1 }}>
                {s.val}
              </div>
              <div className="mt-1.5 text-[13px] text-white/60">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Brand Scroll Down Cue (White Pattern rotated 180 deg) */}
      <BrandScrollCue />
    </section>
  );
}










