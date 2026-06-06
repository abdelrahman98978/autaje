/* =============================================
   AwjaTech Floating Actions & Popups
   - Floating WhatsApp Button (bottom-left)
   - Newsletter Subscription Popup (delay & scroll)
   - Cookies Consent Banner (bottom)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ─── CSS Styles Injection ───
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Floating WhatsApp FAB */
    .awja-whatsapp-fab {
      position: fixed;
      bottom: 24px;
      left: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #25D366;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.3);
      cursor: pointer;
      z-index: 999;
      text-decoration: none;
      transition: all var(--transition-smooth);
    }
    .awja-whatsapp-fab svg {
      width: 32px;
      height: 32px;
      margin: 0 auto;
      display: block;
    }
    .awja-whatsapp-fab:hover {
      transform: scale(1.08) rotate(-5deg);
      box-shadow: 0 12px 32px rgba(37, 211, 102, 0.4);
    }

    /* Newsletter Popup */
    .newsletter-modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 22, 41, 0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1001;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-smooth);
    }
    .newsletter-modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .newsletter-modal-container {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-2xl);
      width: min(480px, 90%);
      padding: var(--space-8);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
      position: relative;
      transform: translateY(30px) scale(0.95);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .newsletter-modal-overlay.open .newsletter-modal-container {
      transform: translateY(0) scale(1);
    }
    .newsletter-close-btn {
      position: absolute;
      top: 16px;
      left: 16px;
      cursor: pointer;
      color: var(--color-outline);
      transition: color var(--transition-fast);
    }
    .newsletter-close-btn:hover {
      color: var(--color-error);
    }

    /* Cookies Consent Banner */
    .cookies-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translate(-50%, 50px);
      width: min(600px, 92%);
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-xl);
      padding: var(--space-4) var(--space-6);
      box-shadow: 0 12px 32px rgba(0, 22, 41, 0.1);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cookies-banner.show {
      transform: translate(-50%, 0);
      opacity: 1;
      visibility: visible;
    }

    @media (max-width: 767px) {
      .cookies-banner {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        gap: var(--space-4);
        padding: var(--space-5);
      }
      .cookies-buttons {
        display: flex;
        gap: var(--space-2);
      }
      .cookies-buttons button {
        flex: 1;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // ─── Injections ───

  // 1. WhatsApp Button
  const waBtn = document.createElement('a');
  waBtn.href = "https://wa.me/966579466881";
  waBtn.target = "_blank";
  waBtn.className = "awja-whatsapp-fab";
  waBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="32" height="32" fill="#ffffff">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.238 1.468 4.858 1.469 5.485-.001 9.948-4.409 9.952-9.83.002-2.628-1.017-5.097-2.871-6.953C16.88 1.986 14.412.966 11.785.966c-5.486 0-9.949 4.41-9.953 9.831-.001 1.722.455 3.4 1.32 4.887l-.994 3.63 3.731-.969c1.4.761 2.878 1.157 4.168 1.157zm11.238-7.669c-.302-.151-1.788-.882-2.064-1.017-.277-.134-.479-.201-.68.101-.201.302-.78.982-.956 1.184-.177.201-.353.227-.655.076-1.241-.624-2.029-1.1-2.827-2.48-.201-.346.201-.321.575-1.071.063-.126.031-.239-.015-.34-.047-.1-.42-1.01-.575-1.385-.151-.365-.302-.315-.42-.315-.1-.005-.226-.005-.353-.005-.126 0-.327.047-.49.226-.164.18-1.12.983-1.12 2.399 0 1.416 1.031 2.784 1.176 2.977.145.193 2.033 3.102 4.925 4.35.688.297 1.226.474 1.644.607.691.22 1.32.19 1.817.115.553-.084 1.788-.731 2.039-1.437.252-.706.252-1.31.177-1.437-.076-.127-.277-.202-.579-.353z"/>
    </svg>
  `;
  document.body.appendChild(waBtn);

  // 2. Newsletter Modal
  const newsletterOverlay = document.createElement('div');
  newsletterOverlay.className = "newsletter-modal-overlay";
  newsletterOverlay.id = "newsletter-modal";
  newsletterOverlay.innerHTML = `
    <div class="newsletter-modal-container">
      <span class="material-symbols-outlined newsletter-close-btn" id="btn-close-newsletter">close</span>
      <div class="space-y-4" style="text-align: center;">
        <span class="material-symbols-outlined" style="font-size: 52px; color: var(--color-secondary);">mail</span>
        <h3 class="headline-md" style="color: var(--color-primary);">اشترك في النشرة الإخبارية</h3>
        <p class="body-md text-on-surface-variant">احصل على آخر مقالات التقنية، تحديثات معايير كاميرات المراقبة، وحلول الشبكات مباشرة في بريدك.</p>
        
        <form class="space-y-3" id="form-newsletter-modal">
          <div class="form-group">
            <input class="form-input" style="text-align: center;" type="email" id="newsletter-modal-email" placeholder="name@company.com" required />
          </div>
          <button class="btn btn-secondary btn-full btn-lg" type="submit">اشترك الآن</button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(newsletterOverlay);

  // 3. Cookies Banner
  const cookiesBanner = document.createElement('div');
  cookiesBanner.className = "cookies-banner";
  cookiesBanner.id = "cookies-consent-banner";
  cookiesBanner.innerHTML = `
    <p class="body-md text-on-surface-variant" style="margin: 0; font-size:14px; font-weight: 500;">
      نحن نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتقديم خدمات مخصصة لك. بتصفحك للموقع، فإنك توافق على استخدامنا لها.
    </p>
    <div class="flex gap-3 cookies-buttons">
      <button class="btn btn-primary" id="btn-cookies-accept" style="padding: 6px 16px; font-size: 13px;">موافق</button>
      <button class="btn btn-ghost" id="btn-cookies-decline" style="padding: 6px 16px; font-size: 13px;">تخصيص</button>
    </div>
  `;
  document.body.appendChild(cookiesBanner);

  // ─── Modal Trigger Logic ───

  // A. Cookies Banner Trigger
  const cookiesAccepted = localStorage.getItem('awja_cookies_accepted');
  if (!cookiesAccepted) {
    setTimeout(() => {
      cookiesBanner.classList.add('show');
    }, 1000);
  }

  document.getElementById('btn-cookies-accept').addEventListener('click', () => {
    localStorage.setItem('awja_cookies_accepted', 'true');
    cookiesBanner.classList.remove('show');
  });

  document.getElementById('btn-cookies-decline').addEventListener('click', () => {
    cookiesBanner.classList.remove('show');
  });

  // B. Newsletter Modal Trigger (Delay of 5s + Scroll detection)
  let modalOpened = false;

  function openNewsletterModal() {
    const subscribed = localStorage.getItem('awja_newsletter_subscribed');
    const dismissed = localStorage.getItem('awja_newsletter_dismissed');

    if (!subscribed && !dismissed && !modalOpened) {
      modalOpened = true;
      newsletterOverlay.classList.add('open');
    }
  }

  // Close newsletter
  document.getElementById('btn-close-newsletter').addEventListener('click', () => {
    newsletterOverlay.classList.remove('open');
    localStorage.setItem('awja_newsletter_dismissed', 'true');
  });

  newsletterOverlay.addEventListener('click', (e) => {
    if (e.target === newsletterOverlay) {
      newsletterOverlay.classList.remove('open');
      localStorage.setItem('awja_newsletter_dismissed', 'true');
    }
  });

  // Newsletter Form Submit
  document.getElementById('form-newsletter-modal').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-modal-email').value;
    alert(`شكراً لك! تم الاشتراك بنجاح بالبريد: ${email}`);
    localStorage.setItem('awja_newsletter_subscribed', 'true');
    newsletterOverlay.classList.remove('open');
  });

  // Trigger on 5 seconds delay
  setTimeout(() => {
    openNewsletterModal();
  }, 5000);

  // Trigger on 50% scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      if (scrollPercent >= 50) {
        openNewsletterModal();
      }
    }
  });
});
