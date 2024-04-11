import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton({ count = 10 }) {
  return Array.from({ length: count }, (_, ind: number) => (
    <div key={ind} className="flex items-center space-x-4 mb-6">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] rounded-[6px]" />
        <Skeleton className="h-4 w-[200px] rounded-[6px]" />
      </div>
    </div>
  ));
}
