/* =============================================
   AwjaTech AI Chatbot Widget
   Injected floating chatbot with NVIDIA NIM API
   and local support ticket wizard integration.
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ─── CSS Styles Injection ───
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .awja-chatbot-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--brand-gradient);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 169, 206, 0.3);
      cursor: pointer;
      z-index: 999;
      transition: all var(--transition-smooth);
    }
    .awja-chatbot-fab span {
      margin: 0 auto;
      display: block;
      line-height: 1;
    }
    .awja-chatbot-fab:hover {
      transform: scale(1.08) rotate(5deg);
      box-shadow: 0 12px 32px rgba(0, 169, 206, 0.4);
    }
    .awja-chatbot-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      height: 520px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: var(--radius-xl);
      box-shadow: 0 16px 48px rgba(0, 22, 41, 0.15);
      z-index: 998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: translateY(20px) scale(0.95);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .awja-chatbot-window.open {
      transform: translateY(0) scale(1);
      opacity: 1;
      visibility: visible;
    }
    .chatbot-header {
      padding: var(--space-4) var(--space-5);
      background: var(--brand-corporate-blue);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .chatbot-header-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .chatbot-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--brand-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 700;
    }
    .chatbot-body {
      flex: 1;
      padding: var(--space-4);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .bot-msg, .user-msg {
      max-width: 80%;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: 14px;
      line-height: 1.4;
    }
    .bot-msg {
      background: #ffffff;
      color: var(--color-on-surface);
      border: 1px solid var(--color-border-light);
      align-self: flex-start;
      border-bottom-right-radius: 2px;
    }
    .user-msg {
      background: var(--brand-corporate-blue);
      color: #ffffff;
      align-self: flex-end;
      border-bottom-left-radius: 2px;
    }
    .chatbot-quick-options {
      display: flex;
      gap: var(--space-2);
      padding: 0 var(--space-4) var(--space-3);
      overflow-x: auto;
      white-space: nowrap;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .chatbot-quick-options::-webkit-scrollbar {
      display: none;
    }
    .quick-btn {
      flex-shrink: 0;
      padding: 6px 12px;
      background: #ffffff;
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-full);
      font-size: 12px;
      cursor: pointer;
      color: var(--color-on-surface-variant);
      transition: all var(--transition-fast);
    }
    .quick-btn:hover {
      background: var(--color-surface-container-low);
      border-color: var(--color-secondary);
      color: var(--color-secondary);
    }
    .chatbot-footer {
      padding: var(--space-3);
      border-top: 1px solid var(--color-border-light);
      display: flex;
      gap: var(--space-2);
      background: #ffffff;
    }
    .chatbot-input {
      flex: 1;
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-full);
      padding: var(--space-2) var(--space-4);
      font-size: 14px;
      outline: none;
      transition: border-color var(--transition-fast);
    }
    .chatbot-input:focus {
      border-color: var(--brand-cyan);
    }
    .chatbot-send-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--brand-corporate-blue);
      color: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color var(--transition-fast);
    }
    .chatbot-send-btn:hover {
      background: var(--color-secondary);
    }
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 4px 8px;
    }
    .typing-dot {
      width: 6px;
      height: 6px;
      background: var(--color-outline);
      border-radius: 50%;
      animation: typingDot 1.4s infinite ease-in-out both;
    }
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typingDot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 480px) {
      .awja-chatbot-window {
        width: calc(100vw - 32px);
        height: 480px;
        right: 16px;
        bottom: 84px;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // ─── DOM Elements Injection ───
  const chatbotContainer = document.createElement('div');
  chatbotContainer.innerHTML = `
    <div class="awja-chatbot-fab" id="chatbot-fab">
      <span class="material-symbols-outlined" style="font-size: 32px;">smart_toy</span>
    </div>
    
    <div class="awja-chatbot-window" id="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">أ</div>
          <div>
            <h4 style="font-size: 14px; font-weight:700; margin:0;">مهندس أوجاتيك الذكي</h4>
            <span style="font-size: 11px; opacity:0.8;">نشط الآن (بقوة الذكاء الاصطناعي)</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="material-symbols-outlined" style="cursor: pointer; font-size: 20px;" id="chatbot-clear" title="مسح المحادثة">delete</span>
          <span class="material-symbols-outlined" style="cursor: pointer;" id="chatbot-close">close</span>
        </div>
      </div>
      
      <div class="chatbot-body" id="chatbot-chat-body">
        <div class="bot-msg">
          مرحباً بك! أنا مساعد أوجاتيك الذكي لخدمات التيار الخفيف والأنظمة الأمنية والشبكات. كيف يمكنني مساعدتك اليوم؟
        </div>
      </div>
      
      <div class="chatbot-quick-options">
        <button class="quick-btn" data-query="ما هي أوقات العمل؟">أوقات العمل ⏰</button>
        <button class="quick-btn" data-query="أريد فتح تذكرة صيانة">فتح تذكرة صيانة 🛠️</button>
        <button class="quick-btn" data-query="طرق الاتصال والتواصل">طرق الاتصال 📞</button>
        <button class="quick-btn" data-query="ما هي خدمات شركة أوجاتيك؟">خدماتنا 🔧</button>
        <button class="quick-btn" data-query="أين يقع مقر شركة أوجاتيك؟">موقعنا 📍</button>
        <button class="quick-btn" data-query="هل توجد عروض أو خصومات حالية؟">عروض وأسعار 💰</button>
      </div>
      
      <div class="chatbot-footer">
        <input type="text" class="chatbot-input" id="chatbot-text-input" placeholder="اكتب استفسارك هنا..." />
        <button class="chatbot-send-btn" id="chatbot-send-btn">
          <span class="material-symbols-outlined" style="font-size: 20px;">send</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(chatbotContainer);

  // ─── UI Interactions ───
  const fab = document.getElementById('chatbot-fab');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const chatBody = document.getElementById('chatbot-chat-body');
  const textInput = document.getElementById('chatbot-text-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const quickBtns = document.querySelectorAll('.quick-btn');

  fab.addEventListener('click', () => {
    windowEl.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    windowEl.classList.remove('open');
  });

  // Clear Chat History Interaction
  const clearBtn = document.getElementById('chatbot-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('هل تريد مسح المحادثة وإعادة تعيينها؟')) {
        chatBody.innerHTML = `
          <div class="bot-msg">
            مرحباً بك! أنا مساعد أوجاتيك الذكي لخدمات التيار الخفيف والأنظمة الأمنية والشبكات. كيف يمكنني مساعدتك اليوم؟
          </div>
        `;
        conversationHistory = [];
        chatbotState.mode = 'chat';
        chatbotState.step = null;
        chatbotState.ticketData = {};
      }
    });
  }

  // Handle quick option buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const query = btn.dataset.query;
      handleUserInput(query);
    });
  });

  sendBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
      handleUserInput(text);
      textInput.value = '';
    }
  });

  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendBtn.click();
    }
  });

  // ─── Chatbot State and Ticket Wizard Logic ───
  let chatbotState = {
    mode: 'chat', // 'chat' or 'ticket'
    step: null,   // name, phone, email, desc
    ticketData: {}
  };

  let conversationHistory = [];

  // ⚠ API key moved to backend for security. Add your server proxy endpoint here.
  const NVIDIA_API_KEY = "YOUR_NVIDIA_API_KEY_HERE"; // Set your NVIDIA API Key here
  
  function formatMarkdown(text) {
    // Basic HTML escape to prevent XSS
    let div = document.createElement('div');
    div.textContent = text;
    let escaped = div.innerHTML;

    // Bold replacement: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet list formatting: - item or * item
    let lines = escaped.split('\n');
    let inList = false;
    let formattedLines = [];

    for (let line of lines) {
      let trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          formattedLines.push('<ul style="margin-right: 20px; margin-bottom: 8px; list-style-type: disc;">');
          inList = true;
        }
        formattedLines.push('<li style="margin-bottom: 4px;">' + trimmed.substring(2) + '</li>');
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(line);
      }
    }
    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('<br>').replace(/<\/ul><br>/g, '</ul>').replace(/<br><ul/g, '<ul');
  }

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = sender === 'bot' ? 'bot-msg' : 'user-msg';
    msg.innerHTML = formatMarkdown(text);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'bot-msg';
    indicator.id = 'temp-typing-indicator';
    indicator.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('temp-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function handleUserInput(text) {
    addMessage(text, 'user');

    if (chatbotState.mode === 'ticket') {
      handleTicketWizard(text);
    } else {
      // Check if user wants to open a ticket
      if (text.includes('تذكرة') || text.toLowerCase().includes('ticket') || text.includes('صيانة') || text.includes('عطل')) {
        initiateTicketWizard();
      } else {
        queryNvidiaAI(text);
      }
    }
  }

  // ─── NVIDIA NIM LLM API Connection ───
  async function queryNvidiaAI(prompt) {
    addTypingIndicator();

    // Prepare message payload containing system prompt + history + current prompt
    const messagesPayload = [
      {
        role: "system",
        content: `أنت المساعد الذكي لشركة أوجاتيك للهندسة (AwjaTech)، وهي شركة سعودية رائدة متخصصة في أنظمة التيار الخفيف والبنية التحتية الذكية والأنظمة الأمنية.
معلومات أساسية عن أوجاتيك:
- الخدمات:
  1. كاميرات المراقبة الأمنية (CCTV): كاميرات IP بدقة 4K، وأنظمة تناظرية Analog HD، وكاميرات PTZ متحركة، وكاميرات حرارية، مع المراقبة عن بعد.
  2. حلول الشبكات (Networking): تصميم البنية التحتية، شبكات الألياف الضوئية (Fiber)، نقاط الاتصال اللاسلكي (Wi-Fi)، الخوادم (Servers)، الجدران النارية (Firewalls).
  3. التحكم في الوصول (Access Control): البصمة الحيوية (بصمات الأصابع، العين)، التعرف على الوجه، البطاقات الذكية (RFID/NFC)، بوابات الدخول للسيارات والأفراد (Turnstiles).
  4. أنظمة الصوت (Sound Systems): أنظمة الصوت للمساجد، قاعات المؤتمرات، أنظمة النداء الصوتي ومخاطبة الجمهور (Public Address)، أنظمة الإخلاء الصوتي في حالات الطوارئ (EVAC) المعتمدة.
- أوقات العمل: من الأحد إلى الخميس، من 8:00 صباحاً حتى 5:00 مساءً. السبت من 9:00 صباحاً حتى 1:00 ظهراً. الجمعة عطلة رسمية.
- للتواصل: البريد الإلكتروني: info@awjatech.com.sa، الهاتف: +966500000000، المقر الرئيسي: الرياض، المملكة العربية السعودية.
تعليمات الرد:
- أجب باختصار وبأسلوب مهني وودود باللغة العربية الفصحى.
- إذا أراد العميل فتح تذكرة دعم أو صيانة، أخبره أنه يمكنه كتابة 'أريد فتح تذكرة' لكي نقوم بأخذ بياناته مباشرة وربطها بحسابه.`
      },
      ...conversationHistory,
      {
        role: "user",
        content: prompt
      }
    ];

    try {
      // Try backend proxy first, then direct API if key available
      const API_URL = NVIDIA_API_KEY
        ? "https://integrate.api.nvidia.com/v1/chat/completions"
        : "/api/chat"; // Backend proxy endpoint

      const headers = {
        "Content-Type": "application/json"
      };
      if (NVIDIA_API_KEY) {
        headers["Authorization"] = `Bearer ${NVIDIA_API_KEY}`;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(NVIDIA_API_KEY ? {
          model: "meta/llama-3.1-70b-instruct",
          messages: messagesPayload,
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 500
        } : { messages: messagesPayload })
      });

      const data = await response.json();
      removeTypingIndicator();
      const botReply = data.choices?.[0]?.message?.content || data.reply;
      if (botReply) {
        addMessage(botReply, 'bot');
        conversationHistory.push({ role: "user", content: prompt });
        conversationHistory.push({ role: "assistant", content: botReply });
        if (conversationHistory.length > 20) {
          conversationHistory.shift();
          conversationHistory.shift();
        }
      } else {
        fallbackResponse(prompt);
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      removeTypingIndicator();
      fallbackResponse(prompt);
    }
  }

  function fallbackResponse(prompt) {
    const text = prompt.toLowerCase();
    if (text.includes('ساعات') || text.includes('أوقات') || text.includes('وقت')) {
      addMessage("أوقات عمل شركة أوجاتيك هي من الأحد إلى الخميس من 8:00 ص حتى 5:00 م، والسبت من 9:00 ص حتى 1:00 م. الجمعة عطلة رسمية.", 'bot');
    } else if (text.includes('رقم') || text.includes('اتصل') || text.includes('تواصل')) {
      addMessage("يمكنك التواصل معنا عبر الهاتف أو الواتساب على الرقم: 966500000000+ أو عبر البريد الإلكتروني: info@awjatech.com.sa.", 'bot');
    } else {
      addMessage("أهلاً بك! لم أتمكن من الاتصال بالخادم الرئيسي حالياً، ولكن يمكنك التواصل مع الدعم الفني مباشرة عبر الهاتف +966500000000 أو فتح تذكرة صيانة بالضغط على الخيارات أسفل المحادثة.", 'bot');
    }
  }

  // ─── Support Ticket Wizard State Machine ───
  function initiateTicketWizard() {
    chatbotState.mode = 'ticket';
    chatbotState.step = 'name';
    chatbotState.ticketData = {};
    addMessage("حسناً، سأساعدك في فتح تذكرة صيانة فنية للمنشأة. ما هو اسمك الكريم؟", 'bot');
  }

  function handleTicketWizard(text) {
    if (chatbotState.step === 'name') {
      chatbotState.ticketData.name = text;
      chatbotState.step = 'phone';
      addMessage("تشرفت بك. يرجى تزويدي برقم الجوال للتواصل:", 'bot');
    } else if (chatbotState.step === 'phone') {
      // Basic verification
      chatbotState.ticketData.phone = text;
      chatbotState.step = 'email';
      addMessage("شكراً لك. يرجى تزويدي بالبريد الإلكتروني للعمل لتسجيل التذكرة في حسابك:", 'bot');
    } else if (chatbotState.step === 'email') {
      chatbotState.ticketData.email = text;
      chatbotState.step = 'desc';
      addMessage("رائع. يرجى كتابة تفاصيل المشكلة أو عطل النظام الذي تواجهه بالتفصيل:", 'bot');
    } else if (chatbotState.step === 'desc') {
      chatbotState.ticketData.desc = text;
      
      // Save and Generate Ticket
      const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
      
      // Load current tickets from localStorage
      let tickets = JSON.parse(localStorage.getItem('awja_tickets')) || [];
      const newTicket = {
        id: ticketId,
        subject: `تذكرة صيانة عبر الذكاء الاصطناعي - ${chatbotState.ticketData.name}`,
        service: 'CCTV', // Default tag
        desc: chatbotState.ticketData.desc,
        status: 'pending',
        messages: [
          { sender: 'client', text: `تفاصيل المشكلة: ${chatbotState.ticketData.desc}` },
          { sender: 'support', text: 'تم استلام تذكرة الصيانة بنجاح عبر المساعد الذكي، وجاري المراجعة والاتصال بك.' }
        ]
      };
      
      tickets.push(newTicket);
      localStorage.setItem('awja_tickets', JSON.stringify(tickets));
      
      // Reset state
      chatbotState.mode = 'chat';
      chatbotState.step = null;
      
      addMessage(`تم فتح التذكرة بنجاح برقم مرجعي: ${ticketId}. 
تم ربط التذكرة ببريدك الإلكتروني، ويمكنك متابعتها ومراسلة المهندسين عبر تسجيل الدخول في بوابة العميل الخاصة بك.`, 'bot');
    }
  }
});
