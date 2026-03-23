export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
          
          <div className="flex justify-between mt-8 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-8 space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-[#DC143C] rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
