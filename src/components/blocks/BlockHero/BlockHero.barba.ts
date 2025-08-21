import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

export default function registerBlockHeroHooks() {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(SplitText);
  barba.hooks.afterEnter(({ next }: any) => {
    setTimeout(() => {
      const el = document.querySelector("#hero-block");
      if (!el) return;

      const tl = gsap.timeline({ delay: 0 });
      const heading = el.querySelectorAll(".hero-headline");
      const tagline = el.querySelectorAll(".hero-tagline");
      const btn = el.querySelectorAll("#hero-btn");
      const paragraph = el.querySelectorAll(".hero-description");
      const image = el.querySelectorAll(".hero-image");

      const hsplit = new SplitText(heading, {
        type: "chars, words,lines",
        linesClass: "line",
        wordsClass: "word",
        charsClass: "char",
        mask: "lines",
      });

      const pSplit = new SplitText(paragraph, {
        type: "lines, words",
        mask: "lines",
        linesClass: "line-parent",
      });

      // Animate heading characters
      tl.from(hsplit.chars, {
        yPercent: 200,
        duration: 0.78,
        stagger: 0.03,
        ease: "power4.out",
      });

      // Animate paragraph lines
      tl.from(
        pSplit.lines,
        {
          y: 200,
          alpha: 0,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.3", // overlap slightly with heading
      );
      //
      // tl.to(
      //   image,
      //   {
      //     opacity: 1,
      //     ease: "power3.out",
      //   },
      //   0.6,
      // );
    }, 1000); // Wait for overlay collapse
  });
}

registerBlockHeroHooks();
