document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('awja_user_email');
  const userName = localStorage.getItem('awja_user_name') || 'عميل أوجاتيك';

  if (!userEmail) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('user-email-display').innerText = userEmail;
  document.getElementById('user-name-display').innerText = userName;
  document.getElementById('user-avatar').innerText = userName.charAt(0).toUpperCase();

  document.getElementById('settings-name').value = userName;
  document.getElementById('settings-email').value = userEmail;
  document.getElementById('settings-phone').value = localStorage.getItem('awja_user_phone') || '0500000000';

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('awja_user_email');
    localStorage.removeItem('awja_user_name');
    localStorage.removeItem('awja_user_phone');
    window.location.href = 'login.html';
  });

  const clientEmailToCompany = {
    'info@falah.com.sa': 'شركة الفلاح التجارية',
    'tech@amal.med.sa': 'مستشفى الأمل الطبي',
    'admin@wafaa.sa': 'مجمع الوفاء التجاري',
    'pm@nukhba.sa': 'شركة النخبة للتطوير',
    'gm@rayhana.hotel': 'فندق ريحانة الفاخر',
    'it@ebdaa.edu.sa': 'جامعة الإبداع الأهلية',
    'admin@shifa.med.sa': 'مجمع عيادات شفاء',
    'ceo@qimma.sa': 'شركة قمة للمقاولات'
  };

  const adminClients = JSON.parse(localStorage.getItem('awja_admin_clients')) || [];
  const foundClient = adminClients.find(c => c.email === userEmail);
  const companyName = foundClient ? foundClient.name : (clientEmailToCompany[userEmail] || userName || 'عميل أوجاتيك');

  let invoices = JSON.parse(localStorage.getItem('awja_admin_invoices'));
  if (!invoices || invoices.length === 0) {
    invoices = [
      { id: 'INV-2026-081', client: 'شركة النخبة للتطوير', desc: 'مرحلة أولى: توريد معدات كاميرات IP', amount: 180000, date: '2026-05-01', status: 'paid' },
      { id: 'INV-2026-082', client: 'مستشفى الأمل الطبي', desc: 'تركيب شبكة الألياف الضوئية', amount: 95000, date: '2026-05-08', status: 'paid' },
      { id: 'INV-2026-083', client: 'جامعة الإبداع الأهلية', desc: 'دراسة الجدوى والتصميم الهندسي', amount: 25000, date: '2026-05-15', status: 'pending' },
      { id: 'INV-2026-084', client: 'فندق ريحانة الفاخر', desc: 'تركيب أنظمة الصوت والنداء', amount: 95000, date: '2026-04-20', status: 'overdue' },
      { id: 'INV-2026-085', client: 'شركة الفلاح التجارية', desc: 'عقد صيانة سنوي شامل', amount: 35000, date: '2026-05-25', status: 'paid' },
      { id: 'INV-2026-086', client: 'مجمع الوفاء التجاري', desc: 'توريد أجهزة التحكم بالدخول', amount: 110000, date: '2026-06-01', status: 'pending' },
      { id: 'INV-2026-087', client: 'شركة قمة للمقاولات', desc: 'دعم فني ومتابعة مشروع الشبكات', amount: 12000, date: '2026-05-30', status: 'paid' }
    ];
    localStorage.setItem('awja_admin_invoices', JSON.stringify(invoices));
  }

  function renderClientInvoices() {
    const tbody = document.getElementById('client-invoices-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const clientInvoices = invoices.filter(i => i.client === companyName);

    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    clientInvoices.forEach(inv => {
      if (inv.status === 'paid') totalPaid += inv.amount;
      else if (inv.status === 'pending') totalPending += inv.amount;
      else if (inv.status === 'overdue') totalOverdue += inv.amount;

      let statusBadge = `<span class="status-badge success">مدفوعة</span>`;
      let actionBtn = `<button class="btn btn-ghost" style="padding: 4px 12px; font-size:12px;" onclick="window.printInvoice('${inv.id}')">عرض وطباعة</button>`;

      if (inv.status === 'pending') {
        statusBadge = `<span class="status-badge warning">معلقة</span>`;
        actionBtn = `
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary" style="padding: 4px 12px; font-size:12px;" onclick="window.openPaymentModal('${inv.id}', ${inv.amount}, '${inv.desc}')">سداد الآن</button>
            <button class="btn btn-ghost" style="padding: 4px 12px; font-size:12px;" onclick="window.printInvoice('${inv.id}')">طباعة</button>
          </div>
        `;
      } else if (inv.status === 'overdue') {
        statusBadge = `<span class="status-badge danger">متأخرة</span>`;
        actionBtn = `
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary" style="padding: 4px 12px; font-size:12px; background-color: var(--color-error); border-color: var(--color-error);" onclick="window.openPaymentModal('${inv.id}', ${inv.amount}, '${inv.desc}')">سداد عاجل</button>
            <button class="btn btn-ghost" style="padding: 4px 12px; font-size:12px;" onclick="window.printInvoice('${inv.id}')">طباعة</button>
          </div>
        `;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700; color:var(--color-outline);">${inv.id}</td>
        <td style="font-weight:600;">${inv.desc}</td>
        <td style="font-weight:700; color:var(--color-primary);">${inv.amount.toLocaleString()} ر.س</td>
        <td>${inv.date}</td>
        <td>${statusBadge}</td>
        <td>${actionBtn}</td>
      `;
      tbody.appendChild(tr);
    });

    if (clientInvoices.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: var(--space-6); color: var(--color-outline);">
            لا توجد فواتير مسجلة باسم هذا الحساب حالياً.
          </td>
        </tr>
      `;
    }

    document.getElementById('client-total-paid').innerText = totalPaid.toLocaleString() + ' ر.س';
    document.getElementById('client-total-pending').innerText = totalPending.toLocaleString() + ' ر.س';
    document.getElementById('client-total-overdue').innerText = totalOverdue.toLocaleString() + ' ر.س';
  }

  let notifications = JSON.parse(localStorage.getItem(`awja_notifications_${userEmail}`));
  if (!notifications) {
    notifications = [
      {
        id: 'NOT-001',
        type: 'info',
        title: 'تم تعيين المهندس فهد الشمري لتذكرة الصيانة',
        desc: 'تم تعيين المهندس فهد الشمري للعمل على تذكرة صيانة كاميرات المراقبة الخاصة بك وسيتم التواصل معك قريباً.',
        date: '2026-06-03 14:30',
        read: false
      },
      {
        id: 'NOT-002',
        type: 'warning',
        title: 'فاتورة معلقة بانتظار السداد',
        desc: 'صدرت فاتورة جديدة لعقد الصيانة السنوي وهي بانتظار سدادكم للتفعيل المستمر.',
        date: '2026-06-02 09:15',
        read: false
      },
      {
        id: 'NOT-003',
        type: 'success',
        title: 'تم حل تذكرة الصيانة بنجاح',
        desc: 'المهندس فهد الشمري أتم بنجاح فحص وتشغيل نظام الكاميرات IP وتم إغلاق التذكرة.',
        date: '2026-05-30 16:45',
        read: true
      }
    ];
    localStorage.setItem(`awja_notifications_${userEmail}`, JSON.stringify(notifications));
  }

  function renderNotifications() {
    const container = document.getElementById('notifications-list-container');
    const badge = document.getElementById('notifications-badge');
    if (!container) return;

    container.innerHTML = '';

    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      badge.innerText = unreadCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }

    notifications.forEach(n => {
      let icon = 'info';
      let iconColor = 'var(--brand-cyan)';
      let bgLight = 'rgba(0, 169, 206, 0.05)';

      if (n.type === 'success') {
        icon = 'check_circle';
        iconColor = 'var(--color-success)';
        bgLight = 'rgba(0, 179, 152, 0.05)';
      } else if (n.type === 'warning') {
        icon = 'warning';
        iconColor = '#b08200';
        bgLight = 'rgba(251, 188, 5, 0.05)';
      } else if (n.type === 'error') {
        icon = 'error';
        iconColor = 'var(--color-error)';
        bgLight = 'rgba(186, 26, 26, 0.05)';
      }

      const notEl = document.createElement('div');
      notEl.className = `flex gap-4 items-start ${n.read ? '' : 'unread-notification'}`;
      notEl.style.padding = 'var(--space-4)';
      notEl.style.borderRadius = 'var(--radius-lg)';
      notEl.style.backgroundColor = n.read ? 'transparent' : bgLight;
      notEl.style.borderBottom = '1px solid var(--color-border-light)';
      notEl.style.transition = 'all var(--transition-fast)';
      notEl.style.width = '100%';

      notEl.innerHTML = `
        <span class="material-symbols-outlined" style="color: ${iconColor}; font-size: 24px; margin-top: 2px;">${icon}</span>
        <div style="flex: 1;">
          <div class="flex justify-between items-center mb-1">
            <h4 class="body-md" style="font-weight: ${n.read ? '600' : '700'}; color: var(--color-primary);">${n.title}</h4>
            <span class="label-sm text-outline">${n.date}</span>
          </div>
          <p class="body-md text-on-surface-variant" style="line-height: 1.4;">${n.desc}</p>
        </div>
      `;

      container.appendChild(notEl);
    });

    if (notifications.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: var(--space-8); color: var(--color-outline);">
          <span class="material-symbols-outlined" style="font-size: 48px;">notifications_off</span>
          <p class="body-md mt-2">لا توجد إشعارات حالياً</p>
        </div>
      `;
    }
  }

  function addClientNotification(type, title, desc) {
    const newNot = {
      id: 'NOT-' + Math.floor(1000 + Math.random() * 9000),
      type,
      title,
      desc,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    notifications.unshift(newNot);
    localStorage.setItem(`awja_notifications_${userEmail}`, JSON.stringify(notifications));
    renderNotifications();
  }

  const menuItems = document.querySelectorAll('.dashboard-menu-item');
  const sections = document.querySelectorAll('.dashboard-section');
  const dashboardTitle = document.getElementById('dashboard-title');
  const notificationsBadge = document.getElementById('notifications-badge');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');

      const target = item.dataset.target;
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(target).classList.add('active');

      if (target === 'section-notifications') {
        dashboardTitle.innerText = 'مركز الإشعارات';
        notifications.forEach(n => n.read = true);
        localStorage.setItem(`awja_notifications_${userEmail}`, JSON.stringify(notifications));
        renderNotifications();
        if (notificationsBadge) notificationsBadge.style.display = 'none';
      } else if (target === 'section-invoices') {
        dashboardTitle.innerText = 'الفواتير والمدفوعات';
        renderClientInvoices();
      } else if (target === 'section-documents') {
        dashboardTitle.innerText = 'الوثائق والعقود';
      } else {
        let cleanText = '';
        for (let node of item.childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            cleanText += node.textContent;
          } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('material-symbols-outlined') && !node.classList.contains('nav-badge')) {
            cleanText += node.innerText;
          }
        }
        dashboardTitle.innerText = cleanText.trim() || 'لوحة التحكم';
      }
    });
  });

  let tickets = [];
  
  async function loadTickets() {
    if (window.supabaseClient && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
      try {
        const { data: userData } = await window.supabaseClient.auth.getUser();
        if (userData?.user) {
          const { data: supaTickets, error } = await window.supabaseClient
            .from('tickets')
            .select('*')
            .eq('user_id', userData.user.id);
          if (!error && supaTickets) {
            tickets = supaTickets;
          }
        }
      } catch (err) {
        console.error('Supabase tickets error:', err);
      }
    }
    
    // Fallback if Supabase is empty or not configured
    if (tickets.length === 0) {
      tickets = JSON.parse(localStorage.getItem('awja_tickets'));
      if (!tickets || tickets.length === 0) {
        tickets = [
          {
            id: 'TKT-7822',
            subject: 'عقد الصيانة والزيارة الدورية',
            service: 'CCTV',
            desc: 'طلب موعد فحص دوري لكافة كاميرات المبنى الرئيسي.',
            status: 'resolved',
            messages: [
              { sender: 'client', text: 'أهلاً بكم، نود حجز موعد زيارة دورية وقائية لنظام الكاميرات.' },
              { sender: 'support', text: 'أهلاً بك عميلنا العزيز، تم تحديد موعد زيارة وقائية يوم الثلاثاء الماضي من قبل المهندس فهد وجرى فحص كافة الكاميرات والعدسات بنجاح.' }
            ]
          },
          {
            id: 'TKT-8832',
            subject: 'صيانة مكبر الصوت Bosch 240W',
            service: 'Sound System',
            desc: 'يوجد تشويش خفيف في القناة الثانية لنظام النداء.',
            status: 'pending',
            messages: [
              { sender: 'client', text: 'مرحباً، لدينا تشويش بسيط في نظام الصوت بالفرع الغربي.' },
              { sender: 'support', text: 'نشكر تواصلك معنا، تم فتح تذكرة وتوجيه فريق الصيانة الميدانية للتواصل معك لزيارة الفرع وفحص المخارج والمكبر.' }
            ]
          }
        ];
        localStorage.setItem('awja_tickets', JSON.stringify(tickets));
      }
    }
    renderTicketsList();
  }
  
  loadTickets();

  const ticketsListContainer = document.getElementById('tickets-list-container');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatHeaderInfo = document.getElementById('chat-header-info');
  const chatInputBar = document.getElementById('chat-input-bar');
  const chatMessageInput = document.getElementById('chat-message-input');
  const btnSendChatMsg = document.getElementById('btn-send-chat-msg');

  let activeTicketId = null;

  function renderTicketsList() {
    ticketsListContainer.innerHTML = '';

    const pendingCount = tickets.filter(t => t.status === 'pending').length;
    const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

    document.getElementById('overview-pending-tickets').innerText = pendingCount;
    document.getElementById('overview-resolved-tickets').innerText = resolvedCount;

    tickets.forEach(t => {
      const item = document.createElement('div');
      item.className = `ticket-list-item ${activeTicketId === t.id ? 'active' : ''}`;

      let statusBadge = `<span class="status-badge success">محلولة</span>`;
      if (t.status === 'pending') {
        statusBadge = `<span class="status-badge warning">تحت المعالجة</span>`;
      }

      item.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="label-sm text-outline" style="font-weight:700;">${t.id}</span>
          ${statusBadge}
        </div>
        <h4 class="body-md" style="font-weight:700; margin-bottom:4px; color:var(--color-primary);">${t.subject}</h4>
        <p class="label-md text-on-surface-variant text-ellipsis">${t.desc.substring(0, 50)}...</p>
      `;

      item.addEventListener('click', () => {
        activeTicketId = t.id;
        renderTicketsList();
        openTicketChat(t);
      });

      ticketsListContainer.appendChild(item);
    });
  }

  function openTicketChat(ticket) {
    chatInputBar.classList.remove('hidden');

    let statusBadge = `<span class="status-badge success">تمت التسوية</span>`;
    if (ticket.status === 'pending') {
      statusBadge = `<span class="status-badge warning">قيد المعالجة الفنية</span>`;
    }

    chatHeaderInfo.innerHTML = `
      <div>
        <h4 class="headline-md" style="font-size: 18px; color: var(--color-primary);">${ticket.subject}</h4>
        <p class="label-md text-on-surface-variant">الرقم المرجعي للتذكرة: ${ticket.id} | نظام: ${ticket.service}</p>
      </div>
      <div>${statusBadge}</div>
    `;

    renderChatMessages(ticket);
  }

  function renderChatMessages(ticket) {
    chatMessagesContainer.innerHTML = '';
    ticket.messages.forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.className = `chat-msg ${msg.sender === 'client' ? 'client' : 'support'}`;
      msgEl.innerHTML = `<p>${msg.text}</p>`;
      chatMessagesContainer.appendChild(msgEl);
    });
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  btnSendChatMsg.addEventListener('click', () => {
    const text = chatMessageInput.value.trim();
    if (!text || !activeTicketId) return;

    const ticket = tickets.find(t => t.id === activeTicketId);
    if (ticket) {
      ticket.messages.push({ sender: 'client', text: text });
      localStorage.setItem('awja_tickets', JSON.stringify(tickets));
      renderChatMessages(ticket);
      chatMessageInput.value = '';

      if (ticket.status === 'pending') {
        setTimeout(() => {
          ticket.messages.push({ sender: 'support', text: 'أهلاً بك، تلقينا رسالتك وجاري مراجعتها من قبل المهندس المختص وتزويدك بالتفاصيل.' });
          localStorage.setItem('awja_tickets', JSON.stringify(tickets));
          if (activeTicketId === ticket.id) {
            renderChatMessages(ticket);
          }
        }, 1500);
      }
    }
  });

  chatMessageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnSendChatMsg.click();
    }
  });

  const ticketModal = document.getElementById('ticket-modal');
  const btnOpenTicketModal = document.getElementById('btn-open-ticket-modal');
  const btnCloseTicketModal = document.getElementById('btn-close-ticket-modal');
  const formNewTicket = document.getElementById('form-new-ticket');

  btnOpenTicketModal.addEventListener('click', () => {
    ticketModal.classList.add('open');
  });

  btnCloseTicketModal.addEventListener('click', () => {
    ticketModal.classList.remove('open');
  });

  formNewTicket.addEventListener('click', (e) => {
    if (e.target === ticketModal) {
      ticketModal.classList.remove('open');
    }
  });

  formNewTicket.addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('new-ticket-subject').value;
    const service = document.getElementById('new-ticket-service').value;
    const desc = document.getElementById('new-ticket-desc').value;
    const btnSubmit = formNewTicket.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = 'جاري الفتح...';
    btnSubmit.disabled = true;

    if (window.supabaseClient && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
      try {
        const { data: userData } = await window.supabaseClient.auth.getUser();
        if (userData?.user) {
          const { error } = await window.supabaseClient
            .from('tickets')
            .insert([{
              user_id: userData.user.id,
              subject: subject,
              description: `النظام: ${service}\n\nالوصف:\n${desc}`,
              status: 'مفتوحة'
            }]);
          if (!error) {
            alert('تم فتح التذكرة بنجاح!');
            formNewTicket.reset();
            ticketModal.classList.remove('open');
            loadTickets(); // reload from supabase
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
            return;
          } else {
            console.error(error);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Fallback Local Storage
    const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
    const newTicket = {
      id: ticketId,
      subject: subject,
      service: service,
      desc: desc,
      status: 'pending',
      messages: [
        { sender: 'client', text: desc }
      ]
    };

    tickets.unshift(newTicket);
    localStorage.setItem('awja_tickets', JSON.stringify(tickets));

    alert(`تم فتح التذكرة بنجاح برقم: ${ticketId}`);
    formNewTicket.reset();
    ticketModal.classList.remove('open');
    renderTicketsList();
    btnSubmit.innerHTML = originalText;
    btnSubmit.disabled = false;
  });

  const formSettings = document.getElementById('form-settings');
  formSettings.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('settings-name').value;
    const email = document.getElementById('settings-email').value;
    const phone = document.getElementById('settings-phone').value;

    localStorage.setItem('awja_user_name', name);
    localStorage.setItem('awja_user_email', email);
    localStorage.setItem('awja_user_phone', phone);

    document.getElementById('user-email-display').innerText = email;
    document.getElementById('user-name-display').innerText = name;
    document.getElementById('user-avatar').innerText = name.charAt(0).toUpperCase();

    alert('تم تعديل البيانات الشخصية بنجاح!');
  });

  const paymentModal = document.getElementById('payment-modal');
  const formPayment = document.getElementById('form-payment');

  window.openPaymentModal = (id, amount, desc) => {
    document.getElementById('payment-invoice-id').value = id;
    document.getElementById('payment-amount-display').innerText = amount.toLocaleString() + ' ر.س';
    document.getElementById('payment-desc-display').innerText = `فاتورة رقم: ${id} - ${desc}`;
    paymentModal.classList.add('open');
  };

  document.getElementById('btn-close-payment-modal').addEventListener('click', () => {
    paymentModal.classList.remove('open');
  });

  formPayment.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('payment-invoice-id').value;
    const invIndex = invoices.findIndex(i => i.id === id);
    if (invIndex > -1) {
      invoices[invIndex].status = 'paid';
      localStorage.setItem('awja_admin_invoices', JSON.stringify(invoices));

      addClientNotification(
        'success',
        `تم سداد الفاتورة رقم ${id} بنجاح`,
        `تمت عملية دفع مبلغ ${invoices[invIndex].amount.toLocaleString()} ر.س بنجاح لصالح: ${invoices[invIndex].desc}.`
      );

      alert(`تم سداد الفاتورة رقم ${id} بنجاح!`);
      paymentModal.classList.remove('open');
      formPayment.reset();
      renderClientInvoices();
    }
  });

  window.printInvoice = (id) => {
    alert(`جاري تجهيز الفاتورة رقم ${id} للطباعة...`);
  };

  document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', () => {
      const filename = btn.dataset.filename;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined spin" style="font-size: 18px; animation: spin 1s linear infinite;">autorenew</span> جاري التحميل...`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px;">download</span> تحميل`;
        alert(`تم تحميل الملف: ${filename} بنجاح!`);
      }, 1500);
    });
  });

  const topbarNotiBell = document.querySelector('.dashboard-header span[title="التنبيهات"]');
  if (topbarNotiBell) {
    topbarNotiBell.addEventListener('click', () => {
      const notiMenuItem = Array.from(document.querySelectorAll('.dashboard-menu-item'))
        .find(item => item.dataset.target === 'section-notifications');
      if (notiMenuItem) {
        notiMenuItem.click();
      }
    });
  }

  const btnHamburger = document.getElementById('btn-hamburger');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const btnSidebarClose = document.getElementById('btn-sidebar-close');

  if (btnHamburger && sidebar) {
    btnHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.add('open');
    });
  }

  if (btnSidebarClose && sidebar) {
    btnSidebarClose.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        sidebar.classList.remove('open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 991 && sidebar && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target !== btnHamburger) {
        sidebar.classList.remove('open');
      }
    }
  });

  renderTicketsList();
  renderClientInvoices();
  renderNotifications();
});
