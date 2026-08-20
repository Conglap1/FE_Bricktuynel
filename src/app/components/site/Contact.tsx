import { useState, useRef, useEffect, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ArrowUpRight, ChevronDown, Check, X, Search, AlertCircle } from "lucide-react";
import { Reveal, MagneticButton } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";
import { useStore, API_BASE_URL } from "../../lib/store";
import { CATEGORIES } from "../../lib/data";

export function Contact() {
  const { contact, products } = useStore();
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Multi-select state for products of interest
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derive available product list: prioritize active dynamic products, fallback to categories/default if empty
  const activeProducts = products.filter((p) => p.isActive);
  const productOptions =
    activeProducts.length > 0
      ? activeProducts.map((p) => ({ id: String(p.id), name: p.name, image: p.image }))
      : CATEGORIES.map((c) => ({ id: c.id, name: c.name, image: c.image }));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = productOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProductSelection = (name: string) => {
    setSelectedProducts((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  const removeProductSelection = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProducts((prev) => prev.filter((item) => item !== name));
  };

  const INFO_CARDS = [
    {
      icon: Phone,
      label: "HOTLINE TƯ VẤN 24/7",
      value: contact.hotline ? `${contact.hotline} · ${contact.phone}` : "1900 1234 · 0908 555 888",

      actionText: "Gọi ngay",
      actionHref: `tel:${(contact.hotline || "19001234").replace(/\s/g, "")}`,
      gradient: "from-[#800A23] to-[#560213]",
      badge: (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Đang hoạt động
        </span>
      ),
    },
    {
      icon: Mail,
      label: "EMAIL BÁO GIÁ & HỖ TRỢ",
      value: contact.email || "kinhdoanh@gachthuanloi.vn",

      actionText: "Gửi email",
      actionHref: `mailto:${contact.email || "kinhdoanh@gachthuanloi.vn"}`,
      gradient: "from-[#A02842] to-[#6E0A21]",
    },
    {
      icon: MapPin,
      label: "ĐỊA CHỈ NHÀ MÁY",
      value: contact.address || "KCN Mỹ Phước, Bến Cát, Bình Dương",

      actionText: "Xem bản đồ",
      actionHref: "#google-map-section",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById("google-map-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
      gradient: "from-[#8C1F37] to-[#560213]",
    },
    {
      icon: Clock,
      label: "GIỜ LÀM VIỆC",
      value: contact.workingHours || "Thứ 2 – Thứ 7 · 07:30 – 17:30",

      actionText: "Giờ phục vụ",
      gradient: "from-[#A02842] to-[#560213]",
    },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const name = formData.get("name")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const productStr = selectedProducts.length > 0 ? selectedProducts.join(", ") : (formData.get("product")?.toString() || "");
    const message = formData.get("message")?.toString().trim() || "";

    if (!name || !phone || !message) {
      setErrorMsg("Vui lòng điền đầy đủ các thông tin bắt buộc (*): Họ tên, Số điện thoại và Nội dung.");
      return;
    }

    const content = productStr ? `[Sản phẩm quan tâm: ${productStr}]\n${message}`.trim() : message;

    try {
      await fetch(`${API_BASE_URL}/contact-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          phone: phone,
          email: email,
          content: content,
        }),
      });
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu liên hệ:", err);
    }

    setSent(true);
    setSelectedProducts([]);
    formEl.reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <section id="contact" className="relative bg-gradient-to-b from-[#FAF7F6] via-secondary/30 to-white py-24 md:py-32 overflow-hidden">
      {/* Decorative background glow accents */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-[#C76B86]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* Left info column */}
        <div className="flex flex-col justify-between">
          <div>
            <SectionHeading
              eyebrow="Liên hệ & Báo giá"
              title={<>Bắt đầu công trình<br />của bạn hôm nay</>}
              desc="Để lại thông tin, Thuận Lợi sẽ liên hệ tư vấn và gửi báo giá cho bạn trong thời gian sớm nhất."
            />

            {/* Info Cards Grid */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:gap-6">
              {INFO_CARDS.map((card, i) => {
                const CardTag = card.actionHref && card.actionHref !== "#google-map-section" ? "a" : "div";
                const isEmail = card.label.includes("EMAIL");
                return (
                  <Reveal key={card.label} delay={i * 0.08} className="h-full">
                    <CardTag
                      href={card.actionHref !== "#google-map-section" ? card.actionHref : undefined}
                      onClick={card.onClick}
                      className="group relative flex h-full flex-col justify-between rounded-2xl border border-primary/15 bg-white p-5 sm:p-6 shadow-[0_6px_30px_rgba(86,2,19,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_20px_45px_rgba(86,2,19,0.12)] cursor-pointer"
                    >
                      {/* Ambient background hover glow */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="relative">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                          >
                            <card.icon className="h-5 w-5" strokeWidth={2.2} />
                          </span>
                          {card.badge}
                        </div>

                        <div className="mt-4">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                            {card.label}
                          </div>
                          <div
                            className={`mt-1.5 font-bold tracking-tight text-foreground leading-relaxed group-hover:text-primary transition-colors ${
                              isEmail ? "text-[13px] sm:text-[13.5px] lg:text-[14px] truncate" : "text-[15px] sm:text-[16px]"
                            }`}
                            title={isEmail ? card.value : undefined}
                          >
                            {card.value}
                          </div>
                          {card.subText && (
                            <p className="mt-1.5 text-[12px] leading-normal text-muted-foreground/80">
                              {card.subText}
                            </p>
                          )}
                        </div>
                      </div>

                      {card.actionText && (
                        <div className="relative mt-4 flex items-center gap-1 text-[12px] font-bold text-primary opacity-90 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                          <span>{card.actionText}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      )}
                    </CardTag>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side: Form */}
        <Reveal delay={0.1} className="h-full">
          <form
            onSubmit={handleSubmit}
            className="relative flex h-full flex-col justify-between rounded-3xl border border-primary/15 bg-white p-7 shadow-[0_24px_60px_rgba(86,2,19,0.08)] sm:p-9"
          >
            <div className="mb-5 pb-4 border-b border-border/60">
              <h3 className="text-xl font-bold text-foreground">Gửi yêu cầu báo giá</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">Điền thông tin bên dưới, chúng tôi sẽ liên hệ tư vấn và báo giá sớm nhất</p>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Họ và tên"
                  name="name"
                  required
                  validationMessage="Vui lòng nhập họ và tên của bạn"
                  placeholder="Nguyễn Văn A"
                />
                <Field
                  label="Số điện thoại"
                  name="phone"
                  type="tel"
                  required
                  numbersOnly
                  inputMode="numeric"
                  maxLength={11}
                  pattern="[0-9]{9,11}"
                  validationMessage="Vui lòng nhập số điện thoại liên hệ"
                  placeholder="0908123456"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="email@congty.vn (không bắt buộc)"
                />
                <div className="relative" ref={dropdownRef}>
                  <FieldLabel>Loại sản phẩm quan tâm</FieldLabel>
                  <input
                    type="hidden"
                    name="product"
                    value={selectedProducts.join(", ")}
                  />
                  
                  {/* Multi-select Trigger container */}
                  <div
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                    className={`group flex min-h-[50px] w-full items-center justify-between gap-2 rounded-xl border bg-input-background px-3.5 py-2 text-[14px] text-foreground outline-none transition-all cursor-pointer ${
                      isSelectOpen
                        ? "border-primary ring-2 ring-primary/20 bg-white"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                      {selectedProducts.length === 0 ? (
                        <span className="text-muted-foreground/70 text-[13.5px] sm:text-[14px] select-none truncate whitespace-nowrap">
                          Chọn sản phẩm quan tâm...
                        </span>
                      ) : (
                        selectedProducts.map((prodName) => (
                          <span
                            key={prodName}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-primary border border-primary/20 animate-in fade-in zoom-in-95 duration-150"
                          >
                            <span className="truncate max-w-[140px] sm:max-w-[160px]">{prodName}</span>
                            <button
                              type="button"
                              onClick={(e) => removeProductSelection(prodName, e)}
                              className="rounded-full p-0.5 text-primary/70 hover:bg-primary/20 hover:text-primary transition-colors"
                              title="Xoá chọn"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                      {selectedProducts.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                          {selectedProducts.length}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isSelectOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isSelectOpen && (
                    <div className="absolute left-0 right-0 top-[102%] z-50 rounded-2xl border border-primary/15 bg-white p-2.5 shadow-[0_16px_40px_rgba(86,2,19,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Header & Quick actions */}
                      <div className="mb-2 flex items-center justify-between px-2 pt-1 pb-2 border-b border-border/50">
                        <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                          Danh sách sản phẩm ({productOptions.length})
                        </span>
                        <div className="flex items-center gap-2">
                          {selectedProducts.length < productOptions.length && (
                            <button
                              type="button"
                              onClick={() => setSelectedProducts(productOptions.map((o) => o.name))}
                              className="text-[12px] font-semibold text-primary hover:underline"
                            >
                              Chọn tất cả
                            </button>
                          )}
                          {selectedProducts.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setSelectedProducts([])}
                              className="text-[12px] font-semibold text-muted-foreground hover:text-rose-600 hover:underline"
                            >
                              Bỏ chọn
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Search box if options > 4 */}
                      {productOptions.length > 4 && (
                        <div className="relative mb-2 px-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm nhanh sản phẩm..."
                            className="w-full rounded-xl border border-border/80 bg-secondary/30 pl-8 pr-3 py-1.5 text-[13px] text-foreground outline-none focus:border-primary focus:bg-white transition-all"
                          />
                        </div>
                      )}

                      {/* Options list */}
                      <div className="max-h-56 overflow-y-auto space-y-1 pr-1 text-[14px]">
                        {filteredOptions.length === 0 ? (
                          <div className="py-6 text-center text-[13px] text-muted-foreground">
                            Không tìm thấy sản phẩm phù hợp
                          </div>
                        ) : (
                          filteredOptions.map((opt) => {
                            const isChecked = selectedProducts.includes(opt.name);
                            return (
                              <div
                                key={opt.id}
                                onClick={() => toggleProductSelection(opt.name)}
                                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                                  isChecked
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground hover:bg-secondary/70"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                                      isChecked
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/40 bg-white group-hover:border-primary/60"
                                    }`}
                                  >
                                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                                  </div>
                                  <span className="truncate">{opt.name}</span>
                                </div>

                                {isChecked && (
                                  <span className="text-[11px] font-bold text-primary shrink-0">
                                    Đã chọn
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[120px]">
                <FieldLabel required>Nội dung / khối lượng dự kiến</FieldLabel>
                <textarea
                  name="message"
                  required
                  placeholder="Mô tả công trình, số lượng gạch, thời gian giao hàng mong muốn…"
                  onInvalid={(e) => {
                    e.currentTarget.setCustomValidity("Vui lòng nhập nội dung hoặc khối lượng dự kiến");
                  }}
                  onInput={(e) => {
                    e.currentTarget.setCustomValidity("");
                  }}
                  className="w-full flex-1 min-h-[110px] resize-none rounded-xl border border-border bg-input-background px-4 py-3 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="mt-6 pt-2">
              {errorMsg && (
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-[13px] font-medium text-rose-700 animate-in fade-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <MagneticButton
                strength={0.15}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-bold text-primary-foreground transition-all duration-300 ${
                  sent ? "bg-[#560213]" : "bg-gradient-to-r from-[#800A23] to-[#560213] hover:brightness-110 shadow-[0_12px_32px_rgba(86,2,19,0.25)]"
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" /> Đã gửi! Chúng tôi sẽ liên hệ sớm
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Gửi yêu cầu báo giá
                  </>
                )}
              </MagneticButton>
              <p className="mt-3 text-center text-[12px] text-muted-foreground">
                🔒 Thông tin của bạn được bảo mật tuyệt đối.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[13px] font-semibold text-foreground">
      {children}
      {required && <span className="ml-1 text-rose-500 font-bold" title="Bắt buộc nhập">*</span>}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  validationMessage,
  numbersOnly = false,
  maxLength,
  inputMode,
  pattern,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validationMessage?: string;
  numbersOnly?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  pattern?: string;
}) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        pattern={pattern}
        onInvalid={(e) => {
          const target = e.currentTarget;
          if (type === "email" && target.validity.typeMismatch) {
            target.setCustomValidity("Vui lòng nhập đúng định dạng email (ví dụ: email@congty.vn)");
          } else if (target.validity.patternMismatch && numbersOnly) {
            target.setCustomValidity("Số điện thoại hợp lệ gồm 9 đến 11 chữ số (ví dụ: 0908123456)");
          } else if (validationMessage) {
            target.setCustomValidity(validationMessage);
          } else if (required) {
            target.setCustomValidity(`Vui lòng điền ${label.toLowerCase()}`);
          }
        }}
        onInput={(e) => {
          if (numbersOnly) {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
          }
          e.currentTarget.setCustomValidity("");
        }}
        className="w-full rounded-xl border border-border bg-input-background px-4 py-3 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
