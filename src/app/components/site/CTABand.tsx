import { ArrowRight, Phone } from "lucide-react";
import { Reveal, MagneticButton } from "../../lib/motion";
import { IMAGES } from "../../lib/data";
import { useStore } from "../../lib/store";

export function CTABand() {
  const { contact } = useStore();
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1240px] px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#560213] px-5 py-12 text-center text-white sm:px-12 md:px-16 md:py-20">
            {/* Background image */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <img src={IMAGES.ctaBannerBg} alt="" className="h-full w-full object-cover" aria-hidden />
              <div className="absolute inset-0 bg-black/35" />
            </div>
            <div className="relative">
              <h2 style={{ fontSize: "clamp(1.35rem, 4.2vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2 }}>
                <span className="inline-block whitespace-nowrap">Sẵn sàng cho công trình</span>{" "}
                <span className="inline-block whitespace-nowrap">tiếp theo của bạn?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[17px] text-white/75">
                Nhận tư vấn và báo giá chi tiết từ chúng tôi trong vòng 24h.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <MagneticButton
                  to="/lien-he"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-primary shadow-lg"
                >
                  Nhận báo giá ngay
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={`tel:${(contact.phone || "").replace(/\s/g, '')}`}
                  strength={0.2}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/15"
                >
                  <Phone className="h-4 w-4" /> {contact.phone}
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
