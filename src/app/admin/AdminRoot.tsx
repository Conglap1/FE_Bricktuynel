import { useState, useEffect } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

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
      <aside
        className={`flex ${
          isCollapsed ? "w-20" : "w-60"
        } shrink-0 flex-col bg-[#560213] text-white h-full overflow-y-auto transition-all duration-300 ease-in-out relative`}
      >
        {/* Header */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center flex-col gap-2 py-4 px-2" : "justify-between px-4 py-4.5"
          } border-b border-white/10`}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            <img
              src="/images/logo/icon.png"
              alt="Thuận Lợi Logo"
              className="h-9 w-9 rounded-lg object-contain bg-white/10 p-1 shrink-0"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-[13.5px] font-bold leading-tight text-white whitespace-nowrap">
                  Thuận Lợi
                </div>
                <div className="text-[11px] text-white/50 whitespace-nowrap">Admin CMS</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Mở rộng thanh menu" : "Rút gọn thanh menu"}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={isCollapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center ${
                  isCollapsed ? "justify-center px-2.5 py-3" : "gap-3 px-3 py-2.5"
                } rounded-lg text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#810C00] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer controls */}
        <div className="border-t border-white/10 p-3 space-y-1">
          {/* Quick toggle button inside footer for accessibility */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Mở rộng thanh menu" : "Rút gọn thanh menu"}
            className={`flex w-full items-center ${
              isCollapsed ? "justify-center px-2.5 py-2.5" : "gap-3 px-3 py-2.5"
            } rounded-lg text-[13px] text-white/60 transition-colors hover:text-white hover:bg-white/10`}
          >
            <ChevronLeft
              className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
            {!isCollapsed && <span className="whitespace-nowrap">Thu gọn menu</span>}
          </button>

          <a
            href="#/"
            title={isCollapsed ? "Xem website" : undefined}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-2.5 py-2.5" : "gap-3 px-3 py-2.5"
            } rounded-lg text-[13px] text-white/60 transition-colors hover:text-white hover:bg-white/10`}
          >
            <ChevronRight className="h-4 w-4 rotate-180 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Xem website</span>}
          </a>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Đăng xuất" : undefined}
            className={`flex w-full items-center ${
              isCollapsed ? "justify-center px-2.5 py-2.5" : "gap-3 px-3 py-2.5"
            } rounded-lg text-[13px] text-white/60 transition-colors hover:text-white hover:bg-white/10`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Đăng xuất</span>}
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

