import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-screen-sm flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <ShoppingBag className="size-8" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl text-foreground">
          העמוד לא נמצא
        </h1>
        <p className="text-muted-foreground">
          ייתכן שהקישור שגוי או שהעמוד כבר לא קיים. בואו נחזיר אתכם לקולקציות
          שלנו.
        </p>
      </div>
      <Button
        render={<Link href="/">חזרה לעמוד הבית</Link>}
        nativeButton={false}
        size="lg"
        shape="pill"
      />
    </main>
  );
}
