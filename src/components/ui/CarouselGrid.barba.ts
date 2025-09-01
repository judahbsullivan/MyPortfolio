import barba from "@barba/core";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function registerCarouselGridHooks() {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      console.log('CarouselGrid: afterEnter hook triggered');
      initializeCarouselLayout();
    }, 1000); // Wait for overlay collapse
  });
}

export function initializeCarouselLayout() {
  console.log('Initializing CarouselGrid animations...');

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

  const carouselItems = document.querySelectorAll('.carousel-container');
  console.log('Found carousel items:', carouselItems.length);

  carouselItems.forEach((item, index) => {
    const image = item.querySelector('.carousel-image');
    const content = item.querySelector('.absolute.inset-0.bg-black\\/60');

    console.log(`Item ${index}:`, { image, content });

    if (!image || !content) {
      console.log(`Item ${index}: Missing elements, skipping`);
      return;
    }

    // Set initial state - container starts as mask, image starts scaled up
    gsap.set(item, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(image, { scale: 1.2, x: 0 });
    gsap.set(content, { opacity: 0 });

    // Container mask reveals from left to right using clipPath
    gsap.fromTo(item,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          id: `carousel-container-${index}`,
          trigger: item,
          start: 'left 80%', // 20% in view before reveal
          end: 'right 20%',
          scrub: false,
          onEnter: () => {
            console.log(`Carousel container ${index} mask revealing from left`);
          }
        }
      }
    );

    // Image scales down from 1.2 to 1 (INDEPENDENT of container scaling)
    gsap.fromTo(image,
      { scale: 1.2 },
      {
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          id: `carousel-image-${index}`,
          trigger: item,
          start: 'left 80%',
          end: 'right 20%',
          scrub: false,
          delay: 0.2, // Start after container starts revealing
          onEnter: () => {
            console.log(`Carousel image ${index} scaling down from 1.2 to 1`);
            // After image scales down, start content animations
            setTimeout(() => {
              gsap.to(content, { opacity: 1, duration: 0.5 });
            }, 300);
          }
        }
      }
    );

    // Subtle horizontal parallax effect as item scrolls
    gsap.to(image, {
      x: -50, // Image slides slightly left through the container mask
      ease: 'none',
      scrollTrigger: {
        id: `carousel-effect-${index}`,
        trigger: item,
        start: 'left 80%',
        end: 'right 20%',
        scrub: 1, // Smooth scrubbing
        delay: 0.8, // Start after container and image animations complete
        onUpdate: (self) => {
          // Container acts as mask - image moves through it
          // No bounds checking needed since container clips overflow
        }
      }
    });
  });
}
