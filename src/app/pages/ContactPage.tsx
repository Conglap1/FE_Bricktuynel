import { PageHeader } from "../components/site/PageHeader";
import { Contact } from "../components/site/Contact";
import { PartnersSection } from "../components/site/PartnersSection";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { useStore } from "../lib/store";
import { IMAGES } from "../lib/data";

function GoogleMap() {
  const { contact } = useStore();
  
  // Tự động bóc tách URL nếu người dùng dán cả đoạn mã <iframe src="..."></iframe>
  const getEmbedUrl = (raw: string) => {
    if (!raw) return "";
    const match = raw.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : raw.trim();
  };

  const mapSrc = getEmbedUrl(contact.googleMapEmbed);

  return (
    <section id="google-map-section" className="bg-white">
      <div className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="overflow-hidden rounded-3xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          {mapSrc ? (
            <iframe
              title="Bản đồ Thuận Lợi Brick"
              src={mapSrc}
              width="100%"
              height="420"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
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
        desc="Để lại thông tin, Thuận Lợi sẽ liên hệ tư vấn và gửi báo giá cho bạn trong thời gian sớm nhất."
        image={IMAGES.contactBanner}
        imagePosition="object-[center_92%]"
        className="!pb-36 md:!pb-52 min-h-[500px] md:min-h-[580px]"
      />
      <Contact />
      <GoogleMap />
      <LogoMarquee />
    </>
  );
}
