import { Facebook, ArrowUp, MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";
import { Link } from "react-router";
import { IMAGES } from "../../lib/data";
import { useStore } from "../../lib/store";

function ZaloIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.86 7.18L4.5 22l4.23-1.69c1.02.28 2.11.44 3.27.44 5.52 0 10-4.03 10-9s-4.48-9-10-9zm3.85 12.75h-5.2c-.41 0-.68-.45-.45-.81l4.03-6.69H9.85c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5.2c.41 0 .68.45.45.81l-4.03 6.69h4.4c.41 0 .75.34.75.75s-.34.75-.75.75z" />
    </svg>
  );
}

function TiktokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.16 8.16 0 0 0 4.76 1.51V7.11a4.84 4.84 0 0 1-.85-.42z"/>
    </svg>
  );
}

const COMPANY_LINKS = [
  { label: "Giới thiệu công ty", to: "/gioi-thieu" },
  { label: "Quy trình sản xuất lò Tuynel", to: "/quy-trinh" },
  { label: "Dự án tiêu biểu", to: "/du-an" },
  { label: "Tin tức & Sự kiện", to: "/tin-tuc" },
  { label: "Liên hệ & Báo giá", to: "/lien-he" },
];

export function Footer() {
  const { contact } = useStore();

  const zaloUrl = contact.zalo
    ? contact.zalo.startsWith("http")
      ? contact.zalo
      : `https://zalo.me/${contact.zalo.replace(/\s+/g, "")}`
    : "#";

  const facebookUrl = contact.facebook || "#";
  const tiktokUrl = contact.tiktok || "#";

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: facebookUrl },
    { icon: ZaloIcon, label: "Zalo", href: zaloUrl },
    { icon: TiktokIcon, label: "TikTok", href: tiktokUrl },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#560213] text-white/70">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={IMAGES.footerBg} alt="" className="h-full w-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1.4fr_1fr]">
          {/* Column 1: Brand & Social */}
          <div>
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo/logo-ngang.png"
                alt="Thuận Lợi Brick"
                className="h-12 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/70">
              Nhà sản xuất gạch đất sét nung Tuynel uy tín từ năm 1988. Nền móng vững chắc cho mọi công trình Việt.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white transition-all hover:scale-105 hover:border-white/40 hover:bg-white/20 shadow-sm"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-[#C76B86]" />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Detailed Company Information */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-inner transition-all hover:border-white/20">
            <h4 className="flex items-center gap-2.5 text-white" style={{ fontSize: "1rem", fontWeight: 700 }}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#C76B86]/20 text-[#C76B86]">
                <Building2 className="h-4 w-4" />
              </span>
              {contact.companyName || "CTTNHH 1TV Thuận Lợi Mộc Hóa"}
            </h4>
            <ul className="mt-5 space-y-3.5 text-[14px]">
              {contact.address && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <strong className="text-white/90">Địa chỉ nhà máy:</strong> {contact.address}
                  </span>
                </li>
              )}
              {(contact.hotline || contact.phone) && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-white/80">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <strong className="text-white/90">Hotline / Kinh doanh:</strong>{" "}
                    <a href={`tel:${(contact.hotline || "").replace(/\s/g, "")}`} className="font-semibold text-white hover:text-[#C76B86] transition-colors">
                      {contact.hotline ? `${contact.hotline}` : ""}
                    </a>{" "}
                    {contact.phone ? `(${contact.phone})` : ""}
                  </span>
                </li>
              )}
              {contact.email && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-white/80">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <strong className="text-white/90">Email liên hệ:</strong>{" "}
                    <a href={`mailto:${contact.email}`} className="text-white/90 hover:text-[#C76B86] transition-colors">
                      {contact.email}
                    </a>
                  </span>
                </li>
              )}
              {contact.workingHours && (
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/10 text-white/80">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <strong className="text-white/90">Giờ làm việc:</strong> {contact.workingHours}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              Về chúng tôi
            </h4>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[14px] transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[13px] text-white/50">
            © 2026 {contact.companyName || "CTTNHH 1TV Thuận Lợi Mộc Hóa"}. Bảo lưu mọi quyền.{" "}
            <Link to="/admin" className="text-white/15 transition-colors hover:text-white/40" tabIndex={-1} aria-hidden>
              ·
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
