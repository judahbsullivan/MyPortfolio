// src/components/BlockCollection.barba.ts
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

function initializeResponsiveLayouts() {
  const collectionLayouts = document.getElementById('collection-layouts');
  if (!collectionLayouts) return;

  const currentLayout = collectionLayouts.getAttribute('data-layout');
  
  // GSAP matchMedia for responsive layout handling
  const mm = gsap.matchMedia();
  
  // Mobile and tablet: Only show mason and parallax
  mm.add('(max-width: 1023px)', () => {
    if (currentLayout === 'list' || currentLayout === 'view') {
      // Force switch to mason on mobile/tablet for table layouts
      const tableElement = collectionLayouts.querySelector('.table-container');
      const masonElement = collectionLayouts.querySelector('.mason-grid');
      
      if (tableElement) {
        gsap.set(tableElement, { display: 'none' });
      }
      
      if (masonElement) {
        gsap.set(masonElement, { display: 'block' });
      }
    }
  });
  
  // Desktop: Show all layouts including table
  mm.add('(min-width: 1024px)', () => {
    // Restore original layout on desktop
    if (currentLayout === 'list' || currentLayout === 'view') {
      const tableElement = collectionLayouts.querySelector('.table-container');
      if (tableElement) {
        gsap.set(tableElement, { display: 'block' });
      }
    }
  });
}

function initializeCardAnimations() {
  const hoverBtn = document.getElementById('hover-follow-btn');
  if (!hoverBtn) return;

  const cards = document.querySelectorAll<HTMLElement>('.collection-card');

  cards.forEach((card) => {
    const titleEl = card.querySelector<HTMLElement>('.card-title');
    const descEl = card.querySelector<HTMLElement>('.card-description');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: 'top 80%', once: true }
    });

    if (titleEl) {
      const split = new SplitText(titleEl, { type: 'words' });
      tl.from(split.words, { y: 30, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' }, 0);
    }
    if (descEl) {
      const split = new SplitText(descEl, { type: 'lines' });
      tl.from(split.lines, { y: 20, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0.2);
    }

    // Only image hover triggers button
    const img = card.querySelector<HTMLElement>('.collection-image');
    if (!img) return;

    img.addEventListener('mouseenter', () => {
      const slug = card.dataset.slug ?? '';
      hoverBtn.textContent = `View ${slug.split('/').pop()}`;
      gsap.to(hoverBtn, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    });
    img.addEventListener('mousemove', (e: MouseEvent) => {
      gsap.to(hoverBtn, { x: e.clientX + 20, y: e.clientY + 20, duration: 0.2, ease: 'power3.out' });
    });
    img.addEventListener('mouseleave', () => {
      gsap.to(hoverBtn, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.inOut' });
    });
  });
}

export default function registerBlockCollectionHooks(): void {
  if (typeof window === 'undefined') return;

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      initializeResponsiveLayouts();
      initializeCardAnimations();
    }, 500);
  });
}

if (typeof window !== 'undefined') {
  registerBlockCollectionHooks();
}
