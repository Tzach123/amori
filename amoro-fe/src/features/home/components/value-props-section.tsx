import { Heart, Leaf, Feather, Smile } from "lucide-react";

const VALUE_PROPS = [
  { icon: Heart, label: "עיצוב ישראלי באהבה" },
  { icon: Leaf, label: "צבעים רכים ועל-זמניים" },
  { icon: Feather, label: "כותנה נעימה לילדים" },
  { icon: Smile, label: "גזרות נוחות לתנועה ומשחק" },
];

export function ValuePropsSection() {
  return (
    <section className="grid grid-cols-2 gap-6 rounded-3xl bg-muted p-8 sm:grid-cols-4">
      {VALUE_PROPS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-3 text-center"
        >
          <Icon className="size-6 text-primary" />
          <p className="text-sm text-foreground">{label}</p>
        </div>
      ))}
    </section>
  );
}
