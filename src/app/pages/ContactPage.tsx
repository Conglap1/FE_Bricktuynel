import { useState } from "react";
import { PageHeader } from "../components/site/PageHeader";
import { Contact } from "../components/site/Contact";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { useStore } from "../lib/store";
import { IMAGES } from "../lib/data";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";

function GoogleMap() {
  const { contact } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const DEFAULT_MAP_URL =
    "https://maps.google.com/maps?q=C%C3%B4ng+ty+TNHH+M%E1%BB%99t+Th%C3%A0nh+Vi%C3%AAn+Thu%E1%BA%A5n+L%E1%BB%A3i+M%E1%BB%99c+H%C3%B3a,+B%C3%ACnh+Hi%E1%BB%87p,+Ki%E1%BA%BFn+T%C6%B0%E1%BB%9Dng,+Long+An&t=&z=15&ie=UTF8&iwloc=&output=embed";

  // Tự động bóc tách URL nếu người dùng dán cả đoạn mã <iframe src="..."></iframe>
  const getEmbedUrl = (raw: string) => {
    if (!raw) return DEFAULT_MAP_URL;
    if (raw.includes("My+Phuoc") || raw.includes("Binh+Duong") || raw.includes("Ben+Cat")) {
      return DEFAULT_MAP_URL;
    }
    const match = raw.match(/src=["']([^"']+)["']/i);
    const url = (match ? match[1] : raw).trim();
    return url || DEFAULT_MAP_URL;
  };

  const mapSrc = getEmbedUrl(contact.googleMapEmbed);
  const directMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    contact.address || "Ấp Mới, Xã Bình Tân, Thị xã Kiến Tường, Tỉnh Long An"
  )}`;

  return (
    <section id="google-map-section" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.06)] bg-slate-50 min-h-[420px]">
          {/* Top Bar Overlay */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <a
              href={directMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105"
            >
              <MapPin className="h-3.5 w-3.5 text-[#810C00]" />
              <span>Mở trong Google Maps</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>
          </div>

          {/* Skeleton loading state while iframe loads */}
          {!isLoaded && mapSrc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 backdrop-blur-sm z-0">
              <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-[#810C00]" />
                <span>Đang tải bản đồ...</span>
              </div>
            </div>
          )}

          {mapSrc ? (
            <iframe
              title="Bản đồ Thuận Lợi Brick"
              src={mapSrc}
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="eager"
              onLoad={() => setIsLoaded(true)}
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[420px] items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium">
              Chưa có thông tin bản đồ
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ContactPage() {
  return (
    <>
      <PageHeader
        crumb="Liên hệ"
        eyebrow="Liên hệ & Báo giá"
        title="Bắt đầu công trình của bạn hôm nay"
        desc="Để lại thông tin, chúng tôi sẽ liên hệ tư vấn và gửi báo giá cho bạn trong thời gian sớm nhất."
        image={IMAGES.contactBanner}
        imagePosition="object-[50%_96%] scale-[1.35] sm:scale-100 sm:object-[center_92%]"
        className="!pb-36 md:!pb-52 min-h-[500px] md:min-h-[580px]"
      />
      <Contact />
      <GoogleMap />
      <LogoMarquee />
    </>
  );
}
