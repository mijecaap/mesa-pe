import { Skeleton } from "@/components/ui/skeleton";

export function PublicPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Hero skeleton */}
      <div className="relative">
        <Skeleton className="h-[45vh] min-h-[320px] w-full" />
        <div className="relative -mt-20 px-4 sm:-mt-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-4">
              <Skeleton className="h-24 w-24 rounded-2xl sm:h-28 sm:w-28" />
              <div className="mb-2">
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="mt-4 h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1.5 h-4 w-3/4" />
            <Skeleton className="mt-3 h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Search & nav skeleton */}
      <div className="sticky top-0 z-20 border-b border-[#EDE6DE] bg-[#FDF8F3]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
      <div className="border-b border-[#EDE6DE] bg-[#FDF8F3]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="space-y-0">
        {Array.from({ length: 2 }).map((_, catIdx) => (
          <div
            key={catIdx}
            className={`py-10 sm:py-14 ${catIdx % 2 === 0 ? "bg-[#FDF8F3]" : "bg-white"}`}
          >
            <div className="mx-auto max-w-2xl px-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-4 w-64" />
              <Skeleton className="mt-4 h-px w-16" />

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 4 }).map((_, itemIdx) => (
                  <div key={itemIdx} className="flex flex-col">
                    <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                    <Skeleton className="mt-2.5 h-4 w-full" />
                    <Skeleton className="mt-1 h-3 w-2/3" />
                    <Skeleton className="mt-2 h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
