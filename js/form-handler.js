/* =============================================
   AwjaTech Form Handler
   Form validation, submission status, and errors
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    // ─── Input Focus Effects ───
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.closest('.form-group')?.classList.remove('has-error');
      });
    });

    // ─── Form Submission ───
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const formData = {};

      // ─── Basic Validation ───
      inputs.forEach(input => {
        const group = input.closest('.form-group') || input.parentElement;
        const value = input.value.trim();
        const errorEl = group.querySelector('.form-error');

        // Reset previous errors
        group.classList.remove('has-error');

        // Required Check
        if (input.hasAttribute('required') && !value) {
          isValid = false;
          group.classList.add('has-error');
          if (errorEl) errorEl.innerText = 'هذا الحقل مطلوب';
        } 
        // Email Format Check
        else if (input.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            group.classList.add('has-error');
            if (errorEl) errorEl.innerText = 'الرجاء إدخال بريد إلكتروني صحيح';
          }
        }
        // Phone Format Check
        else if (input.type === 'tel' && value) {
          const phoneRegex = /^(05|5|\+9665)[0-9]{8}$/;
          if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            isValid = false;
            group.classList.add('has-error');
            if (errorEl) errorEl.innerText = 'الرجاء إدخال رقم جوال سعودي صحيح (مثال: 0500000000)';
          }
        }

        if (isValid && input.name) {
          formData[input.name] = value;
        }
      });

      // Special check for newsletter inputs which might not have a form-group structure
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !emailInput.closest('.form-group')) {
        const val = emailInput.value.trim();
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          isValid = false;
          emailInput.style.outline = '2px solid var(--color-error)';
          setTimeout(() => {
            emailInput.style.outline = '';
          }, 3000);
        }
      }

      if (!isValid) return;

      // ─── Submission Status / UI Updates ───
      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      if (!submitBtn) return;

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin" style="font-variation-settings: 'opsz' 20;">sync</span>
        جاري الإرسال...
      `;

      const action = form.getAttribute('action');

      if (action && action.startsWith('https://formspree.io/')) {
        // Real Formspree submission
        fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            showSuccess(submitBtn, originalBtnText, form);
          } else {
            showError(submitBtn, originalBtnText);
          }
        })
        .catch(error => {
          console.error("Formspree Error:", error);
          showError(submitBtn, originalBtnText);
        });
      } else {
        // Mock API Call (1.5 seconds) for local development
        setTimeout(() => {
          showSuccess(submitBtn, originalBtnText, form);
        }, 1500);
      }
    });
  });
});

function showSuccess(btn, originalText, form) {
  btn.innerHTML = `
    <span class="material-symbols-outlined">check_circle</span>
    تم الإرسال بنجاح
  `;
  btn.style.background = 'var(--color-success)';
  btn.style.color = '#ffffff';

  // Reset form fields
  form.reset();

  // Restore button state after 3 seconds
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}

function showError(btn, originalText) {
  btn.innerHTML = `
    <span class="material-symbols-outlined">error</span>
    فشل الإرسال
  `;
  btn.style.background = 'var(--color-error)';
  btn.style.color = '#ffffff';

  // Restore button state after 3 seconds
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}

