import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Save, MapPin, Upload, Star, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL, getAuthHeaders, getImageUrl } from "../lib/store";
import type { ProjectItem } from "../lib/store";

type ProjectForm = Omit<ProjectItem, "id">;

const EMPTY: ProjectForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  location: "",
  completedDate: "",
  isFeatured: false,
  displayOrder: 0,
  isActive: true,
  image: "",
  images: [],
};

function uid() { return Date.now(); }
function toSlug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}
function formatDateDisplay(d?: string) {
  if (!d) return "—";
  if (d.includes("-")) {
    const parts = d.split("T")[0].split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return d;
}

export function AdminProjects() {
  const { projects, setProjects } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openAdd() { setEditing(null); setForm(EMPTY); setUrlInput(""); setOpen(true); }
  function openEdit(p: ProjectItem) {
    setEditing(p);
    setUrlInput("");
    const existingImgs = (p.images && p.images.length > 0)
      ? p.images
      : (p.image ? [p.image] : []);
    setForm({
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription ?? "",
      description: p.description ?? "",
      location: p.location ?? "",
      completedDate: p.completedDate ?? "",
      isFeatured: p.isFeatured,
      displayOrder: p.displayOrder,
      isActive: p.isActive,
      image: p.image || existingImgs[0] || "",
      images: existingImgs,
    });
    setOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success("Đã xoá dự án");
      } else {
        toast.error("Lỗi khi xoá dự án trên máy chủ.");
      }
    } catch {
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Đã xoá dự án (offline)");
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Vui lòng nhập tên dự án"); return; }
    
    const currentImgs = form.images || [];
    const primaryImg = form.image || (currentImgs.length > 0 ? currentImgs[0] : "");
    const updatedImagesList = currentImgs.length > 0 ? currentImgs : (primaryImg ? [primaryImg] : []);

    const data = {
      ...form,
      slug: form.slug || toSlug(form.name),
      image: primaryImg,
      images: updatedImagesList,
    };

    try {
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/projects/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setProjects(projects.map((p) => (p.id === editing.id ? updated : p)));
          toast.success("Đã cập nhật dự án thành công!");
          setOpen(false);
        } else {
          if (res.status === 404) {
            const createRes = await fetch(`${API_BASE_URL}/projects`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              body: JSON.stringify(data),
            });
            if (createRes.ok) {
              const created = await createRes.json();
              setProjects(projects.map((p) => (p.id === editing.id ? created : p)));
              toast.success("Đã cập nhật và đồng bộ dự án lên máy chủ!");
              setOpen(false);
              return;
            }
          }
          setProjects(projects.map((p) => (p.id === editing.id ? { ...data, id: editing.id } : p)));
          toast.success("Đã cập nhật dự án (lưu nội bộ)");
          setOpen(false);
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const created = await res.json();
          setProjects([...projects, created]);
          toast.success("Đã thêm dự án thành công!");
          setOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || err.title || "Lỗi khi thêm dự án.");
        }
      }
    } catch (err) {
      console.error(err);
      if (editing) {
        setProjects(projects.map((p) => p.id === editing.id ? { ...data, id: editing.id } : p));
      } else {
        setProjects([...projects, { ...data, id: uid() }]);
      }
      toast.success("Đã lưu dự án (offline)");
      setOpen(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} quá lớn (tối đa 10MB).`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE_URL}/uploads/image/projects`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newUploadedUrls.push(data.url);
        } else {
          toast.error(`Tải ảnh ${file.name} thất bại.`);
        }
      }

      if (newUploadedUrls.length > 0) {
        setForm((f) => {
          const currentList = f.images || [];
          const combined = [...currentList, ...newUploadedUrls];
          return {
            ...f,
            images: combined,
            image: f.image || combined[0] || "",
          };
        });
        toast.success(`Đã tải lên ${newUploadedUrls.length} ảnh dự án!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể kết nối đến máy chủ upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    setForm((f) => {
      const currentList = f.images || [];
      if (currentList.includes(trimmed)) {
        toast.info("Link ảnh này đã có trong danh sách");
        return f;
      }
      const combined = [...currentList, trimmed];
      return {
        ...f,
        images: combined,
        image: f.image || combined[0] || "",
      };
    });
    setUrlInput("");
    toast.success("Đã thêm URL ảnh vào dự án!");
  };

  const removeImage = (indexToRemove: number) => {
    setForm((f) => {
      const updatedImgs = (f.images || []).filter((_, idx) => idx !== indexToRemove);
      const newPrimary = updatedImgs.includes(f.image) ? f.image : (updatedImgs[0] || "");
      return {
        ...f,
        images: updatedImgs,
        image: newPrimary,
      };
    });
  };

  const setPrimaryImage = (imgUrl: string) => {
    setForm((f) => ({
      ...f,
      image: imgUrl,
    }));
    toast.info("Đã chọn ảnh đại diện cho dự án");
  };

  function set(key: keyof ProjectForm, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Dự án</h1>
          <p className="mt-1 text-sm text-[#560213]/70">{projects.length} dự án</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#810C00] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-80">
          <Plus className="h-4 w-4" /> Thêm dự án
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#810C00]/20 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#560213] text-white border-b border-[#810C00]/20 text-left text-[12px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">Dự án</th>
              <th className="px-5 py-4">Địa điểm</th>
              <th className="px-5 py-4">Ngày hoàn thành</th>
              <th className="px-5 py-4">Nổi bật</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => {
              const displayImg = p.image || (p.images && p.images[0]) || "";
              const imgCount = p.images?.length || (p.image ? 1 : 0);
              return (
                <tr key={p.id} className={`transition-colors hover:bg-[#C76B86]/5 ${!p.isActive ? "opacity-40" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {displayImg && (
                        <img
                          src={displayImg.startsWith("http") ? displayImg : `http://localhost:5247${displayImg.startsWith("/") ? "" : "/"}${displayImg}`}
                          alt={p.name}
                          className="h-10 w-16 rounded-lg object-cover bg-[#C76B86]/15"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-[#560213]">{p.name}</div>
                        <div className="text-[11px] text-[#810C00]">{p.slug} • {imgCount} ảnh</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-[#560213]/70"><MapPin className="h-3.5 w-3.5" />{p.location}</div>
                  </td>
                  <td className="px-5 py-4 text-[#560213]/70">{formatDateDisplay(p.completedDate)}</td>
                  <td className="px-5 py-4">
                    {p.isFeatured
                      ? <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[12px] font-medium text-amber-700">Lớn 2×2</span>
                      : <span className="text-[#810C00]/50">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="py-12 text-center text-[#810C00]">Chưa có dự án nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                {editing ? "Sửa dự án" : "Thêm dự án"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[72vh] overflow-y-auto px-6 py-5 space-y-4">
              <F label="Tên dự án *">
                <input value={form.name} onChange={(e) => { set("name", e.target.value); if (!editing) set("slug", toSlug(e.target.value)); }} className={inp} />
              </F>
              <F label="Slug (URL)">
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inp} placeholder="tu-dong-tao-tu-ten" />
              </F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Địa điểm"><input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Bình Dương" className={inp} /></F>
                <F label="Ngày hoàn thành">
                  <input
                    type="date"
                    value={form.completedDate ? form.completedDate.split("T")[0] : ""}
                    onChange={(e) => set("completedDate", e.target.value)}
                    className={inp}
                  />
                </F>
              </div>

              {/* Multi Image Upload & URL input */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#560213]/70">
                  Hình ảnh dự án (Tải nhiều ảnh từ máy hoặc nhập URL)
                </label>
                <div className="space-y-3 rounded-xl border border-[#810C00]/20 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#810C00]/30 bg-[#810C00]/10 px-4 py-2.5 text-sm font-semibold text-[#810C00] transition-colors hover:bg-[#810C00] hover:text-white disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải ảnh...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" /> Tải nhiều ảnh từ máy
                        </>
                      )}
                    </button>
                    <span className="text-xs text-[#560213]/60 italic">Lưu vào server (wwwroot/uploads/projects)</span>
                  </div>

                  {/* Manual URL input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddUrl(); } }}
                      placeholder="Hoặc dán URL ảnh (https://... hoặc /photo/...)"
                      className="flex-1 rounded-xl border border-[#810C00]/20 bg-white px-3.5 py-2 text-xs text-[#560213] outline-none focus:border-[#810C00]"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#560213] px-3 py-2 text-xs font-semibold text-white hover:bg-[#810C00]"
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> Thêm URL
                    </button>
                  </div>

                  {/* Images List Grid */}
                  {(form.images || []).length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 pt-2">
                      {(form.images || []).map((imgUrl, idx) => {
                        const fullUrl = imgUrl.startsWith("http") ? imgUrl : `http://localhost:5247${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
                        const isPrimary = form.image === imgUrl || (!form.image && idx === 0);
                        return (
                          <div key={idx} className={`relative rounded-xl border p-1 bg-white transition-all ${isPrimary ? "ring-2 ring-[#810C00] border-[#810C00]" : "border-slate-200"}`}>
                            <img
                              src={fullUrl}
                              alt={`Project image ${idx + 1}`}
                              className="h-20 w-full rounded-lg object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = imgUrl;
                              }}
                            />
                            <div className="mt-1 flex items-center justify-between px-1">
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(imgUrl)}
                                className={`text-[10px] font-semibold flex items-center gap-0.5 ${isPrimary ? "text-[#810C00]" : "text-slate-400 hover:text-slate-700"}`}
                                title="Đặt làm ảnh đại diện"
                              >
                                <Star className={`h-3 w-3 ${isPrimary ? "fill-[#810C00]" : ""}`} />
                                {isPrimary ? "Ảnh bìa" : "Đặt bìa"}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="text-red-500 hover:text-red-700 p-0.5"
                                title="Xoá ảnh này"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-[#560213]/60 italic py-2 text-center">Chưa chọn ảnh nào cho dự án.</div>
                  )}
                </div>
              </div>

              <F label="Mô tả ngắn">
                <textarea value={form.shortDescription ?? ""} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className={inp + " resize-none"} />
              </F>
              <F label="Mô tả chi tiết (description)">
                <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} className={inp + " resize-none"} />
              </F>
              <div className="grid grid-cols-3 gap-3 items-end">
                <F label="Thứ tự"><input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", parseInt(e.target.value) || 0)} className={inp} /></F>
                <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="h-4 w-4 rounded" />
                  <span className="text-sm text-[#560213]">Card lớn 2×2</span>
                </label>
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
