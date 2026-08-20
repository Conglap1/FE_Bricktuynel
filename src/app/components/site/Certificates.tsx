import { useState } from "react";
import { ShieldCheck, ZoomIn, X, FileText, Download, ExternalLink, FileCheck2, Eye } from "lucide-react";
import { Reveal, Stagger, staggerItem, motion } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export type CertificateCardItem = {
  id: string;
  title: string;
  code: string;
  issuer: string;
  badgeText: string;
  image: string;
  pages?: string[];
  pdfUrl: string;
  fileName: string;
};

const REAL_CERTIFICATES: CertificateCardItem[] = [
  {
    id: "iso-9001",
    title: "Giấy Chứng nhận ISO 9001:2015",
    code: "Số: ISO 9001:2015 / VICB",
    issuer: "Tổ chức Chứng nhận Quốc tế VICB",
    badgeText: "CHỨNG NHẬN ISO",
    image: "/images/giayto/iso_page-1.png",
    pdfUrl: "/images/giayto/iso.pdf",
    fileName: "Giấy chứng nhận ISO 9001 (PDF)",
  },
  {
    id: "qcvn-16",
    title: "Giấy Chứng nhận Hợp Quy QCVN 16:2023/BXD",
    code: "Số: QCVN 16:2023 / BXD",
    issuer: "Viện Vật Liệu Xây Dựng - Bộ Xây Dựng",
    badgeText: "HỢP QUY BXD",
    image: "/images/giayto/qcvn_page-1.png",
    pdfUrl: "/images/giayto/qcvn.pdf",
    fileName: "Giấy chứng nhận Hợp Quy QCVN 16 (PDF)",
  },
  {
    id: "cbhq-01-2025",
    title: "Bản Công Bố Hợp Quy Gạch Đất Sét Nung",
    code: "Số: 01/2025/CBHQ-TLMH",
    issuer: "Công ty TNHH Một Thành Viên Thuận Lợi Mộc Hóa",
    badgeText: "CÔNG BỐ HỢP QUY",
    image: "/images/giayto/cbhq_page-1.png",
    pages: ["/images/giayto/cbhq_page-1.png", "/images/giayto/cbhq_page-2.png"],
    pdfUrl: "/images/giayto/cbhq.pdf",
    fileName: "Bản Công bố Hợp Quy (PDF)",
  },
  {
    id: "quatest-3",
    title: "Phiếu Kết Quả Thử Nghiệm Quatest 3",
    code: "Số: KT3-2024 / QUATEST 3",
    issuer: "Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng 3",
    badgeText: "QUATEST 3 KIỂM ĐỊNH",
    image: "/images/giayto/quatest_page-1.png",
    pages: ["/images/giayto/quatest_page-1.png", "/images/giayto/quatest_page2-2.png"],
    pdfUrl: "/images/giayto/quatest3.pdf",
    fileName: "Phiếu thử nghiệm Quatest 3 (PDF)",
  },
  {
    id: "ck-kq-40x80x180",
    title: "Cam Kết & Kết Quả Thử Nghiệm Gạch 40x80x180mm",
    code: "Số: CK-KQ 40x80x180mm / BXD",
    issuer: "Trung tâm Thử nghiệm Vật liệu Xây dựng",
    badgeText: "KẾT QUẢ GẠCH 4x8x18",
    image: "/images/giayto/ck_kq_40x80x180_page-1.png",
    pdfUrl: "/images/giayto/ck_kq_40x80x180.pdf",
    fileName: "Kết quả thử nghiệm Gạch 40x80x180mm (PDF)",
  },
  {
    id: "ck-kq-80x80x180",
    title: "Cam Kết & Kết Quả Thử Nghiệm Gạch 80x80x180mm",
    code: "Số: CK-KQ 80x80x180mm / BXD",
    issuer: "Trung tâm Thử nghiệm Vật liệu Xây dựng",
    badgeText: "KẾT QUẢ GẠCH 8x8x18",
    image: "/images/giayto/ck_kq_80x80x180_page-1.png",
    pdfUrl: "/images/giayto/ck_kq_80x80x180.pdf",
    fileName: "Kết quả thử nghiệm Gạch 80x80x180mm (PDF)",
  },
];

