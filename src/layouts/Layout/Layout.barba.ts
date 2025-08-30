import barba from "@barba/core";
import { gsap } from "gsap";

function LayoutEnter(container: HTMLElement): void {
  const overlay = document.querySelector<HTMLElement>(".overlay");
  // const footer = document.querySelector<HTMLElement>("footer");

  if (!overlay) {
    console.error("Overlay element not found!");
    return;
  }

  // Hide footer while overlay is animating out
  // if (footer) {
  //   gsap.set(footer, { autoAlpha: 0 });
  // }
  //
  const tl = gsap.timeline({
    //   onComplete: () => {
    //     if (footer) {
    //       gsap.to(footer, { autoAlpha: 1, duration: 0.5 });
    //     }
    //   },
  });

  tl.set(overlay, { transformOrigin: "top" })
    .to(overlay, { scaleY: 0, duration: 1, ease: "power2.inOut" }, 0)
    .from(container, { autoAlpha: 0 }, 0.3);
}

function LayoutExit(container: HTMLElement): Promise<void> {
  const overlay = document.querySelector<HTMLElement>(".overlay");
  const footer = document.querySelector<HTMLElement>("footer");

  if (!overlay) {
    console.error("Overlay element not found!");
    return Promise.resolve();
  }

  if (footer) {
    gsap.set(footer, { autoAlpha: 0 }); // hide before exit
  }

  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });

    tl.to(overlay, {
      transformOrigin: "bottom",
      scaleY: 1,
      duration: 1.2,
      ease: "power2.inOut",
    }).from(container, { autoAlpha: 1, duration: 0.8, ease: "power4.in" }, "0");
  });
}

export default function registerLayoutBarba() {
  if (typeof window === "undefined") return;
  if ((window as any).__layout_barba_initialized) return;

  barba.init({
    transitions: [
      {
        name: "overlay-transition",

        async leave({ current }) {
          console.log("[layout.barba] leave → LayoutExit (overlay scaling up)");
          return LayoutExit(current.container);
        },

        async enter({ next }) {
          console.log(
            "[layout.barba] enter → LayoutEnter (overlay scaling down)",
          );
          LayoutEnter(next.container);
        },

        async afterEnter({ next }) {
          console.log("[layout.barba] afterEnter → unblocked container");
          // Always reset scroll to top after transitions (use instant on mobile)
          const isMobile = window.matchMedia('(max-width: 767px)').matches;
          window.scrollTo({ top: 0, left: 0, behavior: isMobile ? 'auto' : 'auto' });
          requestAnimationFrame(() => {
            if ((window as any).initSmoother) {
              (window as any).initSmoother();
            }
          });
        },
      },
    ],
  });

  console.log("[layout.barba] initialized overlay transition");
  (window as any).__layout_barba_initialized = true;
}

registerLayoutBarba();
