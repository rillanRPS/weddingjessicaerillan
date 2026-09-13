import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { Nav } from "@/components/wedding/Nav";
import { BottomNav } from "@/components/wedding/BottomNav";
import { Hero } from "@/components/wedding/Hero";
import { Story } from "@/components/wedding/Story";
import { Ceremony } from "@/components/wedding/Ceremony";
import { Gallery } from "@/components/wedding/Gallery";
import { Gifts } from "@/components/wedding/Gifts";
import { Guestbook } from "@/components/wedding/Guestbook";
import { Faq } from "@/components/wedding/Faq";
import { Footer } from "@/components/wedding/Footer";

const title = "Jessica & Rillan — Nosso casamento";
const description =
  "Site do casamento de Jessica e Rillan: cerimônia, programação do dia, lista de presentes e confirmação de presença.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function CinematicIntro() {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeout = window.setTimeout(() => {
      setIsLeaving(true);
      document.body.style.overflow = previousOverflow;
    }, 2300);

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className={"cinematic-intro " + (isLeaving ? "is-leaving" : "")}
      aria-hidden={isLeaving}
    >
      <div className="cinematic-intro-vignette" />
      <div className="cinematic-intro-orbit cinematic-intro-orbit-a" />
      <div className="cinematic-intro-orbit cinematic-intro-orbit-b" />
      <div className="cinematic-intro-heart" aria-hidden="true">
        <span>♡</span>
      </div>
      <div className="cinematic-intro-grain" />
      <div className="cinematic-intro-monogram" aria-label="J e R">
        <span>J</span>
        <i>&</i>
        <span>R</span>
      </div>
      <div className="cinematic-intro-line" />
    </div>
  );
}

function ScrollToTopOnLoad() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    };

    resetToTop();
    window.requestAnimationFrame(resetToTop);
    window.addEventListener("pageshow", resetToTop);

    return () => {
      window.removeEventListener("pageshow", resetToTop);
    };
  }, []);

  return null;
}

function Index() {
  return (
    <>
      <ScrollToTopOnLoad />
      <CinematicIntro />
      <main className="overflow-x-hidden bg-background pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <Nav />
        <Hero />
        <Story />
        <Ceremony />
        <Gallery />
        <Gifts />
        <Guestbook />
        <Faq />
        <Footer />
      </main>
      <BottomNav />
    </>
  );
}
