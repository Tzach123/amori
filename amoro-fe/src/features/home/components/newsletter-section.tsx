"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-3xl bg-secondary p-8 text-center sm:p-12">
      <Mail className="size-6 text-primary" />
      <h2 className="font-heading text-2xl text-foreground">
        הצטרפו לעולם של AMORI
      </h2>
      <p className="text-sm text-muted-foreground">
        היו הראשונים לקבל עדכונים על קולקציות חדשות.
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      >
        <Input
          type="email"
          required
          placeholder="הכניסו את המייל שלכם"
          aria-label="כתובת אימייל"
          className="flex-1"
        />
        <Button type="submit" shape="pill">
          אני רוצה להצטרף
        </Button>
      </form>
    </section>
  );
}
