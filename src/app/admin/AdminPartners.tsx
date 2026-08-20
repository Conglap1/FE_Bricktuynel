import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Globe } from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL, getAuthHeaders, getImageUrl, FALLBACK_IMAGE } from "../lib/store";
import type { Partner } from "../lib/store";
import { ImageUploadInput } from "./ImageUploadInput";

type PartnerForm = Omit<Partner, "id">;

const EMPTY: PartnerForm = { name: "", logoPath: "", website: "", displayOrder: 0, isActive: true };

function uid() { return Date.now(); }

export function AdminPartners() {
  const { partners, setPartners } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<PartnerForm>(EMPTY);

  function openAdd() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: Partner) {
    setEditing(p);
    setForm({ name: p.name, logoPath: p.logoPath ?? "", website: p.website ?? "", displayOrder: p.displayOrder, isActive: p.isActive });
    setOpen(true);
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/partners/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setPartners(partners.filter((p) => p.id !== id));
        toast.success("Đã xoá đối tác");
      } else {
        toast.error("Lỗi khi xoá đối tác trên máy chủ.");
      }
    } catch {
      setPartners(partners.filter((p) => p.id !== id));
      toast.success("Đã xoá đối tác (offline)");
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Vui lòng nhập tên đối tác"); return; }

    try {
      if (editing) {
        const res = await fetch(`${API_BASE_URL}/partners/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated = await res.json();
          setPartners(partners.map((p) => (p.id === editing.id ? updated : p)));
          toast.success("Đã cập nhật đối tác thành công!");
          setOpen(false);
        } else {
          toast.error("Lỗi khi cập nhật đối tác trên máy chủ.");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/partners`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const created = await res.json();
          setPartners([created, ...partners]);
          toast.success("Đã thêm đối tác thành công!");
          setOpen(false);
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.message || err.title || "Lỗi khi thêm đối tác.");
        }
      }
    } catch (err) {
      console.error(err);
      if (editing) {
        setPartners(partners.map((p) => (p.id === editing.id ? { ...form, id: editing.id } : p)));
      } else {
        setPartners([{ ...form, id: uid() }, ...partners]);
      }
      toast.success("Đã lưu đối tác (offline)");
      setOpen(false);
    }
  }

  function set(key: keyof PartnerForm, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Đối tác</h1>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#560213]/70">{partners?.length || 0} đối tác</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#810C00] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-80 shrink-0">
          <Plus className="h-4 w-4" /> Thêm đối tác
        </button>
      </div>

      <div className="mt-6 sm:mt-8 overflow-x-auto rounded-2xl border border-[#810C00]/20 bg-white shadow-sm">
        <table className="w-full text-xs sm:text-sm min-w-[500px]">
          <thead className="bg-[#560213] text-white border-b border-[#810C00]/20 text-left text-[12px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-4">Đối tác</th>
              <th className="px-5 py-4">Website</th>
              <th className="px-5 py-4">Thứ tự</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {partners?.map((p) => (
              <tr key={p.id} className={`transition-colors hover:bg-[#C76B86]/5 ${!p.isActive ? "opacity-40" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {p.logoPath && (
                      <img
                        src={getImageUrl(p.logoPath)}
                        alt={p.name}
                        className="h-10 w-16 rounded-lg object-contain bg-[#C76B86]/15"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    )}
                    <div className="font-semibold text-[#560213] leading-snug">{p.name}</div>
                  </div>
                </td>

                <td className="px-5 py-4 text-[13px] text-[#560213]/70">
                  {p.website ? <a href={p.website} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">{p.website}</a> : "—"}
                </td>
                <td className="px-5 py-4 text-[13px] text-[#560213]/70">
                  {p.displayOrder}
                </td>
                <td className="px-5 py-4">
                  {p.isActive
                    ? <span className="rounded-full bg-[#C76B86]/20 px-2.5 py-0.5 text-[12px] font-medium text-[#560213]">Hiển thị</span>
                    : <span className="rounded-full bg-[#C76B86]/15 px-2.5 py-0.5 text-[12px] font-medium text-[#560213]/70">Ẩn</span>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!partners || partners.length === 0) && (
              <tr><td colSpan={5} className="py-12 text-center text-[#810C00]">Chưa có đối tác nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                {editing ? "Sửa đối tác" : "Thêm đối tác"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]"><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
              <F label="Tên đối tác *">
                <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} />
              </F>
              <ImageUploadInput
                label="Logo đối tác (Tải file hoặc dùng HTTPS)"
                value={form.logoPath || ""}
                onChange={(url) => set("logoPath", url)}
                folder="partners"
                allowExternalUrl={true}
              />
              <F label="Website">
                <input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." className={inp} />
              </F>
              <div className="grid grid-cols-2 gap-3 items-end">
                <F label="Thứ tự (nhỏ xếp trước)">
                  <input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", parseInt(e.target.value) || 0)} className={inp} />
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
