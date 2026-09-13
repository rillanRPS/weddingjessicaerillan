import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding-data";
import coupleRails from "@/assets/couple-rails.jpg.asset.json";
import { assetUrl } from "@/lib/asset-url";

function useCountdown(target: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      const clamped = Math.max(diff, 0);
      setLeft({
        d: Math.floor(clamped / 86400000),
        h: Math.floor((clamped / 3600000) % 24),
        m: Math.floor((clamped / 60000) % 60),
        s: Math.floor((clamped / 1000) % 60),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return left;
}

export function Hero() {
  const left = useCountdown(wedding.date);

  return (
    <section id="topo" className="relative min-h-[100svh] w-full overflow-hidden">
      <img
        src={assetUrl(coupleRails.url)}
        alt="Jessica e Rillan abraçados sobre os trilhos do trem"
        className="absolute inset-0 size-full object-cover object-[center_30%]"
      />
      <div className="absolute inset-0 bg-foreground/45" />

      <div className="fade-up relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-5 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-cream/90">Vamos nos casar</p>
        <h1 className="mt-6 font-serif text-6xl leading-[0.95] text-cream sm:text-7xl md:text-8xl">
          {wedding.brideFirst}
          <span className="mx-3 italic">&</span>
          {wedding.groomFirst}
        </h1>
        <div className="mt-8 flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.3em] text-cream/85">
          <span className="h-px w-10 bg-cream/50" />
          {wedding.dateLabel}
          <span className="h-px w-10 bg-cream/50" />
        </div>
        <p className="mt-4 text-sm text-cream/80">
          {wedding.venue}
        </p>

        {left && (
          <dl className="mt-12 flex gap-8 sm:gap-12">
            {[
              { v: left.d, l: "dias" },
              { v: left.h, l: "horas" },
              { v: left.m, l: "min" },
              { v: left.s, l: "seg" },
            ].map((item) => (
              <div key={item.l}>
                <dt className="font-serif text-4xl text-cream">
                  {String(item.v).padStart(2, "0")}
                </dt>
                <dd className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-cream/70">
                  {item.l}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <a
          href="https://wa.me/5511925308573?text=Oi%20J%C3%A9ssica%2C%20gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20em%20seu%20casamento%F0%9F%A5%B0"
          className="glow-cta press mt-12 inline-flex items-center rounded-full border border-cream/80 bg-cream/10 px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.28em] text-cream transition-colors hover:bg-cream hover:text-foreground"
        >
          Confirmar presença
        </a>
        <p className="mt-4 rounded-full border border-cream/30 bg-black/20 px-4 py-2 text-xs font-medium tracking-[0.12em] text-cream/90 backdrop-blur-sm">
          Confirme até {wedding.rsvpDeadline}
        </p>
      </div>
    </section>
  );
}
