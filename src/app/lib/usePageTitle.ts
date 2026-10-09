import { useEffect } from "react";
import { useLocation } from "react-router";

const BRAND_NAME = "Lò Gạch Thuận Lợi";

export function formatPageTitle(pageName?: string): string {
  if (!pageName) return BRAND_NAME;
  return `${pageName} - ${BRAND_NAME}`;
}

const SITE_URL = "https://www.gachtuynelthuanloi.com";

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateOgTag(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateTwitterTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function updateCanonical(pathname: string) {
  let canonicalElement = document.getElementById("canonical-link") as HTMLLinkElement | null;
  if (!canonicalElement) {
    canonicalElement = document.querySelector('link[rel="canonical"]');
  }
  if (!canonicalElement) {
    canonicalElement = document.createElement("link");
    canonicalElement.setAttribute("rel", "canonical");
    canonicalElement.id = "canonical-link";
    document.head.appendChild(canonicalElement);
  }
  const cleanPath = pathname === "/" ? "" : pathname;
  canonicalElement.setAttribute("href", `${SITE_URL}${cleanPath}`);
}

export function applySeoMetadata({
  title,
  description,
  keywords,
  pathname,
}: {
  title: string;
  description: string;
  keywords: string;
  pathname: string;
}) {
  document.title = title;
  updateMetaTag("description", description);
  updateMetaTag("keywords", keywords);
  updateOgTag("og:title", title);
  updateOgTag("og:description", description);
  updateOgTag("og:url", `${SITE_URL}${pathname === "/" ? "" : pathname}`);
  updateTwitterTag("twitter:title", title);
  updateTwitterTag("twitter:description", description);
  updateCanonical(pathname);
}

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === "/" || pathname === "") {
      applySeoMetadata({
        title: "Lò Gạch Thuận Lợi - Gạch Tuynel Chất Lượng Cao Mộc Hóa Kiến Tường Long An",
        description: "Nhà máy Gạch Tuynel Thuận Lợi tại Mộc Hóa - Kiến Tường, Long An. Chuyên sản xuất và phân phối gạch tuynel chất lượng cao: gạch ống 4 lỗ, gạch đơmi, gạch thẻ uy tín, giá tốt cho công trình tại Long An và Tây Ninh.",
        keywords: "gạch tuynel, gạch kiến tường, gạch tây ninh, lò gạch thuận lợi, gạch mộc hóa long an, gạch ống 4 lỗ, gạch thẻ, gạch đơmi",
        pathname,
      });
      return;
    }

    if (pathname.startsWith("/admin")) {
      document.title = formatPageTitle("Admin");
      return;
    }

    if (pathname === "/gioi-thieu") {
      applySeoMetadata({
        title: "Gạch Tuynel Kiến Tường & Tây Ninh — Hơn 30 Năm Dựng Xây Niềm Tin",
        description: "Nhà máy sản xuất gạch Tuynel Thuận Lợi tại Thị xã Kiến Tường, Long An. Hơn 30 năm uy tín, chuyên cung cấp gạch ống, gạch thẻ, gạch đơmi đạt chuẩn QCVN 16:2023 cho các công trình tại Kiến Tường, Tây Ninh và miền Nam với giá gốc từ nhà máy.",
        keywords: "gạch kiến tường, gạch tây ninh, gạch tuynel kiến tường, gạch tuynel tây ninh, nhà máy gạch kiến tường, lò gạch kiến tường, lò gạch tây ninh, gạch thuận lợi mộc hóa",
        pathname,
      });
      return;
    }

    if (pathname === "/nang-luc") {
      applySeoMetadata({
        title: "Năng Lực Sản Xuất & Chứng Nhận Hợp Quy QCVN 16:2023 — Gạch Thuận Lợi",
        description: "Năng lực cung ứng hàng chục triệu viên gạch mỗi năm, hệ thống máy móc tự động hóa và chứng nhận hợp quy chuẩn Bộ Xây Dựng của Nhà máy Gạch Tuynel Thuận Lợi Kiến Tường.",
        keywords: "năng lực sản xuất gạch, chứng nhận hợp quy QCVN 16, lò gạch tuynel công suất lớn, nhà máy gạch kiến tường long an, gạch tây ninh",
        pathname,
      });
      return;
    }

    if (pathname === "/san-pham") {
      applySeoMetadata({
        title: "Sản Phẩm Gạch Tuynel Đất Sét Nung Chất Lượng Cao — Gạch Thuận Lợi",
        description: "Danh mục sản phẩm gạch Tuynel đạt chuẩn QCVN 16:2023/BXD: gạch ống 4 lỗ, gạch đơmi, gạch thẻ chịu nén cao. Báo giá trực tiếp tận xưởng cho nhà thầu và đại lý tại Long An, Tây Ninh.",
        keywords: "gạch tuynel, gạch ống 4 lỗ, gạch đơmi, gạch thẻ, giá gạch xây dựng, gạch tuynel kiến tường, gạch tây ninh, bảng giá gạch tuynel",
        pathname,
      });
      return;
    }

    if (pathname.startsWith("/san-pham/")) {
      // Sub-route handled by ProductDetailPage
      updateCanonical(pathname);
      return;
    }

    if (pathname === "/quy-trinh") {
      applySeoMetadata({
        title: "Quy Trình Sản Xuất Gạch Tuynel Khép Kín 1.050°C — Gạch Thuận Lợi",
        description: "Khám phá quy trình công nghệ sản xuất gạch tuynel tự động hoá bằng robot và lò nung tuynel khép kín tại nhà máy Thuận Lợi. Cam kết độ chín đồng đều và cường độ chịu nén vượt trội.",
        keywords: "quy trình sản xuất gạch tuynel, lò nung tuynel, công nghệ sản xuất gạch, robot xếp gạch, tiêu chuẩn gạch đất sét nung",
        pathname,
      });
      return;
    }

    if (pathname === "/du-an" || pathname.startsWith("/du-an/")) {
      applySeoMetadata({
        title: "Dự Án Tiêu Biểu & Công Trình Sử Dụng Gạch Tuynel Thuận Lợi",
        description: "Tổng hợp các dự án khu dân cư, công trình dân dụng và hạ tầng trọng điểm tin tưởng sử dụng gạch Tuynel Thuận Lợi tại Long An, Tây Ninh, TP.HCM và Đồng bằng Sông Cửu Long.",
        keywords: "dự án sử dụng gạch tuynel, công trình xây dựng long an, vật liệu xây dựng tây ninh, gạch thuận lợi kiến tường",
        pathname,
      });
      return;
    }

    if (pathname === "/tin-tuc") {
      applySeoMetadata({
        title: "Tin Tức Ngành Xây Dựng & Cẩm Nang Sử Dụng Gạch — Gạch Thuận Lợi",
        description: "Cập nhật tin tức thị trường vật liệu xây dựng, hướng dẫn kỹ thuật thi công và cẩm nang lựa chọn gạch tuynel chất lượng cho công trình của bạn.",
        keywords: "tin tức vật liệu xây dựng, kinh nghiệm chọn gạch xây nhà, tiêu chuẩn gạch tuynel, thị trường gạch miền nam",
        pathname,
      });
      return;
    }

    if (pathname.startsWith("/tin-tuc/")) {
      // Sub-route handled by NewsDetailPage
      updateCanonical(pathname);
      return;
    }

    if (pathname === "/lien-he") {
      applySeoMetadata({
        title: "Liên Hệ Báo Giá Gạch Tuynel Trực Tiếp Nhà Máy — Gạch Thuận Lợi",
        description: "Liên hệ ngay với Nhà máy Gạch Tuynel Thuận Lợi tại Thị xã Kiến Tường để nhận báo giá sỉ tốt nhất và hỗ trợ giao hàng tận chân công trình tại Long An, Tây Ninh và miền Nam.",
        keywords: "liên hệ lò gạch thuận lợi, báo giá gạch tuynel, mua gạch kiến tường, mua gạch tây ninh, số điện thoại lò gạch thuận lợi",
        pathname,
      });
      return;
    }

    document.title = formatPageTitle("Không Tìm Thấy Trang");
    updateCanonical(pathname);
  }, [location.pathname]);
}
