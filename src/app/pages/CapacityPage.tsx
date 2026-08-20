import { PageHeader } from "../components/site/PageHeader";
import { IMAGES } from "../lib/data";
import { Awards } from "../components/site/Awards";
import { Certificates } from "../components/site/Certificates";
import { TechShowcase } from "../components/site/TechShowcase";
import { CTABand } from "../components/site/CTABand";
import { MediaShowcase } from "../components/site/MediaShowcase";
import { LogoMarquee } from "../components/site/LogoMarquee";

export function CapacityPage() {
  return (
    <>
      <PageHeader
        crumb="Năng lực & Thành Tựu"
        eyebrow="Năng lực & Thành Tựu"
        title="Năng Lực & Thành Tựu"
        desc="Giấy khen, chứng nhận ISO và hệ thống công nghệ sản xuất hiện đại — minh chứng cho cam kết chất lượng của CTTNHH 1TV Thuận Lợi Mộc Hóa."
        image={IMAGES.aboutBanner}
      />
      {/* 0. Video phóng sự nhà đài */}
      <MediaShowcase />
      {/* 1. Giấy khen & Bằng khen */}
      <Awards />
      {/* 2. Chứng nhận ISO & Giấy tờ kiểm định */}
      <Certificates />
      {/* 3. Công nghệ sản xuất hiện đại */}
      <TechShowcase />
      {/* 4. CTA liên hệ */}
      <LogoMarquee />
      <CTABand />
    </>
  );
}
