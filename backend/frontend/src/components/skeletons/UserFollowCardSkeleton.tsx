import { Skeleton } from "../ui/skeleton";

const UserFollowCardSkeleton = () => {
  return (
    <div className="flex items-start justify-between p-2 animate-pulse">
      <div className="flex items-start gap-2">
        {/* User Image Skeleton */}
        <Skeleton className="rounded-full w-10 h-10 bg-gray-300 dark:bg-stone-500" />
        <div>
          {/* Username Skeleton */}
          <Skeleton className="h-4 w-24 mb-1 rounded-md bg-gray-300 dark:bg-stone-500" />
          {/* Followers Skeleton */}
          <Skeleton className="h-3 w-16 rounded-md bg-gray-300 dark:bg-stone-500" />
        </div>
      </div>
      {/* Button Skeleton */}
      <Skeleton className="h-8 w-20 rounded-md bg-gray-300 dark:bg-stone-500" />
    </div>
  );
};

export default UserFollowCardSkeleton;
