import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "../../lib/motion";
import { IMAGES } from "../../lib/data";
import { BrandScrollCue } from "./BrandScrollCue";

export function PageHeader({
  eyebrow,
  title,
  desc,
  crumb,
  image,
  imagePosition = "object-center",
  className = "",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  crumb: string;
  image?: string;
  imagePosition?: string;
  className?: string;
}) {
  const bg = image ?? IMAGES.heroWall;

  return (
    <section className={`relative overflow-hidden bg-[#560213] pb-20 pt-32 md:pb-24 md:pt-36 ${className}`}>
      {/* Background image & Strong Dark Overlay */}
      <div className="absolute inset-0">
        <img src={bg} alt="" className={`h-full w-full object-cover ${imagePosition}`} aria-hidden />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#560213]/90 via-black/50 to-black/75" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 w-full text-left">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[13px] font-semibold"
        >
          <Link to="/" className="text-white/80 transition-colors hover:text-amber-400">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-amber-400/80" />
          <span className="rounded-md bg-white/10 backdrop-blur-md px-2.5 py-1 text-white border border-white/15 drop-shadow-sm font-medium">
            {crumb}
          </span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-amber-500/15 border border-amber-400/35 px-4 py-1.5 backdrop-blur-md shadow-md"
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span
            className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-amber-300 drop-shadow-sm"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {eyebrow || "CTTNHH 1TV THUẬN LỢI MỘC HÓA"}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-3xl text-white font-extrabold drop-shadow-md"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", lineHeight: 1.08, fontWeight: 800 }}
        >
          {title}
        </motion.h1>

        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/95 drop-shadow-sm"
          >
            {desc}
          </motion.p>
        )}
      </div>

      {/* Brand Scroll Down Cue */}
      <BrandScrollCue />
    </section>
  );
}















