/* =============================================
   AwjaTech Main JavaScript
   Navigation, scroll effects, and mobile menu
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Header Scroll Effect ───
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
  }

  // ─── Mobile Menu Toggle ───
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('overflow-hidden');
    });

    // Close menu on clicking outside the inner navigation panel
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
      }
    });

    // Close mobile nav when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // ─── Active Navigation Link Highlighting ───
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize links and paths
    const linkPath = href.replace(/^\.\//, '').replace(/^\.\.\//, '');
    const cleanCurrentPath = currentPath.split('/').pop() || 'index.html';

    if (
      (cleanCurrentPath === 'index.html' && (linkPath === '#' || linkPath === 'index.html')) ||
      (cleanCurrentPath !== 'index.html' && cleanCurrentPath.includes(linkPath) && linkPath !== '#' && linkPath !== '')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ─── Dropdown Hover & Click for Mobile ───
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    
    if (toggle && menu) {
      // Toggle on click for touch devices
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
          e.preventDefault();
          menu.classList.toggle('open');
        }
      });
    }
  });
});
