// BlockPosts.barba.ts – auto-generated hook stub
import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function registerBlockPostsHooks() {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(SplitText, ScrollTrigger);
  
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
    }, 1000); // Wait for overlay collapse
  });
}

function initializePostsInteractivity() {
  // Category filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const layoutButtons = document.querySelectorAll('.layouts-btn');
  const postsContainer = document.getElementById('posts-container');
  const postsTable = document.getElementById('posts-table');
  const postCount = document.getElementById('post-count');
  const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
  
  let currentCategory = 'all';
  let currentLayout = 'mason';
  let allPosts = [];

  // Get all posts from the current view
  function getAllPosts() {
    // Only count posts that are actually visible in the current layout
    const currentLayout = document.querySelector('.posts-container:not(.hidden), #posts-table-wrap:not(.hidden), #posts-parallax:not(.hidden), #posts-carousel:not(.hidden)');
    
    if (!currentLayout) return [];
    
    const postElements = currentLayout.querySelectorAll('[href*="/post/"], [href*="/project/"]');
    console.log('Found post elements in current layout:', postElements.length);
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
      console.log('Updated post count to:', filteredPosts.length);
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
      // Force mason on mobile
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
      console.log(`Already on layout: ${layout}, ignoring switch`);
      return;
    }

    console.log(`Switching from ${currentLayout} to ${layout}`);

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
      animateTable();
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
      if (!isDesktop()) return;
      const target = e.target as HTMLElement;
      const layout = target.dataset.layouts || 'mason';

      console.log(`Layout button clicked: ${layout}`);

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
  const initialLayout = el.getAttribute('data-initial-layout') || 'mason';
  console.log('Setting initial layout to:', initialLayout);
  
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
      postsTable?.classList.remove('hidden', 'md:hidden');
      postsTable?.classList.add('md:block');
      postsContainer?.classList.add('hidden');
      document.getElementById('posts-parallax')?.classList.add('hidden');
      document.getElementById('posts-carousel')?.classList.add('hidden');
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
      switchLayout(initialLayout);
    }, 100);
  }
  
  // Update active button state only if buttons exist (blog/projects pages)
  if (layoutButtons.length > 0) {
    layoutButtons.forEach(btn => {
      const btnLayout = btn.getAttribute('data-layouts');
      if (btnLayout === initialLayout) {
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

  function animateTable() {
    const rows = document.querySelectorAll('#posts-table-wrap .post-row');
    if (!rows.length) return;
    
    gsap.fromTo(rows,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out', stagger: 0.03 }
    );
    
    // Initialize table preview after animation
    setTimeout(() => {
      initializeTablePreview();
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
    
    console.log('Animations cleaned up');
  }
}

function animateMasonryCards() {
  const cards = document.querySelectorAll(
    '.mason-grid .break-inside-avoid'
  );
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.05,
    }
  );
}

function animateTableRows() {
  const rows = document.querySelectorAll('#posts-table-wrap .post-row');
  if (!rows.length) return;
  
  // Prevent double animation
  if ((window as any)._tableRowsAnimated) {
    console.log('Table rows already animated, skipping');
    return;
  }
  
  console.log('Animating table rows...');
  (window as any)._tableRowsAnimated = true;
  
  gsap.fromTo(
    rows,
    { y: 10, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.03,
      onComplete: () => {
        console.log('Table row animation complete');
      }
    }
  );
}

function initializeTablePreview() {
  const tableWrap = document.getElementById('posts-table-wrap');
  const preview = document.getElementById('post-preview');
  const slider = document.getElementById('post-preview-slider');
  const frame = document.getElementById('post-preview-frame');

  if (!tableWrap || !preview || !slider || !frame) {
    console.log('Table preview elements not found');
    return;
  }

  // Prevent double initialization
  if ((window as any)._tablePreviewInitialized) {
    console.log('Table preview already initialized, skipping');
    return;
  }

  console.log('Initializing table preview...');
  (window as any)._tablePreviewInitialized = true;

  // Remove existing event listeners to prevent conflicts
  if ((tableWrap as any)._previewBound) {
    console.log('Removing existing table preview bindings...');
    // Remove old event listeners if they exist
    const oldRows = tableWrap.querySelectorAll('.post-row');
    oldRows.forEach(row => {
      row.removeEventListener('mouseenter', (row as any)._mouseenterHandler);
    });
    tableWrap.removeEventListener('mouseenter', (tableWrap as any)._mouseenterHandler);
    tableWrap.removeEventListener('mouseleave', (tableWrap as any)._mouseleaveHandler);
    tableWrap.removeEventListener('mousemove', (tableWrap as any)._mousemoveHandler);
  }

  // Mark as bound
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
    const mouseenterHandler = (e: Event) => {
      const target = e.currentTarget as HTMLElement | null;
      if (!target) return;
      const indexAttr = target.getAttribute('data-index');
      const idx = Number(indexAttr) || 0;
      activeIndex = idx;
      updateIndex(activeIndex);
      showPreview();
    };
    
    // Store reference for removal
    (row as any)._mouseenterHandler = mouseenterHandler;
    row.addEventListener('mouseenter', mouseenterHandler);
  });

  const mouseenterHandler = () => {
    updateIndex(activeIndex);
    showPreview();
  };
  const mouseleaveHandler = () => hidePreview();
  const mousemoveHandler = (e: MouseEvent) => {
    const rect = tableWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const offsetX = 24;
    const offsetY = -20;
    (preview as HTMLElement).style.left = `${x + offsetX}px`;
    (preview as HTMLElement).style.top = `${y + offsetY}px`;
  };

  // Store references for removal
  (tableWrap as any)._mouseenterHandler = mouseenterHandler;
  (tableWrap as any)._mouseleaveHandler = mouseleaveHandler;
  (tableWrap as any)._mousemoveHandler = mousemoveHandler;

  tableWrap.addEventListener('mouseenter', mouseenterHandler);
  tableWrap.addEventListener('mouseleave', mouseleaveHandler);
  tableWrap.addEventListener('mousemove', mousemoveHandler);
}

function initializeParallaxLayout() {
  const parallaxItems = document.querySelectorAll('.parallax-item');
  const parallaxImages = document.querySelectorAll('.parallax-image-container');
  
  // Set initial positions
  gsap.set(parallaxImages, { x: '100%' });
  
  // Create scroll-triggered animations
  parallaxItems.forEach((item, index) => {
    const imageContainer = item.querySelector('.parallax-image-container');
    const content = item.querySelector('.parallax-content');
    
    if (!imageContainer || !content) return;
    
    // Image parallax animation
    gsap.to(imageContainer, {
      x: '0%',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    });
    
    // Content reveal animation
    const split = new SplitText(content, {
      type: 'chars, words, lines',
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      mask: 'lines'
    });
    
    gsap.set(split.chars, { yPercent: 100, opacity: 0 });
    
    gsap.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: item,
        start: 'center center',
        end: 'bottom center',
        scrub: false
      }
    });
  });
  
  // Hover bubble animation
  parallaxImages.forEach(container => {
    const bubble = container.querySelector('.hover-bubble');
    if (!bubble) return;
    
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      gsap.to(bubble, {
        x: x - 50,
        y: y - 20,
        duration: 0.1,
        ease: 'power2.out'
      });
    });
  });
}

function initializeCarouselLayout() {
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselItems = document.querySelectorAll('.carousel-item');
  
  if (!carouselTrack || !carouselItems.length) return;
  
  let currentIndex = 0;
  const itemWidth = 100 / carouselItems.length;
  let autoScrollInterval: NodeJS.Timeout;
  
  // Auto-scroll carousel
  function autoScroll() {
    currentIndex = (currentIndex + 1) % carouselItems.length;
    const translateX = -currentIndex * itemWidth;
    
    gsap.to(carouselTrack, {
      x: `${translateX}%`,
      duration: 2,
      ease: 'power2.inOut'
    });
  }
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(autoScroll, 3000);
  }
  
  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
    }
  }
  
  // Start auto-scroll
  startAutoScroll();
  
  // Pause on hover
  carouselTrack.addEventListener('mouseenter', stopAutoScroll);
  carouselTrack.addEventListener('mouseleave', startAutoScroll);
  
  // Manual navigation
  carouselItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      const translateX = -currentIndex * itemWidth;
      
      gsap.to(carouselTrack, {
        x: `${translateX}%`,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
}



registerBlockPostsHooks();
