import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/site/Root";
import { HomePage } from "./pages/HomePage";
import { InlineSpinner } from "./components/ui/LoadingState";

// Lazy-loaded public pages for code-splitting
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })));
const CapacityPage = lazy(() => import("./pages/CapacityPage").then((m) => ({ default: m.CapacityPage })));
const ProductsPage = lazy(() => import("./pages/ProductsPage").then((m) => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })));
const ProcessPage = lazy(() => import("./pages/ProcessPage").then((m) => ({ default: m.ProcessPage })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then((m) => ({ default: m.ProjectsPage })));
const NewsPage = lazy(() => import("./pages/NewsPage").then((m) => ({ default: m.NewsPage })));
const NewsDetailPage = lazy(() => import("./pages/NewsDetailPage").then((m) => ({ default: m.NewsDetailPage })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

// Lazy-loaded Admin pages (reduces client landing page bundle by >60%)
const AdminRoot = lazy(() => import("./admin/AdminRoot").then((m) => ({ default: m.AdminRoot })));
const AdminLogin = lazy(() => import("./admin/AdminLogin").then((m) => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import("./admin/AdminProducts").then((m) => ({ default: m.AdminProducts })));
const AdminProjects = lazy(() => import("./admin/AdminProjects").then((m) => ({ default: m.AdminProjects })));
const AdminNews = lazy(() => import("./admin/AdminNews").then((m) => ({ default: m.AdminNews })));
const AdminContact = lazy(() => import("./admin/AdminContact").then((m) => ({ default: m.AdminContact })));
const AdminPartners = lazy(() => import("./admin/AdminPartners").then((m) => ({ default: m.AdminPartners })));
const AdminContactRequests = lazy(() => import("./admin/AdminContactRequests").then((m) => ({ default: m.AdminContactRequests })));

function AdminWrapper() {
  return (
    <Suspense fallback={<InlineSpinner text="Đang tải trang quản trị..." />}>
      <AdminRoot />
    </Suspense>
  );
}

function LoginWrapper() {
  return (
    <Suspense fallback={<InlineSpinner text="Đang tải..." />}>
      <AdminLogin />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "gioi-thieu", Component: AboutPage },
      { path: "nang-luc", Component: CapacityPage },
      { path: "san-pham", Component: ProductsPage },
      { path: "san-pham/:slug", Component: ProductDetailPage },
      { path: "quy-trinh", Component: ProcessPage },
      { path: "du-an", Component: ProjectsPage },
      { path: "du-an/:slug", Component: () => <Navigate to="/du-an" replace /> },
      { path: "tin-tuc", Component: NewsPage },
      { path: "tin-tuc/:slug", Component: NewsDetailPage },
      { path: "lien-he", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/admin/login",
    Component: LoginWrapper,
  },
  {
    path: "/admin",
    Component: AdminWrapper,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "san-pham", Component: AdminProducts },
      { path: "du-an", Component: AdminProjects },
      { path: "tin-tuc", Component: AdminNews },
      { path: "lien-he", Component: AdminContact },
      { path: "doi-tac", Component: AdminPartners },
      { path: "yeu-cau", Component: AdminContactRequests },
    ],
  },
]);
