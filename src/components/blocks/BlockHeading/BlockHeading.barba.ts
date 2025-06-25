import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import barba from "@barba/core";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function registerBlockHeadingHooks(): void {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(({ next }: any) => {
    const section = document.querySelector("#block-heading");
    if (!section) return;

    const tagline = section.querySelector(".heading-tagline");
    const title = section.querySelector(".heading-title");
    const description = section.querySelector(".heading-description");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        once: true,
      },
    });

    if (tagline) {
      const split = new SplitText(tagline, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: "power3.out",
      }, 0);
    }

    if (title) {
      const split = new SplitText(title, { type: "words" });
      tl.from(split.words, {
        opacity: 0,
        y: 40,
        stagger: 0.06,
        duration: 0.8,
        ease: "power3.out",
      }, 0.2);
    }

    if (description) {
      const split = new SplitText(description, { type: "lines" });
      tl.from(split.lines, {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
      }, 0.4);
    }
  });
}

registerBlockHeadingHooks();

