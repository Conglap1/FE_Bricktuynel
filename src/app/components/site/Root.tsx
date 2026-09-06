import { useLocation, useOutlet } from "react-router";
import { AnimatePresence } from "motion/react";
import { motion } from "../../lib/motion";
import { QuoteProvider } from "./QuoteContext";
import { CursorSpotlight } from "./CursorSpotlight";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { QuoteDialog } from "./QuoteDialog";
import { ScrollToTop } from "./ScrollToTop";
import { FloatingWidget } from "./FloatingWidget";
export function Root() {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <QuoteProvider>
      <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
        <ScrollToTop />
        <CursorSpotlight />
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <QuoteDialog />
        <FloatingWidget />
      </div>
    </QuoteProvider>
  );
}




