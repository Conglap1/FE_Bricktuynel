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
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={bg} alt="" className={`h-full w-full object-cover ${imagePosition}`} aria-hidden />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 w-full text-left">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-[13px] text-white/70"
        >
          <Link to="/" className="transition-colors hover:text-white">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white/90 font-medium">{crumb}</span>
        </motion.nav>

        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#C76B86]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="h-px w-6 bg-[#C76B86]" />
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-3xl text-white"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", lineHeight: 1.05, fontWeight: 800 }}
        >
          {title}
        </motion.h1>

        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80"
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















