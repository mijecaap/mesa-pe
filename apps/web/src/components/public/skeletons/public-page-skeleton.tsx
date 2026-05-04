import { Skeleton } from "@/components/ui/skeleton";

export function PublicPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Hero skeleton */}
      <div className="relative">
        <Skeleton className="h-40 w-full sm:h-56" />
        <div className="relative -mt-10 px-4 sm:-mt-14">
          <div className="mx-auto max-w-xl">
            <div className="flex items-end gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl sm:h-24 sm:w-24" />
              <div className="mb-1 flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-4 h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Product list skeleton */}
      <div className="mx-auto max-w-xl px-4 pb-24 pt-4">
        <Skeleton className="mb-4 h-10 w-full rounded-xl" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="flex gap-3 rounded-2xl border border-[#EDE6DE] bg-white p-3"
                >
                  <Skeleton className="h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28" />
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="mt-2 h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
