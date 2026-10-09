import { PageHeader } from "../components/site/PageHeader";
import { IMAGES } from "../lib/data";
import { About } from "../components/site/About";
import { BrandStory } from "../components/site/BrandStory";
import { VisionMissionCore } from "../components/site/VisionMissionCore";

import { AboutPartnersShowcase } from "../components/site/AboutPartnersShowcase";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
export function AboutPage() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.gachtuynelthuanloi.com/#localbusiness",
    "name": "Nhà Máy Gạch Tuynel Thuận Lợi - Gạch Kiến Tường, Gạch Tây Ninh",
    "alternateName": ["Gạch Kiến Tường", "Gạch Tây Ninh", "Lò Gạch Thuận Lợi Kiến Tường", "Gạch Tuynel Thuận Lợi"],
    "description": "Nhà máy sản xuất gạch Tuynel Thuận Lợi tại Thị xã Kiến Tường, Long An. Chuyên phân phối gạch tuynel chất lượng cao, giá gốc xưởng cho các công trình tại Kiến Tường, Tây Ninh và khu vực phía Nam.",
    "url": "https://www.gachtuynelthuanloi.com/gioi-thieu",
    "logo": "https://www.gachtuynelthuanloi.com/images/logo/logo-ngang.png",
    "image": "https://www.gachtuynelthuanloi.com/images/about/factory.jpg",
    "telephone": "0918 701 472",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ấp Mới, Xã Bình Tân",
      "addressLocality": "Thị xã Kiến Tường",
      "addressRegion": "Long An",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.825688,
      "longitude": 105.919937
    },
    "areaServed": [
      {
        "@type": "AdministrativeArea",
        "name": "Thị xã Kiến Tường"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Tây Ninh"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Long An"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Mộc Hóa"
      }
    ],
    "priceRange": "$$",
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Gạch Tuynel Kiến Tường"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Gạch Tuynel Tây Ninh"
        }
      }
    ]
  };

  return (
    <>
      {/* Schema.org LocalBusiness JSON-LD for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <PageHeader
        crumb="Giới thiệu"
        eyebrow="Nhà Máy Gạch Tuynel Thuận Lợi"
        title="Gạch Tuynel Kiến Tường & Tây Ninh — Hơn 30 Năm Dựng Xây Niềm Tin"
        desc="Nhà máy sản xuất gạch Tuynel Thuận Lợi tại Thị xã Kiến Tường (Long An), chuyên sản xuất và phân phối gạch ống, gạch thẻ, gạch đơmi chất lượng cao cho các công trình tại Kiến Tường, Tây Ninh và miền Nam với giá trực tiếp từ xưởng."
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

