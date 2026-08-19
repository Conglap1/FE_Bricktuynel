import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { motion, Reveal } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useStore, type ProcessStep } from "../../lib/store";

function ProcessStepItem({ s, i }: { s: ProcessStep; i: number }) {
  const left = i % 2 === 0;

  // Extra delay for Step 1 (Giai đoạn 01) on page load so page finish rendering first
  const baseDelay = i === 0 ? 0.5 : 0;
  const textDuration = 1.2;
  const imageDelay = baseDelay + textDuration; // Image ONLY starts AFTER text side finishes!

  // 1. Red Pattern Graphic Runner: Glides from outer web edge into center timeline node
  const patternRunnerVariants = {
    hidden: {
      opacity: 0,
      x: left ? "-120%" : "120%",
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: textDuration,
        delay: baseDelay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // 2. Text Content Wipe Reveal: Unveils progressively in sync with the arrow glide
  const cardWipeVariants = {
    hidden: {
      opacity: 0,
      clipPath: left ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0 0% 0 0%)",
      transition: {
        duration: textDuration,
        delay: baseDelay,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  // 3. Image Card Reveal: STRICTLY starts ONLY after the text side completes!
  const imageCardVariants = {
    hidden: {
      opacity: 0,
      x: 0,
      clipPath: left ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
    },
    visible: {
      opacity: 1,
      x: 0,
      clipPath: "inset(0 0% 0 0%)",
      transition: {
        duration: 0.95,
        delay: imageDelay, // STRICTLY after text side finishes!
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="relative md:grid md:grid-cols-2 md:items-center gap-2 md:gap-4 lg:gap-6"
    >
      {/* Glowing Node in center */}
      <div className="absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center justify-center">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-[#810C00] shadow-lg ring-4 ring-[#FAF5EF]">
          <span className="h-3.5 w-3.5 rounded-full bg-[#810C00] animate-pulse" />
        </span>
      </div>

      {/* ── Text Section Container ── */}
      <div className={`relative ${left ? "md:order-1" : "md:order-2"}`}>
        <div className={`flex items-center gap-0.5 md:gap-1 ${left ? "flex-row" : "flex-row-reverse"}`}>

          {/* 1. WHITE TEXT CARD (Pull sát rạt vào mũi tên pattern đỏ) */}
          <motion.div
            variants={cardWipeVariants}
            className={`group relative flex-1 overflow-hidden rounded-3xl border border-[#810C00]/15 bg-white/95 p-6 md:p-8 backdrop-blur-xl shadow-xl shadow-[#810C00]/5 transition-all duration-500 hover:border-[#810C00]/35 hover:shadow-2xl hover:shadow-[#810C00]/12 ${
              left ? "text-right -mr-4 md:-mr-6" : "text-left -ml-4 md:-ml-6"
            }`}
          >
            {/* Watermark Step Number */}
            <motion.span
              variants={textItemVariants}
              className={`pointer-events-none absolute -bottom-6 font-black tracking-tighter text-[#810C00]/[0.05] transition-all duration-500 group-hover:text-[#810C00]/[0.12] ${
                left ? "left-4" : "right-4"
              }`}
              style={{ fontFamily: "var(--font-display)", fontSize: "7.5rem", lineHeight: 1 }}
            >
              {s.step}
            </motion.span>

            {/* Step Badge */}
            <motion.div
              variants={textItemVariants}
              className={`relative z-10 flex items-center gap-3 ${left ? "justify-end" : ""}`}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#810C00]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#810C00] border border-[#810C00]/20 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#810C00] animate-ping" />
                Giai đoạn {s.step}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              variants={textItemVariants}
              className="relative z-10 mt-4 text-[#3B020D] transition-colors duration-300 group-hover:text-[#810C00]"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontWeight: 700, lineHeight: 1.3 }}
            >
              {s.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              variants={textItemVariants}
              className="relative z-10 mt-3 text-[14.5px] leading-relaxed text-[#560213]/80 font-normal"
            >
              {s.desc}
            </motion.p>
          </motion.div>

          {/* 2. RED PATTERN ARROW (Kéo chạm sát vào nút tròn trung tâm) */}
          <motion.div
            variants={patternRunnerVariants}
            className={`shrink-0 flex items-center justify-center z-20 ${
              left ? "-mr-5 md:-mr-7" : "-ml-5 md:-ml-7"
            }`}
          >
            <img
              src="/images/logo/pattern-do.png"
              alt="Pattern Đỏ Chỉ Nhọn"
              className={`w-[80px] sm:w-[95px] md:w-[115px] h-auto object-contain filter drop-shadow-[0_4px_16px_rgba(129,12,0,0.35)] transition-transform duration-500 ${
                left ? "-rotate-90" : "rotate-90"
              }`}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Image Card (Tự động mở từ tâm ra cạnh ngoài CHỈ KHI phần nội dung chữ chạy xong) ── */}
      <div className={left ? "md:order-2" : "md:order-1"}>
        <motion.div
          variants={imageCardVariants}
          className="group relative mt-5 md:mt-0 overflow-hidden rounded-3xl border border-[#810C00]/15 bg-white p-2.5 shadow-xl transition-all duration-500 hover:border-[#810C00]/40 hover:shadow-2xl hover:shadow-[#810C00]/15"
        >
          <div className="overflow-hidden rounded-2xl relative">
            <ImageWithFallback
              src={s.image}
              alt={s.title}
              className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Process() {
  const { process: PROCESS } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.7"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF5EF] to-[#F5ECE4] py-24 md:py-36">
      {/* ── 1. Warm Soft Ambient Glows (Light Mode) ── */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#C76B86]/12 via-[#810C00]/5 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-[#810C00]/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 h-[600px] w-[600px] rounded-full bg-[#C76B86]/10 blur-[120px]" />

      {/* ── 2. Architectural Grid Blueprint Pattern (Light) ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(129, 12, 0, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(129, 12, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── 3. Flowing Heat-Wave Lines (Terracotta Vector Art) ── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1200 1600"
      >
        <defs>
          <linearGradient id="terraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#810C00" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#C76B86" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <path
          d="M-100 200 C300 400, 900 100, 1300 500 C1700 900, 200 1200, 1300 1500"
          fill="none"
          stroke="url(#terraGradient)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
        />
        <path
          d="M-200 600 C500 200, 700 1000, 1400 800"
          fill="none"
          stroke="url(#terraGradient)"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── 4. Decorative Floating Glass Elements ── */}
      <div className="pointer-events-none absolute top-24 right-12 hidden lg:block h-32 w-32 rotate-45 rounded-3xl border border-[#810C00]/10 bg-white/40 backdrop-blur-md shadow-xl opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute bottom-32 left-12 hidden lg:block h-40 w-40 -rotate-12 rounded-full border border-[#C76B86]/15 bg-gradient-to-tr from-[#810C00]/10 to-transparent backdrop-blur-md shadow-xl opacity-50" />

      {/* ── 5. Main Content ── */}
      <div className="relative mx-auto max-w-[1240px] px-6">
        <div ref={ref} className="relative">
          {/* Timeline Center Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-[#810C00]/15 md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-[#810C00] via-[#C76B86] to-[#D4AF37] shadow-[0_0_12px_rgba(129,12,0,0.4)]"
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {PROCESS.map((s, i) => (
              <ProcessStepItem key={s.step} s={s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

