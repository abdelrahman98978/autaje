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
    form.addEventListener('submit', async (e) => {
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
        } else if (isValid && emailInput.name) {
          formData[emailInput.name] = val;
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

      // Insert into Supabase
      if (window.supabaseClient) {
        try {
          const { error } = await window.supabaseClient
            .from('quotes')
            .insert([{
              name: formData.name || 'غير محدد',
              company: formData.company || 'غير محدد',
              phone: formData.phone || 'غير محدد',
              service: formData.service || 'غير محدد',
              message: formData.message || 'اشتراك في النشرة/رسالة غير محددة'
            }]);

          if (error) throw error;

          // Success
          submitBtn.innerHTML = 'تم الإرسال بنجاح <span class="material-symbols-outlined" style="font-size: 20px; margin-right: 8px;">check_circle</span>';
          submitBtn.style.backgroundColor = 'var(--color-success)';
          form.reset();

          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
          }, 3000);

        } catch (error) {
          console.error('Error saving quote:', error);
          submitBtn.innerHTML = 'حدث خطأ، حاول مجدداً <span class="material-symbols-outlined" style="font-size: 20px; margin-right: 8px;">error</span>';
          submitBtn.style.backgroundColor = 'var(--color-error)';
          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.backgroundColor = '';
            submitBtn.disabled = false;
          }, 3000);
        }
      } else {
        alert('يرجى إعداد Supabase أولاً.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
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

