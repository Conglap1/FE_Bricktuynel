import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, getAuthHeaders, getImageUrl } from "../lib/store";

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "products" | "projects" | "news" | "partners";
  allowExternalUrl?: boolean;
}

export function ImageUploadInput({
  label,
  value,
  onChange,
  folder,
  allowExternalUrl = false,
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File ảnh quá lớn (tối đa 10MB).");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/uploads/image/${folder}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Tải ảnh thất bại.");
      }

      const data = await res.json();
      onChange(data.url);
      toast.success(`Đã tải ảnh lên wwwroot/uploads/${folder}/ thành công!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Không thể kết nối đến máy chủ upload.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Convert relative url to full preview url if needed
  const displayUrl = getImageUrl(value);


  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-[#560213]/70">
        {label}
      </label>

      <div className="space-y-2">
        {/* Upload Button Area */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#810C00]/30 bg-[#810C00]/5 px-4 py-2.5 text-sm font-semibold text-[#810C00] transition-colors hover:bg-[#810C00] hover:text-white disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tải ảnh...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" /> Tải ảnh từ máy (lưu wwwroot)
              </>
            )}
          </button>

          {allowExternalUrl && (
            <span className="text-xs text-[#560213]/60 italic">
              (Hoặc nhập URL HTTPS bên ngoài ở dưới)
            </span>
          )}
        </div>

        {/* Text Input fallback/edit for path */}
        {allowExternalUrl ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... hoặc /uploads/..."
            className="w-full rounded-xl border border-[#810C00]/20 bg-[#C76B86]/5 px-3.5 py-2.5 text-sm text-[#560213] outline-none transition-colors focus:border-[#810C00] focus:bg-white"
          />
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={value || "Chưa chọn ảnh nào"}
              placeholder={`/uploads/${folder}/...`}
              className="w-full rounded-xl border border-[#810C00]/20 bg-slate-100 px-3.5 py-2 text-xs text-[#560213]/80 font-mono outline-none"
            />
          </div>
        )}

        {/* Image Preview Box */}
        {value && (
          <div className="relative mt-2 inline-block rounded-xl border border-[#810C00]/20 p-1.5 bg-slate-50">
            <img
              src={displayUrl}
              alt="Preview"
              className="h-24 w-36 rounded-lg object-cover bg-white"
              onError={(e) => {
                // If local image fails to load, fallback image
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150?text=No+Image";
              }}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700"
              title="Xoá ảnh"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
