import { useState, useEffect } from "react";
import {
  Save,
  Building2,
  MapPin,
  Phone,
  PhoneCall,
  Mail,
  Clock,
  Globe,
  Map,
  Info,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, API_BASE_URL, getAuthHeaders, type ContactInfo } from "../lib/store";

export function AdminContact() {
  const { contact, setContact } = useStore();
  const [form, setForm] = useState<ContactInfo>({ ...contact });

  useEffect(() => {
    setForm({ ...contact });
  }, [contact]);

  async function handleSave() {
    try {
      const res = await fetch(`${API_BASE_URL}/contact-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const updated = await res.json();
        setContact(updated);
        toast.success("Đã lưu thông tin liên hệ thành công vào CSDL!");
      } else {
        toast.error("Lỗi khi lưu thông tin liên hệ trên máy chủ.");
      }
    } catch (err) {
      console.error(err);
      setContact(form);
      toast.success("Đã lưu thông tin liên hệ (offline)");
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="h-7 w-7 text-[#810C00]" />
            Thông tin Liên hệ
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý và cập nhật các kênh liên lạc hiển thị trên toàn bộ website
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#810C00] hover:bg-[#560213] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all active:scale-95"
          >
            <Save className="h-4.5 w-4.5" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* 2 Column Form Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Thông tin Doanh nghiệp & Hotline */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 lg:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <MapPin className="h-5 w-5 text-[#810C00]" />
            <h2 className="text-base font-bold text-slate-900">Thông tin Trụ sở & Hotline</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                Tên công ty
              </label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Công ty TNHH Một Thành Viên Thuận Lợi Mộc Hóa"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                Địa chỉ nhà máy / Trụ sở
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="KCN Mỹ Phước, Bến Cát, Bình Dương"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                Số điện thoại liên hệ / Hotline
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0918 701 472"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="kinhdoanh@gachthuanloi.vn"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  Giờ làm việc
                </label>
                <input
                  type="text"
                  value={form.workingHours}
                  onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  placeholder="T2 – T7 · 07:30 – 17:30"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Mạng xã hội & Bản đồ */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 lg:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Share2 className="h-5 w-5 text-[#810C00]" />
            <h2 className="text-base font-bold text-slate-900">Kênh Mạng xã hội & Bản đồ</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  Facebook Page / Messenger
                </label>
                <input
                  type="text"
                  value={form.facebook}
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-blue-500" />
                  Số Zalo
                </label>
                <input
                  type="text"
                  value={form.zalo}
                  onChange={(e) => setForm({ ...form, zalo: e.target.value })}
                  placeholder="https://zalo.me/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-900" />
                Đường dẫn TikTok
              </label>
              <input
                type="text"
                value={form.tiktok}
                onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Map className="h-4 w-4 text-emerald-600" />
                Google Maps Embed URL / Mã nhúng iframe
              </label>
              <textarea
                rows={2}
                value={form.googleMapEmbed}
                onChange={(e) => {
                  const val = e.target.value;
                  const match = val.match(/src=["']([^"']+)["']/i);
                  setForm({ ...form, googleMapEmbed: match ? match[1] : val });
                }}
                placeholder="https://maps.google.com/maps?q=... hoặc dán toàn bộ đoạn thẻ <iframe ...>"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-[#810C00] focus:bg-white focus:ring-1 focus:ring-[#810C00] resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                Mẹo: Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép HTML rồi dán vào đây.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-3.5 flex items-start gap-2.5">
              <Info className="h-4.5 w-4.5 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs lg:text-sm text-amber-900 leading-relaxed">
                Thông tin cập nhật sẽ lập tức áp dụng trên Chân trang (Footer), Trang Liên hệ và các nút gọi nhanh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
