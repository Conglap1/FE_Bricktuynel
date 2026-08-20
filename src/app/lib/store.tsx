import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { toast } from "sonner";
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

function playNotificationChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 tone
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5 tone
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

/* ── ContactInfo — maps to DB: ContactInfo (10 fields) ─────── */
export type ContactInfo = {
  companyName: string;
  address: string;
  phone: string;
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
  refreshContactRequests: (notifyIfNew?: boolean) => Promise<void>;
  refreshAll: () => Promise<void>;
};

export const DEFAULT_ABOUT: AboutData = {
  title: "Gần bốn thập kỷ dựng xây niềm tin từ từng viên gạch",
  desc: "Thành lập năm 1988, Công ty TNHH Một Thành Viên Thuận Lợi Mộc Hóa là một trong những đơn vị sản xuất gạch đất sét nung Tuynel hàng đầu khu vực phía Nam. Chúng tôi kết hợp dây chuyền công nghệ hiện đại với quy trình chuyên nghiệp để tạo ra những sản phẩm bền vững, an toàn — giao hàng toàn quốc với giá cạnh tranh trực tiếp từ nhà máy.",
  points: [
    "Thành lập năm 1988 — hơn 30 năm kinh nghiệm sản xuất gạch Tuynel",
    "Năng lực sản xuất lớn, đáp ứng bất kỳ quy mô công trình nào",
    "Giao hàng đúng hạn — giá cạnh tranh trực tiếp từ nhà máy",
    "Sản phẩm đạt hợp quy QCVN 16:2023/BXD — đáp ứng tiêu chuẩn chất lượng cao",
  ],
};

export const DEFAULT_CONTACT: ContactInfo = {
  companyName: "Công ty TNHH Một Thành Viên Thuận Lợi Mộc Hóa",
  address: "Ấp Mới, Xã Bình Tân, Thị xã Kiến Tường, Tỉnh Long An",
  phone: "0918 701 472",
  email: "kinhdoanh@gachthuanloi.vn",
  facebook: "https://facebook.com",
  zalo: "0918701472",
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

  // Track seen request IDs to detect brand new incoming requests
  const knownRequestIdsRef = useRef<Set<number>>(new Set());

  // Function to refresh contact requests with optional real-time toast alert
  const refreshContactRequests = useCallback(async (notifyIfNew = true) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact-requests`);
      if (res.ok) {
        const data: ContactRequest[] = await res.json();
        if (Array.isArray(data)) {
          const currentKnown = knownRequestIdsRef.current;
          
          // Check for newly arrived requests
          if (notifyIfNew && currentKnown.size > 0) {
            const newRequests = data.filter((r) => !currentKnown.has(r.id));
            if (newRequests.length > 0) {
              const latest = newRequests[0];
              playNotificationChime();
              toast.info(`🔔 Yêu cầu báo giá mới từ ${latest.fullName || "Khách hàng"}!`, {
                description: latest.phone ? `SĐT: ${latest.phone}` : undefined,
                duration: 6000,
              });
            }
          }

          // Update ref set
          const updatedSet = new Set<number>();
          data.forEach((r) => updatedSet.add(r.id));
          knownRequestIdsRef.current = updatedSet;

          setContactRequestsRaw(data);
        }
      }
    } catch (err) {
      console.warn("Lỗi khi cập nhật danh sách yêu cầu:", err);
    }
  }, []);

  // Fetch all real data strictly from .NET 9 API
  const refreshAll = useCallback(async () => {
    try {
      const [resContact, resProducts, resProjects, resNews, resPartners] = await Promise.all([
        fetch(`${API_BASE_URL}/contact-info`).catch(() => null),
        fetch(`${API_BASE_URL}/products`).catch(() => null),
        fetch(`${API_BASE_URL}/projects`).catch(() => null),
        fetch(`${API_BASE_URL}/news`).catch(() => null),
        fetch(`${API_BASE_URL}/partners`).catch(() => null),
      ]);

      if (resContact?.ok) setContactRaw(await resContact.json());
      if (resProducts?.ok) setProductsRaw(await resProducts.json());
      if (resProjects?.ok) setProjectsRaw(await resProjects.json());
      if (resNews?.ok) setNewsRaw(await resNews.json());
      if (resPartners?.ok) setPartnersRaw(await resPartners.json());

      await refreshContactRequests(false);
    } catch (err) {
      console.warn("Backend API fetch error:", err);
    }
  }, [refreshContactRequests]);

  // Initial load and continuous real-time polling every 3 seconds
  useEffect(() => {
    refreshAll();

    // Auto-poll every 3 seconds for immediate real-time synchronization across devices
    const pollInterval = setInterval(() => {
      refreshContactRequests(true);
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [refreshAll, refreshContactRequests]);

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
        refreshContactRequests,
        refreshAll,
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

