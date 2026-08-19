/* Centralised content + imagery for THUẬN LỢI BRICK showcase site.
   ──────────────────────────────────────────────────────────────
   Static / hardcoded images  → /images/...  (served from public/)
   Dynamic data (products, projects, news, partners) → 100% từ API! */

const u = (id: string, w = 1200, h = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

/* ── STATIC IMAGES (hardcoded UI backgrounds) ──────────────── */
export const IMAGES = {
  /* Hero / Banner backgrounds */
  heroClayBricks: "/images/home_page.jpg",
  heroWall: "/images/about.jpg",
  aboutBanner: "/images/about.jpg",
  contactBanner: "/images/hero_lienhe.jpg",
  newsBanner: "/images/hero_tintuc.jpg",
  footerBg: "/images/footer.jpg",
  ctaBannerBg: "/images/hero_cta_footer.jpg",

  /* About section */
  aboutFactory: "/images/gioithieu_anhlon.jpg",
  aboutStack: "/images/gioithieu_anhnho.jpg",
  brandStoryImage: "/images/cauchuyen.jpg",
  visionImage: "/images/tam_nhin.jpg",
  missionImage: "/images/su_menh.jpg",

  /* Product categories (hardcoded thumbnails) */
  clayBrick: u("1768410800604-059f273fa57e", 900, 700),
  concreteBlock: u("1565626424178-c699f6601afd", 900, 700),
  aacBlock: u("1657007508392-d68322544f70", 900, 700),
  paverBrick: u("1520758594221-872948699332", 900, 700),

  /* Process step images (real factory photos) */
  procStep01: "/images/quy_trinh/B1 Nguyên liệu.jpg",
  procStep02: "/images/quy_trinh/B2 Ủ sử lý độ ẩm.jpg",
  procStep03: "/images/quy_trinh/B3 Nhào trộn.jpg",
  procStep04: "/images/quy_trinh/B4.2 Ép đùn.jpg",
  procStep05: "/images/quy_trinh/B5.1 Cắt gạch.jpg",
  procStep06: "/images/quy_trinh/B6.1 Sấy gạch.jpg",
  procStep07: "/images/quy_trinh/B7.2 Nung lò.jpg",
  procStep08: "/images/quy_trinh/B8 Làm nguội.jpg",
  procStep09: "/images/quy_trinh/B9.2 Đóng sản phẩm.jpg",

  /* Legacy aliases for backwards compatibility */
  procMixing: "/images/quy_trinh/B3 Nhào trộn.jpg",
  procMolding: "/images/quy_trinh/B4.2 Ép đùn.jpg",
  procKiln: "/images/quy_trinh/B7.2 Nung lò.jpg",
  procPallet: "/images/quy_trinh/B9.2 Đóng sản phẩm.jpg",
} as const;

/* ── PRODUCT TYPE — maps to DB: Product + ProductImage ─────── */
export type Product = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  length: number;
  width: number;
  height: number;
  weight?: number;
  holeCount?: number;
  compressionStrength?: number;
  waterAbsorption?: number;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  image: string;
  images?: string[];
};

/* ── CATEGORIES ────────────────────────────────────────────── */
export const CATEGORIES = [
  {
    id: "clay",
    name: "Gạch đất sét nung",
    en: "Fired Clay Brick (Tuynel)",
    image: IMAGES.clayBrick,
    count: "Nhiều quy cách",
  },
];

/* ── PRODUCTS (No mock data -> empty array) ──────────────── */
export const PRODUCTS: Product[] = [];

/* ── PROCESS STEPS (9 real factory production steps) ──────── */
export const PROCESS = [
  {
    step: "01",
    title: "Khai thác & Tuyển chọn nguyên liệu",
    desc: "Đất sét và phụ gia tự nhiên được chọn lọc kỹ lưỡng, loại bỏ tạp chất trước khi đưa vào dây chuyền sấy ủ.",
    image: IMAGES.procStep01,
  },
  {
    step: "02",
    title: "Ủ & Xử lý độ ẩm đất sét",
    desc: "Đất sét được ủ trong kho nguyên liệu chuyên dụng nhằm ổn định độ ẩm, tối ưu độ dẻo và tính liên kết cơ học.",
    image: IMAGES.procStep02,
  },
  {
    step: "03",
    title: "Nhào trộn & Phối trộn phụ gia",
    desc: "Hệ thống máy nhào trộn công nghiệp công suất lớn nhào dẻo đất sét cùng phụ gia tăng độ bền chịu lực.",
    image: IMAGES.procStep03,
  },
  {
    step: "04",
    title: "Ép đùn chân không & Định hình",
    desc: "Công nghệ ép đùn chân không hút sạch bọt khí, nén khối gạch mộc đặc chắc với mật độ chịu lực cực cao.",
    image: IMAGES.procStep04,
  },
  {
    step: "05",
    title: "Cắt gạch tự động theo quy cách",
    desc: "Hệ thống cắt tự động định hình chính xác chuẩn kích thước từng viên gạch theo tiêu chuẩn kỹ thuật.",
    image: IMAGES.procStep05,
  },
  {
    step: "06",
    title: "Sấy gạch mộc trong hầm sấy",
    desc: "Gạch mộc được đưa vào hầm sấy tự động nhằm rút bớt độ ẩm dần dần, tránh tình trạng nứt vỡ khi nung.",
    image: IMAGES.procStep06,
  },
  {
    step: "07",
    title: "Nung lò Tuynel công nghệ cao",
    desc: "Gạch được nung liên tục trong lò Tuynel ở nhiệt độ khoảng 1.000°C – 1.050°C, cho viên gạch chín đều và đanh chắc.",
    image: IMAGES.procStep07,
  },
  {
    step: "08",
    title: "Làm nguội & Hạ nhiệt tiêu chuẩn",
    desc: "Chu trình hạ nhiệt kiểm soát tự động giúp ổn định cấu trúc gạch, duy trì màu sắc tự nhiên và độ bền lâu dài.",
    image: IMAGES.procStep08,
  },
  {
    step: "09",
    title: "Kiểm định & Đóng gói sản phẩm",
    desc: "Gạch thành phẩm được phân loại QC nghiêm ngặt, đóng pallet quấn màng co bảo vệ cẩn thận để sẵn sàng giao hàng.",
    image: IMAGES.procStep09,
  },
];

/* ── PROJECT TYPE — maps to DB: Project + ProjectImage ─────── */
export type ProjectItem = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  location: string;
  completedDate: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  image: string;
  images?: string[];
};

/* ── PROJECTS (No mock data -> empty array) ──────────────── */
export const PROJECTS: ProjectItem[] = [];

/* ── NEWS TYPE — maps to DB: News ──────────────────────────── */
export type NewsItem = {
  id: number;
  title: string;
  slug: string;
  thumbnailPath: string;
  summary: string;
  content: string;
  publishedAt: string;
  isActive: boolean;
};

/* ── NEWS (No mock seed data -> 100% from DB API) ─────────── */
export const NEWS: NewsItem[] = [];



/* ── PARTNER TYPE — maps to DB: Partner ────────────────────── */
export type Partner = {
  id: number;
  name: string;
  logoPath: string;
  website: string;
  displayOrder: number;
  isActive: boolean;
};

/* ── PARTNERS (No mock data -> empty array) ────────────────── */
export const PARTNERS_LIST: Partner[] = [];

/* Backwards compat: still export PARTNERS as string[] for LogoMarquee */
export const PARTNERS = PARTNERS_LIST.map((p) => p.name);

/* ── CONTACT REQUEST TYPE — maps to DB: ContactRequest ───── */
export type ContactRequest = {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

