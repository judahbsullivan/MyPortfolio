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

      const headline = el.querySelectorAll(".hero-headline");
      const tagline = el.querySelectorAll(".hero-tagline");
      const btn = el.querySelectorAll("#hero-btn");
      const description = el.querySelectorAll(".hero-description");
      const image = el.querySelectorAll(".hero-image");

      const tl = gsap.timeline({ delay: 0 });

      if (tagline) {
        const splitTagline = new SplitText(tagline, { type: "words" });
        tl.to(splitTagline.words, {
          translateY: "-50%",
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
        }, 0.35);
      }

      if (headline) {
        const splitHeadline = new SplitText(headline, { type: "words" });
        tl.to(splitHeadline.words, {
          translateY: "-100%",
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        }, 0);
      }

      if (description) {
        const splitDescription = new SplitText(description, { type: "lines" });
        tl.to(splitDescription.lines, {
          translateY: "-100%",
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        },);
      }

      if (btn) {
        if (!btn) return console.error("Button not found in BlockHero");
        tl.to(btn, {
          duration: 0.5,
          opacity: 1,
          delay: 0.5,
          ease: "power3.out",
        }, 0.8)
      }

      tl.to(image, {
        opacity: 1,
        ease: "power3.out",
      }, 0.6)



    }, 1000); // Wait for overlay collapse
  });
}

registerBlockHeroHooks();

