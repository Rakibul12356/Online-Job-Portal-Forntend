// GSAP Animations Helper Utility

export function getGsap() {
  if (typeof window !== 'undefined' && window.gsap) {
    if (window.ScrollTrigger && !window.__scrollTriggerRegistered) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.__scrollTriggerRegistered = true;
    }
    return {
      gsap: window.gsap,
      ScrollTrigger: window.ScrollTrigger,
    };
  }
  return { gsap: null, ScrollTrigger: null };
}

/**
 * Animate elements with a smooth staggered fade-up effect on scroll or mount
 * @param {string|Element|Element[]} target 
 * @param {Object} [options]
 */
export function animateStaggerCards(target, options = {}) {
  const { gsap, ScrollTrigger } = getGsap();
  if (!gsap) return;

  const elements = typeof target === 'string' ? document.querySelectorAll(target) : target;
  if (!elements || (elements.length !== undefined && elements.length === 0)) return;

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30,
      scale: 0.98,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      overwrite: 'auto',
      ...options,
    }
  );
}

/**
 * Animate Hero section with stunning smooth entry
 * @param {Element|string} container 
 */
export function animateHero(container) {
  const { gsap } = getGsap();
  if (!gsap) return;

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(
      '.hero-title',
      { opacity: 0, y: 35, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }
    )
      .fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
      .fromTo(
        '.search-section-box',
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        '-=0.4'
      );
  }, container);

  return () => ctx.revert();
}

/**
 * Animate Job Detail page sections as you scroll
 * @param {Element|string} container 
 */
export function animateJobDetailPage(container) {
  const { gsap, ScrollTrigger } = getGsap();
  if (!gsap) return;

  const ctx = gsap.context(() => {
    // Top header entrance
    gsap.fromTo(
      '.job-detail-header-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );

    // Overview boxes
    gsap.fromTo(
      '.job-overview-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' }
    );

    // Description & skills
    gsap.fromTo(
      '.job-desc-card, .job-skills-card',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, delay: 0.25, stagger: 0.1, ease: 'power3.out' }
    );

    // Sidebar
    gsap.fromTo(
      '.job-detail-sidebar',
      { opacity: 0, x: 25 },
      { opacity: 1, x: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' }
    );
  }, container);

  return () => ctx.revert();
}
