/**  Loader component */
export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="text-sm text-slate-900">Loading board...</p>
      </div>
    </div>
  );
}
