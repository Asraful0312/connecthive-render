import { Skeleton } from "../ui/skeleton";

const ConversationSkeleton = () => {
  return (
    <div className="flex items-start gap-2 py-2 px-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-900">
      <Skeleton className="size-10 shrink-0 rounded-full bg-gray-300 dark:bg-stone-500" />

      <div className="flex-1">
        <Skeleton className="w-24 h-4 rounded-md bg-gray-300 dark:bg-stone-500" />
        <Skeleton className="w-48 h-4 mt-1 rounded-md bg-gray-300 dark:bg-stone-500" />
      </div>
    </div>
  );
};

export default ConversationSkeleton;
