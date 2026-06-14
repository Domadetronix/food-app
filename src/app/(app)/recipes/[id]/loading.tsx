import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}
