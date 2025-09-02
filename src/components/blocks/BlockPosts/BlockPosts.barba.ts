// BlockPosts.barba.ts – auto-generated hook stub
import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function registerBlockPostsHooks() {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(SplitText, ScrollTrigger);
  
  // Initialize on first page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnLoad);
  } else {
    initializeOnLoad();
  }
  
  barba.hooks.afterEnter(({ next }: any) => {
    setTimeout(() => {
      const el = document.querySelector("#posts-block");
      if (!el) return;

      // Check if we're on blog or projects page
      const currentPath = window.location.pathname;
      const isBlogOrProjectsPage = currentPath === '/blog' || currentPath === '/projects';

      // Initialize interactive features only on blog/projects pages
      if (isBlogOrProjectsPage) {
        initializePostsInteractivity();
      }
      
      // Always initialize responsive layouts
      initializeResponsiveLayouts();
    }, 1000); // Wait for overlay collapse
  });
}

function initializeOnLoad() {
  const currentPath = window.location.pathname;
  const isBlogOrProjectsPage = currentPath === '/blog' || currentPath === '/projects';
  
  if (isBlogOrProjectsPage) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      initializePostsInteractivity();
    }, 100);
  }
  
  // Always initialize responsive layouts
  setTimeout(() => {
    initializeResponsiveLayouts();
  }, 100);
}

function initializeResponsiveLayouts() {
  // GSAP matchMedia for responsive layout handling
  const mm = gsap.matchMedia();
  
  // Mobile and tablet: Only show mason and parallax, hide table
  mm.add('(max-width: 1023px)', () => {
    const tableButton = document.querySelector('[data-layouts="table"]');
    const postsTable = document.getElementById('posts-table');
    
    // Hide table button on mobile/tablet
    if (tableButton) {
      gsap.set(tableButton, { display: 'none' });
    }
    
    // Hide table content on mobile/tablet
    if (postsTable) {
      gsap.set(postsTable, { display: 'none' });
    }
    
    // If current layout is table, switch to mason
    const postsBlock = document.querySelector('#posts-block');
    const currentLayout = postsBlock?.getAttribute('data-initial-layout');
    if (currentLayout === 'table') {
      const postsContainer = document.getElementById('posts-container');
      if (postsContainer) {
        gsap.set(postsContainer, { display: 'block' });
      }
    }
  });
  
  // Desktop: Show all layouts including table
  mm.add('(min-width: 1024px)', () => {
    const tableButton = document.querySelector('[data-layouts="table"]');
    const postsTable = document.getElementById('posts-table');
    
    // Show table button on desktop
    if (tableButton) {
      gsap.set(tableButton, { display: 'block' });
    }
    
    // Show table content on desktop (if it was the selected layout)
    const postsBlock = document.querySelector('#posts-block');
    const currentLayout = postsBlock?.getAttribute('data-initial-layout');
    if (currentLayout === 'table' && postsTable) {
      gsap.set(postsTable, { display: 'block' });
    }
  });
}

