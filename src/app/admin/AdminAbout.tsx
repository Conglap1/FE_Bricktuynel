import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore, DEFAULT_ABOUT, type AboutData } from "../lib/store";

export function AdminAbout() {
  const { about, setAbout } = useStore();
  const [form, setForm] = useState<AboutData>({ ...about, points: [...about.points] });

  function handleSave() {
    setAbout(form);
    toast.success("Đã lưu nội dung Giới thiệu");
  }

  function addPoint() {
    setForm({ ...form, points: [...form.points, ""] });
  }

  function removePoint(i: number) {
    setForm({ ...form, points: form.points.filter((_, idx) => idx !== i) });
  }

  function setPoint(i: number, val: string) {
    setForm({ ...form, points: form.points.map((p, idx) => (idx === i ? val : p)) });
  }

  function handleReset() {
    setForm({ ...DEFAULT_ABOUT, points: [...DEFAULT_ABOUT.points] });
    toast("Đã khôi phục mặc định");
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#560213]" style={{ fontFamily: "var(--font-display)" }}>Giới thiệu</h1>
          <p className="mt-1 text-sm text-[#560213]/70">Nội dung section About trên trang chủ và trang Giới thiệu</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="rounded-xl border border-[#810C00]/20 px-4 py-2 text-sm text-[#560213]/70 hover:bg-[#C76B86]/5">
            Khôi phục
          </button>
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-[#810C00] px-5 py-2 text-sm font-semibold text-white hover:opacity-80">
            <Save className="h-4 w-4" /> Lưu
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-[#810C00]/20 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-[#560213]">Nội dung chính</h2>
          <div>
            <label className={labelCls}>Tiêu đề</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Mô tả / Đoạn giới thiệu</label>
            <textarea
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              rows={5}
              className={inputCls + " resize-none"}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#810C00]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#560213]">Danh sách điểm mạnh</h2>
            <button onClick={addPoint} className="inline-flex items-center gap-1.5 rounded-lg border border-[#810C00]/20 px-3 py-1.5 text-[12px] font-medium text-[#560213]/80 hover:bg-[#C76B86]/5">
              <Plus className="h-3.5 w-3.5" /> Thêm điểm
            </button>
          </div>
          <div className="space-y-2.5">
            {form.points.map((pt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="shrink-0 grid h-6 w-6 place-items-center rounded-full bg-[#C76B86]/15 text-[11px] font-bold text-[#560213]/70">
                  {i + 1}
                </span>
                <input
                  value={pt}
                  onChange={(e) => setPoint(i, e.target.value)}
                  className={inputCls + " flex-1"}
                />
                <button onClick={() => removePoint(i)} className="shrink-0 rounded-lg p-1.5 text-[#810C00]/50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelCls = "mb-1.5 block text-[12px] font-semibold text-[#560213]/70";
const inputCls = "w-full rounded-xl border border-[#810C00]/20 bg-[#C76B86]/5 px-3.5 py-2.5 text-sm text-[#560213] outline-none transition-colors focus:border-[#810C00] focus:bg-white";
