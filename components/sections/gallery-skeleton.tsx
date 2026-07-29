export function GallerySkeleton() {
  const heights = [220, 300, 260, 320, 240, 280];

  return (
    <div className="columns-2 gap-4 sm:columns-3" aria-hidden="true">
      {heights.map((height, index) => (
        <div
          key={index}
          className="mb-4 w-full animate-pulse rounded-lg bg-muted"
          style={{ height, breakInside: "avoid" }}
        />
      ))}
    </div>
  );
}
