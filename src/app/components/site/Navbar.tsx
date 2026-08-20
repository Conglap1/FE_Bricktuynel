import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { motion } from "../../lib/motion";
import { useStore } from "../../lib/store";

const LINKS = [
  { label: "Trang chủ", to: "/" },
  { label: "Giới thiệu", to: "/gioi-thieu" },
  { label: "Năng lực & Thành Tựu", to: "/nang-luc" },
  { label: "Sản phẩm", to: "/san-pham" },
  { label: "Quy trình", to: "/quy-trinh" },
  { label: "Dự án", to: "/du-an" },
  { label: "Tin tức", to: "/tin-tuc" },
  { label: "Liên hệ", to: "/lien-he" },
];

export function Navbar() {
  const { contact } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const light = isHome && !scrolled;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        light
          ? "bg-transparent"
          : "bg-white/90 backdrop-blur-xl border-b border-border shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
      }`}
    >
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-2.5">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo/logo-ngang.png"
            alt="Thuận Lợi Brick"
            className="h-12 w-auto object-contain transition-all duration-500"
            style={light ? { filter: "brightness(0) invert(1)" } : undefined}
          />
        </Link>

        {/* Nav links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `group relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-all duration-300 ${
                    light
                      ? isActive
                        ? "text-white font-semibold"
                        : "text-white/85 hover:text-white"
                      : isActive
                      ? "text-primary font-semibold"
                      : "text-foreground/80 hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Hover capsule background backdrop */}
                    <span
                      className={`pointer-events-none absolute inset-0 rounded-full transition-all duration-300 ${
                        light
                          ? "bg-white/0 group-hover:bg-white/10"
                          : "bg-primary/0 group-hover:bg-primary/[0.06]"
                      }`}
                    />

                    {/* Nav label with micro-float animation */}
                    <span className="relative z-10 inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
                      {l.label}
                    </span>

                    {/* Bottom capsule glow line with spring center expansion */}
                    <span
                      className={`pointer-events-none absolute bottom-0 left-1/2 h-[2.5px] -translate-x-1/2 rounded-full transition-all duration-300 origin-center ${
                        isActive
                          ? "w-[calc(100%-1.25rem)] opacity-100 scale-x-100"
                          : "w-[calc(100%-1.25rem)] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                      } ${
                        light
                          ? "bg-gradient-to-r from-amber-200/90 via-white to-amber-200/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                          : "bg-primary shadow-[0_1.5px_6px_rgba(129,12,0,0.25)]"
                      }`}
                      style={{
                        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      {/* Luminous center highlight dot ONLY in light/dark hero mode */}
                      {light && (
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_4px_#fff]" />
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Phone CTA */}
        <div className="hidden items-center lg:flex">
          <a
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className={`group relative flex items-center gap-3 overflow-hidden rounded-full border px-5 py-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
              light
                ? "border-white/40 bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:bg-white/20 hover:border-white/70 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                : "border-primary/25 bg-white text-foreground shadow-[0_2px_12px_rgba(129,12,0,0.08)] hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(129,12,0,0.18)]"
            }`}
          >
            {/* Metallic shimmer sweep effect */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer" />

            {/* Icon wrapper with animated pulsing ring */}
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span
                className={`absolute inset-0 rounded-full animate-pulse-ring ${
                  light ? "bg-white/40" : "bg-primary/30"
                }`}
              />
              <span
                className={`relative grid h-8 w-8 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
                  light ? "bg-white text-primary shadow-sm" : "bg-primary text-white shadow-md shadow-primary/30"
                }`}
              >
                <Phone className="h-4 w-4 animate-phone-ring" strokeWidth={2.5} />
              </span>
            </span>

            <div className="flex flex-col leading-none">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  light ? "text-white/80" : "text-primary"
                }`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400 opacity-75" style={{ willChange: "transform, opacity" }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Tư vấn trực tiếp
              </span>
              <span
                className={`mt-0.5 text-[16px] font-extrabold tracking-tight transition-colors ${
                  light ? "text-white group-hover:text-amber-200" : "text-foreground group-hover:text-primary"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {contact.phone}
              </span>
            </div>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={`grid h-10 w-10 place-items-center rounded-md lg:hidden ${light ? "text-white" : "text-foreground"}`}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl lg:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-[15px] font-medium ${
                    isActive ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {/* Phone in mobile */}
            <a
              href={`tel:${(contact.phone || "").replace(/\s/g, '')}`}
              className="relative mt-3 flex items-center justify-center gap-3 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-5 py-3 shadow-sm active:scale-95 transition-all"
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
                <span className="relative grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-sm">
                  <Phone className="h-3.5 w-3.5 animate-phone-ring" strokeWidth={2.5} />
                </span>
              </span>
              <span className="text-[17px] font-extrabold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                {contact.phone}
              </span>
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
