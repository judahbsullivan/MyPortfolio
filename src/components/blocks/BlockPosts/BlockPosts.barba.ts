// BlockPosts.barba.ts – auto-generated hook stub
import barba from "@barba/core";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

export default function registerBlockPostsHooks() {
  if (typeof window === "undefined") return;

  gsap.registerPlugin(SplitText);
  
  barba.hooks.afterEnter(({ next }: any) => {
    setTimeout(() => {
      const el = document.querySelector("#posts-block");
      if (!el) return;

      const tl = gsap.timeline({ delay: 0 });
      const heading = el.querySelectorAll(".posts-headline");
      const tagline = el.querySelectorAll("h2");
      const subtitle = el.querySelectorAll("h4");
      const description = el.querySelectorAll("p");

      // Split text for animations
      const hsplit = new SplitText(heading, {
        type: "chars, words, lines",
        linesClass: "line",
        wordsClass: "word",
        charsClass: "char",
        mask: "lines",
      });

      // Set initial position - hide the text completely
      tl.set(hsplit.chars, {
        yPercent: 200,
        opacity: 0,
      });

      // Animate heading characters from hidden position
      tl.to(hsplit.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.78,
        stagger: 0.03,
        ease: "power4.out",
      });

      // Animate other elements
      tl.from(
        tagline,
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4"
      );

      tl.from(
        subtitle,
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.3"
      );

      tl.from(
        description,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.2"
      );

      // Initialize interactive features
      initializePostsInteractivity();

      // Animate Mason grid cards
      animateMasonryCards();

      // Animate table rows and (re)bind hover preview after transition
      initializeTablePreview();
      animateTableRows();
    }, 1000); // Wait for overlay collapse
  });
}

function initializePostsInteractivity() {
  // Category filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  const layoutButtons = document.querySelectorAll('.layout-btn');
  const postsContainer = document.getElementById('posts-container');
  const postsTable = document.getElementById('posts-table');
  const postCount = document.getElementById('post-count');
  const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;
  
  let currentCategory = 'all';
  let currentLayout = 'mason';
  let allPosts = [];

  // Get all posts from the current view
  function getAllPosts() {
    const postElements = document.querySelectorAll('[href*="/post/"] , [href*="/project/"]');
    return Array.from(postElements).map(element => {
      const link = element as HTMLElement;
      const title = link.querySelector('h3')?.textContent || '';
      const description = link.querySelector('p')?.textContent || '';
      const tags = Array.from(link.querySelectorAll('.text-xs')).map(tag => 
        tag.textContent?.replace('#', '') || ''
      );
      return { element: link, title, description, tags };
    });
  }

  // Filter posts by category
  function filterPosts(category: string) {
    const posts = getAllPosts();
    let filteredPosts = posts;

    if (category !== 'all') {
      filteredPosts = posts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
      );
    }

    // Update post count
    if (postCount) {
      postCount.textContent = filteredPosts.length.toString();
    }

    // Animate filtered posts
    posts.forEach(post => {
      const isVisible = filteredPosts.includes(post);
      gsap.to(post.element, {
        opacity: isVisible ? 1 : 0.3,
        scale: isVisible ? 1 : 0.95,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    return filteredPosts;
  }

  // Switch layout
  function switchLayout(layout: string) {
    if (!isDesktop()) {
      // Force mason on mobile
      postsTable?.classList.add('hidden', 'md:hidden');
      postsTable?.classList.remove('md:block');
      postsContainer?.classList.remove('hidden');
      currentLayout = 'mason';
      return;
    }
    if (layout === currentLayout) return;

    const tl = gsap.timeline();

    if (layout === 'mason') {
      // Switch to masonry layout
      tl.to(postsTable, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          postsTable?.classList.add('hidden', 'md:hidden');
          postsTable?.classList.remove('md:block');
          postsContainer?.classList.remove('hidden');
        }
      })
      .to(postsContainer, {
        opacity: 1,
        duration: 0.3
      }, "-=0.1");
    } else {
      // Switch to table layout
      tl.to(postsContainer, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          postsContainer?.classList.add('hidden');
          postsTable?.classList.remove('hidden', 'md:hidden');
          postsTable?.classList.add('md:block');
        }
      })
      .to(postsTable, {
        opacity: 1,
        duration: 0.3
      }, "-=0.1");
    }

    currentLayout = layout;
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
    button.addEventListener('click', (e) => {
      if (!isDesktop()) return;
      const target = e.target as HTMLElement;
      const layout = target.dataset.layout || 'mason';

      // Update active state
      layoutButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'text-gray-900', 'shadow-sm');
        btn.classList.add('text-gray-600');
      });
      target.classList.add('active', 'bg-white', 'text-gray-900', 'shadow-sm');
      target.classList.remove('text-gray-600');

      // Switch layout
      switchLayout(layout);
    });
  });

  // Initialize with current category
  filterPosts(currentCategory);
  // Ensure correct initial layout per viewport
  if (!isDesktop()) {
    postsTable?.classList.add('hidden');
    postsContainer?.classList.remove('hidden');
    currentLayout = 'mason';
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

function initializeTablePreview() {
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

registerBlockPostsHooks();
