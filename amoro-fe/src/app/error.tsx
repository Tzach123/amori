"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-screen-sm flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <TriangleAlert className="size-8" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl text-foreground">
          משהו השתבש
        </h1>
        <p className="text-muted-foreground">
          קרתה תקלה בלתי צפויה בטעינת העמוד. אפשר לנסות שוב או לחזור לעמוד
          הבית.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => reset()} size="lg" shape="pill">
          נסו שוב
        </Button>
        <Button
          render={<Link href="/">חזרה לעמוד הבית</Link>}
          nativeButton={false}
          variant="outline"
          size="lg"
          shape="pill"
        />
      </div>
    </main>
  );
}
