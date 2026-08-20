import { useState } from "react";
import { Eye, EyeOff, Trash2, X, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL } from "../lib/store";
import type { ContactRequest } from "../lib/store";

export function AdminContactRequests() {
  const { contactRequests, setContactRequests, refreshContactRequests } = useStore();
  const [detailReq, setDetailReq] = useState<ContactRequest | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshContactRequests(false);
    toast.success("Đã làm mới danh sách yêu cầu");
    setTimeout(() => setIsRefreshing(false), 400);
  };

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc chắn muốn xoá yêu cầu này?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/contact-requests/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContactRequests(contactRequests.filter((r) => r.id !== id));
        toast.success("Đã xoá yêu cầu liên hệ");
        if (detailReq?.id === id) setDetailReq(null);
      } else {
        toast.error("Lỗi khi xoá yêu cầu liên hệ.");
      }
    } catch {
      setContactRequests(contactRequests.filter((r) => r.id !== id));
      toast.success("Đã xoá yêu cầu liên hệ (offline)");
      if (detailReq?.id === id) setDetailReq(null);
    }
  }

  async function toggleRead(req: ContactRequest) {
    try {
      const res = await fetch(`${API_BASE_URL}/contact-requests/${req.id}/mark-read`, { method: "PUT" });
      if (res.ok) {
        const updated = await res.json();
        setContactRequests(contactRequests.map((r) => (r.id === req.id ? updated : r)));
        toast.success(updated.isRead ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc");
      }
    } catch {
      setContactRequests(contactRequests.map((r) => (r.id === req.id ? { ...r, isRead: !r.isRead } : r)));
      toast.success(req.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc");
    }
  }


  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Yêu cầu liên hệ</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-[#560213]/70">{contactRequests?.length || 0} yêu cầu</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Real-time Live (Tự động mỗi 3s)
            </span>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          className={`flex items-center gap-2 rounded-xl bg-[#560213] hover:bg-[#810C00] text-white px-4 py-2 text-xs font-semibold shadow-sm transition-all active:scale-95 ${
            isRefreshing ? "opacity-75 cursor-wait" : ""
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Làm mới ngay
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#810C00]/20 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#560213] text-white border-b border-[#810C00]/20 text-left text-[12px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">Khách hàng</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Nội dung</th>
              <th className="px-5 py-4">Ngày gửi</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contactRequests?.map((r) => (
              <tr key={r.id} className={`transition-colors hover:bg-[#C76B86]/5 ${r.isRead ? "opacity-60" : ""}`}>
                <td className="px-5 py-4">
                  <div className="font-semibold text-[#560213]">{r.fullName}</div>
                  <div className="text-[12px] text-[#560213]/70">{r.phone}</div>
                </td>
                <td className="px-5 py-4 text-[#560213]/80">{r.email || "—"}</td>
                <td className="px-5 py-4">
                  <div className="max-w-[200px] truncate text-[#560213]/80 cursor-pointer hover:text-[#560213]" onClick={() => setDetailReq(r)}>
                    {r.content || "—"}
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#560213]/70" style={{ fontFamily: "var(--font-mono)" }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—"}
                </td>
                <td className="px-5 py-4">
                  {r.isRead
                    ? <span className="rounded-full bg-[#C76B86]/15 px-2.5 py-0.5 text-[12px] font-medium text-[#560213]/70">Đã đọc</span>
                    : <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[12px] font-medium text-amber-700">Chưa đọc</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setDetailReq(r)} title="Xem chi tiết" className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]">
                      <MessageSquare className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => toggleRead(r)} title={r.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]">
                      {r.isRead ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!contactRequests || contactRequests.length === 0) && (
              <tr><td colSpan={6} className="py-12 text-center text-[#810C00]">Chưa có yêu cầu nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {detailReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                Chi tiết liên hệ
              </h2>
              <button onClick={() => setDetailReq(null)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-[#560213]/70">Khách hàng</label>
                <div className="text-sm font-medium text-[#560213]">{detailReq.fullName}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-[#560213]/70">Số điện thoại</label>
                  <div className="text-sm text-[#560213]">{detailReq.phone || "—"}</div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#560213]/70">Email</label>
                  <div className="text-sm text-[#560213]">{detailReq.email || "—"}</div>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#560213]/70">Ngày gửi</label>
                <div className="text-sm text-[#560213]" style={{ fontFamily: "var(--font-mono)" }}>
                  {detailReq.createdAt ? new Date(detailReq.createdAt).toLocaleDateString("vi-VN") : "—"}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-[#560213]/70">Nội dung</label>
                <div className="mt-1 rounded-xl bg-[#C76B86]/5 p-4 text-sm text-[#560213] whitespace-pre-wrap leading-relaxed">
                  {detailReq.content || "—"}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#810C00]/10 px-6 py-4">
              <button onClick={() => setDetailReq(null)} className="rounded-xl bg-[#810C00] px-5 py-2 text-sm font-semibold text-white hover:opacity-80">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
