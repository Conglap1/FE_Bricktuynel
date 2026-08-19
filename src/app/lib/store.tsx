import {
  CATEGORIES,
  PROCESS,
  type Product,
  type ProjectItem,
  type NewsItem,
  type Partner,
  type ContactRequest,
} from "./data";

export type Category = (typeof CATEGORIES)[number];
export type ProcessStep = (typeof PROCESS)[number];
export type { Product, ProjectItem, NewsItem, Partner, ContactRequest };

const envApiUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = envApiUrl
  ? envApiUrl.endsWith("/") ? envApiUrl.slice(0, -1) : envApiUrl
  : "/api";

export function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("tsb_admin_auth") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'>No Image</text></svg>";

export function getImageUrl(url?: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("/images/") || url.startsWith("/photo/") || url.startsWith("images/") || url.startsWith("photo/")) {
    return url.startsWith("/") ? url : `/${url}`;
  }
  const serverOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
  if (url.startsWith("/")) return `${serverOrigin}${url}`;
  return `${serverOrigin}/${url}`;
}



/* ── ContactInfo — maps to DB: ContactInfo (10 fields) ─────── */
export type ContactInfo = {
  companyName: string;
  address: string;
  phone: string;
  hotline: string;
  email: string;
  facebook: string;
  zalo: string;
  tiktok: string;
  googleMapEmbed: string;
  workingHours: string;
};

export type AboutData = {
  title: string;
  desc: string;
  points: string[];
};

export type StoreState = {
  products: Product[];
  categories: Category[];
  process: ProcessStep[];
  projects: ProjectItem[];
  news: NewsItem[];
  about: AboutData;
  contact: ContactInfo;
  partners: Partner[];
  contactRequests: ContactRequest[];
};

type StoreActions = {
  setProducts: (v: Product[]) => void;
  setCategories: (v: Category[]) => void;
  setProcess: (v: ProcessStep[]) => void;
  setProjects: (v: ProjectItem[]) => void;
  setNews: (v: NewsItem[]) => void;
  setAbout: (v: AboutData) => void;
  setContact: (v: ContactInfo) => void;
  setPartners: (v: Partner[]) => void;
  setContactRequests: (v: ContactRequest[]) => void;
};

export const DEFAULT_ABOUT: AboutData = {
  title: "Gần bốn thập kỷ dựng xây niềm tin từ từng viên gạch",
  desc: "Thành lập năm 1988, Gạch Thuận Lợi là một trong những đơn vị sản xuất gạch đất sét nung Tuynel hàng đầu khu vực phía Nam. Chúng tôi kết hợp dây chuyền công nghệ hiện đại với đội ngũ kỹ thuật giàu kinh nghiệm để tạo ra những sản phẩm bền vững, an toàn — giao hàng toàn quốc với giá cạnh tranh trực tiếp từ nhà máy.",
  points: [
    "Thành lập năm 1988 — hơn 30 năm kinh nghiệm sản xuất gạch Tuynel",
    "Năng lực sản xuất lớn, đáp ứng bất kỳ quy mô công trình nào",
    "Giao hàng đúng hạn — giá cạnh tranh trực tiếp từ nhà máy",
    "Sản phẩm đạt hợp quy QCVN 16:2023/BXD — đội ngũ kỹ thuật giàu kinh nghiệm",
  ],
};

export const DEFAULT_CONTACT: ContactInfo = {
  companyName: "Công ty TNHH Gạch Thuận Lợi",
  address: "KCN Mỹ Phước, Bến Cát, Bình Dương",
  phone: "0908 555 888",
  hotline: "1900 1234",
  email: "kinhdoanh@gachthuanloi.vn",
  facebook: "https://facebook.com",
  zalo: "0908555888",
  tiktok: "https://tiktok.com",
  googleMapEmbed:
    "https://maps.google.com/maps?q=KCN+My+Phuoc,+Ben+Cat,+Binh+Duong,+Vietnam&t=&z=14&ie=UTF8&iwloc=&output=embed",
  workingHours: "T2 – T7 · 07:30 – 17:30",
};

