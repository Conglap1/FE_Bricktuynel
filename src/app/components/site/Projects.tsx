import { AnimatePresence } from "motion/react";
import { MapPin, Calendar } from "lucide-react";
import { motion, MotionLink } from "../../lib/motion";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { SectionHeading } from "./SectionHeading";
import { useStore } from "../../lib/store";
import { CardSkeleton } from "../ui/LoadingState";

export function Projects() {
  const { projects: PROJECTS, isLoading } = useStore();
  const visible = PROJECTS.filter((p) => p.isActive);

  return (
    <section id="projects" className="relative bg-secondary/50 py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading
          eyebrow="Dự án tiêu biểu"
          title={<>Những công trình<br />được xây bằng niềm tin</>}
        />

        {isLoading ? (
          <div className="mt-14">
            <CardSkeleton count={4} />
          </div>
        ) : (
          <motion.div layout className="mt-14 grid auto-rows-[220px] grid-cols-2 gap-5 md:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <MotionLink
                key={p.id}
                to={`/du-an/${p.slug}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden rounded-2xl bg-[#560213] ${
                  p.isFeatured ? "col-span-2 row-span-2" : ""
                }`}
              >
                <ImageWithFallback
                  src={p.image}
                  alt={`${p.name} — ${p.location}`}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-[1s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#560213] via-[#560213]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 p-5 transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-white" style={{ fontSize: p.isFeatured ? "1.5rem" : "1.05rem", fontWeight: 700 }}>
                    {p.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12px] text-white/70">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {p.location}
                    </span>
                    {p.completedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {p.completedDate.includes("-")
                          ? (() => {
                              const pts = p.completedDate.split("T")[0].split("-");
                              return pts.length === 3 ? `${pts[2]}/${pts[1]}/${pts[0]}` : p.completedDate;
                            })()
                          : p.completedDate}
                      </span>
                    )}
                  </div>
                </div>
              </MotionLink>
            ))}
          </AnimatePresence>
        </motion.div>
        )}
      </div>
    </section>
  );
}
