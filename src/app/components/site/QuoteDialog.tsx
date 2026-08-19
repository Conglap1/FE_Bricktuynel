import { useState, type FormEvent } from "react";
import { AnimatePresence } from "motion/react";
import { X, Send, CheckCircle2, FileText } from "lucide-react";
import { motion } from "../../lib/motion";
import { useQuote } from "./QuoteContext";
import { API_BASE_URL } from "../../lib/store";

export function QuoteDialog() {
  const { open, product, closeQuote } = useQuote();
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const quantity = formData.get("quantity")?.toString() || "";
    const note = formData.get("note")?.toString() || "";

    const contentParts = [];
    if (product) contentParts.push(`[Sản phẩm: ${product}]`);
    if (quantity) contentParts.push(`[Số lượng: ${quantity} viên]`);
    if (note) contentParts.push(note);
    const content = contentParts.join("\n").trim() || "Yêu cầu báo giá";

    try {
      await fetch(`${API_BASE_URL}/contact-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email: "",
          content,
        }),
      });
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu báo giá:", err);
    }

    setSent(true);
    setTimeout(() => {
      setSent(false);
      closeQuote();
    }, 1800);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-[#560213]/60 backdrop-blur-sm" onClick={closeQuote} />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-lg rounded-t-3xl bg-white p-7 shadow-2xl sm:rounded-3xl sm:p-9"
          >
            <button
              onClick={closeQuote}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
              <FileText className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-foreground" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Yêu cầu báo giá
            </h3>
            {product && (
              <p className="mt-1 text-[15px] text-muted-foreground">
                Sản phẩm: <span className="font-semibold text-primary">{product}</span>
              </p>
            )}

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <input name="fullName" required placeholder="Họ và tên" className={inputCls} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="phone" required placeholder="Số điện thoại" className={inputCls} />
                <input name="quantity" placeholder="Số lượng (viên)" className={inputCls} />
              </div>
              <textarea name="note" rows={3} placeholder="Ghi chú thêm…" className={`${inputCls} resize-none`} />
              <button
                type="submit"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors ${
                  sent ? "bg-[#560213]" : "bg-primary shadow-[0_10px_30px_rgba(0,0,0,0.20)]"
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Đã gửi thành công!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Gửi yêu cầu
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-input-background px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";
