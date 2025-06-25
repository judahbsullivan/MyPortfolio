// BlockPricing.barba.ts – auto-generated hook stub
import barba from "@barba/core";
import { gsap } from "gsap";

export default function registerBlockPricingHooks() {
  if (typeof window === "undefined" || !window.barba) return;

  window.barba.hooks.afterEnter(({ next }) => {
    const el = next.container.querySelector("#blockpricing");
    if (!el) return;

    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  });
}
