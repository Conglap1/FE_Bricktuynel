import { Link } from "react-router";
import { ArrowRight, Phone, Mail, MapPin, Clock, CheckCircle2, Calendar } from "lucide-react";
import { IMAGES } from "../lib/data";
import { Hero } from "../components/site/Hero";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";
import { Reveal, Stagger, staggerItem, motion } from "../lib/motion";
import { SectionHeading } from "../components/site/SectionHeading";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useStore } from "../lib/store";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch { return iso; }
}

/* ─── "Xem thêm" button ─── */
function SeeMore({ to, label, dark = false, bg = "" }: { to: string; label: string; dark?: boolean; bg?: string }) {
  const base = bg || (dark ? "bg-black" : "bg-white");
  return (
    <div className={`flex justify-center pb-16 pt-2 ${base}`}>
      <Link
        to={to}
        className={`group inline-flex items-center gap-2.5 rounded-full border px-7 py-3.5 text-[14px] font-semibold transition-all ${
          dark
            ? "border-white/20 text-white/70 hover:border-white hover:text-white"
            : "border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/* ─── 1. News teaser (right after hero) ─── */
function NewsTeaser() {
  const { news } = useStore();
  const visible = news.filter((n) => n.isActive).slice(0, 3);
  return (
    <section className="bg-secondary/40 py-16 md:py-20">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              Tin tức & Sự kiện
            </span>
            <h2 className="mt-1 text-foreground" style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", fontWeight: 800, fontFamily: "var(--font-display)" }}>
              Cập nhật mới nhất
            </h2>
          </div>
          <Link to="/tin-tuc" className="group hidden shrink-0 items-center gap-2 text-[13px] font-semibold text-primary sm:inline-flex">
            Xem tất cả <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <Stagger className="grid gap-5 md:grid-cols-3">
          {visible.map((n) => (
            <motion.div key={n.id} variants={staggerItem}>
              <Link
                to={`/tin-tuc/${n.slug}`}
                className="group flex gap-4 rounded-2xl border border-border bg-white p-4 transition-shadow hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)]"
              >
                {n.thumbnailPath && (
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <img src={n.thumbnailPath} alt={n.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex min-w-0 flex-col">
                  {n.publishedAt && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
                      <Calendar className="h-3 w-3" />{formatDate(n.publishedAt)}
                    </span>
                  )}
                  <h3 className="mt-1 text-[14px] font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {n.title}
                  </h3>
                  {n.summary && (
                    <p className="mt-1 text-[12px] text-muted-foreground line-clamp-2">{n.summary}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─── 2. About teaser ─── */
function AboutTeaser() {
  const { about } = useStore();
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="h-px w-6 bg-foreground/30" /> Giới thiệu
            </span>
            <h2 className="mt-4 text-foreground" style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)", fontWeight: 800, lineHeight: 1.1, fontFamily: "var(--font-display)" }}>
              {about.title}
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground line-clamp-4">
              {about.desc}
            </p>
            <Link to="/gioi-thieu" className="group mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-foreground hover:gap-3 transition-all">
              Tìm hiểu thêm <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <ul className="space-y-3">
              {about.points.slice(0, 4).map((pt) => (
                <li key={pt} className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 px-5 py-4 text-[15px] text-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.2} />
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Products teaser (compact 4-col) ─── */
function ProductsTeaser() {
  const { products } = useStore();
  const active = products.filter((p) => p.isActive && p.isFeatured).slice(0, 4);
  return (
    <section className="bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading
          eyebrow="Dòng sản phẩm"
          title={<>Gạch nung Tuynel<br />Thuận Lợi</>}
          desc="Các sản phẩm chủ lực, đạt chuẩn QCVN 16:2023/BXD."
          align="center"
        />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((p) => (
            <motion.div key={p.id} variants={staggerItem} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <Link
                to={`/san-pham/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <ImageWithFallback src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground leading-snug" style={{ fontSize: "1rem" }}>{p.name}</h3>
                  <p className="mt-1.5 text-[13px] text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                  <div className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-primary">
                    Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─── 4. Process teaser (numbered steps, no images) ─── */
function ProcessTeaser() {
  const { process } = useStore();
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading
          eyebrow="Quy trình sản xuất"
          title={<>Từ đất sét đến<br />viên gạch hoàn thiện</>}
          align="center"
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-3">
          {process.map((s) => (
            <motion.div key={s.step} variants={staggerItem}
              className="rounded-2xl border border-border bg-secondary/30 p-6"
            >
              <span className="text-[2.8rem] font-black leading-none text-border" style={{ fontFamily: "var(--font-display)" }}>{s.step}</span>
              <h3 className="mt-3 font-bold text-foreground leading-snug" style={{ fontSize: "1rem" }}>{s.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground line-clamp-3">{s.desc}</p>
            </motion.div>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Link to="/quy-trinh" className="group inline-flex items-center gap-2.5 rounded-full border border-border px-7 py-3.5 text-[14px] font-semibold text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background">
            Xem quy trình chi tiết <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Projects teaser ─── */
function ProjectsTeaser() {
  const { projects } = useStore();
  const visible = projects.filter((p) => p.isActive).slice(0, 4);
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex items-end justify-between gap-4 mb-12">
          <SectionHeading eyebrow="Dự án tiêu biểu" title={<>Những công trình<br />đã tin dùng Thuận Lợi</>} />
          <Link to="/du-an" className="group hidden shrink-0 items-center gap-2 text-[13px] font-semibold text-primary sm:inline-flex">
            Tất cả dự án <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <motion.div key={p.id} variants={staggerItem}>
              <Link
                to={`/du-an/${p.slug}`}
                className="group relative flex h-52 overflow-hidden rounded-2xl border border-border bg-secondary"
              >
                <ImageWithFallback src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="font-bold text-white leading-snug">{p.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-[12px] text-white/70">
                    <MapPin className="h-3 w-3" />{p.location}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─── 6. Contact preview ─── */
function ContactTeaser() {
  const { contact } = useStore();
  const INFO = [
    {
      icon: Phone,
      label: "Hotline 24/7",
      value: contact.hotline ? `${contact.hotline} · ${contact.phone}` : "0908 555 888",
      subText: "Hỗ trợ cuộc gọi & Zalo miễn phí",
      actionText: "Gọi ngay",
      href: `tel:${(contact.hotline || contact.phone || "0908555888").replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email báo giá",
      value: contact.email || "kinhdoanh@gachthuanloi.vn",
      subText: "Phản hồi trong 2-4h làm việc",
      actionText: "Gửi mail",
      href: `mailto:${contact.email || "kinhdoanh@gachthuanloi.vn"}`,
      isEmail: true,
    },
    {
      icon: MapPin,
      label: "Địa chỉ Nhà máy",
      value: contact.address || "KCN Mỹ Phước, Bến Cát, Bình Dương",
      subText: "Diện tích sản xuất hơn 100.000m²",
      actionText: "Xem vị trí",
      href: "#google-map-section",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById("google-map-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: contact.workingHours || "Thứ 2 – Thứ 7 · 07:30 – 17:30",
      subText: "Nghỉ Chủ Nhật & các ngày Lễ lớn",
      actionText: "Giờ phục vụ",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-[#560213] py-28 md:py-36 min-h-[580px] md:min-h-[680px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={IMAGES.contactBanner} alt="" className="h-full w-full object-cover object-[center_92%]" aria-hidden />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      <div className="relative mx-auto max-w-[1240px] px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-center">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#C76B86]" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="h-px w-6 bg-[#C76B86]" /> Liên hệ & Tư vấn
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 text-white" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", lineHeight: 1.1, fontWeight: 800, fontFamily: "var(--font-display)" }}>
                Bắt đầu công trình<br />của bạn hôm nay
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <ul className="mt-8 space-y-3.5">
                {["Tư vấn tận tâm", "Báo giá trong 24 giờ", "Giao hàng toàn quốc", "Hỗ trợ sau bán hàng"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] font-medium text-white/90">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#E08BA3]" strokeWidth={2.2} />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:gap-6">
            {INFO.map((it) => {
              const CardTag = it.href && it.href !== "#google-map-section" ? "a" : "div";
              return (
                <motion.div key={it.label} variants={staggerItem} className="h-full">
                  <CardTag
                    href={it.href !== "#google-map-section" ? it.href : undefined}
                    onClick={it.onClick}
                    className="group relative flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/35 hover:bg-white/15 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden"
                  >
                    {/* Background glow overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex items-center justify-between gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#A02842] to-[#560213] text-white shadow-md transition-transform duration-300 group-hover:scale-110 border border-white/20">
                          <it.icon className="h-5 w-5" strokeWidth={2.2} />
                        </span>
                        {it.actionText && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFA0B4] opacity-90 transition-all group-hover:opacity-100 group-hover:translate-x-0.5">
                            {it.actionText}
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: "var(--font-mono)" }}>
                          {it.label}
                        </div>
                        <div className={`mt-1.5 font-bold tracking-tight text-white leading-relaxed group-hover:text-white transition-colors ${
                          it.isEmail ? "text-[14px] sm:text-[15px] break-all sm:break-normal" : "text-[15px] sm:text-[16px]"
                        }`}>
                          {it.value}
                        </div>
                        {it.subText && (
                          <p className="mt-2 text-[12px] text-white/60 leading-normal">
                            {it.subText}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardTag>
                </motion.div>
              );
            })}
          </Stagger>
        </div>
        {/* CTA button inside section */}
        <Reveal delay={0.3}>
          <div className="mt-12 flex justify-center">
            <Link
              to="/lien-he"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50 hover:shadow-lg"
            >
              Liên hệ báo giá
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Main homepage ─── */
export function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />




      {/* News right below banner */}
      <NewsTeaser />
      {/* About */}
      <AboutTeaser />
      <SeeMore to="/gioi-thieu" label="Tìm hiểu thêm về chúng tôi" bg="bg-white" />
      {/* Products */}
      <ProductsTeaser />
      <SeeMore to="/san-pham" label="Xem bảng thông số đầy đủ" bg="bg-secondary/30" />
      {/* Process */}
      <ProcessTeaser />
      {/* Projects */}
      <ProjectsTeaser />
      <SeeMore to="/du-an" label="Xem tất cả dự án" bg="bg-secondary/40" />
      {/* Contact */}
      <ContactTeaser />
      <CTABand />
    </>
  );
}
