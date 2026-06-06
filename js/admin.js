/* =============================================
   AwjaTech Admin Dashboard JavaScript
   Full ERP / CRM / Accounting / Marketing / Support
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── AUTH CHECK ───
  const adminEmail = localStorage.getItem('awja_admin_email');
  if (!adminEmail) {
    // Check if logging in as admin
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      localStorage.setItem('awja_admin_email', 'admin@awjatech.sa');
      localStorage.setItem('awja_admin_name', 'مشرف النظام');
    } else {
      // Allow demo access without redirecting
      localStorage.setItem('awja_admin_email', 'admin@awjatech.sa');
      localStorage.setItem('awja_admin_name', 'مشرف النظام');
    }
  }

  const adminName = localStorage.getItem('awja_admin_name') || 'المشرف';
  const adminEmailDisplay = localStorage.getItem('awja_admin_email') || 'admin@awjatech.sa';
  document.getElementById('admin-name-display').textContent = adminName;
  document.getElementById('admin-email-display').textContent = adminEmailDisplay;

  // Logout
  document.getElementById('admin-logout').addEventListener('click', () => {
    localStorage.removeItem('awja_admin_email');
    localStorage.removeItem('awja_admin_name');
    window.location.href = 'login.html';
  });

  // ─── SIDEBAR NAV ───
  const navItems = document.querySelectorAll('.admin-nav-item');
  const sections = document.querySelectorAll('.admin-section');
  const pageTitle = document.getElementById('admin-page-title');

  const sectionTitles = {
    'sec-overview': 'نظرة عامة',
    'sec-crm': 'CRM - إدارة العملاء',
    'sec-erp': 'ERP - إدارة المشاريع',
    'sec-accounting': 'المحاسبة',
    'sec-marketing': 'التسويق',
    'sec-support': 'الدعم الفني'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const target = item.dataset.target;
      sections.forEach(s => s.classList.remove('active'));
      const targetSection = document.getElementById(target);
      if (targetSection) targetSection.classList.add('active');
      pageTitle.textContent = sectionTitles[target] || '';
      // Close mobile sidebar
      document.getElementById('admin-sidebar').classList.remove('open');
    });
  });

  // Mobile hamburger
  document.getElementById('admin-hamburger').addEventListener('click', () => {
    document.getElementById('admin-sidebar').classList.toggle('open');
  });

  // ─── MOCK DATA ───
  let clients = JSON.parse(localStorage.getItem('awja_admin_clients')) || [
    { id: 'CLT-001', name: 'شركة الفلاح التجارية', email: 'info@falah.com.sa', phone: '0501234567', status: 'active', projects: 3 },
    { id: 'CLT-002', name: 'مستشفى الأمل الطبي', email: 'tech@amal.med.sa', phone: '0509876543', status: 'active', projects: 2 },
    { id: 'CLT-003', name: 'مجمع الوفاء التجاري', email: 'admin@wafaa.sa', phone: '0555432109', status: 'lead', projects: 0 },
    { id: 'CLT-004', name: 'شركة النخبة للتطوير', email: 'pm@nukhba.sa', phone: '0508765432', status: 'active', projects: 5 },
    { id: 'CLT-005', name: 'فندق ريحانة الفاخر', email: 'gm@rayhana.hotel', phone: '0512345678', status: 'inactive', projects: 1 },
    { id: 'CLT-006', name: 'جامعة الإبداع الأهلية', email: 'it@ebdaa.edu.sa', phone: '0503216547', status: 'active', projects: 4 },
    { id: 'CLT-007', name: 'مجمع عيادات شفاء', email: 'admin@shifa.med.sa', phone: '0556789012', status: 'lead', projects: 0 },
    { id: 'CLT-008', name: 'شركة قمة للمقاولات', email: 'ceo@qimma.sa', phone: '0541234567', status: 'active', projects: 2 },
  ];

  let projects = JSON.parse(localStorage.getItem('awja_admin_projects')) || [
    { id: 'PROJ-041', name: 'منظومة مراقبة المطار الإقليمي', client: 'شركة النخبة للتطوير', type: 'CCTV', engineer: 'م. فهد الشمري', budget: 450000, status: 'active' },
    { id: 'PROJ-042', name: 'شبكات مستشفى الأمل', client: 'مستشفى الأمل الطبي', type: 'Networking', engineer: 'م. سارة القحطاني', budget: 220000, status: 'active' },
    { id: 'PROJ-043', name: 'نظام تحكم دخول الجامعة', client: 'جامعة الإبداع الأهلية', type: 'Access Control', engineer: 'م. خالد العتيبي', budget: 185000, status: 'planning' },
    { id: 'PROJ-044', name: 'أنظمة صوت الفندق', client: 'فندق ريحانة الفاخر', type: 'Sound System', engineer: 'م. عبدالله الدوسري', budget: 95000, status: 'completed' },
    { id: 'PROJ-045', name: 'حل متكامل للمجمع التجاري', client: 'مجمع الوفاء التجاري', type: 'Integrated', engineer: 'م. فهد الشمري', budget: 680000, status: 'active' },
    { id: 'PROJ-046', name: 'تحديث شبكات الفلاح', client: 'شركة الفلاح التجارية', type: 'Networking', engineer: 'م. سارة القحطاني', budget: 75000, status: 'completed' },
    { id: 'PROJ-047', name: 'مشروع كاميرات المجمع', client: 'مجمع الوفاء التجاري', type: 'CCTV', engineer: 'م. خالد العتيبي', budget: 130000, status: 'planning' },
  ];

  let invoices = JSON.parse(localStorage.getItem('awja_admin_invoices')) || [
    { id: 'INV-2026-081', client: 'شركة النخبة للتطوير', desc: 'مرحلة أولى: توريد معدات كاميرات IP', amount: 180000, date: '2026-05-01', status: 'paid' },
    { id: 'INV-2026-082', client: 'مستشفى الأمل الطبي', desc: 'تركيب شبكة الألياف الضوئية', amount: 95000, date: '2026-05-08', status: 'paid' },
    { id: 'INV-2026-083', client: 'جامعة الإبداع الأهلية', desc: 'دراسة الجدوى والتصميم الهندسي', amount: 25000, date: '2026-05-15', status: 'pending' },
    { id: 'INV-2026-084', client: 'فندق ريحانة الفاخر', desc: 'تركيب أنظمة الصوت والنداء', amount: 95000, date: '2026-04-20', status: 'overdue' },
    { id: 'INV-2026-085', client: 'شركة الفلاح التجارية', desc: 'عقد صيانة سنوي شامل', amount: 35000, date: '2026-05-25', status: 'paid' },
    { id: 'INV-2026-086', client: 'مجمع الوفاء التجاري', desc: 'توريد أجهزة التحكم بالدخول', amount: 110000, date: '2026-06-01', status: 'pending' },
    { id: 'INV-2026-087', client: 'شركة قمة للمقاولات', desc: 'دعم فني ومتابعة مشروع الشبكات', amount: 12000, date: '2026-05-30', status: 'paid' },
  ];

  let campaigns = JSON.parse(localStorage.getItem('awja_admin_campaigns')) || [
    { id: 'CAMP-001', title: 'عروض عيد الفطر 2026', subject: 'عروض حصرية على أنظمة المراقبة', sent: 234, opened: 91, date: '2026-04-10' },
    { id: 'CAMP-002', title: 'تحديث أنظمة الشبكات', subject: 'ترقية مجانية لأنظمة Wi-Fi القديمة', sent: 234, opened: 87, date: '2026-05-01' },
    { id: 'CAMP-003', title: 'نشرة أوجاتيك الشهرية - مايو', subject: 'آخر الأخبار والتقنيات الأمنية', sent: 234, opened: 78, date: '2026-05-15' },
  ];

  let subscribers = JSON.parse(localStorage.getItem('awja_admin_subs')) || [
    { email: 'ahmed@company.sa', date: '2026-06-03' },
    { email: 'sara@tech.sa', date: '2026-06-02' },
    { email: 'info@building.sa', date: '2026-06-01' },
    { email: 'manager@corp.sa', date: '2026-05-30' },
    { email: 'ceo@startup.sa', date: '2026-05-28' },
  ];

  let supportTickets = JSON.parse(localStorage.getItem('awja_tickets')) || [];
  // Add admin-specific tickets if needed
  if (supportTickets.length < 3) {
    supportTickets = [
      { id: 'TKT-7822', subject: 'عقد الصيانة والزيارة الدورية', service: 'CCTV', desc: 'طلب موعد فحص دوري لكافة كاميرات المبنى الرئيسي.', status: 'resolved', priority: 'normal', client: 'شركة الفلاح التجارية', engineer: 'م. فهد الشمري', messages: [{ sender: 'client', text: 'أهلاً، نود حجز موعد زيارة دورية وقائية.' }, { sender: 'support', text: 'تم تحديد موعد زيارة وقائية يوم الثلاثاء من قبل المهندس فهد.' }] },
      { id: 'TKT-8832', subject: 'تشويش في نظام الصوت', service: 'Sound System', desc: 'تشويش في القناة الثانية لنظام النداء.', status: 'pending', priority: 'high', client: 'مستشفى الأمل الطبي', engineer: null, messages: [{ sender: 'client', text: 'لدينا تشويش بسيط في نظام الصوت بالفرع الغربي.' }, { sender: 'support', text: 'تم توجيه فريق الصيانة الميدانية.' }] },
      { id: 'TKT-9140', subject: 'انقطاع كاميرا بوابة الدخول', service: 'CCTV', desc: 'كاميرا بوابة الدخول الرئيسية توقفت عن الإرسال منذ صباح اليوم.', status: 'pending', priority: 'urgent', client: 'جامعة الإبداع الأهلية', engineer: null, messages: [{ sender: 'client', text: 'كاميرا البوابة لا تعمل منذ 8 ص.' }] },
      { id: 'TKT-9201', subject: 'استفسار عن تجديد العقد', service: 'Networking', desc: 'استفسار عن شروط وأسعار تجديد عقد الصيانة السنوي.', status: 'pending', priority: 'normal', client: 'شركة قمة للمقاولات', engineer: 'م. سارة القحطاني', messages: [{ sender: 'client', text: 'نود الاستفسار عن تجديد العقد.' }] },
    ];
    localStorage.setItem('awja_tickets', JSON.stringify(supportTickets));
  }

  // ── Supabase: Fetch quotes and tickets for admin ──
  async function loadAdminSupabaseData() {
    if (!window.supabaseClient) return;
    try {
      // Fetch all quotes (admin RLS policy)
      const { data: quotes, error: qErr } = await window.supabaseClient
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });
      if (!qErr && quotes && quotes.length > 0) {
        console.log(`📥 Loaded ${quotes.length} quotes from Supabase`);
        // Show quotes in an activity or a dedicated section
        const overviewActivity = document.getElementById('overview-activity');
        if (overviewActivity) {
          quotes.slice(0, 3).forEach(q => {
            const item = document.createElement('div');
            item.className = 'admin-activity-item';
            item.innerHTML = `
              <span class="material-symbols-outlined" style="color:var(--brand-cyan);">request_quote</span>
              <div><strong>طلب عرض سعر: ${q.name} - ${q.service}</strong><br><small class="text-on-surface-variant">${q.company} | ${q.phone}</small></div>
            `;
            overviewActivity.prepend(item);
          });
        }
      }

      // Fetch all tickets from Supabase (admin RLS policy)
      const { data: supaTickets, error: tErr } = await window.supabaseClient
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (!tErr && supaTickets && supaTickets.length > 0) {
        console.log(`📥 Loaded ${supaTickets.length} tickets from Supabase`);
        // Merge Supabase tickets into the support list
        supaTickets.forEach(t => {
          if (!supportTickets.find(st => st.id === t.id)) {
            supportTickets.unshift({
              id: t.id.substring(0, 8).toUpperCase(),
              subject: t.subject,
              service: 'عام',
              desc: t.description,
              status: t.status === 'مغلقة' ? 'resolved' : 'pending',
              priority: 'normal',
              client: 'عميل Supabase',
              engineer: null,
              messages: [{ sender: 'client', text: t.description }]
            });
          }
        });
        renderSupportTickets();
      }
    } catch (err) {
      console.error('Admin Supabase load error:', err);
    }
  }
  loadAdminSupabaseData();

  // ─── RENDER FUNCTIONS ───

  // Status label helpers
  function statusLabel(status) {
    const map = { active: 'نشط', inactive: 'غير نشط', lead: 'محتمل', paid: 'مدفوعة', pending: 'معلقة', overdue: 'متأخرة', resolved: 'محلولة', planning: 'تخطيط', completed: 'مكتمل' };
    return map[status] || status;
  }
  function priorityLabel(p) {
    const map = { urgent: 'عاجل', high: 'مرتفع', normal: 'عادي' };
    return map[p] || p;
  }

  // ── CRM ──
  function renderCRM(filterName = '', filterStatus = 'all') {
    const tbody = document.getElementById('crm-tbody');
    let filtered = clients;
    if (filterName) filtered = filtered.filter(c => c.name.includes(filterName) || c.email.includes(filterName));
    if (filterStatus !== 'all') filtered = filtered.filter(c => c.status === filterStatus);

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><code style="font-size:11px; color:var(--color-outline);">${c.id}</code></td>
        <td style="font-weight:600; color:var(--color-primary);">${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td><span class="admin-status ${c.status}">${statusLabel(c.status)}</span></td>
        <td style="text-align:center;">${c.projects}</td>
        <td>
          <button class="admin-table-action" onclick="viewClient('${c.id}')">عرض</button>
          <button class="admin-table-action" onclick="deleteClient('${c.id}')" style="color:var(--color-error); border-color:var(--color-error);">حذف</button>
        </td>
      </tr>
    `).join('');

    document.getElementById('kpi-clients').textContent = clients.length;
  }

  // ── ERP / Kanban ──
  function renderKanban(filter = 'all') {
    ['planning', 'active', 'completed'].forEach(col => {
      document.getElementById(`kanban-${col}`).innerHTML = '';
      document.getElementById(`kanban-${col}-count`).textContent = 0;
    });

    let filtered = projects;
    if (filter !== 'all') filtered = projects.filter(p => p.status === filter);

    const counts = { planning: 0, active: 0, completed: 0 };
    filtered.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = `
        <div class="kanban-card-title">${p.name}</div>
        <p style="font-size:12px; color:var(--color-on-surface-variant); margin-bottom:var(--space-2);">${p.client}</p>
        <div class="flex items-center gap-2">
          <span class="kanban-card-tag">${p.type}</span>
        </div>
        <div class="kanban-card-meta">
          <span>م. ${p.engineer ? p.engineer.replace('م. ', '') : '—'}</span>
          <span style="font-weight:600; color:var(--color-primary);">${p.budget.toLocaleString()} ر.س</span>
        </div>
      `;
      const container = document.getElementById(`kanban-${p.status}`);
      if (container) container.appendChild(card);
    });

    Object.keys(counts).forEach(col => {
      const el = document.getElementById(`kanban-${col}-count`);
      if (el) el.textContent = counts[col] || 0;
    });
    document.getElementById('kpi-projects').textContent = projects.filter(p => p.status === 'active').length;
  }

  // ── ACCOUNTING ──
  function renderAccounting(filter = 'all') {
    const tbody = document.getElementById('acc-tbody');
    let filtered = invoices;
    if (filter !== 'all') filtered = invoices.filter(i => i.status === filter);

    tbody.innerHTML = filtered.map(inv => `
      <tr>
        <td><code style="font-size:11px; color:var(--color-outline);">${inv.id}</code></td>
        <td style="font-weight:600;">${inv.client}</td>
        <td>${inv.desc}</td>
        <td style="font-weight:700; color:var(--color-primary);">${inv.amount.toLocaleString()}</td>
        <td>${inv.date}</td>
        <td><span class="admin-status ${inv.status}">${statusLabel(inv.status)}</span></td>
        <td>
          <button class="admin-table-action">طباعة</button>
          ${inv.status === 'pending' || inv.status === 'overdue' ? `<button class="admin-table-action" style="color:var(--brand-green);border-color:var(--brand-green);" onclick="markPaid('${inv.id}')">تحصيل</button>` : ''}
        </td>
      </tr>
    `).join('');

    const pending = invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0);
    const overdue = invoices.filter(i => i.status === 'overdue').reduce((a, b) => a + b.amount, 0);
    document.getElementById('acc-pending').textContent = pending.toLocaleString() + ' ر.س';
    document.getElementById('acc-overdue').textContent = overdue.toLocaleString() + ' ر.س';
  }

  // ── MARKETING ──
  function renderMarketing() {
    const campList = document.getElementById('campaign-list');
    campList.innerHTML = campaigns.map(c => `
      <div class="admin-campaign-item">
        <div class="admin-campaign-title">${c.title}</div>
        <p style="font-size:12px; color:var(--color-on-surface-variant); margin-bottom:var(--space-2);">${c.subject}</p>
        <div class="admin-campaign-stats">
          <span>📤 مُرسل: ${c.sent}</span>
          <span>📬 مفتوح: ${c.opened}</span>
          <span>📊 ${Math.round((c.opened / c.sent) * 100)}%</span>
          <span>📅 ${c.date}</span>
        </div>
      </div>
    `).join('');

    const subList = document.getElementById('subscriber-list');
    subList.innerHTML = subscribers.slice(0, 8).map(s => `
      <div class="admin-subscriber-item">
        <span>${s.email}</span>
        <span style="font-size:11px; color:var(--color-outline);">${s.date}</span>
      </div>
    `).join('');

    document.getElementById('mkt-subs').textContent = subscribers.length + 200; // Base + new subs
  }

  // ── SUPPORT ──
  let activeTicketId = null;

  function renderSupportTickets(filterStatus = 'all', filterPriority = 'all') {
    const list = document.getElementById('support-tickets-list');
    let filtered = supportTickets;
    if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);
    if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);

    list.innerHTML = filtered.map(t => `
      <div class="admin-support-ticket ${activeTicketId === t.id ? 'active' : ''}" onclick="openSupportTicket('${t.id}')">
        <div class="admin-support-ticket-header">
          <span class="admin-support-ticket-id">${t.id}</span>
          <div style="display:flex; gap:4px;">
            <span class="admin-status ${t.priority}">${priorityLabel(t.priority)}</span>
            <span class="admin-status ${t.status}">${statusLabel(t.status)}</span>
          </div>
        </div>
        <div class="admin-support-ticket-title">${t.subject}</div>
        <div class="admin-support-ticket-desc">${t.desc}</div>
        <div class="admin-support-ticket-footer">
          <span>👤 ${t.client || '—'}</span>
          <span>🔧 ${t.engineer || 'غير معيّن'}</span>
        </div>
      </div>
    `).join('');

    // Update KPIs
    const urgent = supportTickets.filter(t => t.priority === 'urgent' && t.status === 'pending').length;
    const pending = supportTickets.filter(t => t.status === 'pending').length;
    const resolved = supportTickets.filter(t => t.status === 'resolved').length;
    document.getElementById('sup-urgent').textContent = urgent;
    document.getElementById('sup-pending').textContent = pending;
    document.getElementById('sup-resolved').textContent = resolved;
    document.getElementById('support-badge').textContent = pending;
    document.getElementById('kpi-tickets').textContent = pending;
  }

  function openSupportTicket(id) {
    activeTicketId = id;
    const ticket = supportTickets.find(t => t.id === id);
    if (!ticket) return;
    renderSupportTickets(
      document.getElementById('sup-filter-status').value,
      document.getElementById('sup-filter-priority').value
    );

    const detail = document.getElementById('support-ticket-detail');
    const engineers = ['م. فهد الشمري', 'م. سارة القحطاني', 'م. خالد العتيبي', 'م. عبدالله الدوسري'];
    const engOptions = engineers.map(e => `<option value="${e}" ${ticket.engineer === e ? 'selected' : ''}>${e}</option>`).join('');

    detail.innerHTML = `
      <div class="admin-support-detail-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:var(--space-4);">
          <div>
            <h4 style="font-weight:700; color:var(--color-primary); margin-bottom:4px;">${ticket.subject}</h4>
            <p style="font-size:12px; color:var(--color-on-surface-variant);">${ticket.id} | ${ticket.service} | 👤 ${ticket.client || '—'}</p>
          </div>
          <div style="display:flex; gap:var(--space-2); flex-wrap:wrap; align-items:center;">
            <span class="admin-status ${ticket.priority}">${priorityLabel(ticket.priority)}</span>
            <span class="admin-status ${ticket.status}">${statusLabel(ticket.status)}</span>
            ${ticket.status === 'pending' ? `<button class="btn btn-primary" style="padding:4px 14px; font-size:12px;" onclick="resolveTicket('${ticket.id}')">إغلاق وحل التذكرة</button>` : ''}
          </div>
        </div>
        <div style="margin-top:var(--space-3); display:flex; gap:var(--space-3); align-items:center; font-size:13px;">
          <label style="font-weight:600;">تعيين لـ:</label>
          <select style="border:1px solid var(--color-border-light); border-radius:var(--radius-lg); padding:4px 12px; font-size:13px;" onchange="assignEngineer('${ticket.id}', this.value)">
            <option value="">— اختر مهندساً —</option>
            ${engOptions}
          </select>
        </div>
      </div>
      <div class="admin-support-detail-body" id="support-msg-body">
        ${ticket.messages.map(m => `
          <div class="admin-support-msg ${m.sender}">
            <strong style="font-size:11px; opacity:0.7; display:block; margin-bottom:4px;">${m.sender === 'client' ? '👤 العميل' : '🔧 الدعم الفني'}</strong>
            <p style="margin:0; font-size:13px;">${m.text}</p>
          </div>
        `).join('')}
      </div>
      <div class="admin-support-detail-footer">
        <input type="text" id="support-reply-input" placeholder="اكتب ردك هنا..." />
        <button class="btn btn-primary" style="padding:8px 16px;" onclick="sendSupportReply('${ticket.id}')">
          <span class="material-symbols-outlined" style="font-size:18px;">send</span>
          إرسال
        </button>
      </div>
    `;
    const msgBody = document.getElementById('support-msg-body');
    if (msgBody) msgBody.scrollTop = msgBody.scrollHeight;
  }

  // Global functions for onclick attributes
  window.openSupportTicket = openSupportTicket;

  window.resolveTicket = (id) => {
    const ticket = supportTickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = 'resolved';
      ticket.messages.push({ sender: 'support', text: 'تم إغلاق التذكرة وحلّ المشكلة بنجاح. شكراً لتواصلكم مع فريق أوجاتيك.' });
      localStorage.setItem('awja_tickets', JSON.stringify(supportTickets));
      renderSupportTickets(document.getElementById('sup-filter-status').value, document.getElementById('sup-filter-priority').value);
      openSupportTicket(id);
    }
  };

  window.assignEngineer = (id, engineer) => {
    const ticket = supportTickets.find(t => t.id === id);
    if (ticket && engineer) {
      ticket.engineer = engineer;
      ticket.messages.push({ sender: 'support', text: `تم تعيين ${engineer} للعمل على هذه التذكرة.` });
      localStorage.setItem('awja_tickets', JSON.stringify(supportTickets));
      renderSupportTickets(document.getElementById('sup-filter-status').value, document.getElementById('sup-filter-priority').value);
      openSupportTicket(id);
    }
  };

  window.sendSupportReply = (id) => {
    const input = document.getElementById('support-reply-input');
    const text = input ? input.value.trim() : '';
    if (!text) return;
    const ticket = supportTickets.find(t => t.id === id);
    if (ticket) {
      ticket.messages.push({ sender: 'support', text });
      localStorage.setItem('awja_tickets', JSON.stringify(supportTickets));
      openSupportTicket(id);
    }
  };

  window.viewClient = (id) => {
    const c = clients.find(cl => cl.id === id);
    if (c) alert(`العميل: ${c.name}\nالبريد: ${c.email}\nالجوال: ${c.phone}\nالمشاريع: ${c.projects}`);
  };

  window.deleteClient = (id) => {
    if (confirm('هل تريد حذف هذا العميل؟')) {
      clients = clients.filter(c => c.id !== id);
      localStorage.setItem('awja_admin_clients', JSON.stringify(clients));
      renderCRM();
    }
  };

  window.markPaid = (id) => {
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      inv.status = 'paid';
      localStorage.setItem('awja_admin_invoices', JSON.stringify(invoices));
      renderAccounting(document.getElementById('acc-filter').value);
    }
  };

  // ── FILTER EVENTS ──
  document.getElementById('crm-search').addEventListener('input', e => renderCRM(e.target.value, document.getElementById('crm-filter-status').value));
  document.getElementById('crm-filter-status').addEventListener('change', e => renderCRM(document.getElementById('crm-search').value, e.target.value));
  document.getElementById('erp-filter').addEventListener('change', e => renderKanban(e.target.value));
  document.getElementById('acc-filter').addEventListener('change', e => renderAccounting(e.target.value));
  document.getElementById('sup-filter-status').addEventListener('change', () => renderSupportTickets(document.getElementById('sup-filter-status').value, document.getElementById('sup-filter-priority').value));
  document.getElementById('sup-filter-priority').addEventListener('change', () => renderSupportTickets(document.getElementById('sup-filter-status').value, document.getElementById('sup-filter-priority').value));

  // ── MODALS ──
  function openModal(id) { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }

  document.querySelectorAll('.admin-modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });

  document.getElementById('btn-add-client').addEventListener('click', () => openModal('modal-add-client'));
  document.getElementById('btn-add-project').addEventListener('click', () => openModal('modal-add-project'));
  document.getElementById('btn-new-invoice').addEventListener('click', () => openModal('modal-new-invoice'));
  document.getElementById('btn-new-campaign').addEventListener('click', () => openModal('modal-new-campaign'));

  // Form submissions
  document.getElementById('form-add-client').addEventListener('submit', e => {
    e.preventDefault();
    const newClient = {
      id: 'CLT-' + String(clients.length + 1).padStart(3, '0'),
      name: document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      phone: document.getElementById('client-phone').value,
      status: document.getElementById('client-status').value,
      projects: 0
    };
    clients.push(newClient);
    localStorage.setItem('awja_admin_clients', JSON.stringify(clients));
    renderCRM();
    closeModal('modal-add-client');
    e.target.reset();
  });

  document.getElementById('form-add-project').addEventListener('submit', e => {
    e.preventDefault();
    const newProject = {
      id: 'PROJ-' + String(projects.length + 48).padStart(3, '0'),
      name: document.getElementById('proj-name').value,
      client: document.getElementById('proj-client').value,
      type: document.getElementById('proj-type').value,
      engineer: document.getElementById('proj-engineer').value,
      budget: parseInt(document.getElementById('proj-budget').value),
      status: 'planning'
    };
    projects.push(newProject);
    localStorage.setItem('awja_admin_projects', JSON.stringify(projects));
    renderKanban(document.getElementById('erp-filter').value);
    closeModal('modal-add-project');
    e.target.reset();
  });

  document.getElementById('form-new-invoice').addEventListener('submit', e => {
    e.preventDefault();
    const newInv = {
      id: 'INV-2026-' + String(invoices.length + 88).padStart(3, '0'),
      client: document.getElementById('inv-client').value,
      desc: document.getElementById('inv-desc').value,
      amount: parseInt(document.getElementById('inv-amount').value),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    invoices.push(newInv);
    localStorage.setItem('awja_admin_invoices', JSON.stringify(invoices));
    renderAccounting(document.getElementById('acc-filter').value);
    closeModal('modal-new-invoice');
    e.target.reset();
  });

  document.getElementById('form-new-campaign').addEventListener('submit', e => {
    e.preventDefault();
    const newCamp = {
      id: 'CAMP-' + String(campaigns.length + 4).padStart(3, '0'),
      title: document.getElementById('camp-title').value,
      subject: document.getElementById('camp-subject').value,
      sent: subscribers.length + 200,
      opened: Math.floor((subscribers.length + 200) * 0.35),
      date: new Date().toISOString().split('T')[0]
    };
    campaigns.push(newCamp);
    localStorage.setItem('awja_admin_campaigns', JSON.stringify(campaigns));
    renderMarketing();
    closeModal('modal-new-campaign');
    e.target.reset();
  });

  // Support enter key
  document.addEventListener('keypress', e => {
    if (e.key === 'Enter' && activeTicketId) {
      const input = document.getElementById('support-reply-input');
      if (input && document.activeElement === input) {
        window.sendSupportReply(activeTicketId);
      }
    }
  });

  // ── INITIAL RENDER ──
  renderCRM();
  renderKanban();
  renderAccounting();
  renderMarketing();
  renderSupportTickets();

});
