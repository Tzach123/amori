import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/image-placeholder";

export function BrandStorySection() {
  return (
    <section className="grid overflow-hidden rounded-3xl bg-secondary md:grid-cols-2">
      <ImagePlaceholder
        label="ילדים משחקים בחוף הים"
        className="h-64 w-full md:h-auto md:order-2"
      />
      <div className="flex flex-col justify-center gap-4 p-8 text-center sm:p-12 md:order-1">
        <h2 className="font-heading text-2xl text-foreground">
          הסיפור שלנו
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          AMORI נולדה מתוך אהבה לילדות. אנחנו מאמינים שבגדי ילדים צריכים להיות
          יפים, נוחים ופשוטים — כאלה שנועדו לילדים בדיוק מי שהם.
        </p>
        <Button
          render={<Link href="/about">קראו עוד עלינו</Link>}
          nativeButton={false}
          variant="outline"
          className="mx-auto w-fit"
          shape="pill"
        />
      </div>
    </section>
  );
}
