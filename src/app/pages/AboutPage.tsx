import { PageHeader } from "../components/site/PageHeader";
import { IMAGES } from "../lib/data";
import { About } from "../components/site/About";
import { BrandStory } from "../components/site/BrandStory";
import { VisionMissionCore } from "../components/site/VisionMissionCore";

import { AboutPartnersShowcase } from "../components/site/AboutPartnersShowcase";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";

export function AboutPage() {
  return (
    <>
      <PageHeader
        crumb="Giới thiệu"
        eyebrow="Về Thuận Lợi"
        title="Hơn hai mươi năm dựng xây niềm tin"
        desc="Câu chuyện, giá trị và năng lực sản xuất gạch Tuynel đằng sau thương hiệu Gạch Thuận Lợi từ năm 1988."
        image={IMAGES.aboutBanner}
      />
      {/* 1. Khúc đầu (Giữ nguyên) */}
      <About />
      {/* 2. Slogan & Câu chuyện thương hiệu */}
      <BrandStory />
      {/* 3. Bộ ba Tầm nhìn - Sứ mệnh - Giá trị cốt lõi */}
      <VisionMissionCore />
      {/* 4. Đối tác & Liên minh xây dựng chiến lược (WOW Showcase) */}
      <AboutPartnersShowcase />
      {/* 6. Banner kêu gọi liên hệ */}
      <LogoMarquee />
      <CTABand />
    </>
  );
}

