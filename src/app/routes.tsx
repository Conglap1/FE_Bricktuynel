import { createHashRouter } from "react-router";
import { Root } from "./components/site/Root";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { CapacityPage } from "./pages/CapacityPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProcessPage } from "./pages/ProcessPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AdminRoot } from "./admin/AdminRoot";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminDashboard } from "./admin/AdminDashboard";
import { AdminProducts } from "./admin/AdminProducts";
import { AdminProjects } from "./admin/AdminProjects";
import { AdminNews } from "./admin/AdminNews";
import { AdminContact } from "./admin/AdminContact";
import { AdminPartners } from "./admin/AdminPartners";
import { AdminContactRequests } from "./admin/AdminContactRequests";
import { StoreProvider } from "./lib/store";

function AdminWrapper() {
  return (
    <StoreProvider>
      <AdminRoot />
    </StoreProvider>
  );
}

export const router = createHashRouter([
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
      { path: "du-an/:slug", Component: ProjectDetailPage },
      { path: "tin-tuc", Component: NewsPage },
      { path: "tin-tuc/:slug", Component: NewsDetailPage },
      { path: "lien-he", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
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
