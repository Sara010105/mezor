import { Skeleton } from "../../components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Image Skeleton */}
        <div className="aspect-[4/5] w-full">
          <Skeleton className="w-full h-full bg-[#f9f5f0]" />
        </div>

        {/* Right: Info Skeleton */}
        <div className="flex flex-col gap-8">
          <div>
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="pt-8 space-y-6">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
