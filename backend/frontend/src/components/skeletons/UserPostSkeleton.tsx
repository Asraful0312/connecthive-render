const UserPostSkeleton = () => {
  return (
    <div className="pt-8">
      <div className="flex py-5 pb-4 gap-3">
        <div className="flex flex-col items-center">
          {/* Avatar Skeleton */}
          <div className="skeleton shrink-0 rounded-full size-12 md:size-14"></div>

          {/* Line Skeleton */}
          <div className="h-full w-[1px] skeleton my-2"></div>

          {/* Nested Avatars Skeleton */}
          <div className="relative w-full">
            <div className="skeleton rounded-full size-7 absolute top-0 left-[15px]"></div>
            <div className="skeleton rounded-full size-7 absolute bottom-0 right-[-5px]"></div>
            <div className="skeleton rounded-full size-7 absolute bottom-0 left-0 md:left-1"></div>
          </div>
        </div>

        <div className="flex gap-2 flex-col w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex w-full items-center gap-2">
              {/* Name Skeleton */}
              <div className="skeleton h-4 w-24 rounded-md"></div>
              <div className="skeleton h-4 w-4 rounded-full"></div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="skeleton h-4 w-12 rounded-md"></div>
              <div className="skeleton h-4 w-6 rounded-md"></div>
            </div>
          </div>

          {/* Text Skeleton */}
          <div className="skeleton h-4 w-full rounded-md"></div>

          {/* Image Skeleton */}
          <div className="rounded-md skeleton h-40 w-full "></div>

          <div className="flex my-1">
            {/* Actions Placeholder */}
            <div className="skeleton h-6 w-10 rounded-md"></div>
          </div>

          <div className="flex items-center gap-2">
            <div className="skeleton h-4 w-16 rounded-md"></div>
            <div className="size-[4px] rounded-full skeleton"></div>
            <div className="skeleton h-4 w-16 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPostSkeleton;
