import barba from "@barba/core";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function registerCarouselGridHooks() {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      initializeCarouselLayout();
    }, 500);
  });
}

export function initializeCarouselLayout() {
  // Kill any existing ScrollTriggers for this component to prevent conflicts
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id && trigger.vars.id.startsWith('carousel-')) {
      trigger.kill();
    }
  });

  // Make function globally available for layout switching
  if (typeof window !== 'undefined') {
    (window as any).initializeCarouselLayout = initializeCarouselLayout;
  }

  const carouselItems = document.querySelectorAll('.carousel-item');

  carouselItems.forEach((item, index) => {
    const image = item.querySelector('.carousel-image');
    
    if (!image) return;

    // Set initial state
    gsap.set(image, { 
      scale: 1.1, 
      opacity: 0.8 
    });

    // Animate image on scroll
    gsap.to(image, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        id: `carousel-image-${index}`,
        trigger: item,
        start: "top 80%",
        end: "bottom 20%",
        scrub: false,
        onEnter: () => {
          // Image is now fully visible
        }
      }
    });
  });
}

if (typeof window !== 'undefined') {
  registerCarouselGridHooks();
}
