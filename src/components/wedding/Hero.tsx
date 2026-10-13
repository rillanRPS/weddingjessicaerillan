import { ChevronDown } from "lucide-react";
import { wedding } from "@/lib/wedding-data";
import coupleRails from "@/assets/couple-rails.jpg.asset.json";
import { assetUrl } from "@/lib/asset-url";

export function Hero() {
  return (
    <section id="topo" className="relative min-h-[100svh] w-full overflow-hidden">
      <img
        src={assetUrl(coupleRails.url)}
        alt="Jessica e Rillan abraçados sobre os trilhos do trem"
        className="absolute inset-0 size-full object-cover object-[center_30%]"
      />
      <div className="hero-aurora hero-aurora-left" aria-hidden="true" />
      <div className="hero-aurora hero-aurora-right" aria-hidden="true" />
      <div className="hero-sparkles" aria-hidden="true" />
      <div className="absolute inset-0 bg-foreground/45" />

      <div className="fade-up relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-cream/90">Uma celebração para sempre</p>
        <h1 className="mt-6 font-serif text-6xl leading-[0.95] text-cream sm:text-7xl md:text-8xl">
          {wedding.brideFirst}
          <span className="mx-3 italic">&</span>
          {wedding.groomFirst}
        </h1>
        <p className="mt-6 text-sm text-cream/80">
          {wedding.venue}
        </p>

        <div className="mt-9 w-full max-w-xl rounded-[2rem] border border-cream/35 bg-black/20 px-6 py-7 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-md sm:px-10 sm:py-8">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/75">Uma data que guardaremos para sempre</p>
          <p className="mt-4 font-serif text-2xl text-cream sm:text-3xl">Nosso casamento aconteceu em</p>
          <p className="mt-1 font-serif text-4xl italic text-cream sm:text-5xl">10/10/2026</p>
          <div className="mx-auto my-5 h-px w-14 bg-cream/45" />
          <p className="font-serif text-lg leading-relaxed text-cream sm:text-xl">
            “Grandes coisas fez o Senhor por nós; por isso estamos alegres.”
          </p>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-cream/70">Salmos 126:3</p>
        </div>

        <a
          href="https://wa.me/5511925308573?text=Oi%20J%C3%A9ssica%2C%20gostaria%20de%20confirmar%20minha%20presen%C3%A7a%20em%20seu%20casamento%F0%9F%A5%B0"
          className="glow-cta press mt-8 inline-flex items-center rounded-full border border-cream/80 bg-cream/10 px-9 py-3.5 text-[0.7rem] uppercase tracking-[0.28em] text-cream transition-colors hover:bg-cream hover:text-foreground"
        >
          Confirmar presença
        </a>

        <a
          href="#historia"
          aria-label="Explorar a história do casal"
          className="hero-scroll-cue press mt-8 inline-flex size-12 items-center justify-center rounded-full border border-cream/35 bg-black/15 text-cream backdrop-blur-sm"
        >
          <ChevronDown className="size-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
