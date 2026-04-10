// Shared: LoadingSpinner — loading indicator
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/70 border-t-transparent" />
      </div>
    </div>
  );
}
