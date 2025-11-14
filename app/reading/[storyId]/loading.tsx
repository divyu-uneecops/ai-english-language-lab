export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Passage Skeleton */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          {/* Passage Header Skeleton */}
          <div className="bg-white border-b border-gray-200 px-6 flex items-center justify-between py-4">
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Passage Content Skeleton */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Panel - Speech Practice Skeleton */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Right Panel Header Skeleton */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Speech Practice Content Skeleton */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 mx-auto bg-gray-200 animate-pulse rounded-full"></div>
              <div className="h-4 w-64 mx-auto bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-48 mx-auto bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
