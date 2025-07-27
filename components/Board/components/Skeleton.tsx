export const CardSkeleton = () => (
  <div className="w-full p-4 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-sm animate-pulse">
    <div className="h-5 bg-gray-400 dark:bg-gray-600 rounded mb-2"></div>
    <div className="h-3 bg-gray-400 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-400 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

export const ColumnSkeleton = () => (
  <div className="w-[280px] flex-shrink-0">
    <div className="flex items-center mb-2">
      <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mr-2 animate-pulse"></div>
      <div className="h-5 bg-gray-400 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
    </div>
    <div className="flex flex-col gap-2">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

const BoardSkeleton = () => (
  <section className="w-full h-[calc(100dvh-73px)] relative overflow-x-auto overflow-y-hidden bg-gray-200 dark:bg-gray-900 p-4">
    <div className="h-full flex gap-4 transition-all duration-400 ease-in-out min-w-max">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
      <div className="w-[280px] flex-shrink-0 flex flex-col items-center justify-center p-4 bg-gray-800/20 dark:bg-gray-400/20 rounded-md mt-8">
        <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-32 animate-pulse"></div>
      </div>
    </div>
  </section>
);

export default BoardSkeleton;
