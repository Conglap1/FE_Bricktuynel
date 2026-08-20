import { useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Layers,
  Folder,
  Newspaper,
  Handshake,
  MessageSquare,
  Eye,
  Clock,
  RefreshCw,
  ExternalLink,
  ArrowUpRight,
  Inbox,
  FileText,
} from "lucide-react";
import { useStore } from "../lib/store";

export function AdminDashboard() {
  const { products, projects, news, partners, contactRequests, refreshAll } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadRequests = contactRequests.filter((r) => !r.isRead).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const stats = [
    {
      label: "Sản phẩm",
      value: products.length,
      subtext: `${products.filter((p) => p.isFeatured).length} sản phẩm nổi bật`,
      icon: Layers,
      to: "/admin/san-pham",
      color: "border-amber-500/20 bg-amber-50/50 hover:bg-amber-50",
      iconBg: "bg-amber-600 text-white shadow-amber-600/20",
    },
    {
      label: "Dự án công trình",
      value: projects.length,
      subtext: `${projects.filter((p) => p.isActive).length} dự án công khai`,
      icon: Folder,
      to: "/admin/du-an",
      color: "border-rose-500/20 bg-rose-50/50 hover:bg-rose-50",
      iconBg: "bg-[#810C00] text-white shadow-rose-900/20",
    },
    {
      label: "Tin tức & Bài viết",
      value: news.length,
      subtext: `${news.filter((n) => n.isActive).length} đã xuất bản`,
      icon: Newspaper,
      to: "/admin/tin-tuc",
      color: "border-purple-500/20 bg-purple-50/50 hover:bg-purple-50",
      iconBg: "bg-purple-600 text-white shadow-purple-600/20",
    },
    {
      label: "Đối tác",
      value: partners.length,
      subtext: `${partners.filter((p) => p.isActive).length} đối tác liên kết`,
      icon: Handshake,
      to: "/admin/doi-tac",
      color: "border-blue-500/20 bg-blue-50/50 hover:bg-blue-50",
      iconBg: "bg-blue-600 text-white shadow-blue-600/20",
    },
    {
      label: "Yêu cầu báo giá",
      value: contactRequests.length,
      subtext: unreadRequests > 0 ? `${unreadRequests} chưa phản hồi` : "Đã xử lý tất cả",
      icon: MessageSquare,
      to: "/admin/yeu-cau",
      color: unreadRequests > 0 
        ? "border-red-400/60 bg-red-50/80 hover:bg-red-50" 
        : "border-emerald-500/20 bg-emerald-50/50 hover:bg-emerald-50",
      iconBg: unreadRequests > 0 ? "bg-red-600 text-white shadow-red-600/30" : "bg-emerald-600 text-white shadow-emerald-600/20",
      badge: unreadRequests > 0 ? `${unreadRequests} Mới` : undefined,
    },
  ];

  const todayFormatted = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-full flex flex-col p-3.5 sm:p-5 gap-3.5 bg-slate-50 box-border overflow-y-auto">
      {/* ── Top Header Banner (Compact Single Screen) ── */}
      <div className="relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-r from-[#560213] via-[#810C00] to-[#560213] px-4 sm:px-5 py-3.5 text-white shadow-md">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-white/70">
              <Clock className="h-3 w-3 text-amber-300" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white mt-0.5">
              Tổng quan Quản trị
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Tự động cập nhật (3s)
            </span>

            <button
              onClick={handleRefresh}
              className={`flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-white transition-all active:scale-95 ${
                isRefreshing ? "opacity-75 cursor-wait" : ""
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Làm mới
            </button>

            <a
              href="#/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-2.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95"
            >
              <Eye className="h-3.5 w-3.5" />
              Xem website
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Real KPI Stat Cards ── */}
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 shrink-0">
        {stats.map((s) => (
          <RouterLink
            key={s.label}
            to={s.to}
            className={`group relative overflow-hidden rounded-xl border bg-white p-2.5 sm:p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${s.color}`}
          >
            <div className="flex items-center justify-between">
              <span className={`grid h-7 sm:h-8.5 w-7 sm:w-8.5 place-items-center rounded-lg shadow-sm ${s.iconBg}`}>
                <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              {s.badge && (
                <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-sm">
                  {s.badge}
                </span>
              )}
            </div>

            <div className="mt-1.5 sm:mt-2">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-[#810C00] transition-colors">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-0.5 truncate">{s.label}</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">{s.subtext}</div>
            </div>
          </RouterLink>
        ))}
      </div>

      {/* ── Main Content Grid: Recent Customer Inquiries & Content Overview ── */}
      <div className="grid gap-3.5 lg:grid-cols-3 flex-1 min-h-0">
        {/* Real Customer Contact Requests (2 columns) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-sm flex flex-col h-full min-h-[300px] overflow-hidden">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4.5 w-4.5 text-[#810C00]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Yêu cầu tư vấn & Báo giá gần đây
                </h2>
              </div>
            </div>
            <RouterLink
              to="/admin/yeu-cau"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors"
            >
              Tất cả ({contactRequests.length})
              <ArrowUpRight className="h-3 w-3" />
            </RouterLink>
          </div>

          {contactRequests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 p-4 text-center bg-slate-50/50">
              <Inbox className="h-8 w-8 text-slate-300 mb-1" />
              <p className="text-xs font-semibold text-slate-700">Chưa có yêu cầu báo giá nào</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {contactRequests.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center justify-between gap-3 rounded-lg border p-2.5 text-xs transition-colors ${
                    !req.isRead
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-bold text-xs ${
                      !req.isRead ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      {req.fullName ? req.fullName.charAt(0).toUpperCase() : "K"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{req.fullName}</span>
                        {!req.isRead && (
                          <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[9px] font-bold text-white shrink-0">
                            Mới
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        📞 {req.phone} {req.email ? `• ✉️ ${req.email}` : ""}
                      </div>
                      <p className="text-[11px] text-slate-600 truncate italic">
                        "{req.content}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                    </span>
                    <RouterLink
                      to="/admin/yeu-cau"
                      className="rounded bg-white border border-slate-200 hover:border-[#810C00] hover:text-[#810C00] px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition-colors"
                    >
                      Chi tiết
                    </RouterLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Summary Card (1 column) */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-sm flex flex-col justify-between h-full overflow-hidden">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <FileText className="h-4.5 w-4.5 text-[#810C00]" />
              <div>
                <h2 className="text-sm font-bold text-slate-900">Thống kê dữ liệu</h2>
                <p className="text-[11px] text-slate-500">Nội dung đang hiển thị trên trang</p>
              </div>
            </div>

            <div className="space-y-4 pt-3.5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700">Sản phẩm kích hoạt</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {products.filter((p) => p.isActive).length} / {products.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-[#810C00] h-2.5 rounded-full transition-all shadow-xs"
                    style={{
                      width: `${products.length > 0 ? (products.filter((p) => p.isActive).length / products.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700">Dự án xuất bản</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {projects.filter((p) => p.isActive).length} / {projects.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-rose-600 h-2.5 rounded-full transition-all shadow-xs"
                    style={{
                      width: `${projects.length > 0 ? (projects.filter((p) => p.isActive).length / projects.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700">Bài viết tin tức</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {news.filter((n) => n.isActive).length} / {news.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all shadow-xs"
                    style={{
                      width: `${news.length > 0 ? (news.filter((n) => n.isActive).length / news.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-700">Đối tác đồng hành</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {partners.filter((p) => p.isActive).length} / {partners.length}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all shadow-xs"
                    style={{
                      width: `${partners.length > 0 ? (partners.filter((p) => p.isActive).length / partners.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
