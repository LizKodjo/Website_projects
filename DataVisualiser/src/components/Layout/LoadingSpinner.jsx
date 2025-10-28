export default function LoadingSpinner() {
  return (
    <>
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500">
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Loading data...
          </span>
        </div>
      </div>
    </>
  );
}
