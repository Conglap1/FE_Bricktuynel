import { ArrowUpRight } from "lucide-react";
import { MotionLink, Stagger, staggerItem } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SectionHeading } from "./SectionHeading";
import { useStore } from "../../lib/store";

export function ProductCategories() {
  const { categories: CATEGORIES } = useStore();
  return (
    <section className="relative bg-secondary/50 py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Danh mục sản phẩm"
            title={<>Giải pháp vật liệu<br />cho mọi hạng mục</>}
          />
          <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground md:pb-2">
            Bốn dòng sản phẩm chủ lực, hơn 40 quy cách khác nhau đáp ứng từ móng
            chịu lực đến tường bao cách nhiệt.
          </p>
        </div>

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <MotionLink
              key={c.id}
              to="/lien-he"
              variants={staggerItem}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <ImageWithFallback
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#560213]/85 via-[#560213]/15 to-transparent" />
                <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {c.count}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60" style={{ fontFamily: "var(--font-mono)" }}>
                    {c.en}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-white" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                      {c.name}
                    </h3>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </MotionLink>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
