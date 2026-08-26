"use client";

import dynamic from "next/dynamic";

const HeloraScene = dynamic(() => import("./HeloraScene"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-ink" />,
});

export default function SceneCanvas({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={className ?? "h-full w-full"}>
      <HeloraScene compact={compact} />
    </div>
  );
}
