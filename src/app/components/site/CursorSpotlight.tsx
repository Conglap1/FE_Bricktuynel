import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/* Soft blue spotlight that follows the cursor — hidden on touch devices. */
export function CursorSpotlight() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  // Giảm stiffness/damping để spring nhẹ hơn, ít compute hơn
  const sx = useSpring(x, { stiffness: 80, damping: 25, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 80, damping: 25, mass: 0.8 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    let pendingX = -500;
    let pendingY = -500;

    const move = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      // Throttle bằng rAF: chỉ update 1 lần mỗi frame thay vì mỗi mousemove event
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        x.set(pendingX);
        y.set(pendingY);
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[90] hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        left: sx,
        top: sy,
        background:
          "radial-gradient(circle, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 65%)",
        willChange: "transform",
      }}
    />
  );
}
