import barba from "@barba/core";
import { gsap } from "gsap";

export default function registerTableHooks() {
  if (typeof window === "undefined") return;

  barba.hooks.afterEnter(() => {
    setTimeout(() => {
      // Animate table rows
      animateTableRows();
      // Initialize table preview
      initializeTablePreview();
    }, 1000); // Wait for overlay collapse
  });
}

export function animateTableRows() {
  const rows = document.querySelectorAll('#posts-table-wrap .post-row');
  if (!rows.length) return;
  
  gsap.fromTo(
    rows,
    { y: 10, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.03,
    }
  );
}

export function initializeTablePreview() {
  const tableWrap = document.getElementById('posts-table-wrap');
  const preview = document.getElementById('post-preview');
  const slider = document.getElementById('post-preview-slider');
  const frame = document.getElementById('post-preview-frame');

  if (!tableWrap || !preview || !slider || !frame) return;

  // Guard to avoid double-binding on repeated hooks
  if ((tableWrap as any)._previewBound) return;
  (tableWrap as any)._previewBound = true;

  const rows = tableWrap.querySelectorAll('.post-row');
  let activeIndex = 0;

  const showPreview = () => {
    preview.classList.remove('scale-0', 'opacity-0');
    preview.classList.add('scale-100', 'opacity-100');
  };
  
  const hidePreview = () => {
    preview.classList.add('scale-0', 'opacity-0');
    preview.classList.remove('scale-100', 'opacity-100');
  };
  
  const updateIndex = (index: number) => {
    const h = (frame as HTMLElement).clientHeight;
    const countAttr = slider.getAttribute('data-count');
    const count = Number(countAttr) || 0;
    const reversedIndex = Math.max(0, count - 1 - index);
    const offset = -(reversedIndex * h);
    (slider as HTMLElement).style.transform = `translateY(${offset}px)`;
  };

  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      const target = e.currentTarget as HTMLElement | null;
      if (!target) return;
      const indexAttr = target.getAttribute('data-index');
      const idx = Number(indexAttr) || 0;
      activeIndex = idx;
      updateIndex(activeIndex);
      showPreview();
    });
  });

  tableWrap.addEventListener('mouseenter', () => {
    updateIndex(activeIndex);
    showPreview();
  });
  
  tableWrap.addEventListener('mouseleave', () => hidePreview());
  
  tableWrap.addEventListener('mousemove', (e) => {
    const rect = tableWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const offsetX = 24;
    const offsetY = -20;
    (preview as HTMLElement).style.left = `${x + offsetX}px`;
    (preview as HTMLElement).style.top = `${y + offsetY}px`;
  });
}

registerTableHooks();
