import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL, getAuthHeaders, getImageUrl, FALLBACK_IMAGE } from "../lib/store";
import type { NewsItem, NewsSectionItem, NewsImageItem } from "../lib/store";
import { ImageUploadInput } from "./ImageUploadInput";

type NewsForm = Omit<NewsItem, "id">;

const EMPTY: NewsForm = { 
  title: "", 
  slug: "", 
  summary: "", 
  content: "", 
  thumbnailPath: "", 
  publishedAt: "", 
  isActive: true,
  sections: [],
  images: []
};

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

  function openAdd() { 
    setEditing(null); 
    setForm({ ...EMPTY, publishedAt: todayISO(), sections: [], images: [] }); 
    setOpen(true); 
  }

  function openEdit(n: NewsItem) {
    setEditing(n);
    setForm({ 
      title: n.title, 
      slug: n.slug, 
      summary: n.summary ?? "", 
      content: n.content ?? "", 
      thumbnailPath: n.thumbnailPath,
      publishedAt: n.publishedAt ?? "", 
      isActive: n.isActive,
      sections: n.sections ? JSON.parse(JSON.stringify(n.sections)) : [],
      images: n.images ? JSON.parse(JSON.stringify(n.images)) : []
    });
    setOpen(true);
  }

  async function handleDelete(n: NewsItem, e?: React.MouseEvent) {
    e?.stopPropagation();
    if (!window.confirm(`Bạn có chắc chắn muốn xoá bài viết "${n.title}" không?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/news/${n.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setNews(news.filter((item) => item.id !== n.id));
        toast.success("Đã xoá tin tức");
      } else {
        toast.error("Lỗi khi xoá tin tức trên máy chủ.");
      }
    } catch {
      setNews(news.filter((item) => item.id !== n.id));
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

  // Helpers to manage sections
  function addSection() {
    const nextOrder = (form.sections?.length || 0) + 1;
    const newSec: NewsSectionItem = { question: "", answer: "", displayOrder: nextOrder, images: [] };
    setForm((f) => ({ ...f, sections: [...(f.sections || []), newSec] }));
  }

  function updateSection(index: number, field: keyof NewsSectionItem, val: unknown) {
    const list = [...(form.sections || [])];
    list[index] = { ...list[index], [field]: val };
    setForm((f) => ({ ...f, sections: list }));
  }

  function removeSection(index: number) {
    const list = [...(form.sections || [])];
    list.splice(index, 1);
    setForm((f) => ({ ...f, sections: list }));
  }

  // Helpers to manage section images
  function addSectionImage(secIdx: number) {
    const list = [...(form.sections || [])];
    const sec = list[secIdx];
    const nextOrder = (sec.images?.length || 0) + 1;
    const newImg: NewsImageItem = { imagePath: "", caption: "", displayOrder: nextOrder };
    sec.images = [...(sec.images || []), newImg];
    setForm((f) => ({ ...f, sections: list }));
  }

  function updateSectionImage(secIdx: number, imgIdx: number, field: keyof NewsImageItem, val: unknown) {
    const list = [...(form.sections || [])];
    const sec = list[secIdx];
    if (sec.images) {
      sec.images[imgIdx] = { ...sec.images[imgIdx], [field]: val };
    }
    setForm((f) => ({ ...f, sections: list }));
  }

  function removeSectionImage(secIdx: number, imgIdx: number) {
    const list = [...(form.sections || [])];
    const sec = list[secIdx];
    if (sec.images) {
      sec.images.splice(imgIdx, 1);
    }
    setForm((f) => ({ ...f, sections: list }));
  }

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
              <th className="px-5 py-4">Số mục (Sections)</th>
              <th className="px-5 py-4">Ngày đăng</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {news.map((n) => (
              <tr
                key={n.id}
                onClick={() => openEdit(n)}
                className={`cursor-pointer transition-colors hover:bg-[#810C00]/10 ${!n.isActive ? "opacity-40" : ""}`}
              >
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
                <td className="px-5 py-4 text-xs font-semibold text-[#560213]">
                  {n.sections && n.sections.length > 0 ? (
                    <span className="rounded-full bg-[#810C00]/10 px-2.5 py-1 text-[#810C00]">
                      {n.sections.length} mục
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(n);
                      }}
                      className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]"
                      title="Sửa bài viết"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(n, e)}
                      className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500"
                      title="Xoá bài viết"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-[#810C00]">Chưa có bài viết nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-lg text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                {editing ? "Sửa bài viết chi tiết" : "Thêm bài viết chi tiết"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4 rounded-xl border border-[#810C00]/10 p-4 bg-slate-50/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#810C00]">1. Thông tin chung bài viết</h3>
                <F label="Tiêu đề bài viết *">
                  <input value={form.title} onChange={(e) => { set("title", e.target.value); if (!editing) set("slug", toSlug(e.target.value)); }} className={inp} />
                </F>
                <F label="Slug (URL)">
                  <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inp} placeholder="tu-dong-tao-tu-tieu-de" />
                </F>
                <ImageUploadInput
                  label="Hình ảnh thumbnail đại diện bài viết"
                  value={form.thumbnailPath || ""}
                  onChange={(url) => set("thumbnailPath", url)}
                  folder="news"
                  allowExternalUrl={true}
                />
                <F label="Mô tả / Tóm tắt mở đầu (Summary)">
                  <textarea
                    value={form.summary ?? ""}
                    onChange={(e) => set("summary", e.target.value)}
                    rows={3}
                    placeholder="Nhập tóm tắt mở đầu... (hỗ trợ xuống dòng)"
                    className={inp + " resize-y min-h-[80px]"}
                  />
                </F>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <F label="Ngày đăng (PublishedAt)">
                    <input type="date" value={form.publishedAt ?? ""} onChange={(e) => set("publishedAt", e.target.value)} className={inp} />
                  </F>
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 rounded" />
                    <span className="text-sm font-semibold text-[#560213]">Hiển thị bài viết</span>
                  </label>
                </div>
              </div>

              {/* Các Mục phụ (Sections) */}
              <div className="space-y-4 rounded-xl border border-[#810C00]/15 p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#810C00]">2. Các Mục phụ / Câu hỏi & Trả lời ({form.sections?.length || 0})</h3>
                    <p className="text-[12px] text-muted-foreground">💡 Bạn có thể nhấn <b>Enter</b> để xuống dòng hoặc <b>2 lần Enter</b> để tách thành các đoạn văn riêng biệt</p>
                  </div>
                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#810C00] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm Mục (+ Section)
                  </button>
                </div>

                {(!form.sections || form.sections.length === 0) ? (
                  <div className="p-4 text-center text-xs text-slate-500 border border-dashed rounded-xl">
                    Chưa có mục phụ nào. Bấm "Thêm Mục" để tạo câu hỏi và nội dung theo bố cục bài viết.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.sections.map((sec, secIdx) => (
                      <div key={secIdx} className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-3 relative">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-xs font-extrabold text-[#810C00]">Mục #{secIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeSection(secIdx)}
                            className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Xoá mục này
                          </button>
                        </div>

                        <F label="Câu hỏi / Tiêu đề mục (Question / Heading)">
                          <input
                            value={sec.question || ""}
                            onChange={(e) => updateSection(secIdx, "question", e.target.value)}
                            placeholder="Ví dụ: Robot xếp gạch hoạt động như thế nào?"
                            className={inp}
                          />
                        </F>

                        <F label="Nội dung chi tiết / Câu trả lời (Answer / Content)">
                          <textarea
                            value={sec.answer || ""}
                            onChange={(e) => updateSection(secIdx, "answer", e.target.value)}
                            rows={5}
                            placeholder="Nhập nội dung câu trả lời... (nhấn Enter để xuống dòng, cách 2 dòng để tạo đoạn mới)"
                            className={inp + " resize-y min-h-[120px]"}
                          />
                        </F>

                        {/* Hình ảnh kèm caption thuộc Section */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-[#560213]">Hình ảnh đính kèm theo mục này ({sec.images?.length || 0})</span>
                            <button
                              type="button"
                              onClick={() => addSectionImage(secIdx)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                            >
                              <ImageIcon className="h-3.5 w-3.5" /> + Thêm ảnh vào mục
                            </button>
                          </div>

                          {sec.images && sec.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="p-3 bg-white border rounded-xl space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                                <span>Ảnh #{imgIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeSectionImage(secIdx, imgIdx)}
                                  className="text-red-500 hover:underline cursor-pointer"
                                >
                                  Xoá ảnh
                                </button>
                              </div>
                              <ImageUploadInput
                                label="Đường dẫn hình ảnh"
                                value={img.imagePath || ""}
                                onChange={(url) => updateSectionImage(secIdx, imgIdx, "imagePath", url)}
                                folder="news"
                                allowExternalUrl={true}
                              />
                              <div>
                                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mô tả theo hình (Caption)</label>
                                <input
                                  value={img.caption || ""}
                                  onChange={(e) => updateSectionImage(secIdx, imgIdx, "caption", e.target.value)}
                                  placeholder="Ví dụ: Hình 1. Robot xếp gạch tự động trong dây chuyền sản xuất..."
                                  className={inp}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#810C00]/10 px-6 py-4 bg-slate-50">
              <button onClick={() => setOpen(false)} className="rounded-xl border border-[#810C00]/20 px-4 py-2 text-sm text-[#560213]/80 hover:bg-[#C76B86]/5 cursor-pointer">Huỷ</button>
              <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-[#810C00] px-5 py-2 text-sm font-semibold text-white hover:opacity-80 cursor-pointer">
                <Save className="h-4 w-4" /> Lưu bài viết
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
