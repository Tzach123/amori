import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/image-placeholder";

export function HeroSection() {
  return (
    <section className="grid overflow-hidden rounded-3xl bg-secondary md:grid-cols-2">
      <ImagePlaceholder
        label="ילדים בקולקציית הקיץ"
        className="h-64 w-full md:h-auto"
      />
      <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
        <p className="text-sm font-medium text-primary">קולקציית קיץ 2026</p>
        <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl">
          נוצרה לימים שטופי שמש ולהרפתקאות קטנות
        </h1>
        <Button
          render={<Link href="/collections">לצפייה בקולקציה</Link>}
          nativeButton={false}
          size="lg"
          className="w-fit"
          shape="pill"
        />
      </div>
    </section>
  );
}
