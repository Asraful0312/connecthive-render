const SearchCardSkeleton = () => {
  return (
    <div className="flex items-start gap-2 animate-pulse">
      {/* Skeleton for Profile Image */}
      <div className="w-7 h-7 rounded-full bg-blue-200"></div>

      <div className="flex flex-col gap-1">
        {/* Skeleton for Username */}
        <div className="h-4 w-24 bg-gray-300 rounded"></div>

        {/* Skeleton for Follower Count */}
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default SearchCardSkeleton;
