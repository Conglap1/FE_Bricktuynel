import { useEffect, useState } from "react";
import { ArrowUp, Facebook, Phone, Mail } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { motion } from "../../lib/motion";
import { useStore } from "../../lib/store";

function ZaloIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <img src="/images/zalo.png" alt="Zalo" className={`${className} object-contain rounded-full bg-white p-0.5`} />
  );
}

function TiktokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.16 8.16 0 0 0 4.76 1.51V7.11a4.84 4.84 0 0 1-.85-.42z"/>
    </svg>
  );
}

export function FloatingWidget() {
  const { contact } = useStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const phoneNum = contact.hotline || contact.phone || "0908 555 888";
  const telUrl = `tel:${phoneNum.replace(/\s+/g, "")}`;

  const zaloUrl = contact.zalo
    ? contact.zalo.startsWith("http")
      ? contact.zalo
      : `https://zalo.me/${contact.zalo.replace(/\s+/g, "")}`
    : "https://zalo.me";

  const facebookUrl = contact.facebook || "https://facebook.com";
  const tiktokUrl = contact.tiktok || "https://tiktok.com";
  const emailUrl = contact.email ? `mailto:${contact.email}` : "mailto:kinhdoanh@gachthuanloi.vn";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-none">
      {/* Floating social contact stack */}
      <div className="flex flex-col gap-2.5 pointer-events-auto items-end">
        {/* Phone Button */}
        <a
          href={telUrl}
          title={`Gọi điện: ${phoneNum}`}
          aria-label={`Gọi điện: ${phoneNum}`}
          className="group relative flex h-11 items-center justify-center rounded-full bg-[#16A34A] px-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#15803D] hover:shadow-xl"
        >
          <Phone className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[140px] group-hover:opacity-100">
            {phoneNum}
          </span>
        </a>

        {/* Zalo Button */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Zalo"
          aria-label="Chat Zalo"
          className="group relative flex h-11 items-center justify-center rounded-full bg-[#0068FF] px-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#0052cc] hover:shadow-xl"
        >
          <ZaloIcon className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100">
            Zalo
          </span>
        </a>

        {/* Facebook Button */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          aria-label="Facebook"
          className="group relative flex h-11 items-center justify-center rounded-full bg-[#1877F2] px-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#1464c9] hover:shadow-xl"
        >
          <Facebook className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100">
            Facebook
          </span>
        </a>

        {/* TikTok Button */}
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
          aria-label="TikTok"
          className="group relative flex h-11 items-center justify-center rounded-full bg-black px-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-800 hover:shadow-xl border border-white/20"
        >
          <TiktokIcon className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100">
            TikTok
          </span>
        </a>

        {/* Email Button */}
        <a
          href={emailUrl}
          title="Gửi Email liên hệ"
          aria-label="Gửi Email liên hệ"
          className="group relative flex h-11 items-center justify-center rounded-full bg-[#EA4335] px-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#D93025] hover:shadow-xl"
        >
          <Mail className="h-5 w-5 shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[160px] group-hover:opacity-100">
            {contact.email || "Gửi Email"}
          </span>
        </a>
      </div>

      {/* Floating Scroll To Top Button (Arrow icon) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={scrollToTop}
            title="Lên đầu trang"
            aria-label="Lên đầu trang"
            className="group pointer-events-auto relative flex h-11 items-center justify-center rounded-full border border-white/30 bg-[#560213]/90 px-3 text-white backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#72031a] hover:border-white/60 active:scale-95"
          >
            <ArrowUp className="h-5 w-5 shrink-0" />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[100px] group-hover:opacity-100">
              Lên đầu trang
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
