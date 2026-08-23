import { PageHeader } from "../components/site/PageHeader";
import { IMAGES } from "../lib/data";
import { Process } from "../components/site/Process";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";

export function ProcessPage() {
  return (
    <>
      <PageHeader
        crumb="Quy trình"
        eyebrow="Quy trình sản xuất"
        title="Từ đất sét đến viên gạch hoàn thiện"
        desc="Quy trình khép kín 9 bước chuyên nghiệp với công nghệ lò Tuynel hiện đại và kiểm soát chất lượng nghiêm ngặt."
        image={IMAGES.aboutBanner}
      />
      <Process />
      <LogoMarquee />
      <CTABand />
    </>
  );
}