export function Certificates() {
  const [activeItem, setActiveItem] = useState<CertificateCardItem | null>(null);

  return (
    <section id="certificates" className="relative bg-secondary/40 py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Giấy tờ ISO & Chứng nhận thực tế"
          title={<><span className="inline-block whitespace-nowrap">Giấy Chứng Nhận ISO &amp;</span> <span className="inline-block whitespace-nowrap">Kết Quả Kiểm Định</span></>}
          desc="Bản scan giấy chứng nhận hệ thống quản lý ISO 9001:2015, hợp quy QCVN 16:2023/BXD, Quatest 3 và kết quả thử nghiệm chất lượng gạch xây thực tế."
          align="center"
        />

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REAL_CERTIFICATES.map((cert) => (
            <motion.div
              key={cert.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary font-mono truncate">
                    <ShieldCheck className="h-3 w-3 shrink-0" />
                    {cert.badgeText}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                    <FileText className="h-2.5 w-2.5" />
                    PDF Gốc
                  </span>
                </div>

                {/* Khung Ảnh Scan Giấy Chứng Nhận Thực Tế */}
                <div
                  onClick={() => setActiveItem(cert)}
                  className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-neutral-100 p-2 cursor-pointer group-hover:border-primary/40 transition-colors flex items-center justify-center"
                >
                  <ImageWithFallback
                    src={cert.image}
                    alt={cert.title}
                    className="h-full w-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-3 backdrop-blur-[2px]">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm shadow-md">
                      <ZoomIn className="h-3.5 w-3.5" /> Phóng to
                    </div>
                    <a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-white shadow-md hover:bg-primary/90 transition-colors"
                    >
                      <Eye className="h-3 w-3" /> Xem PDF
                    </a>
                  </div>
                </div>

                {/* Title & Info */}
                <h3 className="mt-3.5 text-foreground leading-snug font-bold text-[14px] line-clamp-2" title={cert.title}>
                  {cert.title}
                </h3>

                <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                  <div className="font-mono text-primary font-semibold truncate">{cert.code}</div>
                  <div className="line-clamp-1">{cert.issuer}</div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-3.5 pt-2.5 border-t border-border flex items-center justify-between gap-1 text-[11px]">
                <a
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline truncate"
                >
                  <FileText className="h-3 w-3 shrink-0" /> Xem tệp PDF
                </a>
                <a
                  href={cert.pdfUrl}
                  download
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium shrink-0"
                  title="Tải về file PDF"
                >
                  <Download className="h-3 w-3" /> Tải
                </a>
              </div>
            </motion.div>
          ))}
        </Stagger>

      </div>

      {/* ── LIGHTBOX XEM ẢNH SCAN TOÀN MÀN HÌNH ── */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-secondary/40">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-bold text-foreground text-[15px] block leading-tight">{activeItem.title}</span>
                  <span className="text-[11px] font-mono text-primary font-semibold">{activeItem.code}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image Content (Bản Scan Thật) */}
            <div className="max-h-[75vh] overflow-auto p-4 bg-neutral-900 flex flex-col items-center gap-4">
              {(activeItem.pages || [activeItem.image]).map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`${activeItem.title} - Trang ${idx + 1}`}
                  className="max-h-[70vh] w-auto object-contain rounded bg-white p-2 shadow-lg"
                />
              ))}
            </div>

            {/* Footer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 bg-white text-xs">
              <div className="text-muted-foreground font-medium">
                Cơ quan cấp: <span className="text-foreground font-semibold">{activeItem.issuer}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeItem.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-primary" /> Mở Tệp PDF Gốc
                </a>
                <a
                  href={activeItem.pdfUrl}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Tải PDF Về Máy
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}