function initializePostsInteractivity() {
  // Check if we're on blog or projects page
  const currentPath = window.location.pathname;
  const isBlogOrProjectsPage = currentPath === '/blog' || currentPath === '/projects';
  
  // Category filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const layoutButtons = document.querySelectorAll('.layouts-btn');
  const postsContainer = document.getElementById('posts-container');
  const postsTable = document.getElementById('posts-table');
  const postCount = document.getElementById('post-count');
  const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;
  
  let currentCategory = 'all';
  let currentLayout = 'mason';
  let allPosts = [];

  // Get all posts from the current view
  function getAllPosts() {
    // Only count posts that are actually visible in the current layout
    const currentLayout = document.querySelector('.posts-container:not(.hidden), #posts-table-wrap:not(.hidden), #posts-parallax:not(.hidden), #posts-carousel:not(.hidden)');
    
    if (!currentLayout) return [];
    
    const postElements = currentLayout.querySelectorAll('[href*="/post/"], [href*="/project/"]');
    return Array.from(postElements).map(element => {
      const link = element as HTMLElement;
      const title = link.querySelector('h3')?.textContent || '';
      const description = link.querySelector('p')?.textContent || '';
      return { element: link, title, description };
    });
  }

  // Filter posts by category (simplified - show all for now)
  function filterPosts(category: string) {
    const posts = getAllPosts();
    
    // For now, show all posts regardless of category
    const filteredPosts = posts;

    // Update post count
    if (postCount) {
      postCount.textContent = filteredPosts.length.toString();
    }

    // Show all posts
    posts.forEach(post => {
      gsap.set(post.element, {
        opacity: 1,
        scale: 1
      });
    });

    return filteredPosts;
  }

  // Simple layout switcher
  function switchLayout(layout: string) {
    if (!isDesktop()) {
      // Force mason on mobile/tablet
      postsTable?.classList.add('hidden', 'md:hidden');
      postsTable?.classList.remove('md:block');
      postsContainer?.classList.remove('hidden');
      document.getElementById('posts-parallax')?.classList.add('hidden');
      document.getElementById('posts-carousel')?.classList.add('hidden');
      currentLayout = 'mason';
      return;
    }

    // Prevent switching to the same layout
    if (layout === currentLayout) {
      return;
    }

    // Clean up existing animations
    cleanupAnimations();

    // Hide all layouts
    postsContainer?.classList.add('hidden');
    postsTable?.classList.add('hidden', 'md:hidden');
    postsTable?.classList.remove('md:block');
    document.getElementById('posts-parallax')?.classList.add('hidden');
    document.getElementById('posts-carousel')?.classList.add('hidden');

    // Show new layout
    if (layout === 'mason') {
      postsContainer?.classList.remove('hidden');
      animateMasonry();
    } else if (layout === 'table') {
      postsTable?.classList.remove('hidden', 'md:hidden');
      postsTable?.classList.add('md:block');
      animateTableRows();
    } else if (layout === 'parallax') {
      document.getElementById('posts-parallax')?.classList.remove('hidden');
      animateParallax();
    } else if (layout === 'carousel') {
      document.getElementById('posts-carousel')?.classList.remove('hidden');
      animateCarousel();
    }

    // Update current layout
    currentLayout = layout;
    
    // Update post count for new layout
    setTimeout(() => {
      filterPosts(currentCategory);
    }, 100);
  }

  // Category button event listeners
  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const category = target.dataset.category || 'all';

      // Update active state
      categoryButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
      });
      target.classList.add('active', 'bg-blue-600', 'text-white');
      target.classList.remove('bg-gray-200', 'text-gray-700');

      // Filter posts
      currentCategory = category;
      filterPosts(category);
    });
  });

  // Layout button event listeners
  layoutButtons.forEach(button => {
    // Remove any existing event listeners to prevent duplicates
    button.removeEventListener('click', button._layoutClickHandler);
    
    // Create handler function
    button._layoutClickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      const layout = target.dataset.layouts || 'mason';
      
      // Check if this is a desktop-only layout on mobile
      if (!isDesktop() && target.hasAttribute('data-desktop-only')) {
        return;
      }

      // Update active state
      layoutButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'text-gray-900', 'shadow-sm');
        btn.classList.add('text-gray-600');
      });
      target.classList.add('active', 'bg-white', 'text-gray-900', 'shadow-sm');
      target.classList.remove('text-gray-600');

      // Switch layout
      switchLayout(layout);
    };
    
    // Add new event listener
    button.addEventListener('click', button._layoutClickHandler);
  });

  // Set initial layout based on the component prop
  const postsBlock = document.querySelector("#posts-block");
  const initialLayout = postsBlock?.getAttribute('data-initial-layout') || 'mason';

  
  // Set initial layout
  currentLayout = initialLayout;
  
  // Ensure initial layout is visible and content shows
  if (isBlogOrProjectsPage) {
    // Show initial layout immediately
    if (initialLayout === 'mason') {
      postsContainer?.classList.remove('hidden');
      postsTable?.classList.add('hidden', 'md:hidden');
      document.getElementById('posts-parallax')?.classList.add('hidden');
      document.getElementById('posts-carousel')?.classList.add('hidden');
    } else if (initialLayout === 'table') {
      // Only show table on desktop
      if (isDesktop()) {
        postsTable?.classList.remove('hidden', 'md:hidden');
        postsTable?.classList.add('md:block');
        postsContainer?.classList.add('hidden');
        document.getElementById('posts-parallax')?.classList.add('hidden');
        document.getElementById('posts-carousel')?.classList.add('hidden');
      } else {
        // Fallback to mason on mobile/tablet
        postsContainer?.classList.remove('hidden');
        postsTable?.classList.add('hidden', 'md:hidden');
        document.getElementById('posts-parallax')?.classList.add('hidden');
        document.getElementById('posts-carousel')?.classList.add('hidden');
        currentLayout = 'mason';
      }
    } else if (initialLayout === 'parallax') {
      document.getElementById('posts-parallax')?.classList.remove('hidden');
      postsContainer?.classList.add('hidden');
      postsTable?.classList.add('hidden', 'md:hidden');
      document.getElementById('posts-carousel')?.classList.add('hidden');
    } else if (initialLayout === 'carousel') {
      document.getElementById('posts-carousel')?.classList.remove('hidden');
      postsContainer?.classList.add('hidden');
      postsTable?.classList.add('hidden', 'md:hidden');
      document.getElementById('posts-parallax')?.classList.add('hidden');
    }
    
    // Run initial animation
    setTimeout(() => {
      switchLayout(currentLayout);
    }, 100);
  }
  
  // Update active button state only if buttons exist (blog/projects pages)
  if (layoutButtons.length > 0) {
    layoutButtons.forEach(btn => {
      const btnLayout = btn.getAttribute('data-layouts');
      if (btnLayout === currentLayout) {
        btn.classList.add('active', 'bg-white', 'text-gray-900', 'shadow-sm');
        btn.classList.remove('text-gray-600');
      }
    });
  }
  
  // Ensure correct initial layout per viewport
  if (!isDesktop()) {
    postsTable?.classList.add('hidden');
    postsContainer?.classList.remove('hidden');
    currentLayout = 'mason';
  }
  
  // Initialize with current category after layout is set
  filterPosts(currentCategory);



  // Simple animation functions
  function animateMasonry() {
    const cards = document.querySelectorAll('.mason-grid .break-inside-avoid');
    if (!cards.length) return;
    
    gsap.fromTo(cards, 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05 }
    );
  }

  function animateTableRows() {
    const rows = document.querySelectorAll('#posts-table-wrap .post-row');
    if (!rows.length) return;
    
    gsap.fromTo(rows,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.03 }
    );
    
    // Initialize table preview after animation
    setTimeout(() => {
      if ((window as any).initializeTablePreview) {
        (window as any).initializeTablePreview();
      }
    }, 200);
  }

  function animateParallax() {
    if ((window as any).initializeParallaxLayout) {
      (window as any).initializeParallaxLayout();
    }
  }

  function animateCarousel() {
    if ((window as any).initializeCarouselLayout) {
      (window as any).initializeCarouselLayout();
    }
  }

  // Cleanup function
  function cleanupAnimations() {
    // Kill all ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && (
        trigger.vars.id.startsWith('parallax-') ||
        trigger.vars.id.startsWith('carousel-') ||
        trigger.vars.id.startsWith('table-') ||
        trigger.vars.id.startsWith('mason-')
      )) {
        trigger.kill();
      }
    });

    // Clear GSAP animations
    gsap.killTweensOf([
      '.parallax-item',
      '.carousel-container',
      '.post-row',
      '.break-inside-avoid'
    ]);
  }
}

registerBlockPostsHooks();
