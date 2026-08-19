import { NavLink, Outlet, useNavigate, Navigate } from "react-router";
import { ADMIN_AUTH_KEY } from "./AdminLogin";
import {
  LayoutDashboard,
  Layers,
  Folder,
  Newspaper,
  Phone,
  LogOut,
  ChevronRight,
  Handshake,
  MessageSquare,
} from "lucide-react";
import { Toaster } from "sonner";

const NAV = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/admin/san-pham", label: "Sản phẩm", icon: Layers },
  { to: "/admin/du-an", label: "Dự án", icon: Folder },
  { to: "/admin/tin-tuc", label: "Tin tức", icon: Newspaper },
  { to: "/admin/lien-he", label: "Liên hệ", icon: Phone },
  { to: "/admin/doi-tac", label: "Đối tác", icon: Handshake },
  { to: "/admin/yeu-cau", label: "Yêu cầu liên hệ", icon: MessageSquare },
];

export function AdminRoot() {
  const navigate = useNavigate();

  if (!sessionStorage.getItem(ADMIN_AUTH_KEY)) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col bg-[#560213] text-white h-full overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4.5">
          <img
            src="/images/logo/icon.png"
            alt="Thuận Lợi Logo"
            className="h-9 w-9 rounded-lg object-contain bg-white/10 p-1 shrink-0"
          />
          <div>
            <div className="text-[13.5px] font-bold leading-tight text-white">
              Thuận Lợi
            </div>
            <div className="text-[11px] text-white/50">Admin CMS</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#810C00] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-0.5">
          <a
            href="#/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/60 transition-colors hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Xem website
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/60 transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 h-full overflow-auto bg-[#ffffff]">
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
