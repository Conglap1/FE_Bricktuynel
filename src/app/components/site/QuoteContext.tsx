import { createContext, useContext, useState, type ReactNode } from "react";

type QuoteCtx = {
  open: boolean;
  product?: string;
  openQuote: (product?: string) => void;
  closeQuote: () => void;
};

const Ctx = createContext<QuoteCtx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>();

  return (
    <Ctx.Provider
      value={{
        open,
        product,
        openQuote: (p) => {
          setProduct(p);
          setOpen(true);
        },
        closeQuote: () => setOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useQuote() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useQuote must be used within QuoteProvider");
  return c;
}
