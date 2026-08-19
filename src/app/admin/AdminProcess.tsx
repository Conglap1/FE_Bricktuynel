import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../lib/store";
import type { ProcessStep } from "../lib/store";

const EMPTY: ProcessStep = { step: "", title: "", desc: "", image: "" };

export function AdminProcess() {
  const { process, setProcess } = useStore();
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<ProcessStep>(EMPTY);

  function openAdd() {
    setEditIdx(null);
    setForm({ ...EMPTY, step: String(process.length + 1).padStart(2, "0") });
    setOpen(true);
  }

  function openEdit(i: number) {
    setEditIdx(i);
    setForm({ ...process[i] });
    setOpen(true);
  }

  function handleDelete(i: number) {
    setProcess(process.filter((_, idx) => idx !== i));
    toast.success("Đã xoá bước");
  }

  function move(i: number, dir: -1 | 1) {
    const arr = [...process];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setProcess(arr);
  }

  function handleSave() {
    if (!form.title.trim()) { toast.error("Vui lòng nhập tiêu đề"); return; }
    if (editIdx !== null) {
      const arr = [...process];
      arr[editIdx] = form;
      setProcess(arr);
      toast.success("Đã cập nhật bước");
    } else {
      setProcess([...process, form]);
      toast.success("Đã thêm bước");
    }
    setOpen(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Quy trình</h1>
          <p className="mt-1 text-sm text-[#560213]/70">{process.length} bước sản xuất</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-[#810C00] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-80">
          <Plus className="h-4 w-4" /> Thêm bước
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {process.map((s, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-[#810C00]/20 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 text-[#810C00]/50 hover:text-[#560213]/80 disabled:opacity-30">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === process.length - 1} className="rounded p-0.5 text-[#810C00]/50 hover:text-[#560213]/80 disabled:opacity-30">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-3xl font-black text-slate-100" style={{ fontFamily: "var(--font-display)", lineHeight: 1 }}>
              {s.step}
            </span>
            {s.image && (
              <img src={s.image} alt={s.title} className="h-14 w-20 rounded-xl object-cover bg-[#C76B86]/15 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#560213] truncate">{s.title}</div>
              <div className="mt-0.5 text-[13px] text-[#560213]/70 truncate">{s.desc}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEdit(i)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-slate-900 hover:text-[#560213]">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(i)} className="rounded-lg border border-[#810C00]/20 p-1.5 text-[#810C00] hover:border-red-500 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#810C00]/10 px-6 py-4">
              <h2 className="font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>
                {editIdx !== null ? "Sửa bước" : "Thêm bước"}
              </h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-[#810C00] hover:text-[#560213]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-24">
                  <label className={lbl}>Số thứ tự</label>
                  <input value={form.step} onChange={(e) => setForm({ ...form, step: e.target.value })} placeholder="01" className={inp} />
                </div>
                <div className="flex-1">
                  <label className={lbl}>Tiêu đề *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>Mô tả</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} className={inp + " resize-none"} />
              </div>
              <div>
                <label className={lbl}>URL hình ảnh</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inp} />
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

const lbl = "mb-1.5 block text-[12px] font-semibold text-[#560213]/70";
const inp = "w-full rounded-xl border border-[#810C00]/20 bg-[#C76B86]/5 px-3.5 py-2.5 text-sm text-[#560213] outline-none transition-colors focus:border-[#810C00] focus:bg-white";
