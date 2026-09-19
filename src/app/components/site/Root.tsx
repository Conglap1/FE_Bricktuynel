import { useLocation, useOutlet } from "react-router";
import { motion } from "../../lib/motion";
import { usePageTitle } from "../../lib/usePageTitle";
import { QuoteProvider } from "./QuoteContext";
import { CursorSpotlight } from "./CursorSpotlight";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { QuoteDialog } from "./QuoteDialog";
import { ScrollToTop } from "./ScrollToTop";
import { FloatingWidget } from "./FloatingWidget";

export function Root() {
  usePageTitle();
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <QuoteProvider>
      <div className="min-h-screen w-full overflow-x-clip bg-background text-foreground">
        <ScrollToTop />
        <CursorSpotlight />
        <Navbar />
        <main>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {outlet}
          </motion.div>
        </main>
        <Footer />
        <QuoteDialog />
        <FloatingWidget />
      </div>
    </QuoteProvider>
  );
}




