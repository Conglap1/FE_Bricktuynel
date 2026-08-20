import { PageHeader } from "../components/site/PageHeader";
import { Process } from "../components/site/Process";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";

export function ProcessPage() {
  return (
    <>
      <PageHeader
        crumb="Quy trình"
        eyebrow="CTTNHH 1TV Thuận Lợi Mộc Hóa"
        title="Từ đất sét đến viên gạch hoàn thiện"
        desc="Quy trình khép kín 9 bước chuyên nghiệp với công nghệ lò Tuynel hiện đại và kiểm soát chất lượng nghiêm ngặt."
      />
      <Process />
      <LogoMarquee />
      <CTABand />
    </>
  );
}
