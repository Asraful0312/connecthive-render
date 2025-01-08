import { Separator } from "@/components/ui/separator";

const PostPageSkeleton = () => {
  return (
    <>
      <div className="flex gap-2 flex-col w-full animate-pulse">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full">
          <div className="flex w-full items-center gap-2">
            <div className="w-12 h-12 bg-gray-300 dark:bg-stone-500 rounded-full" />
            <div className="flex flex-col">
              <div className="w-24 h-4 bg-gray-300 dark:bg-stone-500 rounded" />
              <div className="w-16 h-3 bg-gray-200 dark:bg-stone-500 rounded mt-1" />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-10 h-4 bg-gray-200 dark:bg-stone-500 rounded" />
            <div className="w-6 h-6 bg-gray-200 dark:bg-stone-500 rounded-full" />
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4">
          <div className="w-full h-4 bg-gray-300 dark:bg-stone-500 rounded" />
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-stone-500 rounded mt-2" />
        </div>

        {/* Post Image */}
        <div className="w-full h-60 bg-gray-300 dark:bg-stone-500 rounded-md mt-4"></div>

        {/* Post Stats */}
        <div className="flex items-center gap-4 mt-4">
          <div className="w-16 h-4 bg-gray-200 dark:bg-stone-500 rounded" />
          <div className="w-2 h-2 bg-gray-200 dark:bg-stone-500 rounded-full" />
          <div className="w-16 h-4 bg-gray-200 dark:bg-stone-500 rounded" />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Footer Section */}
      <div className="flex justify-between items-center animate-pulse">
        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 bg-gray-300 dark:bg-stone-500 rounded-full" />
          <div className="w-40 h-4 bg-gray-300 dark:bg-stone-500 rounded" />
        </div>
        <div className="w-16 h-8 bg-gray-300 dark:bg-stone-500 rounded" />
      </div>

      <Separator className="my-4" />
    </>
  );
};

export default PostPageSkeleton;
