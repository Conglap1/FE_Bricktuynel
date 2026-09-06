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

/* Product grid skeleton (5 columns on desktop) */
export function CardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)] max-w-[320px] sm:max-w-none p-4 space-y-3 animate-pulse"
        >
          <Skeleton className="aspect-[5/4] w-full rounded-xl bg-slate-200" />
          <Skeleton className="h-5 w-3/4 rounded bg-slate-200" />
          <Skeleton className="h-3.5 w-full rounded bg-slate-200/60" />
          <Skeleton className="h-3.5 w-2/3 rounded bg-slate-200/60" />
          <div className="mt-auto space-y-2 pt-2">
            <Skeleton className="h-9 w-full rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* News cards skeleton (3 columns) */
export function NewsCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 space-y-3 animate-pulse">
          <Skeleton className="aspect-[16/10] w-full rounded-xl bg-slate-200" />
          <Skeleton className="h-3 w-20 bg-slate-200" />
          <Skeleton className="h-5 w-5/6 bg-slate-200" />
          <Skeleton className="h-3.5 w-full bg-slate-200/60" />
        </div>
      ))}
    </div>
  );
}

/* News teaser skeleton (3 items horizontal layout on homepage) */
export function NewsTeaserSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
          <Skeleton className="h-20 w-28 shrink-0 rounded-xl bg-slate-200" />
          <div className="flex flex-1 flex-col space-y-2 justify-center">
            <Skeleton className="h-3 w-20 bg-slate-200" />
            <Skeleton className="h-4 w-full bg-slate-200" />
            <Skeleton className="h-3 w-4/5 bg-slate-200/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Projects grid skeleton */
export function ProjectGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid auto-rows-[220px] grid-cols-2 gap-5 md:grid-cols-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-end space-y-2 animate-pulse ${
            idx === 0 ? "col-span-2 row-span-2" : ""
          }`}
        >
          <Skeleton className="h-6 w-3/4 rounded bg-slate-200" />
          <Skeleton className="h-3.5 w-1/2 rounded bg-slate-200/70" />
        </div>
      ))}
    </div>
  );
}

/* Full page detail skeleton */
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
          <Skeleton className="aspect-[4/3] w-full rounded-3xl bg-slate-200" />
          <div className="grid grid-cols-4 gap-3">
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/70" />
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/70" />
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/70" />
            <Skeleton className="aspect-[4/3] rounded-xl bg-slate-200/70" />
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

/* Admin table skeleton */
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

/* Admin dashboard KPI Stat Cards skeleton (exactly 5 columns matching dashboard layout) */
export function StatCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 shrink-0 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-2.5 sm:p-3 shadow-sm space-y-2 animate-pulse">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-200" />
            <Skeleton className="h-3.5 w-10 rounded bg-slate-200/70" />
          </div>
          <div className="pt-1 space-y-1">
            <Skeleton className="h-6 w-10 rounded bg-slate-200" />
            <Skeleton className="h-3 w-24 rounded bg-slate-200/70" />
            <Skeleton className="h-2.5 w-20 rounded bg-slate-200/50" />
          </div>
        </div>
      ))}
    </div>
  );
}
