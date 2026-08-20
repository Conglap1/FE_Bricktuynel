import { Quote } from "lucide-react";
import { Reveal } from "../../lib/motion";
import { SectionHeading } from "./SectionHeading";
import { IMAGES } from "../../lib/data";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-secondary/30 py-20 md:py-28">
      {/* ── 1. Slogan Banner ── */}
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-[#7A1326] to-[#45020F] p-8 md:p-14 text-white shadow-2xl">
            {/* Background decorative elements */}
            <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute right-8 top-8 opacity-10">
              <Quote className="h-32 w-32" />
            </div>

            <div className="relative z-10 max-w-3xl">
              <h3
                className="text-white leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
                  fontWeight: 900,
                }}
              >
                &ldquo;Vững bước dựng xây — Nâng tầm công trình Việt&rdquo;
              </h3>
              <p className="mt-4 text-[16px] text-white/85 leading-relaxed max-w-2xl">
                Mỗi viên gạch ra lò không chỉ mang sức mạnh của công nghệ hiện đại, mà còn gắn liền với niềm tự hào được đồng hành cùng hàng ngàn công trình lớn nhỏ trên khắp cả nước.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── 2. Short Brand Story Section + 1 Khung Ảnh Duy Nhất ── */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Cột chữ bên trái */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Hành trình phát triển"
              title={<><span className="inline-block whitespace-nowrap">Hành trình tôi luyện qua lửa đỏ</span><br /><span className="inline-block whitespace-nowrap">Gạch Thuận Lợi</span></>}
              desc="Bắt đầu từ năm 1988, vượt qua biến cố bão lũ nghiệt ngã để đứng dậy, không ngừng đổi mới công nghệ và vươn mình trở thành nhà sản xuất gạch Tuynel uy tín hàng đầu."
            />

            <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground/85">
              <p className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
                <span className="font-bold text-primary">1988 — Khởi nguồn khát vọng từ đất Tây Ninh:</span> Hành trình bắt đầu từ năm 1988 với ngọn lửa nhiệt huyết của những người thợ làm gạch tại Tây Ninh. Những bước chân đầu tiên đi tìm đất, gieo mầm khát vọng đặt nền móng chắc chắn cho các công trình Việt.
              </p>
              <p className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
                <span className="font-bold text-primary">Biến cố Tân Thạnh — Hồi sinh từ tàn tro bão lũ:</span> Để mở rộng quy mô, xưởng chuyển sang thuê lò nung liên thanh tại Tân Thạnh. Nhưng trận lũ lịch sử càn quét đã làm sụp đổ hoàn toàn hệ thống lò, cuốn trôi mọi thành quả tích góp. Đứng trước đống đổ nát trắng tay, bản lĩnh người làm gạch lên tiếng: <em className="text-primary/90">&ldquo;Nước lũ có thể cuốn trôi gạch nung, nhưng không thể dập tắt lửa nghề trong tim.&rdquo;</em> Quyết định dời xưởng về địa điểm hiện tại là bước ngoặt sinh tử để làm lại từ đầu.
              </p>
              <p className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
                <span className="font-bold text-primary">Chuyển mình hiện đại — Đổi mới & Xanh hóa:</span> Đặt chân đến vùng đất mới, Thuận Lợi liên tục cải tiến và nâng cấp toàn diện quy trình sản xuất. Từ lò nung truyền thống, chúng tôi nâng cấp lên công nghệ lò Tuynel khép kín 1.050°C, ứng dụng tự động hóa cánh tay robot và tích hợp hệ thống điện mặt trời xanh — bảo chứng cho chất lượng đanh chắc và sự phát triển bền vững vượt thời gian.
              </p>
            </div>
          </div>

          {/* Cột Khung Ảnh Duy Nhất Bên Phải (Ảnh câu chuyện thương hiệu) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl bg-secondary shadow-lg border border-border">
              <ImageWithFallback
                src={IMAGES.brandStoryImage}
                alt="Hành trình phát triển Gạch Thuận Lợi"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
