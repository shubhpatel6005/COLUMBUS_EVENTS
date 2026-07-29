export function PlaceholderMark({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-brass/15 px-1 py-0.5 underline decoration-brass decoration-dashed underline-offset-4">
      {children}
    </span>
  );
}
