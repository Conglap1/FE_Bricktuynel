import { Compass, Target, Gem, CheckCircle2, Flame, Factory, Award, HeartHandshake, Zap, ShieldCheck, Truck } from "lucide-react";
import { Reveal, Stagger, staggerItem, motion } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";
import { IMAGES } from "../../lib/data";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function VisionMissionCore() {
  return (
    <section className="relative bg-white py-24 md:py-32 border-t border-border/60">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading
          eyebrow="Định hướng & Giá trị cốt lõi"
          title={
            <>
              <span className="inline-block whitespace-nowrap">Tầm nhìn · Sứ mệnh · Giá trị cốt lõi</span>
              <br />
              <span className="inline-block whitespace-nowrap mt-1">Tạo nên thương hiệu Thuận Lợi</span>
            </>
          }
          desc="Nền tảng vững chắc định hình mọi hoạt động sản xuất, cung ứng và phát triển lâu dài của doanh nghiệp."
          align="center"
          className="max-w-5xl"
        />

        {/* ── 1. Hàng Tầm Nhìn & Sứ Mệnh (Symmetrical & Balanced layout) ── */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 items-stretch">
          {/* ── TẦM NHÌN (VISION) ── */}
          <Reveal className="h-full">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl h-full">
              <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
              
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-[13px] font-bold text-primary">
                    <Compass className="h-4.5 w-4.5" />
                    TẦM NHÌN
                  </div>

                  <h3 className="mt-6 text-foreground min-h-[3.2rem]" style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: "1.3" }}>
                    Tự động hoá hiện đại — Kế thừa truyền thống — 100% Năng lượng xanh
                  </h3>

                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    Gạch Thuận Lợi định hướng trở thành thương hiệu sản xuất gạch hàng đầu, nơi công nghệ tự động hoá khép kín từ khâu sản xuất đến xuất xưởng hoà quyện cùng tinh hoa và bản sắc truyền thống của ngành nghề. Chúng tôi chuyển dịch 100% sang điện mặt trời và mở rộng quy mô dòng gạch không nung bền vững cho tương lai.
                  </p>

                  {/* Các mục chi tiết của Tầm Nhìn (3 mục) */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xs">
                      <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-bold text-foreground text-[14px]">Tự động hoá khép kín từ sản xuất đến xuất xưởng</h4>
                        <p className="text-[13px] text-muted-foreground">Vận hành dây chuyền tự động hoá đồng bộ ở các khâu tạo hình, đóng gói và xuất xưởng, đảm bảo độ chính xác và năng suất vượt trội.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xs">
                      <Factory className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-bold text-foreground text-[14px]">Sử dụng 100% Điện mặt trời &amp; Năng lượng xanh</h4>
                        <p className="text-[13px] text-muted-foreground">Ứng dụng hệ thống điện năng lượng mặt trời vận hành toàn nhà máy, cắt giảm tối đa phát thải carbon và bảo vệ môi trường.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xs">
                      <Flame className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-bold text-foreground text-[14px]">Mở rộng gạch không nung &amp; Lưu giữ nét truyền thống</h4>
                        <p className="text-[13px] text-muted-foreground">Thúc đẩy phổ biến các dòng gạch không nung sinh thái, song song giữ gìn nét đẹp kỹ nghệ làm gạch truyền thống lâu đời.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khung Ảnh Tầm Nhìn */}
                <div className="mt-8">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                    <ImageWithFallback
                      src={IMAGES.visionImage}
                      alt="Tầm nhìn phát triển Gạch Thuận Lợi"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── SỨ MỆNH (MISSION) ── */}
          <Reveal delay={0.12} className="h-full">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl h-full">
              <div className="absolute top-0 right-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-[13px] font-bold text-primary">
                    <Target className="h-4.5 w-4.5" />
                    SỨ MỆNH
                  </div>

                  <h3 className="mt-6 text-foreground min-h-[3.2rem]" style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", lineHeight: "1.3" }}>
                    Chất lượng chuẩn xác — Cung ứng vững vàng — Tối ưu mọi công trình
                  </h3>

                  <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                    Sứ mệnh của Gạch Thuận Lợi là mang đến sự an tâm tuyệt đối cho từng mét vuông công trình qua những sản phẩm gạch Tuynel đạt chuẩn kiểm định khắt khe, độ bền đanh chắc và kích thước đồng đều. Chúng tôi liên tục duy trì năng lực cung ứng ổn định và sát cánh đồng hành cùng đối tác.
                  </p>

                  {/* Các mục chi tiết của Sứ Mệnh (3 mục cân đối) */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xs">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-bold text-foreground text-[14px]">Cam kết chất lượng &amp; Đạt chuẩn QCVN 16:2023</h4>
                        <p className="text-[13px] text-muted-foreground">100% lô hàng xuất xưởng đều qua kiểm tra nghiêm ngặt độ chịu nén, độ bền cơ học và chỉ tiêu kỹ thuật trước khi bàn giao.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xs">
                      <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-bold text-foreground text-[14px]">Năng lực cung ứng lớn &amp; Tiến độ vượt trội</h4>
                        <p className="text-[13px] text-muted-foreground">Chủ động kho bãi và dây chuyền tự động hóa giúp đảm bảo sản lượng lớn, giao hàng kịp thời cho mọi dự án trọng điểm.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-white p-3.5 shadow-2xs">
                      <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <h4 className="font-bold text-foreground text-[14px]">Đồng hành bền vững &amp; Tối ưu chi phí đối tác</h4>
                        <p className="text-[13px] text-muted-foreground">Cung cấp bảng giá trực tiếp từ nhà máy không qua trung gian, hỗ trợ giải pháp kỹ thuật tối ưu chi phí cho nhà thầu.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khung Ảnh Sứ Mệnh */}
                <div className="mt-8">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm">
                    <ImageWithFallback
                      src={IMAGES.missionImage}
                      alt="Sứ mệnh cam kết Gạch Thuận Lợi"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── 2. Khối GIÁ TRỊ CỐT LÕI (Có đúng 1 khung ảnh sạch sẽ bên dưới) ── */}
        <Reveal delay={0.2}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-b from-primary/[0.04] via-white to-secondary/30 p-8 md:p-12 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/80">
              <div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground shadow-sm">
                  <Gem className="h-4.5 w-4.5" />
                  GIÁ TRỊ CỐT LÕI
                </div>
                <h3 className="mt-4 text-foreground" style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
                  6 Giá Trị Tạo Nên Sự Khác Biệt
                </h3>
              </div>
              <p className="max-w-md text-[14px] text-muted-foreground leading-relaxed">
                Những nguyên tắc kim chỉ nam định hướng tư duy và hành động của tập thể cán bộ công nhân viên Gạch Thuận Lợi.
              </p>
            </div>

            {/* Grid 6 giá trị cốt lõi chi tiết */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Award,
                  title: "1. Chất Lượng Đỉnh Cao",
                  desc: "Mỗi viên gạch Tuynel đều đạt các chỉ tiêu cơ lý, độ nén đanh chắc khắt khe theo tiêu chuẩn QCVN 16:2023/BXD.",
                },
                {
                  icon: HeartHandshake,
                  title: "2. Uy Tín & Cam Kết",
                  desc: "Giữ trọn niềm tin với đối tác & nhà thầu về tiến độ giao hàng, quy cách chuẩn và bảng giá minh bạch từ nhà máy.",
                },
                {
                  icon: Zap,
                  title: "3. Tự Động Hoá Hiện Đại",
                  desc: "Đầu tư dây chuyền sản xuất thông minh, tự động hoá khép kín bằng cánh tay robot từ tạo hình đến xuất xưởng.",
                },
                {
                  icon: Flame,
                  title: "4. Bản Lĩnh & Kiên Định",
                  desc: "Kế thừa hành trình từ năm 1988, bản lĩnh đứng dậy từ tàn tro bão lũ Tân Thạnh, giữ vững lửa nghề và không ngừng vươn lên.",
                },
                {
                  icon: Factory,
                  title: "5. Năng Lượng Xanh & Gạch Không Nung",
                  desc: "Chuyển dịch 100% điện mặt trời và mở rộng quy mô dòng gạch không nung sinh thái, hướng tới tương lai phát triển bền vững.",
                },
                {
                  icon: CheckCircle2,
                  title: "6. Kế Thừa & Đổi Mới",
                  desc: "Hòa quyện kỹ nghệ làm gạch Tuynel truyền thống với công nghệ hiện đại — kết hợp hài hòa bản sắc và phát triển bền vững.",
                },
              ].map((val) => (
                <div key={val.title} className="rounded-2xl border border-border bg-white p-6 shadow-2xs hover:border-primary/40 hover:shadow-md transition-all">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <val.icon className="h-5.5 w-5.5" strokeWidth={2} />
                  </div>
                  <h4 className="mt-4 font-bold text-foreground text-[16px]">{val.title}</h4>
                  <p className="mt-2 text-[13.5px] text-muted-foreground leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>


          </div>
        </Reveal>
      </div>
    </section>
  );
}
