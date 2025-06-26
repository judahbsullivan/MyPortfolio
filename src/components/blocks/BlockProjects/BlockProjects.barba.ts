// BlockProjects.barba.ts
import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

export default function registerBlockProjectsHooks() {
  if (typeof window === "undefined") return;
  gsap.registerPlugin(SplitText);

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      const block = document.querySelector<HTMLElement>(".block-projects");
      if (!block) return;

      // Text wrappers (spans with translate-y-full)
      const taglineEls = block.querySelectorAll<HTMLElement>("p span.uppercase");
      const headlineEls = block.querySelectorAll<HTMLElement>("h2 span");

      // Buttons
      const filterBtns = block.querySelectorAll<HTMLButtonElement>(".flex.flex-wrap button");
      const viewBtns = block.querySelectorAll<HTMLButtonElement>(".flex.items-center button");

      // List/Card item wrappers (inline-block translate-y-full)
      const items = block.querySelectorAll<HTMLElement>("div.overflow-hidden.flex.justify-between > div.inline-block");

      // View more wrapper
      const viewMoreWrapper = block.querySelector<HTMLElement>(".flex.justify-between div.inline-block");

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Tagline: split into words and animate up by 50%
      if (taglineEls.length) {
        const split = new SplitText(taglineEls, { type: 'words' });
        tl.to(
          split.words,
          { translateY: '-50%', stagger: 0.1, duration: 0.6 },
          0.2
        );
      }

      // Headline: split into words and animate up by 100%
      if (headlineEls.length) {
        const split = new SplitText(headlineEls, { type: 'words' });
        tl.to(
          split.words,
          { translateY: '-100%', stagger: 0.1, duration: 0.8 },
          0
        );
      }

      // Filter buttons pop in
      if (filterBtns.length) {
        tl.to(
          filterBtns,
          { scale: 1, opacity: 1, stagger: 0.05, duration: 0.5 },
          0.8
        );
      }

      // View mode buttons pop in
      if (viewBtns.length) {
        tl.to(
          viewBtns,
          { scale: 1, opacity: 1, stagger: 0.05, duration: 0.5 },
          0.8
        );
      }

      // Items slide up into place
      if (items.length) {
        tl.to(
          items,
          { translateY: '0%', stagger: 0.1, duration: 0.8 },
          1.0
        );
      }

      // "View more" button scales in
      if (viewMoreWrapper) {
        tl.to(
          viewMoreWrapper,
          { scale: 1, opacity: 1, duration: 0.5 },
          1.2
        );
      }
    }, 800);
  });
}

registerBlockProjectsHooks();
