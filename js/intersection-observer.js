/* =============================================
   AwjaTech Intersection Observer
   Scroll-triggered animations and counter animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Scroll-Triggered Animations ───
  const animationOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // If it's a stats container, trigger the counters inside
        if (entry.target.classList.contains('stats-container') || entry.target.querySelector('.counter')) {
          startCounters(entry.target);
        }
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, animationOptions);

  // Select all element selectors to be animated
  const animatedElements = document.querySelectorAll(
    '.animate-on-scroll, .stats-container, .service-card, .project-card, .sector-card, .why-us-item, .quality-item'
  );
  
  animatedElements.forEach(el => {
    // Add default initial animation classes if not already present
    if (!el.classList.contains('animate-on-scroll') && !el.classList.contains('stats-container')) {
      el.classList.add('animate-on-scroll');
    }
    animationObserver.observe(el);
  });

  // ─── Counter Animations ───
  function startCounters(container) {
    const counterElements = container.querySelectorAll('.counter');
    counterElements.forEach(counter => {
      // Avoid double counting
      if (counter.classList.contains('counted')) return;
      counter.classList.add('counted');

      const targetText = counter.getAttribute('data-target') || counter.innerText;
      const targetVal = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
      if (isNaN(targetVal)) return;

      const suffix = targetText.replace(/[0-9]/g, '');
      let currentVal = 0;
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const stepTime = duration / steps;
      const increment = targetVal / steps;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= targetVal) {
          counter.innerText = targetVal + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(currentVal) + suffix;
        }
      }, stepTime);
    });
  }
});
