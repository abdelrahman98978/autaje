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
      left: auto !important;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--brand-gradient);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 169, 206, 0.35);
      cursor: pointer;
      z-index: 99;
      transition: all var(--transition-smooth);
    }
    .awja-chatbot-fab::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: var(--brand-cyan);
      opacity: 0.3;
      z-index: -1;
      animation: chatbot-pulse 2s infinite;
    }
    .awja-chatbot-fab::after {
      content: '';
      position: absolute;
      top: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background-color: #00FF66;
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(0, 255, 102, 0.8);
    }
    @keyframes chatbot-pulse {
      0% {
        transform: scale(1);
        opacity: 0.4;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }
    .awja-chatbot-fab span {
      margin: 0 auto;
      display: block;
      line-height: 1;
    }
    .awja-chatbot-fab:hover {
      transform: scale(1.08) rotate(5deg);
      box-shadow: 0 12px 32px rgba(0, 169, 206, 0.45);
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
      max-width: 85%;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: var(--font-label-md-size);
      line-height: 1.6;
      position: relative;
    }
    .bot-msg {
      background: #ffffff;
      color: var(--color-on-surface);
      border: 1px solid var(--color-border-light);
      align-self: flex-start;
      border-bottom-right-radius: 2px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .user-msg {
      background: var(--brand-corporate-blue);
      color: #ffffff;
      align-self: flex-end;
      border-bottom-left-radius: 2px;
      box-shadow: 0 4px 12px rgba(0, 43, 73, 0.15);
    }
    .chatbot-quick-options {
      display: flex;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4) var(--space-4);
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
      padding: 8px 16px;
      background: #ffffff;
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-full);
      font-size: var(--font-label-sm-size);
      font-weight: 600;
      cursor: pointer;
      color: var(--color-primary);
      transition: all var(--transition-fast);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .quick-btn:hover {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .chatbot-footer {
      padding: var(--space-4);
      border-top: 1px solid var(--color-border-light);
      display: flex;
      gap: var(--space-2);
      background: #ffffff;
    }
    .chatbot-input {
      flex: 1;
      border: 1px solid var(--color-border-light);
      border-radius: var(--radius-full);
      padding: var(--space-2) var(--space-5);
      font-size: var(--font-body-md-size);
      outline: none;
      transition: all var(--transition-fast);
      background: var(--color-surface-container-low);
    }
    .chatbot-input:focus {
      border-color: var(--brand-cyan);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 169, 206, 0.1);
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

    @media (max-width: 767px) {
      .awja-chatbot-fab {
        bottom: 16px;
        right: 16px;
        width: 48px;
        height: 48px;
      }
      .awja-chatbot-fab span {
        font-size: 24px !important;
      }
      .awja-chatbot-fab::after {
        width: 10px;
        height: 10px;
        top: 1px;
        right: 1px;
      }
    }

    @media (max-width: 480px) {
      .awja-chatbot-window {
        width: calc(100vw - 32px);
        height: 480px;
        right: 16px;
        bottom: 80px;
      }
    }

    /* Hide when mobile menu is open */
    .mobile-nav.open ~ div .awja-chatbot-fab,
    .mobile-nav.open ~ div .awja-chatbot-window,
    body.overflow-hidden .awja-chatbot-fab,
    body.overflow-hidden .awja-chatbot-window {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transform: scale(0.8) translateY(20px) !important;
    }
  `;
  document.head.appendChild(styleEl);

  // ─── DOM Elements Injection ───
  const currentLang = document.documentElement.lang || localStorage.getItem('awja_lang') || 'ar';
  
  const chatbotStrings = {
    'ar': {
      'greeting': 'مرحباً بك! أنا مساعد أوجاتيك الذكي لخدمات التيار الخفيف والأنظمة الأمنية والشبكات. كيف يمكنني مساعدتك اليوم؟',
      'title': 'مهندس أوجاتيك الذكي',
      'status': 'نشط الآن (بقوة الذكاء الاصطناعي)',
      'placeholder': 'اكتب استفسارك هنا...',
      'clear_confirm': 'هل تريد مسح المحادثة وإعادة تعيينها؟',
      'fallback_work_hours': 'أوقات عمل شركة أوجاتيك هي من الأحد إلى الخميس من 8:00 ص حتى 5:00 م، والسبت من 9:00 ص حتى 1:00 م. الجمعة عطلة رسمية.',
      'fallback_contact': 'يمكنك التواصل معنا عبر الهاتف أو الواتساب على الرقم: 966579466881+ أو عبر البريد الإلكتروني: sales@awjatech.sa.',
      'fallback_error': 'أهلاً بك! لم أتمكن من الاتصال بالخادم الرئيسي حالياً، ولكن يمكنك التواصل مع الدعم الفني مباشرة عبر الهاتف +966579466881 أو فتح تذكرة صيانة بالضغط على الخيارات أسفل المحادثة.',
      'ticket_init': 'حسناً، سأساعدك في فتح تذكرة صيانة فنية للمنشأة. ما هو اسمك الكريم؟',
      'ticket_phone': 'تشرفت بك. يرجى تزويدي برقم الجوال للتواصل:',
      'ticket_email': 'شكراً لك. يرجى تزويدي بالبريد الإلكتروني للعمل لتسجيل التذكرة في حسابك:',
      'ticket_desc': 'رائع. يرجى كتابة تفاصيل المشكلة أو عطل النظام الذي تواجهه بالتفصيل:',
      'ticket_success': 'تم فتح التذكرة بنجاح برقم مرجعي: {id}. تم ربط التذكرة ببريدك الإلكتروني، ويمكنك متابعتها ومراسلة المهندسين عبر تسجيل الدخول في بوابة العميل الخاصة بك.'
    },
    'en': {
      'greeting': 'Welcome! I am the AwjaTech AI assistant for Low Current services, security systems, and networking. How can I help you today?',
      'title': 'AwjaTech AI Engineer',
      'status': 'Online (Powered by AI)',
      'placeholder': 'Type your query here...',
      'clear_confirm': 'Do you want to clear the conversation history?',
      'fallback_work_hours': 'AwjaTech working hours are Sunday to Thursday from 8:00 AM to 5:00 PM, and Saturday from 9:00 AM to 1:00 PM. Friday is a holiday.',
      'fallback_contact': 'You can contact us via phone or WhatsApp at: +966579466881 or via email: sales@awjatech.sa.',
      'fallback_error': 'Welcome! I am currently unable to connect to the main server, but you can contact technical support directly via phone +966579466881 or open a maintenance ticket using the options below.',
      'ticket_init': 'Sure, I will help you open a technical maintenance ticket. May I have your full name?',
      'ticket_phone': 'Nice to meet you. Please provide your mobile number:',
      'ticket_email': 'Thank you. Please provide your business email to register the ticket:',
      'ticket_desc': 'Great. Please describe the problem or system failure you are experiencing in detail:',
      'ticket_success': 'Ticket opened successfully with reference: {id}. The ticket is linked to your email; you can track it and message engineers by logging into your client portal.'
    },
    'fr': {
      'greeting': 'Bienvenue ! Je suis l\'assistant IA d\'AwjaTech pour les services de courant faible, les systèmes de sécurité et les réseaux. Comment puis-je vous aider aujourd\'hui ?',
      'title': 'Ingénieur IA AwjaTech',
      'status': 'En ligne (Propulsé par l\'IA)',
      'placeholder': 'Écrivez votre question ici...',
      'clear_confirm': 'Voulez-vous effacer l\'historique de la conversation ?',
      'fallback_work_hours': 'Les heures de travail d\'AwjaTech sont du dimanche au jeudi de 8h00 à 17h00 et le samedi de 9h00 à 13h00. Le vendredi est un jour férié.',
      'fallback_contact': 'Vous pouvez nous contacter par téléphone ou WhatsApp au : +966579466881 ou par email : sales@awjatech.sa.',
      'fallback_error': 'Bienvenue ! Je ne parviens pas à me connecter au serveur principal pour le moment, mais vous pouvez contacter le support technique directement par téléphone au +966579466881.',
      'ticket_init': 'Bien sûr, je vais vous aider à ouvrir un ticket de maintenance. Quel est votre nom complet ?',
      'ticket_phone': 'Enchanté. Veuillez fournir votre numéro de téléphone mobile :',
      'ticket_email': 'Merci. Veuillez fournir votre email professionnel pour enregistrer le ticket :',
      'ticket_desc': 'Excellent. Veuillez décrire en détail le problème ou la panne du système que vous rencontrez :',
      'ticket_success': 'Ticket ouvert avec succès avec la référence : {id}. Le ticket est lié à votre email.'
    },
    'es': {
      'greeting': '¡Bienvenido! Soy el asistente de IA de AwjaTech para servicios de baja tensión, sistemas de seguridad y redes. ¿Cómo puedo ayudarte hoy?',
      'title': 'Ingeniero de IA de AwjaTech',
      'status': 'En línea (Impulsado por IA)',
      'placeholder': 'Escribe tu consulta aquí...',
      'clear_confirm': '¿Quieres borrar el historial de la conversación?',
      'fallback_work_hours': 'El horario laboral de AwjaTech es de domingo a jueves de 8:00 AM a 5:00 PM, y sábados de 9:00 AM a 1:00 PM. El viernes es festivo.',
      'fallback_contact': 'Puede contactarnos por teléfono o WhatsApp al: +966579466881 o por correo electrónico: sales@awjatech.sa.',
      'fallback_error': '¡Bienvenido! Actualmente no puedo conectarme al servidor principal, pero puede contactar con el soporte técnico directamente por teléfono al +966579466881.',
      'ticket_init': 'Claro, te ayudaré a abrir un ticket de mantenimiento técnico. ¿Cuál es su nombre completo?',
      'ticket_phone': 'Mucho gusto. Por favor, proporcione su número de móvil:',
      'ticket_email': 'Gracias. Proporcione su correo electrónico comercial para registrar el ticket:',
      'ticket_desc': 'Genial. Describa en detalle el problema o fallo del sistema que está experimentando:',
      'ticket_success': 'Ticket abierto con éxito con referencia: {id}. El ticket está vinculado a su correo electrónico.'
    }
  };

  const s = chatbotStrings[currentLang] || chatbotStrings['ar'];

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
            <h4 style="font-size: 14px; font-weight:700; margin:0;">${s.title}</h4>
            <span style="font-size: 11px; opacity:0.8;">${s.status}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="material-symbols-outlined" style="cursor: pointer; font-size: 20px;" id="chatbot-clear" title="مسح المحادثة">delete</span>
          <span class="material-symbols-outlined" style="cursor: pointer;" id="chatbot-close">close</span>
        </div>
      </div>
      
      <div class="chatbot-body" id="chatbot-chat-body">
        <div class="bot-msg">
          ${s.greeting}
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
        <input type="text" class="chatbot-input" id="chatbot-text-input" placeholder="${s.placeholder}" />
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
      if (confirm(s.clear_confirm)) {
        chatBody.innerHTML = `
          <div class="bot-msg">
            ${s.greeting}
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

  // API key is stored securely on Vercel server-side (/api/chat)
  const CHAT_API_URL = "/api/chat";
  
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
      const ticketKeywords = ['تذكرة', 'ticket', 'صيانة', 'عطل', 'maintenance', 'panne', 'mantenimiento'];
      if (ticketKeywords.some(k => text.toLowerCase().includes(k))) {
        initiateTicketWizard();
      } else {
        queryOpenRouterAI(text);
      }
    }
  }

  // ─── OpenRouter LLM API Connection ───
  async function queryOpenRouterAI(prompt) {
    addTypingIndicator();

    const systemPrompts = {
      'ar': `أنت "المهندس الذكي"، مستشار تقني وهندسي لشركة أوجاتيك للهندسة (AwjaTech).
أوجاتيك هي شركة سعودية رائدة متخصصة في تصميم وتنفيذ حلول التيار الخفيف (Low Current) والأنظمة الأمنية والبنية التحتية الذكية.

شخصيتك:
- مهنية للغاية، دقيقة هندسياً، وودودة.
- تتحدث بصيغة الجمع "نحن في أوجاتيك" لتعزيز هوية الشركة.
- تركز على الحلول التقنية المبتكرة والمعايير العالمية.

تخصصاتنا: CCTV، الشبكات، التحكم بالدخول، الأنظمة الذكية، أنظمة الصوت.
الموقع: الرياض. الهاتف: 966579466881+`,
      'en': `You are the "AI Engineer", a technical and engineering consultant for AwjaTech Engineering.
AwjaTech is a leading Saudi company specializing in Low Current solutions, security systems, and smart infrastructure.

Your Personality:
- Highly professional, engineering-precise, and friendly.
- Use "We at AwjaTech" to reinforce company identity.
- Focus on innovative technical solutions and global standards.

Specialties: CCTV, Networking, Access Control, Smart Systems, Audio Systems.
Location: Riyadh. Phone: +966579466881`,
      'fr': `Vous êtes l'"Ingénieur IA", consultant technique pour AwjaTech Engineering.
AwjaTech est une entreprise saoudienne leader spécialisée dans les solutions à courant faible, les systèmes de sécurité et les infrastructures intelligentes.

Personnalité : Professionnelle, précise, amicale.
Spécialités : CCTV, Réseaux, Contrôle d'accès, Domotique.`,
      'es': `Eres el "Ingeniero de IA", consultor técnico de AwjaTech Engineering.
AwjaTech es una empresa saudí líder especializada en soluciones de baja tensión, sistemas de seguridad e infraestructura inteligente.

Personalidad: Profesional, precisa, amable.`
    };

    const sysMsg = systemPrompts[document.documentElement.lang] || systemPrompts['ar'];

    // Prepare message payload containing system prompt + history + current prompt
    const messagesPayload = [
      {
        role: "system",
        content: sysMsg
      },
      ...conversationHistory,
      {
        role: "user",
        content: prompt
      }
    ];

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          model: "nvidia/llama-3.1-nemotron-70b-instruct"
        })
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
    if (text.includes('ساعات') || text.includes('أوقات') || text.includes('hours') || text.includes('horaires')) {
      addMessage(s.fallback_work_hours, 'bot');
    } else if (text.includes('رقم') || text.includes('اتصل') || text.includes('contact') || text.includes('phone')) {
      addMessage(s.fallback_contact, 'bot');
    } else {
      addMessage(s.fallback_error, 'bot');
    }
  }

  // ─── Support Ticket Wizard State Machine ───
  function initiateTicketWizard() {
    chatbotState.mode = 'ticket';
    chatbotState.step = 'name';
    chatbotState.ticketData = {};
    addMessage(s.ticket_init, 'bot');
  }

  function handleTicketWizard(text) {
    if (chatbotState.step === 'name') {
      chatbotState.ticketData.name = text;
      chatbotState.step = 'phone';
      addMessage(s.ticket_phone, 'bot');
    } else if (chatbotState.step === 'phone') {
      chatbotState.ticketData.phone = text;
      chatbotState.step = 'email';
      addMessage(s.ticket_email, 'bot');
    } else if (chatbotState.step === 'email') {
      chatbotState.ticketData.email = text;
      chatbotState.step = 'desc';
      addMessage(s.ticket_desc, 'bot');
    } else if (chatbotState.step === 'desc') {
      chatbotState.ticketData.desc = text;
      
      // Save and Generate Ticket
      const ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
      
      // Load current tickets from localStorage
      let tickets = JSON.parse(localStorage.getItem('awja_tickets')) || [];
      const newTicket = {
        id: ticketId,
        subject: `Ticket via AI - ${chatbotState.ticketData.name}`,
        service: 'Support',
        desc: chatbotState.ticketData.desc,
        status: 'pending',
        messages: [
          { sender: 'client', text: chatbotState.ticketData.desc },
          { sender: 'support', text: 'Received via AI Assistant. We will contact you soon.' }
        ]
      };
      
      tickets.push(newTicket);
      localStorage.setItem('awja_tickets', JSON.stringify(tickets));
      
      // Reset state
      chatbotState.mode = 'chat';
      chatbotState.step = null;
      
      addMessage(s.ticket_success.replace('{id}', ticketId), 'bot');
    }
  }

});
