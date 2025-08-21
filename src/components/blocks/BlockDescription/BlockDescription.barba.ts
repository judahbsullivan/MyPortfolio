import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import barba from "@barba/core";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function registerBlockDescriptionHooks(): void {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(({ next }: any) => {
    const section = document.querySelector("#block-description");
    if (!section) return;

    const title = section.querySelectorAll(".desc-title");
    const text = section.querySelectorAll(".desc-text");
    const btn = section.querySelectorAll(".desc-btn");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%", // when top of section hits 80% of viewport
      },
    });

    if (title) {
      const split = new SplitText(title, { type: "words" });
      tl.from(
        split.words,
        {
          opacity: 0,
          y: 30,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
        },
        0,
      );
    }

    if (text) {
      const split = new SplitText(text, { type: "lines" });
      tl.from(
        split.lines,
        {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
        },
        0.2,
      );
    }

    if (btn) {
      tl.to(
        btn,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.2,
          ease: "power2.out",
        },
        0.4,
      );
    }
  });
}

registerBlockDescriptionHooks();
