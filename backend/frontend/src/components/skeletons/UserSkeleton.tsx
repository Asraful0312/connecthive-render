const UserSkeleton = () => {
  return (
    <div>
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 dark:bg-stone-600 rounded w-32 mb-2"></div>
            <div className="flex gap-2 items-center mt-2">
              <div className="h-4 bg-gray-200 dark:bg-stone-600 rounded w-20"></div>
              <div className="h-4 bg-gray-200 dark:bg-stone-600 rounded w-24"></div>
            </div>
          </div>
          <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-200 dark:bg-stone-600 rounded-full"></div>
        </div>

        <div>
          <div className="h-5 bg-gray-200 dark:bg-stone-600 rounded w-3/4"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 dark:bg-stone-600 rounded w-16"></div>
            <div className="h-1 w-1 bg-gray-200 dark:bg-stone-600 rounded-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-stone-600 rounded w-32"></div>
          </div>

          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 dark:bg-stone-600 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-stone-600 rounded-full"></div>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <div className="h-10 bg-gray-200 dark:bg-stone-600 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 dark:bg-stone-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default UserSkeleton;
