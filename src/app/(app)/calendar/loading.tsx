import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="min-h-[68px] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
