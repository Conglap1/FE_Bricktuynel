import { ShieldCheck, Truck, Gauge, Leaf, Headphones, BadgeCheck } from "lucide-react";
import { motion, Stagger, staggerItem, Counter, Reveal } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";

const REASONS = [
  { icon: ShieldCheck, title: "Chất lượng hợp quy", desc: "100% sản phẩm đạt QCVN 16:2023/BXD, kiểm định độc lập từng lô hàng." },
  { icon: Gauge, title: "Độ bền vượt trội", desc: "Cường độ nén cao, độ hút nước thấp, đảm bảo tuổi thọ công trình." },
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Đội xe chuyên dụng, đóng pallet quấn màng, giao đúng tiến độ." },
  { icon: Leaf, title: "Thân thiện môi trường", desc: "Công nghệ nung tiết kiệm năng lượng, tận dụng nhiệt tuần hoàn." },
  { icon: Headphones, title: "Tư vấn tận tâm", desc: "Sẵn sàng hỗ trợ tư vấn chọn vật liệu phù hợp cho công trình của bạn." },
  { icon: BadgeCheck, title: "Giá cạnh tranh", desc: "Sản xuất trực tiếp không qua trung gian, báo giá minh bạch." },
];

const STATS = [
  { to: 30, suffix: "+", label: "Năm hoạt động" },
  { to: 1200, suffix: "+", label: "Dự án hoàn thành" },
  { to: 98, suffix: "%", label: "Khách hàng quay lại" },
  { to: 40, suffix: "+", label: "Quy cách sản phẩm" },
];

export function WhyChooseUs() {
  return (
    <section className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading
          eyebrow="Vì sao chọn chúng tôi"
          title={<>Lợi thế tạo nên<br />sự khác biệt</>}
          align="center"
        />

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => (
            <motion.div
              key={r.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40 hover:bg-secondary/40"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <r.icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-foreground" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                {r.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </Stagger>

        {/* Stats band */}
        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-8 rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:grid-cols-2 lg:grid-cols-4 lg:px-14">
            {STATS.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 900, lineHeight: 1 }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-[14px] text-white/75">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
