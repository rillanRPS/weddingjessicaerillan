import { useEffect, useState } from "react";
import { Heart, Church, Images, Gift, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "historia", label: "Nossa história", icon: Heart },
  { id: "cerimonia", label: "Cerimônia", icon: Church },
  { id: "galeria", label: "Galeria", icon: Images },
  { id: "presentes", label: "Presentes", icon: Gift },
  { id: "recados", label: "Recados", icon: MessageCircle },
];

export function BottomNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-1">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id} className="flex-1">
              <a
                href={item.id === "confirmar" ? "https://wa.me/5511925308573?text=Oi%20J%C3%A9ssica%2C%20gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20em%20seu%20casamento%F0%9F%A5%B0" : "#" + item.id}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "text-sage-deep" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full transition-all duration-300",
                    isActive ? "bg-sage/60 scale-105" : "bg-transparent",
                  )}
                >
                  <item.icon className="size-[1.05rem]" />
                </span>
                <span className="w-full truncate text-center text-[0.55rem] uppercase tracking-[0.08em]">
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
