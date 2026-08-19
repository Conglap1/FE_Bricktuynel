import { PageHeader } from "../components/site/PageHeader";
import { Projects } from "../components/site/Projects";
import { LogoMarquee } from "../components/site/LogoMarquee";
import { CTABand } from "../components/site/CTABand";

export function ProjectsPage() {
  return (
    <>
      <PageHeader
        crumb="Dự án"
        eyebrow="Dự án tiêu biểu"
        title="Những công trình được xây bằng niềm tin"
        desc="Hơn 1.200 công trình dân dụng, công nghiệp và công cộng trên khắp cả nước đã tin dùng gạch Thuận Lợi."
      />
      <Projects />
      <LogoMarquee />
      <CTABand />
    </>
  );
}
