import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function registerBlockHeroHooks() {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(({ next }: any) => {
    setTimeout(() => {
      const el = next.container.querySelector("#hero-block");
      if (!el) return;

      const headline = el.querySelector(".hero-headline");
      const tagline = el.querySelector(".hero-tagline");
      const description = el.querySelector(".hero-description");

      const tl = gsap.timeline({ delay: 0 });

      if (tagline) {
        const splitTagline = new SplitText(tagline, { type: "words" });
        tl.from(splitTagline.words, {
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
        }, 0);
      }

      if (headline) {
        const splitHeadline = new SplitText(headline, { type: "words" });
        tl.from(splitHeadline.words, {
          opacity: 0,
          y: 40,
          stagger: 0.07,
          duration: 0.8,
          ease: "power3.out",
        }, 0.2);
      }

      if (description) {
        const splitDescription = new SplitText(description, { type: "lines" });
        tl.from(splitDescription.lines, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        }, 0.4);
      }

    }, 1000); // Wait for overlay collapse
  });
}

registerBlockHeroHooks();

