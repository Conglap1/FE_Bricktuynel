import { useState, useEffect } from "react";
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
  parentCrumb,
  parentLink,
  image,
  imagePosition = "object-center",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  desc?: string;
  crumb: string;
  parentCrumb?: string;
  parentLink?: string;
  image?: string;
  imagePosition?: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState<string>(image || IMAGES.newsBanner);

  useEffect(() => {
    setImgSrc(image || IMAGES.newsBanner);
  }, [image]);

  return (
    <section className={`relative overflow-hidden bg-[#560213] pb-20 pt-32 md:pb-24 md:pt-36 ${className}`}>
      {/* Background image & Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          alt=""
          className={`h-full w-full object-cover ${imagePosition}`}
          onError={() => setImgSrc(IMAGES.newsBanner)}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 w-full text-left">
        {/* Nổi bật thanh breadcrumb trên cùng */}
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-[13px] font-semibold rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 border border-white/20 text-white shadow-lg"
        >
          {parentCrumb ? (
            <>
              {parentLink ? (
                <Link to={parentLink} className="text-white/80 transition-colors hover:text-white">
                  {parentCrumb}
                </Link>
              ) : (
                <span className="text-white/80">{parentCrumb}</span>
              )}
              <ChevronRight className="h-3.5 w-3.5 text-white/60" />
              <span className="text-white font-bold">{crumb}</span>
            </>
          ) : (
            <span className="text-white font-bold">{crumb}</span>
          )}
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-3xl text-white font-extrabold drop-shadow-md"
          style={{ fontSize: "clamp(1.75rem, 5vw, 3.6rem)", lineHeight: 1.08, fontWeight: 800 }}
        >
          {title}
        </motion.h1>

        {desc && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/90 drop-shadow-sm"
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















