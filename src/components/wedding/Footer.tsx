import { wedding } from "@/lib/wedding-data";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="bg-sage-deep py-20 text-center">
      <Reveal className="mx-auto max-w-2xl px-5">
        <p className="font-serif text-4xl tracking-[0.3em] text-cream">{wedding.monogram}</p>
        <div className="mx-auto mt-6 h-px w-16 bg-cream/40" />
        <p className="mt-6 text-[0.7rem] uppercase leading-relaxed tracking-[0.25em] text-cream/80">
          {wedding.dateLabel} · {wedding.venue}
        </p>
        <p className="mt-10 font-serif text-2xl leading-relaxed text-cream sm:text-3xl">
          O grande dia passou; o carinho de vocês permanece.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
          A todos que estiveram conosco, deixaram um recado ou nos presentearam: nosso muito obrigado.
          Cada presença, palavra e gesto tornou essa celebração ainda mais especial — e ficará para sempre em nossa memória.
        </p>
        <p className="mt-8 font-serif text-xl italic text-cream">
          Com amor, {wedding.brideFirst} e {wedding.groomFirst}
        </p>
      </Reveal>
    </footer>
  );
}
