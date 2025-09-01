import barba from "@barba/core";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function registerParallaxGridHooks() {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      console.log('ParallaxGrid: afterEnter hook triggered');
      initializeParallaxLayout();
    }, 1000); // Wait for overlay collapse
  });
}

export function initializeParallaxLayout() {
  console.log('Initializing ParallaxGrid animations...');

  // Kill any existing ScrollTriggers for this component to prevent conflicts
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id && trigger.vars.id.startsWith('parallax-')) {
      trigger.kill();
    }
  });

  // Make function globally available for layout switching
  if (typeof window !== 'undefined') {
    (window as any).initializeParallaxLayout = initializeParallaxLayout;
  }

  const parallaxItems = document.querySelectorAll('.parallax-item');
  console.log('Found parallax items:', parallaxItems.length);

  parallaxItems.forEach((item, index) => {
    const imageContainer = item.querySelector('.parallax-container');
    const content = item.querySelector('.parallax-content');
    const image = item.querySelector('.parallax-image');

    console.log(`Item ${index}:`, { imageContainer, content, image });

    if (!imageContainer || !content || !image) {
      console.log(`Item ${index}: Missing elements, skipping`);
      return;
    }
    
                // Set initial state - container starts as mask, image starts scaled up
      gsap.set(imageContainer, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(image, { scale: 1.5, y: 0 });
      gsap.set(content, { opacity: 0 });
      
      // Container mask reveals from top to bottom using clipPath (doesn't affect image scaling)
      gsap.fromTo(imageContainer, 
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            id: `parallax-container-${index}`,
            trigger: item,
            start: 'top 70%', // 30% in view before reveal
            end: 'bottom 30%',
            scrub: false,
            onEnter: () => {
              console.log(`Container ${index} mask revealing from top`);
            }
          }
        }
      );

      // Image scales down from 1.5 to 1 (INDEPENDENT of container scaling)
      gsap.fromTo(image, 
        { scale: 1.5 },
        {
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            id: `parallax-image-${index}`,
            trigger: item,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: false,
            delay: 0.3, // Start after container starts revealing
            onEnter: () => {
              console.log(`Image ${index} scaling down from 1.5 to 1`);
              // After image scales down, start content animations
              setTimeout(() => {
                gsap.to(content, { opacity: 1, duration: 0.5 });
              }, 500);
            }
          }
        }
      );

      // Container acts as mask - image slides through it after reveal
      gsap.to(image, {
        y: -100, // Image slides up through the container mask
        ease: 'none',
        scrollTrigger: {
          id: `parallax-effect-${index}`,
          trigger: item,
          start: 'top 70%',
          end: 'bottom top',
          scrub: 1, // Smooth scrubbing
          delay: 1.5, // Start after container and image animations complete
          onUpdate: (self) => {
            // Container acts as mask - image moves through it
            // No bounds checking needed since container clips overflow
          }
        }
      });
    
          // Content reveal animations - triggered after container reveals
      const title = content.querySelector('.parallax-title span');
      const description = content.querySelector('.parallax-description span');
      const link = content.querySelector('.parallax-link');
      
      if (title) {
        const splitTitle = new SplitText(title, {
          type: 'chars, words, lines',
          lineClass: 'line++',
          wordsClass: 'word++',
          charsClass: 'char++',
          mask: 'lines'
        });
        
        gsap.set(splitTitle.chars, { yPercent: 100, opacity: 0 });
        
        // Title reveals after container animation completes
        gsap.to(splitTitle.chars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: false,
            delay: 1.4 // Wait for container animation + 200ms
          }
        });
      }
      
      if (description) {
        const splitDescription = new SplitText(description, {
          type: 'lines, words',
          lineClass: 'line++',
          charsClass: 'char++',
          mask: 'lines'
        });
        
        gsap.set(splitDescription.lines, { yPercent: 100, opacity: 0 });
        
        // Description reveals after title
        gsap.to(splitDescription.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: false,
            delay: 1.6 // Wait for title animation
          }
        });
      }
      
      if (link) {
        // Button scales in from right after description
        gsap.fromTo(link,
          { 
            scale: 0,
            opacity: 0,
            transform: 'translateX(100%)'
          },
          {
            scale: 1,
            opacity: 1,
            transform: 'translateX(0%)',
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: false,
              delay: 1.8 // Wait for description animation
            }
          }
        );
      }
  });
  
  // Hover bubble animation (only shows bubble, doesn't move image)
  const imageContainers = document.querySelectorAll('.parallax-container');
  console.log('Found image containers for hover:', imageContainers.length);
  
  imageContainers.forEach((container, index) => {
    const bubble = container.querySelector('.hover-bubble');
    if (!bubble) {
      console.log(`Container ${index}: No bubble found`);
      return;
    }
    
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      gsap.to(bubble, {
        x: x - 50,
        y: y - 20,
        opacity: 1,
        duration: 0.1,
        ease: 'power2.out'
      });
    });
    
    container.addEventListener('mouseleave', () => {
      gsap.to(bubble, {
        opacity: 0,
        duration: 0.2
      });
    });
  });
}
