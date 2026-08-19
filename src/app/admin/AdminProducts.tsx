import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, X, Save, Upload, Star, Loader2, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL, getAuthHeaders, getImageUrl, FALLBACK_IMAGE } from "../lib/store";
import { compressImageFile } from "../lib/imageCompressor";
import type { Product } from "../lib/data";

type ProductForm = Omit<Product, "id">;

const EMPTY: ProductForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  length: 220,
  width: 105,
  height: 60,
  weight: undefined,
  holeCount: undefined,
  compressionStrength: undefined,
  waterAbsorption: undefined,
  isFeatured: true,
  displayOrder: 0,
  isActive: true,
  image: "",
  images: [],
};

function uid() { return Date.now(); }

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

export function AdminProducts() {
  const { products, setProducts } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [urlInput, setUrlInput] = useState("");

  function openAdd() { setEditing(null); setForm(EMPTY); setUrlInput(""); setOpen(true); }
  function openEdit(p: Product) {
    setEditing(p);
    setUrlInput("");
    const existingImgs = (p.images && p.images.length > 0)
      ? p.images
      : (p.image ? [p.image] : []);
    setForm({
      name: p.name, slug: p.slug, shortDescription: p.shortDescription, description: p.description,
      length: p.length, width: p.width, height: p.height, weight: p.weight,
      holeCount: p.holeCount, compressionStrength: p.compressionStrength, waterAbsorption: p.waterAbsorption,
      isFeatured: p.isFeatured, displayOrder: p.displayOrder, isActive: p.isActive,
      image: p.image || existingImgs[0] || "",
      images: existingImgs,
    });
    setOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success("Đã xoá sản phẩm");
      } else {
        toast.error("Không thể xoá sản phẩm trên máy chủ.");
      }
    } catch {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Đã xoá sản phẩm (offline)");
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Vui lòng nhập tên sản phẩm"); return; }
    
    // Ensure primary image is set
    const currentImgs = form.images || [];
    const primaryImg = form.image || (currentImgs.length > 0 ? currentImgs[0] : "");
    const updatedImagesList = currentImgs.length > 0 ? currentImgs : (primaryImg ? [primaryImg] : []);

    const data = {
      ...form,
      slug: form.slug || toSlug(form.name),
      image: primaryImg,
      images: updatedImagesList
    };

    try {
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map((p) => (p.id === editing.id ? updated : p)));
          toast.success("Đã cập nhật sản phẩm thành công!");
          setOpen(false);
        } else {
          if (res.status === 404) {
            const createRes = await fetch(`${API_BASE_URL}/products`, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...getAuthHeaders() },
              body: JSON.stringify(data),
            });
            if (createRes.ok) {
              const created = await createRes.json();
              setProducts(products.map((p) => (p.id === editing.id ? created : p)));
              toast.success("Đã cập nhật và đồng bộ sản phẩm lên máy chủ!");
              setOpen(false);
              return;
            }
          }
          setProducts(products.map((p) => (p.id === editing.id ? { ...data, id: editing.id } : p)));
          toast.success("Đã cập nhật sản phẩm (lưu nội bộ)");
          setOpen(false);
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const created = await res.json();
          setProducts([...products, created]);
          toast.success("Đã thêm sản phẩm thành công!");
          setOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || err.title || "Lỗi khi thêm sản phẩm trên máy chủ.");
        }
      }
    } catch (err) {
      console.error(err);
      if (editing) {
        setProducts(products.map((p) => p.id === editing.id ? { ...data, id: editing.id } : p));
        toast.success("Đã cập nhật sản phẩm (offline)");
      } else {
        setProducts([...products, { ...data, id: uid() }]);
        toast.success("Đã thêm sản phẩm (offline)");
      }
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
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`File ${file.name} quá lớn (tối đa 50MB).`);
          continue;
        }

        const compressedFile = await compressImageFile(file);
        const formData = new FormData();
        formData.append("file", compressedFile);

        const res = await fetch(`${API_BASE_URL}/uploads/image/products`, {
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
        toast.success(`Đã tải lên ${newUploadedUrls.length} ảnh sản phẩm!`);
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
    toast.success("Đã thêm URL ảnh vào sản phẩm!");
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
    toast.info("Đã chọn ảnh chính cho sản phẩm");
  };

  function num(v: string) { const n = parseFloat(v); return isNaN(n) ? undefined : n; }
  function set(key: keyof ProductForm, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Sản phẩm</h1>
          <p className="mt-1 text-sm text-[#560213]/70">{products.length} sản phẩm</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#810C00] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-80">
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#810C00]/20 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#560213] text-white border-b border-[#810C00]/20 text-left text-[12px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">Sản phẩm</th>
              <th className="px-5 py-4">Kích thước (mm)</th>
              <th className="px-5 py-4">Số lỗ</th>
              <th className="px-5 py-4">Nén (kG/cm²)</th>
              <th className="px-5 py-4">Hút nước (%)</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const displayImg = p.image || (p.images && p.images[0]) || "";
              const imgCount = p.images?.length || (p.image ? 1 : 0);
              return (
                <tr key={p.id} className={`transition-colors hover:bg-[#C76B86]/5 ${!p.isActive ? "opacity-40" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {displayImg && (
                        <img
                          src={getImageUrl(displayImg)}
                          alt={p.name}
                          className="h-10 w-14 rounded-lg object-cover bg-[#C76B86]/15"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                          }}
                        />
                      )}
                      <div>
                        <div className="font-semibold text-[#560213] flex items-center gap-2">
                          {p.name}
                          {p.isFeatured && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                              Nổi bật
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#810C00]">{p.slug} • {imgCount} ảnh</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#560213]/80">{p.length}×{p.width}×{p.height}</td>
                  <td className="px-5 py-4 text-[#560213]/80">{p.holeCount ?? "—"}</td>
                  <td className="px-5 py-4 text-[#560213]/80">{p.compressionStrength != null ? `≥ ${p.compressionStrength}` : "—"}</td>
                  <td className="px-5 py-4 text-[#560213]/80">{p.waterAbsorption != null ? `≤ ${p.waterAbsorption}%` : "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-[#810C00]">Chưa có sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                {editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]"><X className="h-5 w-5" /></button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto px-6 py-5 space-y-4">
              {/* Tên & slug */}
              <F label="Tên sản phẩm *">
                <input value={form.name} onChange={(e) => { set("name", e.target.value); if (!editing) set("slug", toSlug(e.target.value)); }} className={inp} />
              </F>
              <F label="Slug (URL)">
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inp} placeholder="tu-dong-tao-tu-ten" />
              </F>

              {/* Multi Image Upload */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#560213]/70">
                  Hình ảnh sản phẩm (có thể chọn nhiều ảnh)
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
                    <span className="text-xs text-[#560213]/60 italic">Lưu vào server (wwwroot/uploads/products)</span>
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
                      className="rounded-xl bg-[#560213] px-3 py-2 text-xs font-semibold text-white hover:bg-[#810C00]"
                    >
                      + Thêm URL
                    </button>
                  </div>

                  {/* Images List Grid */}
                  {(form.images || []).length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 pt-2">
                      {(form.images || []).map((imgUrl, idx) => {
                        const fullUrl = getImageUrl(imgUrl);
                        const isPrimary = form.image === imgUrl || (!form.image && idx === 0);
                        return (
                          <div key={idx} className={`relative rounded-xl border p-1 bg-white transition-all ${isPrimary ? "ring-2 ring-[#810C00] border-[#810C00]" : "border-slate-200"}`}>
                            <img
                              src={fullUrl}
                              alt={`Product image ${idx + 1}`}
                              className="h-20 w-full rounded-lg object-cover bg-[#C76B86]/15"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                              }}
                            />
                            <div className="mt-1 flex items-center justify-between px-1">
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(imgUrl)}
                                className={`text-[10px] font-semibold flex items-center gap-0.5 ${isPrimary ? "text-[#810C00]" : "text-slate-400 hover:text-slate-700"}`}
                                title="Đặt làm ảnh chính"
                              >
                                <Star className={`h-3 w-3 ${isPrimary ? "fill-[#810C00]" : ""}`} />
                                {isPrimary ? "Ảnh chính" : "Đặt chính"}
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
                    <div className="text-xs text-[#560213]/60 italic py-2 text-center">Chưa chọn ảnh nào cho sản phẩm.</div>
                  )}
                </div>
              </div>

              <F label="Mô tả ngắn (hiển thị trên card)">
                <textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={3} className={inp + " resize-none"} />
              </F>
              <F label="Mô tả chi tiết (description)">
                <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={4} className={inp + " resize-none"} />
              </F>

              {/* Kích thước */}
              <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#810C00]">Kích thước (mm)</div>
                <div className="grid grid-cols-3 gap-3">
                  <F label="Dài (L)"><input type="number" value={form.length} onChange={(e) => set("length", num(e.target.value) ?? 220)} className={inp} /></F>
                  <F label="Rộng (W)"><input type="number" value={form.width} onChange={(e) => set("width", num(e.target.value) ?? 105)} className={inp} /></F>
                  <F label="Cao (H)"><input type="number" value={form.height} onChange={(e) => set("height", num(e.target.value) ?? 60)} className={inp} /></F>
                </div>
              </div>

              {/* Thông số kỹ thuật */}
              <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-[#810C00]">Thông số kỹ thuật</div>
                <div className="grid grid-cols-3 gap-3">
                  <F label="Số lỗ"><input type="number" value={form.holeCount ?? ""} onChange={(e) => set("holeCount", num(e.target.value))} placeholder="—" className={inp} /></F>
                  <F label="Cường độ nén"><input type="number" value={form.compressionStrength ?? ""} onChange={(e) => set("compressionStrength", num(e.target.value))} placeholder="kG/cm²" className={inp} /></F>
                  <F label="Độ hút nước"><input type="number" value={form.waterAbsorption ?? ""} onChange={(e) => set("waterAbsorption", num(e.target.value))} placeholder="%" className={inp} /></F>
                </div>
              </div>
              <F label="Trọng lượng (kg/viên)">
                <input type="number" step="0.1" value={form.weight ?? ""} onChange={(e) => set("weight", num(e.target.value))} placeholder="—" className={inp} />
              </F>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3">
                <F label="Thứ tự"><input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", parseInt(e.target.value) || 0)} className={inp} /></F>
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="h-4 w-4 rounded" />
                  <span className="text-sm font-semibold text-[#560213]">Nổi bật (Trang chủ)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer pt-6">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 rounded" />
                  <span className="text-sm font-semibold text-[#560213]">Hiển thị</span>
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
