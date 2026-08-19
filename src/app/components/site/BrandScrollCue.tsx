import React from "react";
import { motion } from "../../lib/motion";

interface BrandScrollCueProps {
  className?: string;
  showText?: boolean;
}

export function BrandScrollCue({
  className = "",
  showText = true,
}: BrandScrollCueProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 z-20 pointer-events-none ${className}`}
    >
      {showText && (
        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow-md">
          CUỘN XUỐNG
        </span>
      )}

      {/* Biểu tượng Pattern trắng png nhỏ nhắn tinh tế ở chân Banner */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="rotate-0 flex items-center justify-center overflow-hidden"
      >
        <img
          src="/images/logo/pattern-trang.png"
          alt="Biểu tượng cuộn xuống thương hiệu"
          className="h-3 md:h-4 w-auto max-w-[120px] object-contain drop-shadow-md opacity-85"
        />
      </motion.div>
    </motion.div>
  );
}





