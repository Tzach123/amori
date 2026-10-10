export default function Loading() {
  return (
    <main
      role="status"
      aria-label="טוען..."
      className="flex flex-1 items-center justify-center py-24"
    >
      <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </main>
  );
}
