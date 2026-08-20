import { Tv } from "lucide-react";
import { Reveal } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";

export function MediaShowcase() {
  return (
    <section id="media-showcase" className="relative bg-white py-20 md:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-primary/4 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-[350px] w-[350px] rounded-full bg-amber-400/6 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Truyền thông & Báo chí"
          title={
            <>
              <span className="inline-block whitespace-nowrap">Ứng Dụng Robot Xếp Gạch</span>
              <br />
              <span className="inline-block whitespace-nowrap">Trong Dây Chuyền Sản Xuất</span>
            </>
          }
          desc="Phóng sự đài truyền hình Long An TV về quá trình ứng dụng robot tự động hóa trong dây chuyền sản xuất tại nhà máy Thuận Lợi Mộc Hóa."
          align="center"
        />

        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Video embed */}
            <div className="w-full lg:flex-1">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src="https://www.youtube.com/embed/OB-RSMzeRfI?rel=0&modestbranding=1"
                    title="Ứng dụng Robot xếp gạch trong dây chuyền sản xuất – Long An TV"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                    style={{ borderRadius: "1.5rem" }}
                  />
                </div>
              </div>
            </div>

            {/* Info panel */}
            <div className="w-full lg:max-w-[340px] flex flex-col gap-5">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 self-start">
                <Tv className="h-4 w-4 text-primary" />
                <span className="text-[12px] font-bold uppercase tracking-widest text-primary">
                  Phóng Sự Truyền Hình
                </span>
              </div>

              <h3 className="text-[20px] font-bold leading-snug text-foreground md:text-[24px]">
                Ứng Dụng Robot Vào<br />
                <span className="text-primary">Dây Chuyền Sản Xuất</span>
              </h3>

              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Long An TV ghi lại quá trình Thuận Lợi Mộc Hóa đầu tư robot tự động hóa trong khâu xếp gạch — nâng cao năng suất, giảm lao động thủ công và đảm bảo chất lượng đồng đều.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "35+", label: "Năm kinh nghiệm" },
                  { value: "ISO", label: "Chứng nhận quốc tế" },
                  { value: "100%", label: "Nguyên liệu tự nhiên" },
                  { value: "24/7", label: "Dây chuyền sản xuất" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col rounded-2xl border border-border/60 bg-secondary/40 p-3.5"
                  >
                    <span className="text-[20px] font-extrabold text-primary">{stat.value}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