const Ctx = createContext<(StoreState & StoreActions) | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Clear any legacy localStorage mock caches on startup
  useEffect(() => {
    try {
      ["tsb_cms_v1", "tsb_cms_v2", "tsb_cms_v3", "tsb_cms_v4", "tsb_cms_v5", "tsb_cms_v6"].forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch {}
  }, []);

  const [products, setProductsRaw] = useState<Product[]>([]);
  const [categories, setCategoriesRaw] = useState<Category[]>(CATEGORIES);
  const [process, setProcessRaw] = useState<ProcessStep[]>(PROCESS);
  const [projects, setProjectsRaw] = useState<ProjectItem[]>([]);
  const [news, setNewsRaw] = useState<NewsItem[]>([]);

  const [about, setAboutRaw] = useState<AboutData>(DEFAULT_ABOUT);
  const [contact, setContactRaw] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [partners, setPartnersRaw] = useState<Partner[]>([]);
  const [contactRequests, setContactRequestsRaw] = useState<ContactRequest[]>([]);

  // Fetch real data strictly from .NET 9 API
  useEffect(() => {
    async function fetchFromApi() {
      try {
        const resContact = await fetch(`${API_BASE_URL}/contact-info`);
        if (resContact.ok) {
          const data = await resContact.json();
          setContactRaw(data);
        }

        const resProducts = await fetch(`${API_BASE_URL}/products`);
        if (resProducts.ok) {
          const data = await resProducts.json();
          setProductsRaw(Array.isArray(data) ? data : []);
        } else {
          setProductsRaw([]);
        }

        const resProjects = await fetch(`${API_BASE_URL}/projects`);
        if (resProjects.ok) {
          const data = await resProjects.json();
          setProjectsRaw(Array.isArray(data) ? data : []);
        } else {
          setProjectsRaw([]);
        }

        const resNews = await fetch(`${API_BASE_URL}/news`);
        if (resNews.ok) {
          const data = await resNews.json();
          setNewsRaw(Array.isArray(data) ? data : []);
        } else {
          setNewsRaw([]);
        }

        const resPartners = await fetch(`${API_BASE_URL}/partners`);
        if (resPartners.ok) {
          const data = await resPartners.json();
          setPartnersRaw(Array.isArray(data) ? data : []);
        } else {
          setPartnersRaw([]);
        }

        const resReqs = await fetch(`${API_BASE_URL}/contact-requests`);
        if (resReqs.ok) {
          const data = await resReqs.json();
          setContactRequestsRaw(Array.isArray(data) ? data : []);
        } else {
          setContactRequestsRaw([]);
        }
      } catch (err) {
        console.warn("Backend API not connected / offline:", err);
        // Reset to empty arrays if BE is offline
        setProductsRaw([]);
        setProjectsRaw([]);
        setNewsRaw([]);
        setPartnersRaw([]);
        setContactRequestsRaw([]);
      }
    }

    fetchFromApi();
  }, []);

  const setProducts = useCallback((v: Product[]) => setProductsRaw(v), []);
  const setCategories = useCallback((v: Category[]) => setCategoriesRaw(v), []);
  const setProcess = useCallback((v: ProcessStep[]) => setProcessRaw(v), []);
  const setProjects = useCallback((v: ProjectItem[]) => setProjectsRaw(v), []);
  const setNews = useCallback((v: NewsItem[]) => setNewsRaw(v), []);
  const setAbout = useCallback((v: AboutData) => setAboutRaw(v), []);
  const setContact = useCallback((v: ContactInfo) => setContactRaw(v), []);
  const setPartners = useCallback((v: Partner[]) => setPartnersRaw(v), []);
  const setContactRequests = useCallback((v: ContactRequest[]) => setContactRequestsRaw(v), []);

  return (
    <Ctx.Provider
      value={{
        products,
        categories,
        process,
        projects,
        news,
        about,
        contact,
        partners,
        contactRequests,
        setProducts,
        setCategories,
        setProcess,
        setProjects,
        setNews,
        setAbout,
        setContact,
        setPartners,
        setContactRequests,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}
