import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

function animateHero() {
  const root = document.querySelector("#hero-block");
  if (!root) return;

  gsap.registerPlugin(SplitText);

  const tl = gsap.timeline();

  // Headline: original SplitText animation
  const headline = root.querySelector(".hero-headline");
  if (headline) {
    const split = new SplitText(headline as Element, {
      type: "chars, words, lines",
      linesClass: "line",
      wordsClass: "word",
      charsClass: "char",
      mask: "lines",
    });

    tl.set(split.chars, { yPercent: 100, opacity: 0 });
    tl.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: "power4.out",
    });
  }

  // Other elements: simple, non-SplitText animations
  const tagline = root.querySelectorAll(".hero-tagline");
  const paragraph = root.querySelectorAll(".hero-description");
  const name = root.querySelectorAll(".hero-name");
  const buttons = root.querySelectorAll(".hero-btn");
  const image = root.querySelectorAll(".hero-image");

  tl.fromTo(tagline, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" }, "-=0.4");

  tl.fromTo(paragraph, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "-=0.25");

  tl.fromTo(name, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "-=0.25");

  tl.fromTo(buttons, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: "power2.out" }, "-=0.25");

  tl.fromTo(image, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out" }, "-=0.25");
}

let ranThisLoad = false;

export default function registerBlockHeroHooks() {
  if (typeof window === "undefined") return;

  const run = () => animateHero();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (ranThisLoad) return;
      ranThisLoad = true;
      run();
    }, { once: true });
  } else {
    if (!ranThisLoad) {
      ranThisLoad = true;
      run();
    }
  }

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      ranThisLoad = false; // reset for new page
      animateHero();
    }, 600);
  });
}
