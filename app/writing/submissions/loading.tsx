export default function WritingSubmissionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-80 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Submissions List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="text-center">
                    <div className="h-4 w-16 mx-auto bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="h-6 w-12 mx-auto bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
