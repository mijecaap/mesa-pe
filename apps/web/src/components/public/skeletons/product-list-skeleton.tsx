import { Skeleton } from "@/components/ui/skeleton";

export function ProductListSkeleton() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-4">
      <Skeleton className="mb-4 h-10 w-full rounded-xl" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="mt-4 space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="flex gap-3 rounded-2xl border border-[#EBE5E0] bg-white p-3"
              >
                <Skeleton className="h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28" />
                <div className="flex flex-1 flex-col justify-between py-0.5">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="mt-2 h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
