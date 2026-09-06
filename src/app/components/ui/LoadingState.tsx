import { Loader2 } from "lucide-react";
import { Skeleton } from "./skeleton";

export function InlineSpinner({ text = "Đang tải dữ liệu..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-500 font-medium text-sm">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span>{text}</span>
    </div>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)] max-w-[320px] sm:max-w-none p-4"
        >
          <Skeleton className="aspect-[5/4] w-full rounded-xl bg-slate-200/70 mb-4 animate-pulse" />
          <Skeleton className="h-5 w-3/4 rounded bg-slate-200/70 mb-2" />
          <Skeleton className="h-3.5 w-full rounded bg-slate-200/50 mb-1.5" />
          <Skeleton className="h-3.5 w-2/3 rounded bg-slate-200/50 mb-4" />
          <div className="mt-auto space-y-2 pt-2">
            <Skeleton className="h-9 w-full rounded-full bg-slate-200/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-24 space-y-8 animate-pulse">
      <div className="flex items-center gap-2 text-sm">
        <Skeleton className="h-4 w-20 rounded bg-slate-200" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-32 rounded bg-slate-200" />
      </div>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6 space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-3xl bg-slate-200/80" />
          <div className="grid grid-cols-4 gap-3">
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/60" />
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/60" />
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/60" />
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/60" />
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6">
          <Skeleton className="h-8 w-3/4 rounded-lg bg-slate-200" />
          <Skeleton className="h-4 w-full rounded bg-slate-200/70" />
          <Skeleton className="h-4 w-5/6 rounded bg-slate-200/70" />
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Skeleton className="h-16 rounded-xl bg-slate-200/60" />
            <Skeleton className="h-16 rounded-xl bg-slate-200/60" />
            <Skeleton className="h-16 rounded-xl bg-slate-200/60" />
            <Skeleton className="h-16 rounded-xl bg-slate-200/60" />
          </div>
          <Skeleton className="h-12 w-full rounded-full bg-primary/20 mt-6" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-100 animate-pulse">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-5 py-4">
              <Skeleton className="h-4 w-4/5 rounded bg-slate-200/70" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded bg-slate-200" />
            <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg bg-slate-200" />
          <Skeleton className="h-3 w-32 rounded bg-slate-200/60" />
        </div>
      ))}
    </div>
  );
}
