import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        className
      )}
    >
      <ImageIcon className="size-8 opacity-40" />
    </div>
  );
}
