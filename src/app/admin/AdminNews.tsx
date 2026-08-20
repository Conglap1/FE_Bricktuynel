import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL, getAuthHeaders, getImageUrl, FALLBACK_IMAGE } from "../lib/store";
import type { NewsItem } from "../lib/store";
import { ImageUploadInput } from "./ImageUploadInput";

type NewsForm = Omit<NewsItem, "id">;

const EMPTY: NewsForm = { title: "", slug: "", summary: "", content: "", thumbnailPath: "", publishedAt: "", isActive: true };

function uid() { return Date.now(); }
function toSlug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function fmtDate(iso: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("vi-VN"); } catch { return iso; }
}

export function AdminNews() {
  const { news, setNews } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<NewsForm>(EMPTY);

  function openAdd() { setEditing(null); setForm({ ...EMPTY, publishedAt: todayISO() }); setOpen(true); }
  function openEdit(n: NewsItem) {
    setEditing(n);
    setForm({ title: n.title, slug: n.slug, summary: n.summary ?? "", content: n.content ?? "", thumbnailPath: n.thumbnailPath,
      publishedAt: n.publishedAt ?? "", isActive: n.isActive });
    setOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNews(news.filter((n) => n.id !== id));
        toast.success("Đã xoá tin tức");
      } else {
        toast.error("Lỗi khi xoá tin tức trên máy chủ.");
      }
    } catch {
      setNews(news.filter((n) => n.id !== id));
      toast.success("Đã xoá tin tức (offline)");
    }
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    const data = { ...form, slug: form.slug || toSlug(form.title) };

    try {
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/news/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setNews(news.map((n) => (n.id === editing.id ? updated : n)));
          toast.success("Đã cập nhật bài viết thành công!");
          setOpen(false);
        } else {
          if (res.status === 404) {
            const createRes = await fetch(`${API_BASE_URL}/news`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              body: JSON.stringify(data),
            });
            if (createRes.ok) {
              const created = await createRes.json();
              setNews(news.map((n) => (n.id === editing.id ? created : n)));
              toast.success("Đã cập nhật và đồng bộ bài viết lên máy chủ!");
              setOpen(false);
              return;
            }
          }
          setNews(news.map((n) => (n.id === editing.id ? { ...data, id: editing.id } : n)));
          toast.success("Đã cập nhật bài viết (lưu nội bộ)");
          setOpen(false);
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/news`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const created = await res.json();
          setNews([created, ...news]);
          toast.success("Đã thêm bài viết thành công!");
          setOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || err.title || "Lỗi khi thêm bài viết.");
        }
      }
    } catch {
      if (editing) {
        setNews(news.map((n) => (n.id === editing.id ? { ...data, id: editing.id } : n)));
        toast.success("Đã cập nhật (offline)");
      } else {
        setNews([{ ...data, id: uid() }, ...news]);
        toast.success("Đã thêm bài viết (offline)");
      }
      setOpen(false);
    }
  }

  function set(key: keyof NewsForm, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Tin tức</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#560213]/70">{news.length} bài viết</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#810C00] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-80 shrink-0">
          <Plus className="h-4 w-4" /> Thêm bài viết
        </button>
      </div>

      <div className="mt-6 sm:mt-8 overflow-x-auto rounded-2xl border border-[#810C00]/20 bg-white shadow-sm">
        <table className="w-full text-xs sm:text-sm min-w-[500px]">
          <thead className="bg-[#560213] text-white border-b border-[#810C00]/20 text-left text-[12px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">Bài viết</th>
              <th className="px-5 py-4">Ngày đăng</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news.map((n) => (
              <tr key={n.id} className={`transition-colors hover:bg-[#C76B86]/5 ${!n.isActive ? "opacity-40" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {n.thumbnailPath && (
                      <img
                        src={getImageUrl(n.thumbnailPath)}
                        alt={n.title}
                        className="h-10 w-16 rounded-lg object-cover bg-[#C76B86]/15"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    )}
                    <div>
                      <div className="font-semibold text-[#560213] leading-snug">{n.title}</div>
                      <div className="text-[11px] text-[#810C00]">{n.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#560213]/70" style={{ fontFamily: "var(--font-mono)" }}>
                  {fmtDate(n.publishedAt ?? "")}
                </td>
                <td className="px-5 py-4">
                  {n.isActive
                    ? <span className="rounded-full bg-[#C76B86]/20 px-2.5 py-0.5 text-[12px] font-medium text-[#560213]">Hiển thị</span>
                    : <span className="rounded-full bg-[#C76B86]/15 px-2.5 py-0.5 text-[12px] font-medium text-[#560213]/70">Ẩn</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(n)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(n.id)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr><td colSpan={4} className="py-12 text-center text-[#810C00]">Chưa có bài viết nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                {editing ? "Sửa bài viết" : "Thêm bài viết"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
              <F label="Tiêu đề *">
                <input value={form.title} onChange={(e) => { set("title", e.target.value); if (!editing) set("slug", toSlug(e.target.value)); }} className={inp} />
              </F>
              <F label="Slug (URL)">
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inp} placeholder="tu-dong-tao-tu-tieu-de" />
              </F>
              <ImageUploadInput
                label="Hình ảnh thumbnail (Tải file hoặc dùng HTTPS)"
                value={form.thumbnailPath || ""}
                onChange={(url) => set("thumbnailPath", url)}
                folder="news"
                allowExternalUrl={true}
              />
              <F label="Tóm tắt bài viết (summary)">
                <textarea value={form.summary ?? ""} onChange={(e) => set("summary", e.target.value)} rows={3} className={inp + " resize-none"} />
              </F>
              <F label="Nội dung bài viết (content)">
                <textarea value={form.content ?? ""} onChange={(e) => set("content", e.target.value)} rows={6} className={inp + " resize-none"} />
              </F>
              <div className="grid grid-cols-2 gap-3 items-end">
                <F label="Ngày đăng (PublishedAt)">
                  <input type="date" value={form.publishedAt ?? ""} onChange={(e) => set("publishedAt", e.target.value)} className={inp} />
                </F>
                <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 rounded" />
                  <span className="text-sm text-[#560213]">Hiển thị</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#810C00]/10 px-6 py-4">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-[#810C00]/20 px-4 py-2 text-sm text-[#560213]/80 hover:bg-[#C76B86]/5">Huỷ</button>
              <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-[#810C00] px-5 py-2 text-sm font-semibold text-white hover:opacity-80">
                <Save className="h-4 w-4" /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full rounded-xl border border-[#810C00]/20 bg-[#C76B86]/5 px-3.5 py-2.5 text-sm text-[#560213] outline-none transition-colors focus:border-[#810C00] focus:bg-white";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-[#560213]/70">{label}</label>
      {children}
    </div>
  );
}
