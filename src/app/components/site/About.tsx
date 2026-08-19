import { CheckCircle2 } from "lucide-react";
import { Reveal, Counter } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SectionHeading } from "./SectionHeading";
import { IMAGES } from "../../lib/data";
import { useStore } from "../../lib/store";

export function About() {
  const { about } = useStore();
  return (
    <section id="about" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* Image collage */}
        <div className="relative">
          <Reveal>
            <div className="overflow-hidden rounded-2xl bg-secondary">
              <ImageWithFallback
                src={IMAGES.aboutFactory}
                alt="Công nhân sản xuất gạch tại nhà máy Thuận Lợi"
                className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="absolute -bottom-8 -right-4 w-44 overflow-hidden rounded-xl border-4 border-white bg-secondary shadow-2xl sm:w-56">
              <ImageWithFallback
                src={IMAGES.aboutStack}
                alt="Pallet gạch thành phẩm"
                className="aspect-square w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="absolute -left-4 top-8 rounded-xl border border-border bg-white/90 px-5 py-4 shadow-xl backdrop-blur sm:-left-8">
              <div className="text-primary" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
                <Counter to={99} suffix="%" />
              </div>
              <div className="mt-1 text-[12px] font-medium text-muted-foreground">Đạt chuẩn kiểm định</div>
            </div>
          </Reveal>
        </div>

        {/* Text */}
        <div>
          <SectionHeading
            eyebrow="Về Thuận Lợi"
            title={about.title}
            desc={about.desc}
          />
          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {about.points.map((p, i) => (
              <Reveal key={p} delay={0.1 + i * 0.08}>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.2} />
                  <span className="text-[15px] leading-snug text-foreground/85">{p}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
