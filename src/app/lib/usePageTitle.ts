import { useEffect } from "react";
import { useLocation } from "react-router";

const BRAND_NAME = "Lò Gạch Thuận Lợi";

export function formatPageTitle(pageName?: string): string {
  if (!pageName) return BRAND_NAME;
  return `${pageName} - ${BRAND_NAME}`;
}

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === "/" || pathname === "") {
      document.title = BRAND_NAME;
      return;
    }

    if (pathname.startsWith("/admin")) {
      document.title = formatPageTitle("Admin");
      return;
    }

    if (pathname === "/gioi-thieu") {
      document.title = formatPageTitle("Giới Thiệu");
      return;
    }

    if (pathname === "/nang-luc") {
      document.title = formatPageTitle("Năng Lực & Thành Tựu");
      return;
    }

    if (pathname === "/san-pham") {
      document.title = formatPageTitle("Sản Phẩm");
      return;
    }

    if (pathname.startsWith("/san-pham/")) {
      document.title = formatPageTitle("Chi Tiết Sản Phẩm");
      return;
    }

    if (pathname === "/quy-trinh") {
      document.title = formatPageTitle("Quy Trình");
      return;
    }

    if (pathname === "/du-an") {
      document.title = formatPageTitle("Dự Án");
      return;
    }

    if (pathname.startsWith("/du-an/")) {
      document.title = formatPageTitle("Chi Tiết Dự Án");
      return;
    }

    if (pathname === "/tin-tuc") {
      document.title = formatPageTitle("Tin Tức");
      return;
    }

    if (pathname.startsWith("/tin-tuc/")) {
      document.title = formatPageTitle("Chi Tiết Tin Tức");
      return;
    }

    if (pathname === "/lien-he") {
      document.title = formatPageTitle("Liên Hệ");
      return;
    }

    document.title = formatPageTitle("Không Tìm Thấy Trang");
  }, [location.pathname]);
}
