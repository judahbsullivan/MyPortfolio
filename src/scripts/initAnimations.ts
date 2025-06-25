//@ts-nocheck
import barba from "@barba/core";
import barbaPrefetch from "@barba/prefetch";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ─── ScrollSmoother Setup ──────────────────────────────────────────────────
let smoother: ScrollSmoother | null = null;
function initSmoother() {
  if (smoother) smoother.kill();
  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true,
  });
  console.log("[initAnimations] ScrollSmoother initialized");
}

// Expose these so layout.barba.ts can kill/re-init
; (window as any).initSmoother = initSmoother;
; (window as any).smoother = smoother;

if (typeof window !== "undefined") {
  barba.use(barbaPrefetch);
  (window as any).barba = barba;

  if (!(window as any).__initAnimations_initialized) {
    // 1) First‐load smoother
    initSmoother();

    // 3) Import all *.barba.ts modules
    const modules = import.meta.glob(
      [
        "src/components/blocks/*/*.barba.ts",
        "src/layouts/*/*.barba.ts"
      ],
      { eager: true }
    );
    for (const path in modules) {
      const fn = (modules[path] as any).default;
      if (typeof fn === "function") {
        fn();
        console.log(`[initAnimations] Registered hooks from ${path}`);
      }
    }

    console.log("[initAnimations] Barba hooks loaded");
    (window as any).__initAnimations_initialized = true;
  }
}

