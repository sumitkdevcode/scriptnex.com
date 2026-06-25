export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00d285]" />
        <span className="text-[#ababab] text-sm">Loading...</span>
      </div>
    </div>
  );
}
