function showPage(name, btn) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
  if (btn) btn.classList.add("active");
  if (name === "auth") initAuthCanvas();
}
document.querySelectorAll(".jfilter").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".jfilter")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
  }),
);
document.querySelectorAll(".filter-btn").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
  }),
);
document.querySelectorAll(".m-filter").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".m-filter")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
  }),
);
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
let nodes = [];
function resizeHome() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
function initNodes() {
  nodes = Array.from({ length: 28 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 3 + 1.5,
  }));
}
function drawHome() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes.forEach((n) => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
  });
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x,
        dy = nodes[i].y - nodes[j].y,
        d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = "rgba(255,107,0," + (1 - d / 150) * 0.82 + ")";
        ctx.lineWidth = 1.15;
        ctx.stroke();
      }
    }
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + 0.6, 0, Math.PI * 2);
    ctx.fillStyle = "#FF8C33";
    ctx.fill();
  });
  requestAnimationFrame(drawHome);
}
resizeHome();
initNodes();
drawHome();
window.addEventListener("resize", () => {
  resizeHome();
  initNodes();
});
let authAnimRunning = false;
function initAuthCanvas() {
  if (authAnimRunning) return;
  authAnimRunning = true;
  const ac = document.getElementById("authCanvas");
  const actx = ac.getContext("2d");
  let an = [];
  function ra() {
    ac.width = ac.offsetWidth;
    ac.height = ac.offsetHeight;
    an = Array.from({ length: 20 }, () => ({
      x: Math.random() * ac.width,
      y: Math.random() * ac.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));
  }
  function da() {
    actx.clearRect(0, 0, ac.width, ac.height);
    an.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > ac.width) n.vx *= -1;
      if (n.y < 0 || n.y > ac.height) n.vy *= -1;
    });
    for (let i = 0; i < an.length; i++)
      for (let j = i + 1; j < an.length; j++) {
        const dx = an[i].x - an[j].x,
          dy = an[i].y - an[j].y,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < 145) {
          actx.beginPath();
          actx.moveTo(an[i].x, an[i].y);
          actx.lineTo(an[j].x, an[j].y);
          actx.strokeStyle = "rgba(255,140,51," + (1 - d / 145) * 0.82 + ")";
          actx.lineWidth = 1.05;
          actx.stroke();
        }
      }
    an.forEach((n) => {
      actx.beginPath();
      actx.arc(n.x, n.y, n.r + 0.5, 0, Math.PI * 2);
      actx.fillStyle = "#FF8C33";
      actx.fill();
    });
    requestAnimationFrame(da);
  }
  ra();
  da();
}
function switchTab(tab) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((b, i) =>
      b.classList.toggle(
        "active",
        (tab === "login" && i === 0) || (tab === "signup" && i === 1),
      ),
    );
  document
    .getElementById("form-login")
    .classList.toggle("active", tab === "login");
  document
    .getElementById("form-signup")
    .classList.toggle("active", tab === "signup");
  document.getElementById("success-state").style.display = "none";
  document.getElementById("auth-tabs").style.display = "flex";
}
function togglePw(id, btn) {
  const inp = document.getElementById(id);
  const h = inp.type === "password";
  inp.type = h ? "text" : "password";
  btn.textContent = h ? "Hide" : "Show";
}
function checkStrength(val) {
  const segs = [
    document.getElementById("s1"),
    document.getElementById("s2"),
    document.getElementById("s3"),
    document.getElementById("s4"),
  ];
  const label = document.getElementById("strength-label");
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Too short", "Weak", "Fair", "Strong", "Very strong"];
  segs.forEach(
    (s, i) =>
      (s.style.background = i < score ? colors[score - 1] : "var(--border)"),
  );
  label.textContent = val.length === 0 ? "Enter a password" : labels[score];
  label.style.color = score > 0 ? colors[score - 1] : "var(--gray)";
}
function handleLogin() {
  const e = document.getElementById("login-email").value;
  const p = document.getElementById("login-password").value;
  if (!e || !p) {
    alert("Please fill in all fields.");
    return;
  }
  showSuccess();
}
function handleSignup() {
  if (!document.getElementById("terms").checked) {
    alert("Please accept the terms.");
    return;
  }
  showSuccess();
}
function showSuccess() {
  document.getElementById("form-login").classList.remove("active");
  document.getElementById("form-signup").classList.remove("active");
  document.getElementById("auth-tabs").style.display = "none";
  document.getElementById("success-state").style.display = "block";
  const heading = document.querySelector("#success-state h3");
  if (heading && window.aptverseProfile)
    heading.textContent = `You're in, ${window.aptverseProfile.displayName}!`;
}
const contacts = [
  {
    id: 1,
    name: "Amaka Okonkwo",
    initials: "AO",
    color: "#7C3AED",
    role: "Software Engineer · Flutterwave",
    online: true,
    unread: 2,
    messages: [
      {
        from: "them",
        text: "Hey Mo! APTverse looks amazing 🔥",
        time: "10:02 AM",
      },
      {
        from: "me",
        text: "Thanks! Going with Firebase for now",
        time: "10:15 AM",
      },
      {
        from: "them",
        text: "Smart move. Lmk if you need tips 🙌",
        time: "10:17 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Tunde Olawale",
    initials: "TO",
    color: "#059669",
    role: "Full-Stack Dev · Andela",
    online: true,
    unread: 0,
    messages: [
      {
        from: "me",
        text: "Still holding the workshop Saturday?",
        time: "Yesterday",
      },
      {
        from: "them",
        text: "Yes! 2pm WAT. Zoom link coming tomorrow",
        time: "Yesterday",
      },
      { from: "me", text: "Perfect 👍", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Kelechi Eze",
    initials: "KE",
    color: "#0EA5E9",
    role: "Student · Semester 4",
    online: false,
    unread: 0,
    messages: [
      {
        from: "them",
        text: "Dropped the city guide update on GitHub",
        time: "Mon",
      },
      {
        from: "me",
        text: "Looks clean! The map integration is 🔥",
        time: "Mon",
      },
    ],
  },
  {
    id: 4,
    name: "Fatima Nwosu",
    initials: "FN",
    color: "#DC2626",
    role: "Backend Engineer · Paystack",
    online: false,
    unread: 1,
    messages: [
      {
        from: "them",
        text: "Reviewed your Spring Boot project — DM when free",
        time: "Sun",
      },
    ],
  },
  {
    id: 5,
    name: "Bisi Daniel",
    initials: "BD",
    color: "#F59E0B",
    role: "UI/UX Designer",
    online: true,
    unread: 0,
    messages: [
      { from: "me", text: "Can you review the APTverse UI?", time: "Sat" },
      { from: "them", text: "Sure! Send me screenshots", time: "Sat" },
    ],
  },
];
let activeContactId = null,
  typingTimer = null;
function renderChatList() {
  const list = document.getElementById("chatList");
  list.innerHTML = contacts
    .map(
      (c) =>
        `<div class="chat-item${activeContactId === c.id ? " active" : ""}" onclick="openChat(${c.id})"><div class="ci-avatar" style="background:${c.color}">${c.initials}${c.online ? '<div class="online-dot"></div>' : ""}</div><div class="ci-info"><div class="ci-top"><div class="ci-name">${c.name}</div><div class="ci-time">${c.messages[c.messages.length - 1].time}</div></div><div class="ci-preview">${c.messages[c.messages.length - 1].text}</div></div>${c.unread > 0 ? `<div class="ci-unread">${c.unread}</div>` : ""}</div>`,
    )
    .join("");
}
function openChat(id) {
  activeContactId = id;
  const c = contacts.find((x) => x.id === id);
  c.unread = 0;
  document.getElementById("chatEmpty").style.display = "none";
  const wrap = document.getElementById("activeChatWrap");
  wrap.style.display = "flex";
  const av = document.getElementById("ctAvatar");
  av.textContent = c.initials;
  av.style.background = c.color;
  document.getElementById("ctName").textContent = c.name;
  document.getElementById("ctStatus").textContent = c.online
    ? "● Online"
    : "○ Offline";
  document.getElementById("ctStatus").style.color = c.online
    ? "#22c55e"
    : "#888";
  renderMessages(c);
  renderChatList();
  document.getElementById("chatTextarea").focus();
}
function renderMessages(c) {
  const box = document.getElementById("chatMessages");
  box.innerHTML =
    '<div class="date-divider"><span>Today</span></div>' +
    c.messages
      .map(
        (m) =>
          `<div class="msg-row ${m.from === "me" ? "mine" : "theirs"}">${m.from === "them" ? `<div class="msg-av" style="background:${c.color}">${c.initials}</div>` : ""}<div><div class="bubble">${m.text}</div><div class="msg-time" style="text-align:${m.from === "me" ? "right" : "left"}">${m.time}</div></div></div>`,
      )
      .join("");
  box.scrollTop = box.scrollHeight;
}
function generateReply(text, contactName) {
  const t = text.toLowerCase().trim();
  const firstName = (contactName || "").split(" ")[0];

  const has = (...words) => words.some((w) => t.includes(w));

  if (/^(hi|hey|hello|yo|sup)\b/.test(t)) return `Hey! What's up?`;
  if (has("thank", "thanks", "thx", "appreciate"))
    return `Anytime! Happy to help 🙌`;
  if (has("bye", "goodnight", "see you", "later"))
    return `Take care! Talk soon 👋`;

  if (t.includes("?")) {
    if (has("how are you", "how you dey", "how far"))
      return `I'm good, just grinding on some code 😅 you?`;
    if (has("when", "what time", "schedule"))
      return `Let me check and get back to you shortly.`;
    if (has("can you", "could you", "would you"))
      return `Sure, I can do that — give me a bit.`;
    if (has("why")) return `Good question, let me think about that.`;
    return `Good question — let me get back to you on that.`;
  }

  if (has("http://", "https://", "www.")) return `Nice, opening that now.`;
  if (has("code", "bug", "error", "fix", "deploy", "push", "repo", "github"))
    return `Send me the repo/snippet, I'll take a look.`;
  if (has("project", "app", "build", "ui", "design", "feature"))
    return `Looking forward to seeing how it turns out 🔥`;
  if (has("meeting", "call", "zoom", "workshop"))
    return `Sounds good, count me in.`;
  if (has("congrats", "congratulations", "nice one", "well done"))
    return `Thank you so much! 🙏`;
  if (has("sorry", "my bad", "apolog")) return `No worries at all!`;
  if (has("lol", "lmao", "😂", "🤣")) return `Lmaooo 😂`;

  if (t.length < 12) return `Got it 👍`;
  if (t.length > 140)
    return `That's a lot to take in — let me read through properly and reply.`;

  const fallback = [
    "That's great!",
    "Sounds good 👍",
    "Nice work! 🚀",
    "I'll check it out",
    "Great idea!",
    `Makes sense${firstName ? ", " + firstName : ""}.`,
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

async function fetchAiReply(c) {
  const minDelay = new Promise((resolve) =>
    setTimeout(resolve, 700 + Math.random() * 700),
  );
  let reply = null;
  try {
    const history = c.messages
      .slice(-14)
      .map((m) => ({ from: m.from, text: m.text }));
    const response = await fetch("/api/chat-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: { name: c.name, role: c.role },
        history,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.reply) reply = data.reply;
  } catch (_) {
    reply = null;
  }
  await minDelay;
  if (!reply)
    reply = generateReply(c.messages[c.messages.length - 1].text, c.name);
  return reply;
}

function sendMessage() {
  if (!activeContactId) return;
  const ta = document.getElementById("chatTextarea");
  const text = ta.value.trim();
  if (!text) return;
  const c = contacts.find((x) => x.id === activeContactId);
  const now = new Date();
  const time =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");
  c.messages.push({ from: "me", text, time });
  ta.value = "";
  ta.style.height = "auto";
  renderMessages(c);
  renderChatList();
  clearTimeout(typingTimer);
  const box = document.getElementById("chatMessages");
  const typingEl = document.createElement("div");
  typingEl.className = "typing-indicator";
  typingEl.id = "typingIndicator";
  typingEl.innerHTML = `<div class="msg-av" style="background:${c.color}">${c.initials}</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
  box.appendChild(typingEl);
  box.scrollTop = box.scrollHeight;

  return fetchAiReply(c).then((reply) => {
    const el = document.getElementById("typingIndicator");
    if (el) el.remove();
    const rt = new Date();
    const t =
      rt.getHours().toString().padStart(2, "0") +
      ":" +
      rt.getMinutes().toString().padStart(2, "0");
    c.messages.push({ from: "them", text: reply, time: t });
    renderMessages(c);
    renderChatList();
  });
}
document.getElementById("chatTextarea").addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 100) + "px";
});
document
  .getElementById("chatTextarea")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
renderChatList();
const mentors = [
  {
    id: 1,
    name: "Amaka Okonkwo",
    initials: "AO",
    color: "#7C3AED",
    role: "Software Engineer",
    company: "Flutterwave",
    rating: 4.9,
    reviews: 34,
    bio: "3 years in fintech. I help students transition from school projects to real-world development — portfolio reviews, career strategy, and interview prep.",
    skills: ["Flutter", "React", "Node.js", "Firebase"],
    available: true,
    sessions: "1hr/week",
    students: 12,
    sent: true,
  },
  {
    id: 2,
    name: "Tunde Olawale",
    initials: "TO",
    color: "#059669",
    role: "Full-Stack Developer",
    company: "Andela",
    rating: 4.8,
    reviews: 28,
    bio: "I've mentored 20+ students through their first internship. Specialise in career roadmaps, open source contribution, and remote work readiness.",
    skills: ["Python", "Django", "AWS", "PostgreSQL"],
    available: true,
    sessions: "2hrs/week",
    students: 8,
    sent: true,
  },
  {
    id: 3,
    name: "Fatima Nwosu",
    initials: "FN",
    color: "#DC2626",
    role: "Backend Engineer",
    company: "Paystack",
    rating: 4.7,
    reviews: 19,
    bio: "Backend systems, API design, and database optimisation. Happy to review your Spring Boot or Node projects and give honest technical feedback.",
    skills: ["Java", "Spring Boot", "SQL", "Microservices"],
    available: false,
    sessions: "1hr/week",
    students: 6,
    sent: false,
  },
  {
    id: 4,
    name: "Chidi Dike",
    initials: "CD",
    color: "#0EA5E9",
    role: "DevOps Engineer",
    company: "Microsoft UK",
    rating: 5.0,
    reviews: 11,
    bio: "Working in the UK at Microsoft. I help students understand cloud infrastructure, CI/CD pipelines, and how to get DevOps roles without prior experience.",
    skills: ["Docker", "Kubernetes", "Azure", "GitHub Actions"],
    available: true,
    sessions: "1hr/2 weeks",
    students: 4,
    sent: false,
  },
  {
    id: 5,
    name: "Rashida Adeyemi",
    initials: "RA",
    color: "#F59E0B",
    role: "UI/UX Designer",
    company: "Interswitch",
    rating: 4.6,
    reviews: 22,
    bio: "Design thinking, Figma mastery, and user research. I help dev students build beautiful products and collaborate effectively with designers.",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    available: true,
    sessions: "1hr/week",
    students: 9,
    sent: false,
  },
  {
    id: 6,
    name: "James Obiora",
    initials: "JO",
    color: "#6366F1",
    role: "Mobile Developer",
    company: "Kuda Bank",
    rating: 4.8,
    reviews: 15,
    bio: "Flutter specialist at a leading Nigerian neobank. I review Flutter codebases, help with architecture decisions, and guide students on landing mobile dev roles.",
    skills: ["Flutter", "Dart", "Kotlin", "Firebase"],
    available: false,
    sessions: "1hr/week",
    students: 7,
    sent: false,
  },
];
let pendingMentorId = null;
function renderMentors() {
  const grid = document.getElementById("mentorGrid");
  grid.innerHTML = mentors
    .map(
      (m) =>
        `<div class="mentor-card"><div class="mc-top"><div class="mc-avatar" style="background:${m.color}">${m.initials}<div class="mc-badge">⭐</div></div><div class="mc-info"><div class="mc-name">${m.name}</div><div class="mc-role">${m.role}</div><div class="mc-company">${m.company}</div><div class="mc-rating">★★★★${m.rating >= 5 ? "★" : "☆"} <span>${m.rating} (${m.reviews} reviews)</span></div></div></div><div class="mc-bio">${m.bio}</div><div class="mc-skills">${m.skills.map((s) => `<span class="mc-skill">${s}</span>`).join("")}</div><div class="mc-footer"><div class="mc-meta"><div class="mc-avail"><span class="dot${m.available ? "" : " busy"}"></span>${m.available ? "Available now" : "Limited slots"}</div><div style="color:var(--gray);font-size:0.72rem;margin-top:2px">🕐 ${m.sessions} · 👥 ${m.students} students</div></div><button class="request-btn${m.sent ? " sent" : ""}" ${m.sent ? "" : 'onclick="openModal(' + m.id + ')"'} id="req-btn-${m.id}">${m.sent ? "✓ Requested" : "Request"}</button></div></div>`,
    )
    .join("");
}
function openModal(id) {
  pendingMentorId = id;
  const m = mentors.find((x) => x.id === id);
  document.getElementById("modalDesc").textContent =
    "Send a request to " +
    m.name +
    " explaining what you would like help with.";
  document.getElementById("requestModal").classList.add("open");
}
function closeModal() {
  document.getElementById("requestModal").classList.remove("open");
}
function sendRequest() {
  if (!pendingMentorId) return;
  const m = mentors.find((x) => x.id === pendingMentorId);
  m.sent = true;
  closeModal();
  renderMentors();
  const toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;bottom:2rem;right:2rem;background:#22c55e;color:#fff;padding:0.75rem 1.25rem;border-radius:10px;font-size:0.88rem;font-weight:600;z-index:300;animation:fadeIn 0.3s ease";
  toast.textContent = "✓ Mentorship request sent!";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
renderMentors();

// SHOWCASE
const projects = [
  {
    id: 1,
    emoji: "🌆",
    bg: "#1a1040",
    title: "City Guide App",
    author: "Mo Flourish",
    authorInitials: "MF",
    authorColor: "var(--orange)",
    sem: "Sem 3",
    desc: "A full-featured city guide built with Flutter and Firebase. Browse places, filter by category, and get directions.",
    tags: ["Flutter", "Firebase", "Riverpod", "GoRouter"],
    likes: 58,
    comments: 14,
    views: 312,
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    id: 2,
    emoji: "✅",
    bg: "#0d1f12",
    title: "Taskr — To-do App",
    author: "Mo Flourish",
    authorInitials: "MF",
    authorColor: "var(--orange)",
    sem: "Sem 2",
    desc: "A clean dark-themed to-do web app with localStorage, filters, inline editing and toast notifications.",
    tags: ["HTML", "CSS", "JavaScript"],
    likes: 34,
    comments: 7,
    views: 180,
    featured: false,
    github: "#",
    demo: "#",
  },
  {
    id: 3,
    emoji: "📊",
    bg: "#0d1a2e",
    title: "Naira Tracker",
    author: "Kelechi Eze",
    authorInitials: "KE",
    authorColor: "#059669",
    sem: "Sem 4",
    desc: "Personal finance tracker for Nigerian users. Track income, expenses and savings goals with charts.",
    tags: ["React", "Chart.js", "Node.js", "MongoDB"],
    likes: 71,
    comments: 19,
    views: 445,
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    id: 4,
    emoji: "🤖",
    bg: "#1a0d1a",
    title: "Spam Classifier API",
    author: "Ifeanyi Obi",
    authorInitials: "IO",
    authorColor: "#0EA5E9",
    sem: "Sem 4",
    desc: "Machine learning API that classifies SMS messages as spam or ham. Built with Python and scikit-learn.",
    tags: ["Python", "Flask", "scikit-learn", "REST API"],
    likes: 46,
    comments: 11,
    views: 267,
    featured: false,
    github: "#",
    demo: "#",
  },
  {
    id: 5,
    emoji: "🏪",
    bg: "#1a1500",
    title: "Marketplace UI",
    author: "Adaeze Sylva",
    authorInitials: "AS",
    authorColor: "#DC2626",
    sem: "Sem 3",
    desc: "E-commerce UI concept for a Nigerian marketplace app. Full product listing, cart, and checkout flow.",
    tags: ["Flutter", "Dart", "GetX"],
    likes: 39,
    comments: 8,
    views: 221,
    featured: false,
    github: "#",
    demo: "#",
  },
  {
    id: 6,
    emoji: "🎮",
    bg: "#0a0a1a",
    title: "Snake Game",
    author: "Biodun Okafor",
    authorInitials: "BO",
    authorColor: "#6366F1",
    sem: "Sem 2",
    desc: "Classic snake game recreated in JavaScript with a dark neon theme, high score tracking and speed levels.",
    tags: ["HTML", "CSS", "JavaScript", "Canvas"],
    likes: 52,
    comments: 16,
    views: 394,
    featured: false,
    github: "#",
    demo: "#",
  },
];

let likedProjects = new Set();

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = projects
    .map(
      (p) => `
    <div class="project-card">
      <div class="project-thumb" style="background:${p.bg}">
        <span>${p.emoji}</span>
        ${p.featured ? '<div class="project-badge">Featured</div>' : ""}
      </div>
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        <div class="project-author">
          <div class="pa-avatar" style="background:${p.authorColor}">${p.authorInitials}</div>
          <span class="pa-name">${p.author}</span>
          <span class="pa-sem">· ${p.sem}</span>
        </div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tags">${p.tags.map((t) => `<span class="project-tag">#${t}</span>`).join("")}</div>
        <div class="project-footer">
          <div class="project-stats">
            <span class="pstat-item">👁 ${p.views}</span>
            <span class="pstat-item">💬 ${p.comments}</span>
          </div>
          <div class="project-links">
            <button class="plink-btn like-btn ${likedProjects.has(p.id) ? "liked" : ""}" onclick="toggleLike(${p.id},this)">
              ${likedProjects.has(p.id) ? "❤" : "🤍"} ${p.likes + (likedProjects.has(p.id) ? 1 : 0)}
            </button>
            <a class="plink-btn" href="${p.github}" target="_blank">⌥ Code</a>
            ${p.demo ? `<a class="plink-btn" href="${p.demo}" target="_blank">↗ Demo</a>` : ""}
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function toggleLike(id, btn) {
  if (likedProjects.has(id)) {
    likedProjects.delete(id);
  } else {
    likedProjects.add(id);
  }
  renderProjects();
}

function openSubmitModal() {
  document.getElementById("submitModal").classList.add("open");
}
function closeSubmitModal() {
  document.getElementById("submitModal").classList.remove("open");
}
function submitProject() {
  closeSubmitModal();
  const toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;bottom:2rem;right:2rem;background:#22c55e;color:#fff;padding:0.75rem 1.25rem;border-radius:10px;font-size:0.88rem;font-weight:600;z-index:300;animation:fadeIn 0.3s ease";
  toast.textContent = "🚀 Project submitted for review!";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.querySelectorAll(".sc-filter").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".sc-filter")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
  }),
);

renderProjects();

// NOTIFICATIONS
const notifications = [
  {
    id: 1,
    type: "like",
    icon: "AO",
    color: "#7C3AED",
    text: "<strong>Amaka Okonkwo</strong> liked your project <strong>City Guide App</strong>",
    time: "2 min ago",
    emoji: "\u2764",
    unread: true,
    category: "all",
  },
  {
    id: 2,
    type: "comment",
    icon: "KE",
    color: "#059669",
    text: '<strong>Kelechi Eze</strong> commented: "This is super helpful, thanks Mo!"',
    time: "14 min ago",
    emoji: "\u{1F4AC}",
    unread: true,
    category: "mentions",
  },
  {
    id: 3,
    type: "connect",
    icon: "FN",
    color: "#DC2626",
    text: "<strong>Fatima Nwosu</strong> accepted your connection request",
    time: "1 hr ago",
    emoji: "\u{1F91D}",
    unread: true,
    category: "all",
  },
  {
    id: 4,
    type: "mentor",
    icon: "TO",
    color: "#059669",
    text: "<strong>Tunde Olawale</strong> confirmed your mentorship session for Saturday at 2pm",
    time: "3 hrs ago",
    emoji: "\u{1F4C5}",
    unread: true,
    category: "all",
  },
  {
    id: 5,
    type: "job",
    icon: "\u{1F4BC}",
    color: "#FF6B00",
    text: "New job posted: <strong>Junior Flutter Developer</strong> at Kuda Bank matches your profile",
    time: "5 hrs ago",
    emoji: "\u{1F4BC}",
    unread: false,
    category: "all",
  },
  {
    id: 6,
    type: "mention",
    icon: "IO",
    color: "#0EA5E9",
    text: '<strong>Ifeanyi Obi</strong> mentioned you: "@Mo Flourish check this out!"',
    time: "Yesterday",
    emoji: "\u{1F4E3}",
    unread: false,
    category: "mentions",
  },
  {
    id: 7,
    type: "like",
    icon: "RA",
    color: "#F59E0B",
    text: "<strong>Rashida Adeyemi</strong> liked your comment on the workshop post",
    time: "Yesterday",
    emoji: "\u2764",
    unread: false,
    category: "all",
  },
  {
    id: 8,
    type: "system",
    icon: "\u{1F393}",
    color: "#FF6B00",
    text: "Your profile is 80% complete. Add your bio to reach more connections!",
    time: "2 days ago",
    emoji: "\u{1F393}",
    unread: false,
    category: "all",
  },
];

let currentNotifFilter = "all";
let currentNotifPageFilter = "all";

function notifItemHTML(n) {
  return `
      <div class="notif-item ${n.unread ? "unread" : ""}" onclick="markRead(${n.id})">
        <div class="ni-icon" style="background:${n.color}">${n.icon.length <= 3 ? n.icon : n.emoji}</div>
        <div class="ni-body">
          <div class="ni-text">${n.text}</div>
          <div class="ni-time">${n.time}</div>
        </div>
      </div>
    `;
}

function renderNotifications() {
  const list = document.getElementById("notifList");
  if (list) {
    const filtered =
      currentNotifFilter === "unread"
        ? notifications.filter((n) => n.unread)
        : currentNotifFilter === "mentions"
          ? notifications.filter((n) => n.category === "mentions")
          : notifications;

    list.innerHTML =
      filtered.length === 0
        ? '<div class="notif-empty">No notifications here</div>'
        : filtered.map(notifItemHTML).join("");
  }

  const unread = notifications.filter((n) => n.unread).length;
  const badge = document.getElementById("notifCount");
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? "block" : "none";
  }

  renderNotifPage();
}

function renderNotifPage() {
  const list = document.getElementById("notifPageList");
  if (!list) return;
  const filtered =
    currentNotifPageFilter === "unread"
      ? notifications.filter((n) => n.unread)
      : currentNotifPageFilter === "mentions"
        ? notifications.filter((n) => n.category === "mentions")
        : notifications;

  list.innerHTML =
    filtered.length === 0
      ? '<div class="notif-empty">No notifications here</div>'
      : filtered.map(notifItemHTML).join("");
}

function toggleNotif(e) {
  e.stopPropagation();
  const dd = document.getElementById("notifDropdown");
  dd.classList.toggle("open");
  renderNotifications();
}

function markRead(id) {
  const n = notifications.find((x) => x.id === id);
  if (n) {
    n.unread = false;
    renderNotifications();
  }
}

function markAllRead() {
  notifications.forEach((n) => (n.unread = false));
  renderNotifications();
}

function filterNotif(filter, btn) {
  currentNotifFilter = filter;
  document
    .querySelectorAll("#notifDropdown .notif-tab")
    .forEach((t) => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderNotifications();
}

function filterNotifPage(filter, btn) {
  currentNotifPageFilter = filter;
  document
    .querySelectorAll("#page-notifications .notif-tab")
    .forEach((t) => t.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderNotifPage();
}

document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("notifDropdown");
  const bell = document.getElementById("notifBell");
  if (dropdown && !dropdown.contains(e.target) && !bell.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

renderNotifications();

// THEME TOGGLE
function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  document.getElementById("themeBtn").textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("aptverse-theme", isLight ? "light" : "dark");
}
// Restore saved theme
(function () {
  const saved = localStorage.getItem("aptverse-theme");
  if (saved === "light") {
    document.body.classList.add("light");
    const btn = document.getElementById("themeBtn");
    if (btn) btn.textContent = "☀️";
  }
})();

// MOBILE NAV
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const btn = document.getElementById("hamburger");
  nav.classList.toggle("mobile-open");
  if (btn) btn.classList.toggle("open");
}

// Close menu when a nav button is clicked on mobile
document.querySelectorAll(".nav-btn").forEach((b) => {
  b.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("mobile-open");
    const hamburger = document.getElementById("hamburger");
    if (hamburger) hamburger.classList.remove("open");
  });
});

// MOBILE CHAT - open chat main panel on mobile
const _origOpenChat = openChat;
openChat = function (id) {
  _origOpenChat(id);
  if (window.innerWidth <= 768) {
    document.getElementById("chatMain").classList.add("mobile-open");
  }
};

function closeMobileChat() {
  document.getElementById("chatMain").classList.remove("mobile-open");
  activeContactId = null;
  renderChatList();
}

// Close nav on outside click (mobile)
document.addEventListener("click", (e) => {
  const nav = document.getElementById("navLinks");
  const ham = document.getElementById("hamburger");
  if (
    nav.classList.contains("mobile-open") &&
    !nav.contains(e.target) &&
    (!ham || !ham.contains(e.target))
  ) {
    nav.classList.remove("mobile-open");
    if (ham) ham.classList.remove("open");
  }
});

// SETTINGS
function showSettingsPanel(name, btn) {
  document
    .querySelectorAll(".settings-panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".settings-nav-item")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("spanel-" + name).classList.add("active");
  if (btn) btn.classList.add("active");
}

function toggleThemeFromSettings(checkbox) {
  const isLight = checkbox.checked;
  document.body.classList.toggle("light", isLight);
  document.getElementById("themeBtn").textContent = isLight
    ? "\u2600\uFE0F"
    : "\u{1F319}";
  localStorage.setItem("aptverse-theme", isLight ? "light" : "dark");
}

function setAccent(color, light, swatch) {
  document.documentElement.style.setProperty("--orange", color);
  document.documentElement.style.setProperty("--orange-light", light);
  document
    .querySelectorAll(".color-swatch")
    .forEach((s) => s.classList.remove("selected"));
  swatch.classList.add("selected");
  showToast("Accent color updated!");
}

function confirmDelete() {
  if (confirm("Are you sure? This cannot be undone.")) {
    showToast("Account scheduled for deletion");
  }
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.style.cssText =
    "position:fixed;bottom:2rem;right:2rem;background:#22c55e;color:#fff;padding:0.75rem 1.25rem;border-radius:10px;font-size:0.88rem;font-weight:600;z-index:9999;animation:fadeIn 0.3s ease";
  toast.textContent = "\u2713 " + msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Sync dark mode toggle in settings with current theme
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  if (toggle) toggle.checked = document.body.classList.contains("light");
});

// GLOBAL SEARCH DATA
const searchData = [
  // People
  {
    type: "people",
    title: "Mo Flourish",
    sub: "Software Engineering Student · Sem 3",
    icon: "MF",
    color: "var(--orange)",
    badge: "Student",
    page: "profile",
    navIdx: 2,
  },
  {
    type: "people",
    title: "Amaka Okonkwo",
    sub: "Software Engineer · Flutterwave",
    icon: "AO",
    color: "#7C3AED",
    badge: "Alumni",
    page: "alumni",
    navIdx: 3,
  },
  {
    type: "people",
    title: "Tunde Olawale",
    sub: "Full-Stack Developer · Andela",
    icon: "TO",
    color: "#059669",
    badge: "Alumni",
    page: "alumni",
    navIdx: 3,
  },
  {
    type: "people",
    title: "Fatima Nwosu",
    sub: "Backend Engineer · Paystack",
    icon: "FN",
    color: "#DC2626",
    badge: "Alumni",
    page: "alumni",
    navIdx: 3,
  },
  {
    type: "people",
    title: "Chidi Dike",
    sub: "DevOps Engineer · Microsoft UK",
    icon: "CD",
    color: "#0EA5E9",
    badge: "Alumni",
    page: "alumni",
    navIdx: 3,
  },
  {
    type: "people",
    title: "Rashida Adeyemi",
    sub: "UI/UX Designer · Interswitch",
    icon: "RA",
    color: "#F59E0B",
    badge: "Alumni",
    page: "alumni",
    navIdx: 3,
  },
  {
    type: "people",
    title: "Kelechi Eze",
    sub: "Student · Semester 4",
    icon: "KE",
    color: "#0EA5E9",
    badge: "Student",
    page: "feed",
    navIdx: 1,
  },
  // Projects
  {
    type: "projects",
    title: "City Guide App",
    sub: "Flutter · Firebase · Riverpod",
    icon: "🌆",
    color: "#1a1040",
    badge: "Project",
    page: "showcase",
    navIdx: 7,
    square: true,
  },
  {
    type: "projects",
    title: "Taskr — To-do App",
    sub: "HTML · CSS · JavaScript",
    icon: "✅",
    color: "#0d1f12",
    badge: "Project",
    page: "showcase",
    navIdx: 7,
    square: true,
  },
  {
    type: "projects",
    title: "Naira Tracker",
    sub: "React · Chart.js · Node.js",
    icon: "📊",
    color: "#0d1a2e",
    badge: "Project",
    page: "showcase",
    navIdx: 7,
    square: true,
  },
  {
    type: "projects",
    title: "Spam Classifier API",
    sub: "Python · Flask · scikit-learn",
    icon: "🤖",
    color: "#1a0d1a",
    badge: "Project",
    page: "showcase",
    navIdx: 7,
    square: true,
  },
  {
    type: "projects",
    title: "Snake Game",
    sub: "HTML · Canvas · JavaScript",
    icon: "🎮",
    color: "#0a0a1a",
    badge: "Project",
    page: "showcase",
    navIdx: 7,
    square: true,
  },
  // Jobs
  {
    type: "jobs",
    title: "Junior Flutter Developer",
    sub: "Kuda Bank · ₦180k/mo · Lagos",
    icon: "🏦",
    color: "#1a1040",
    badge: "Job",
    page: "jobs",
    navIdx: 4,
    square: true,
  },
  {
    type: "jobs",
    title: "Frontend Engineer Intern",
    sub: "Flutterwave · ₦120k/mo · Remote",
    icon: "💸",
    color: "#0d1f12",
    badge: "Job",
    page: "jobs",
    navIdx: 4,
    square: true,
  },
  {
    type: "jobs",
    title: "Backend Developer (Java)",
    sub: "Paystack · ₦250k/mo · Lagos",
    icon: "💳",
    color: "#1a0d1a",
    badge: "Job",
    page: "jobs",
    navIdx: 4,
    square: true,
  },
  {
    type: "jobs",
    title: "Mobile Developer Intern",
    sub: "PiggyVest · ₦100k/mo · Lagos",
    icon: "📱",
    color: "#0a0a1a",
    badge: "Job",
    page: "jobs",
    navIdx: 4,
    square: true,
  },
  // Posts
  {
    type: "posts",
    title: "Breaking into fintech",
    sub: "Amaka Okonkwo shared career advice for Semester 3+ students",
    icon: "AO",
    color: "#7C3AED",
    badge: "Post",
    page: "feed",
    navIdx: 1,
  },
  {
    type: "posts",
    title: "City Guide Flutter app",
    sub: "Kelechi Eze shared a Firebase and Riverpod project update",
    icon: "KE",
    color: "#059669",
    badge: "Post",
    page: "feed",
    navIdx: 1,
  },
  // Mentors
  {
    type: "mentors",
    title: "Amaka Okonkwo",
    sub: "Flutter · React · Mentor at Flutterwave",
    icon: "AO",
    color: "#7C3AED",
    badge: "Mentor",
    page: "mentorship",
    navIdx: 6,
  },
  {
    type: "mentors",
    title: "Tunde Olawale",
    sub: "Python · Django · Mentor at Andela",
    icon: "TO",
    color: "#059669",
    badge: "Mentor",
    page: "mentorship",
    navIdx: 6,
  },
  {
    type: "mentors",
    title: "Chidi Dike",
    sub: "Docker · Azure · Mentor at Microsoft",
    icon: "CD",
    color: "#0EA5E9",
    badge: "Mentor",
    page: "mentorship",
    navIdx: 6,
  },
];

let currentSearchTab = "all";
let selectedIndex = -1;

function openSearch() {
  document.getElementById("searchOverlay").classList.add("open");
  setTimeout(() => document.getElementById("globalSearchInput").focus(), 50);
  showDefaultResults();
}

function closeSearch() {
  document.getElementById("searchOverlay").classList.remove("open");
  document.getElementById("globalSearchInput").value = "";
  selectedIndex = -1;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById("searchOverlay")) closeSearch();
}

function setSearchTab(tab, btn) {
  currentSearchTab = tab;
  document
    .querySelectorAll(".search-tab")
    .forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  runSearch(document.getElementById("globalSearchInput").value);
}

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(
    "(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
    "gi",
  );
  return text.replace(re, '<span class="sr-highlight">$1</span>');
}

function runSearch(query) {
  const results = document.getElementById("searchResults");
  const countEl = document.getElementById("searchCount");
  query = query.trim();

  if (!query) {
    showDefaultResults();
    countEl.textContent = "";
    return;
  }

  const q = query.toLowerCase();
  let filtered = searchData.filter((item) => {
    const matchesTab =
      currentSearchTab === "all" || item.type === currentSearchTab;
    const matchesQuery =
      item.title.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  countEl.textContent =
    filtered.length + " result" + (filtered.length !== 1 ? "s" : "");

  if (filtered.length === 0) {
    results.innerHTML = `<div class="search-empty"><div class="search-empty-icon">🔍</div><p>No results for "<strong>${query}</strong>"</p></div>`;
    return;
  }

  // Group by type
  const groups = {};
  filtered.forEach((item) => {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  });

  const typeLabels = {
    people: "People",
    projects: "Projects",
    jobs: "Jobs",
    mentors: "Mentors",
    posts: "Posts",
  };
  let html = "";
  Object.entries(groups).forEach(([type, items]) => {
    if (currentSearchTab === "all")
      html += `<div class="search-section-label">${typeLabels[type]}</div>`;
    items.forEach((item) => {
      html += `<div class="search-result-item" onclick="goToResult(${JSON.stringify(item).replace(/"/g, "&quot;")})">
        <div class="sr-icon ${item.square ? "square" : ""}" style="background:${item.color}">${item.icon}</div>
        <div class="sr-body">
          <div class="sr-title">${highlight(item.title, query)}</div>
          <div class="sr-sub">${highlight(item.sub, query)}</div>
        </div>
        <span class="sr-badge">${item.badge}</span>
      </div>`;
    });
  });

  results.innerHTML = html;
}

function goToResult(item) {
  closeSearch();
  const navBtns = document.querySelectorAll(".nav-btn");
  showPage(item.page, navBtns[item.navIdx] || null);
}

function showDefaultResults() {
  document.getElementById("searchResults").innerHTML = `
    <div class="search-section-label">Suggested</div>
    <div class="search-result-item" onclick="closeSearch();showPage('alumni',document.querySelectorAll('.nav-btn')[3])">
      <div class="sr-icon" style="background:#7C3AED">AO</div>
      <div class="sr-body"><div class="sr-title">Amaka Okonkwo</div><div class="sr-sub">Software Engineer · Flutterwave</div></div>
      <span class="sr-badge">Alumni</span>
    </div>
    <div class="search-result-item" onclick="closeSearch();showPage('jobs',document.querySelectorAll('.nav-btn')[4])">
      <div class="sr-icon square" style="background:#1a1040">🏦</div>
      <div class="sr-body"><div class="sr-title">Junior Flutter Developer</div><div class="sr-sub">Kuda Bank · ₦180k/mo</div></div>
      <span class="sr-badge">Job</span>
    </div>
    <div class="search-result-item" onclick="closeSearch();showPage('showcase',document.querySelectorAll('.nav-btn')[7])">
      <div class="sr-icon square" style="background:#1a1040">🌆</div>
      <div class="sr-body"><div class="sr-title">City Guide App</div><div class="sr-sub">by Mo Flourish · Flutter, Firebase</div></div>
      <span class="sr-badge">Project</span>
    </div>
    <div class="search-result-item" onclick="closeSearch();showPage('mentorship',document.querySelectorAll('.nav-btn')[6])">
      <div class="sr-icon" style="background:#059669">TO</div>
      <div class="sr-body"><div class="sr-title">Tunde Olawale</div><div class="sr-sub">Full-Stack Mentor · Andela</div></div>
      <span class="sr-badge">Mentor</span>
    </div>
  `;
}

// Keyboard shortcut Ctrl+K
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
  if (e.key === "Escape") closeSearch();
});

// SPLASH SCREEN
const SPLASH_HTML = `<canvas class="splash-canvas" id="splashCanvas" aria-hidden="true"></canvas>
  <div class="splash-frame splash-frame-one" aria-hidden="true"></div>
  <div class="splash-frame splash-frame-two" aria-hidden="true"></div>
  <div class="splash-content">
    <div class="splash-kicker"><span></span> APTECH STUDENT NETWORK</div>
    <div class="splash-logo">APT<span>verse</span></div>
    <div class="splash-tagline">All of Aptech, in one universe</div>
    <div class="splash-bar-wrap" aria-label="Loading APTverse">
      <div class="splash-bar" id="splashBar"></div>
    </div>
    <div class="splash-loading-row"><span class="splash-status" id="splashStatus">Preparing your network</span><span class="splash-percent" id="splashPercent">0%</span></div>
  </div>
  <div class="splash-footer">STUDENTS · ALUMNI · OPPORTUNITY</div>`;

function runSplash(onDone) {
  let splash = document.getElementById("splash");
  if (!splash) {
    splash = document.createElement("div");
    splash.id = "splash";
    document.body.insertBefore(splash, document.body.firstChild);
  }
  splash.classList.remove("fade-out");
  splash.innerHTML = SPLASH_HTML;

  const bar = document.getElementById("splashBar");
  const pct = document.getElementById("splashPercent");
  const status = document.getElementById("splashStatus");
  const splashCanvas = document.getElementById("splashCanvas");
  const splashContext = splashCanvas.getContext("2d");
  let splashNodes = [];
  let splashAnimation;
  const resizeSplash = () => {
    splashCanvas.width = splashCanvas.offsetWidth;
    splashCanvas.height = splashCanvas.offsetHeight;
    splashNodes = Array.from({ length: 26 }, () => ({
      x: Math.random() * splashCanvas.width,
      y: Math.random() * splashCanvas.height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.8 + 1,
    }));
  };
  const drawSplashNetwork = () => {
    splashContext.clearRect(0, 0, splashCanvas.width, splashCanvas.height);
    splashNodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > splashCanvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > splashCanvas.height) node.vy *= -1;
    });
    for (let i = 0; i < splashNodes.length; i++)
      for (let j = i + 1; j < splashNodes.length; j++) {
        const dx = splashNodes[i].x - splashNodes[j].x,
          dy = splashNodes[i].y - splashNodes[j].y,
          distance = Math.hypot(dx, dy);
        if (distance < 185) {
          splashContext.beginPath();
          splashContext.moveTo(splashNodes[i].x, splashNodes[i].y);
          splashContext.lineTo(splashNodes[j].x, splashNodes[j].y);
          splashContext.strokeStyle = `rgba(255, 107, 0, ${(1 - distance / 185) * 0.7})`;
          splashContext.lineWidth = 1;
          splashContext.stroke();
        }
      }
    splashNodes.forEach((node) => {
      splashContext.beginPath();
      splashContext.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      splashContext.fillStyle = "#FF8C33";
      splashContext.fill();
    });
    splashAnimation = requestAnimationFrame(drawSplashNetwork);
  };
  resizeSplash();
  drawSplashNetwork();
  const onResize = () => resizeSplash();
  window.addEventListener("resize", onResize, { once: true });
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 500
    : 2900;
  const startedAt = performance.now();
  const stages = [
    "Preparing your network",
    "Connecting students and alumni",
    "Loading opportunities",
    "Ready to grow",
  ];
  const update = (now) => {
    const raw = Math.min((now - startedAt) / duration, 1);
    const progress = 1 - Math.pow(1 - raw, 2.3);
    const percent = Math.round(progress * 100);
    bar.style.width = `${percent}%`;
    pct.textContent = `${percent}%`;
    const nextStatus =
      stages[Math.min(stages.length - 1, Math.floor(raw * stages.length))];
    if (status.textContent !== nextStatus) status.textContent = nextStatus;
    if (raw < 1) {
      requestAnimationFrame(update);
      return;
    }
    setTimeout(() => {
      splash.classList.add("fade-out");
      setTimeout(() => {
        cancelAnimationFrame(splashAnimation);
        splash.remove();
        if (typeof onDone === "function") onDone();
      }, 650);
    }, 420);
  };
  requestAnimationFrame(update);
}

runSplash();

// FOOTER — hide on pages that are full-height (chat)
const _origShowPage = showPage;
showPage = function (name, btn) {
  _origShowPage(name, btn);
  const footer = document.getElementById("mainFooter");
  if (footer) footer.style.display = name === "chat" ? "none" : "";
};

// SCROLL TO TOP
window.addEventListener("scroll", () => {
  const btn = document.getElementById("scrollTopBtn");
  if (btn) btn.classList.toggle("visible", window.scrollY > 300);
});

// EVENTS
const eventsData = [
  {
    id: 1,
    day: "10",
    month: "JUL",
    type: "hackathon",
    badgeClass: "badge-hackathon",
    title: "APTverse Build Challenge 2026",
    location: "Aptech Lagos · In-Person",
    time: "9:00 AM – 6:00 PM",
    mode: "In-Person",
    desc: "24-hour hackathon for Aptech students. Build a real-world solution using any stack. Top 3 teams win cash prizes and internship referrals from alumni sponsors.",
    prize: "₦250,000 prize pool",
    attendees: ["#FF6B00", "#7C3AED", "#059669", "#0EA5E9"],
    count: 87,
    registered: true,
  },
  {
    id: 2,
    day: "13",
    month: "JUL",
    type: "workshop",
    badgeClass: "badge-workshop",
    title: "Flutter Advanced Workshop: State Management Deep Dive",
    location: "Virtual · Zoom",
    time: "2:00 PM – 5:00 PM",
    mode: "Virtual",
    desc: "Hands-on session covering Riverpod, BLoC, and Provider. Bring your laptop and follow along with live code. Hosted by James Obiora from Kuda Bank.",
    prize: null,
    attendees: ["#DC2626", "#F59E0B", "#6366F1"],
    count: 54,
    registered: false,
  },
  {
    id: 3,
    day: "17",
    month: "JUL",
    type: "webinar",
    badgeClass: "badge-webinar",
    title: "Breaking into Tech: From Aptech to Your First Job",
    location: "Virtual · Google Meet",
    time: "6:00 PM – 7:30 PM",
    mode: "Virtual",
    desc: "Panel of 4 Aptech alumni share their journeys, what worked, what didn't, and how to stand out as a fresh grad in Nigeria's tech market.",
    prize: null,
    attendees: ["#7C3AED", "#059669", "#DC2626"],
    count: 120,
    registered: false,
  },
  {
    id: 4,
    day: "23",
    month: "JUL",
    type: "career",
    badgeClass: "badge-career",
    title: "Tech Career Fair Lagos 2026",
    location: "Landmark Event Centre · VI, Lagos",
    time: "10:00 AM – 4:00 PM",
    mode: "In-Person",
    desc: "Meet recruiters from Flutterwave, Paystack, Kuda, Andela, and 10+ more companies. Bring printed CVs. Dress professionally. Free entry for Aptech students.",
    prize: null,
    attendees: ["#FF6B00", "#0EA5E9", "#F59E0B", "#6366F1"],
    count: 210,
    registered: true,
  },
  {
    id: 5,
    day: "26",
    month: "JUL",
    type: "workshop",
    badgeClass: "badge-workshop",
    title: "Java Spring Boot for Beginners",
    location: "Virtual · Zoom",
    time: "3:00 PM – 5:00 PM",
    mode: "Virtual",
    desc: "Step-by-step Spring Boot project from scratch. REST APIs, JPA, and connecting to a real database. Great for Semester 3+ students.",
    prize: null,
    attendees: ["#DC2626", "#7C3AED"],
    count: 38,
    registered: false,
  },
];

function renderEvents() {
  const list = document.getElementById("eventsList");
  if (!list) return;
  list.innerHTML = eventsData
    .map(
      (ev) => `
    <div class="event-card">
      <div class="event-card-top">
        <div class="event-date-block">
          <div class="ev-day">${ev.day}</div>
          <div class="ev-month">${ev.month}</div>
        </div>
        <div class="event-main">
          <div class="event-type-badge ${ev.badgeClass}">${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</div>
          <div class="event-title">${ev.title}</div>
          <div class="event-meta">
            <span class="ev-meta-item">📍 ${ev.location}</span>
            <span class="ev-meta-item">🕐 ${ev.time}</span>
            <span class="ev-meta-item">${ev.mode === "Virtual" ? "💻" : "🏢"} ${ev.mode}</span>
          </div>
          <div class="event-desc">${ev.desc}</div>
          <div class="event-footer">
            <div class="ev-attendees">
              <div class="ev-av-stack">
                ${ev.attendees.map((c) => `<div class="ev-av" style="background:${c}">★</div>`).join("")}
              </div>
              <span class="ev-count">${ev.count} registered</span>
              ${ev.prize ? `<span class="ev-prize">🏆 ${ev.prize}</span>` : ""}
            </div>
            <button class="register-btn ${ev.registered ? "registered" : ""}" onclick="toggleRegister(${ev.id},this)">
              ${ev.registered ? "✓ Registered" : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function toggleRegister(id, btn) {
  const ev = eventsData.find((e) => e.id === id);
  if (!ev || ev.registered) return;
  ev.registered = true;
  ev.count++;
  renderEvents();
  showToast("Registered for " + ev.title.split(":")[0] + "!");
}

document.querySelectorAll(".ev-filter").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".ev-filter")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
  }),
);

renderEvents();

// MORE DROPDOWN
function toggleMore(e) {
  e.stopPropagation();
  document.getElementById("moreDropdown").classList.toggle("open");
}
function closeMore() {
  document.getElementById("moreDropdown").classList.remove("open");
}
document.addEventListener("click", (e) => {
  const dd = document.getElementById("moreDropdown");
  if (dd && !dd.closest(".more-wrap").contains(e.target)) closeMore();
});

// CLEAN MOBILE NAV
function toggleMobileMenu() {
  const nav = document.getElementById("navLinks");
  const btn = document.getElementById("hamburgerMobile");
  nav.classList.toggle("mobile-open");
  btn.classList.toggle("open");
}

// Close mobile nav when a page is selected
const _origShowPageMobile = showPage;
showPage = function (name, btn) {
  _origShowPageMobile(name, btn);
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  const nav = document.getElementById("navLinks");
  const ham = document.getElementById("hamburgerMobile");
  if (nav) nav.classList.remove("mobile-open");
  if (ham) ham.classList.remove("open");
};

// Remember the current page across refreshes
const _origShowPagePersist = showPage;
showPage = function (name, btn) {
  _origShowPagePersist(name, btn);
  try {
    const key = "aptverse-app-state-v1";
    const state = JSON.parse(localStorage.getItem(key)) || {};
    state.currentPage = name;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (_) {}
};

// Close mobile nav on outside click
document.addEventListener("click", (e) => {
  const nav = document.getElementById("navLinks");
  const ham = document.getElementById("hamburgerMobile");
  if (
    nav &&
    ham &&
    nav.classList.contains("mobile-open") &&
    !nav.contains(e.target) &&
    !ham.contains(e.target)
  ) {
    nav.classList.remove("mobile-open");
    ham.classList.remove("open");
  }
});

// App interactions for the standalone prototype.
function closeSearchOnBg(event) {
  if (event.target.classList.contains("search-overlay")) closeSearch();
}

function updateButtonState(button, label) {
  button.textContent = label;
  button.disabled = true;
  button.classList.add("sent", "registered");
}

function filterCards(cards, predicate) {
  cards.forEach((card) => {
    card.style.display = predicate(card) ? "" : "none";
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("btn-post")) {
    const composer = document.querySelector(".composer-input");
    const content = composer.value.trim();
    if (!content) {
      showToast("Write something before posting");
      composer.focus();
      return;
    }
    const post = document.createElement("div");
    post.className = "feed-post";
    post.innerHTML = `<div class="post-header"><div class="avatar">MF</div><div class="post-meta"><div class="post-name">Mo Flourish <span class="post-badge">Student</span></div><div class="post-info">Just now</div></div></div><div class="post-text"></div><div class="post-actions"><button class="post-action">Like · 0</button><button class="post-action">Comment · 0</button><button class="post-action">Share</button><button class="post-action post-msg-btn">Message</button></div>`;
    post.querySelector(".post-text").textContent = content;
    document
      .querySelector(".feed-layout > div")
      .insertBefore(post, document.querySelector(".feed-post"));
    window.userPosts = window.userPosts || [];
    window.userPosts.unshift({ content, createdAt: "Just now" });
    composer.value = "";
    saveAppState?.();
    showToast("Post shared with the community");
  }

  if (button.classList.contains("post-action")) {
    const text = button.textContent.trim();
    if (text.startsWith("Like")) {
      const count = Number((text.match(/\d+/) || [0])[0]);
      const liked = button.classList.toggle("liked");
      button.textContent = `Like · ${count + (liked ? 1 : -1)}`;
    } else if (text.startsWith("Comment")) {
      const composer = document.querySelector(".composer-input");
      composer.focus();
      composer.placeholder = "Write a comment...";
      showToast("Comment box ready");
    } else if (text.startsWith("Share")) {
      showToast("Post link copied to your clipboard");
    }
  }

  if (button.classList.contains("post-msg-btn")) {
    const postEl = button.closest(".feed-post");
    const nameEl = postEl?.querySelector(".post-name");
    const name = nameEl ? nameEl.childNodes[0].textContent.trim() : "";
    const contact = contacts.find(
      (item) =>
        name && (item.name === name || name.includes(item.name.split(" ")[0])),
    );
    if (window.aptverseProfile && name === window.aptverseProfile.displayName) {
      showToast("That's your own post!");
    } else if (contact) {
      showPage("chat", document.querySelectorAll(".nav-btn")[5]);
      openChat(contact.id);
    } else {
      showToast(`Starting a new conversation with ${name || "this user"}`);
      showPage("chat", document.querySelectorAll(".nav-btn")[5]);
      openChat(contacts[0].id);
    }
  }

  if (button.matches(".connect-btn, .a-connect")) {
    if (!button.disabled) {
      updateButtonState(button, "Requested");
      showToast("Connection request sent");
    }
  }

  if (button.classList.contains("apply-btn")) {
    const title = button
      .closest(".job-card")
      .querySelector(".job-title").textContent;
    if (!button.disabled) {
      updateButtonState(button, "Applied");
      showToast(`Application started for ${title}`);
    }
  }

  if (button.classList.contains("post-job-btn"))
    showToast("Role submission form is ready for the next release");
  if (
    button.classList.contains("btn-primary") &&
    button.textContent.includes("Edit Profile")
  ) {
    showPage("settings", null);
    showSettingsPanel("profile", document.querySelector(".settings-nav-item"));
    showToast("Edit your profile details below");
  }
  if (button.classList.contains("new-chat-btn")) {
    openChat(contacts[0].id);
    showToast("Started a new conversation with Amaka");
  }
  if (button.classList.contains("attach-btn"))
    showToast("Attachments are ready to add in the connected app");
  if (
    button.classList.contains("ct-action-btn") &&
    !button.hasAttribute("onclick")
  )
    showToast("Profile details are available from the alumni directory");
  if (button.classList.contains("mc-nav")) {
    const month = button.closest(".mc-header").querySelector(".mc-month");
    const next = button.textContent.includes("›");
    month.textContent = next ? "August 2026" : "June 2026";
    button
      .closest(".ev-calendar-card")
      .querySelector(".ev-calendar-title").textContent = next
      ? "August 2026"
      : "June 2026";
  }
  if (button.classList.contains("social-btn"))
    showToast(`${button.textContent.trim()} sign-in is ready to connect`);
});

document.querySelector(".search-input")?.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  filterCards([...document.querySelectorAll(".alumni-card")], (card) =>
    card.textContent.toLowerCase().includes(query),
  );
});

document.querySelectorAll(".filter-btn").forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.textContent.trim().toLowerCase();
    filterCards([...document.querySelectorAll(".alumni-card")], (card) => {
      const text = card.textContent.toLowerCase();
      return (
        filter === "all" ||
        (filter === "nigeria" && !text.includes("(uk)")) ||
        (filter === "abroad" && text.includes("(uk)")) ||
        (filter === "open to mentor" && /amaka|tunde|james/.test(text))
      );
    });
  }),
);

document.querySelectorAll(".jfilter").forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.textContent.trim().toLowerCase();
    filterCards(
      [...document.querySelectorAll(".job-card")],
      (card) =>
        filter === "all" || card.textContent.toLowerCase().includes(filter),
    );
  }),
);

function filterMentorCards() {
  const query = document.querySelector(".m-search")?.value.toLowerCase() || "";
  const filter =
    document
      .querySelector(".m-filter.active")
      ?.textContent.trim()
      .toLowerCase() || "all";
  filterCards([...document.querySelectorAll(".mentor-card")], (card) => {
    const text = card.textContent.toLowerCase();
    return text.includes(query) && (filter === "all" || text.includes(filter));
  });
}
document
  .querySelector(".m-search")
  ?.addEventListener("input", filterMentorCards);
document
  .querySelectorAll(".m-filter")
  .forEach((button) =>
    button.addEventListener("click", () => setTimeout(filterMentorCards)),
  );

function filterProjects() {
  const query = document.querySelector(".sc-search")?.value.toLowerCase() || "";
  const filter =
    document
      .querySelector(".sc-filter.active")
      ?.textContent.trim()
      .toLowerCase() || "all";
  filterCards([...document.querySelectorAll(".project-card")], (card) => {
    const text = card.textContent.toLowerCase();
    return text.includes(query) && (filter === "all" || text.includes(filter));
  });
}
document.querySelector(".sc-search")?.addEventListener("input", filterProjects);
document
  .querySelectorAll(".sc-filter")
  .forEach((button) =>
    button.addEventListener("click", () => setTimeout(filterProjects)),
  );
document.querySelectorAll(".project-tag").forEach((tag) =>
  tag.addEventListener("click", () => {
    const input = document.querySelector(".sc-search");
    if (input) {
      input.value = tag.textContent.replace("#", "");
      filterProjects();
    }
  }),
);

document.querySelectorAll(".ev-filter").forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.textContent.trim().toLowerCase();
    setTimeout(() => {
      filterCards(
        [...document.querySelectorAll(".event-card")],
        (card, index) => filter === "all" || eventsData[index].type === filter,
      );
    });
  }),
);

document
  .querySelector(".chat-search input")
  ?.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    filterCards([...document.querySelectorAll(".chat-item")], (card) =>
      card.textContent.toLowerCase().includes(query),
    );
  });

submitProject = function () {
  const modal = document.getElementById("submitModal");
  const fields = modal.querySelectorAll("input, textarea, select");
  const [title, description, category, tags] = fields;
  if (!title.value.trim() || !description.value.trim() || !category.value) {
    showToast("Add a name, description, and category");
    return;
  }
  projects.unshift({
    id: Date.now(),
    emoji: "🚀",
    bg: "#1a1040",
    title: title.value.trim(),
    author: "Mo Flourish",
    authorInitials: "MF",
    authorColor: "var(--orange)",
    sem: "Sem 3",
    desc: description.value.trim(),
    tags: tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    likes: 0,
    comments: 0,
    views: 0,
    featured: false,
    github: "#",
    demo: null,
  });
  fields.forEach((field) => {
    if (field.tagName !== "SELECT") field.value = "";
    else field.selectedIndex = 0;
  });
  closeSubmitModal();
  renderProjects();
  filterProjects();
  showToast("Project submitted to your showcase");
};

document.querySelectorAll(".upload-btn").forEach((button) => {
  if (!button.hasAttribute("onclick"))
    button.addEventListener("click", () =>
      showToast(
        button.textContent.includes("Remove")
          ? "Profile photo removed"
          : "Choose a profile photo from your device",
      ),
    );
});

document
  .querySelectorAll(
    ".forgot-row a, .terms-row a, .footer-col a:not([onclick]), .footer-bottom-links a, .footer-social-btn",
  )
  .forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("This page is ready to connect to your account service");
    }),
  );

// Persistent local application state. This keeps the standalone build useful between refreshes.
const APTVERSE_STORAGE_KEY = "aptverse-app-state-v1";
const defaultProfile = {
  firstName: "Mo",
  lastName: "Flourish",
  displayName: "Mo Flourish",
  bio: "Passionate software engineering student at Aptech Learning Lagos. Building apps that solve real problems.",
  location: "Lagos, Nigeria",
  semester: "Semester 3",
  github: "",
  linkedin: "",
  email: "mo.flourish@aptech.ng",
  visibility: "Everyone",
  avatar: null,
};

function loadAppState() {
  try {
    return JSON.parse(localStorage.getItem(APTVERSE_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveAppState() {
  const state = loadAppState();
  state.profile = window.aptverseProfile;
  state.projects = projects;
  state.likes = [...likedProjects];
  state.mentors = mentors.map(({ id, sent }) => ({ id, sent }));
  state.events = eventsData.map(({ id, registered, count }) => ({
    id,
    registered,
    count,
  }));
  state.contacts = contacts.map(({ id, messages, unread }) => ({
    id,
    messages,
    unread,
  }));
  state.notifications = notifications.map(({ id, unread }) => ({ id, unread }));
  state.userPosts = window.userPosts || [];
  state.preferences = [
    ...document.querySelectorAll('.settings-panel input[type="checkbox"]'),
  ].map((input) => input.checked);
  if (state.session?.email && Array.isArray(state.accounts)) {
    const account = state.accounts.find(
      (item) => item.email === state.session.email,
    );
    if (account) account.profile = window.aptverseProfile;
  }
  localStorage.setItem(APTVERSE_STORAGE_KEY, JSON.stringify(state));
}
function restoreAppState() {
  const state = loadAppState();
  window.aptverseProfile = { ...defaultProfile, ...(state.profile || {}) };
  if (
    ![
      "Semester 1",
      "Semester 2",
      "Semester 3",
      "Semester 4",
      "Alumni",
    ].includes(window.aptverseProfile.semester)
  )
    window.aptverseProfile.semester = "Semester 4";
  if (Array.isArray(state.projects)) {
    projects.splice(0, projects.length, ...state.projects);
  }
  if (Array.isArray(state.likes)) likedProjects = new Set(state.likes);
  state.mentors?.forEach((saved) => {
    const mentor = mentors.find((item) => item.id === saved.id);
    if (mentor) mentor.sent = saved.sent;
  });
  state.events?.forEach((saved) => {
    const event = eventsData.find((item) => item.id === saved.id);
    if (event) Object.assign(event, saved);
  });
  state.contacts?.forEach((saved) => {
    const contact = contacts.find((item) => item.id === saved.id);
    if (contact) {
      contact.messages = saved.messages || contact.messages;
      contact.unread = saved.unread || 0;
    }
  });
  state.notifications?.forEach((saved) => {
    const notification = notifications.find((item) => item.id === saved.id);
    if (notification) notification.unread = saved.unread;
  });
  window.userPosts = state.userPosts || [];
  document
    .querySelectorAll('.settings-panel input[type="checkbox"]')
    .forEach((input, index) => {
      if (typeof state.preferences?.[index] === "boolean")
        input.checked = state.preferences[index];
    });
  const privacySelect = document.querySelector("#spanel-privacy select");
  if (privacySelect)
    privacySelect.value = window.aptverseProfile.visibility || "Everyone";
  window.aptverseSession = state.session || null;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function localPasswordHash(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index++)
    hash = ((hash << 5) + hash) ^ value.charCodeAt(index);
  return `local-${(hash >>> 0).toString(16)}`;
}
function getLocalAccounts() {
  return loadAppState().accounts || [];
}
function saveLocalAccounts(accounts, session = window.aptverseSession) {
  const state = loadAppState();
  state.accounts = accounts;
  state.session = session;
  localStorage.setItem(APTVERSE_STORAGE_KEY, JSON.stringify(state));
  window.aptverseSession = session;
}
function renderSessionUI() {
  const cta = document.querySelector(".nav-cta");
  if (!cta) return;
  const signedIn = Boolean(window.aptverseSession);
  cta.textContent = signedIn ? "My Profile" : "Sign In";
  cta.onclick = () =>
    showPage(
      signedIn ? "profile" : "auth",
      signedIn ? document.querySelectorAll(".nav-btn")[2] : null,
    );
  cta.title = signedIn
    ? `Signed in as ${window.aptverseProfile.displayName}`
    : "Sign in to APTverse";
}
function startSession(account) {
  window.aptverseProfile = {
    ...defaultProfile,
    ...(account.profile || {}),
    email: account.email,
  };
  window.aptverseSession = { email: account.email, signedInAt: Date.now() };
  saveLocalAccounts(getLocalAccounts(), window.aptverseSession);
  renderProfile();
  renderSessionUI();
  saveAppState();
}
function signOut() {
  const state = loadAppState();
  state.session = null;
  localStorage.setItem(APTVERSE_STORAGE_KEY, JSON.stringify(state));
  window.aptverseSession = null;
  renderSessionUI();
  runSplash(() => {
    showPage("auth", null);
    switchTab("login");
    showToast("Signed out of APTverse");
  });
}
function profileInputs() {
  const panel = document.getElementById("spanel-profile");
  const inputs = panel.querySelectorAll("input, textarea, select");
  return {
    firstName: inputs[0],
    lastName: inputs[1],
    displayName: inputs[2],
    bio: inputs[3],
    location: inputs[4],
    semester: inputs[5],
    github: inputs[6],
    linkedin: inputs[7],
  };
}
function renderProfile() {
  const profile = window.aptverseProfile;
  const inputs = profileInputs();
  Object.entries(inputs).forEach(([key, input]) => {
    if (input) input.value = profile[key] || "";
  });
  document
    .querySelectorAll(".profile-name")
    .forEach((node) => (node.textContent = profile.displayName));
  document
    .querySelectorAll(".profile-title")
    .forEach(
      (node) =>
        (node.textContent = `Software Engineering Student · Aptech Learning Lagos`),
    );
  document
    .querySelectorAll(".profile-loc")
    .forEach(
      (node) =>
        (node.textContent = `📍 ${profile.location} · ${profile.semester}`),
    );
  document.querySelectorAll(".profile-avatar, .avatar-lg").forEach((node) => {
    if (profile.avatar) {
      node.style.backgroundImage = `url(${profile.avatar})`;
      node.style.backgroundSize = "contain";
      node.style.backgroundPosition = "center";
      node.style.backgroundRepeat = "no-repeat";
      node.style.backgroundColor = "#f0f2f5";
      node.textContent = "";
    } else {
      node.style.backgroundImage = "";
      node.style.backgroundSize = "";
      node.style.backgroundPosition = "";
      node.style.backgroundRepeat = "";
      node.style.backgroundColor = "";
      node.textContent =
        `${profile.firstName[0] || "M"}${profile.lastName[0] || "F"}`.toUpperCase();
    }
  });
  const about = document.querySelector("#page-profile .section-card p");
  if (about) about.textContent = profile.bio;
}
function saveProfile() {
  const inputs = profileInputs();
  const next = Object.fromEntries(
    Object.entries(inputs).map(([key, input]) => [key, input.value.trim()]),
  );
  if (!next.firstName || !next.lastName || !next.displayName) {
    showToast("First name, last name, and display name are required");
    return false;
  }
  window.aptverseProfile = { ...window.aptverseProfile, ...next };
  renderProfile();
  saveAppState();
  showToast("Profile saved");
  return true;
}
function openFormModal(title, fields, submitLabel, onSubmit) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay open";
  overlay.innerHTML = `<div class="modal"><button class="modal-close" aria-label="Close">×</button><h3>${title}</h3><div class="submit-project-form">${fields.map((field) => `<div class="sform-field"><label>${field.label}</label>${field.control || `<input name="${field.name}" type="${field.type || "text"}" placeholder="${field.placeholder || ""}">`}</div>`).join("")}</div><div class="modal-footer"><button class="modal-cancel">Cancel</button><button class="modal-send">${submitLabel}</button></div></div>`;
  const close = () => overlay.remove();
  overlay.addEventListener("click", (event) => {
    if (
      event.target === overlay ||
      event.target.closest(".modal-close, .modal-cancel")
    )
      close();
  });
  overlay.querySelector(".modal-send").addEventListener("click", () => {
    const values = Object.fromEntries(
      [...overlay.querySelectorAll("[name]")].map((input) => [
        input.name,
        input.value.trim(),
      ]),
    );
    if (onSubmit(values) !== false) close();
  });
  document.body.appendChild(overlay);
  overlay.querySelector("input, textarea, select")?.focus();
}

const PAGE_NAV_INDEX = { home: 0, feed: 1, profile: 2, alumni: 3, jobs: 4 };
const PAGE_MORE_INDEX = {
  chat: 0,
  mentorship: 1,
  showcase: 2,
  events: 3,
  notifications: 4,
  settings: 5,
};
const GATED_PAGES = ["profile", "chat", "settings"];

function navButtonFor(page) {
  if (page in PAGE_NAV_INDEX)
    return document.querySelectorAll(".nav-btn")[PAGE_NAV_INDEX[page]];
  if (page in PAGE_MORE_INDEX)
    return document.querySelectorAll(".more-item")[PAGE_MORE_INDEX[page]];
  return null;
}

function restoreLastPage() {
  const state = loadAppState();
  let target = state.currentPage;
  const signedIn = Boolean(window.aptverseSession);
  if (target && GATED_PAGES.includes(target) && !signedIn) target = "auth";
  if (!target || !document.getElementById("page-" + target)) return;
  if (target === "home") return; // already the active page by default
  showPage(target, navButtonFor(target));
}

restoreAppState();
renderProfile();
renderSessionUI();
restoreLastPage();
renderProjects();
renderMentors();
renderEvents();
renderChatList();
renderNotifications();
window.userPosts.forEach((postData) => {
  const post = document.createElement("div");
  post.className = "feed-post";
  post.innerHTML = `<div class="post-header"><div class="avatar">MF</div><div class="post-meta"><div class="post-name">Mo Flourish <span class="post-badge">Student</span></div><div class="post-info"></div></div></div><div class="post-text"></div><div class="post-actions"><button class="post-action">Like · 0</button><button class="post-action">Comment · 0</button><button class="post-action">Share</button><button class="post-action post-msg-btn">Message</button></div>`;
  post.querySelector(".post-info").textContent = postData.createdAt;
  post.querySelector(".post-text").textContent = postData.content;
  document
    .querySelector(".feed-layout > div")
    .insertBefore(post, document.querySelector(".feed-post"));
});

const baseSendMessage = sendMessage;
sendMessage = function () {
  saveAppState();
  const result = baseSendMessage();
  if (result && typeof result.then === "function") result.then(saveAppState);
  else saveAppState();
};
const baseToggleLike = toggleLike;
toggleLike = function (id, button) {
  baseToggleLike(id, button);
  saveAppState();
};
const baseSendRequest = sendRequest;
sendRequest = function () {
  const message = document.querySelector("#requestModal textarea").value.trim();
  if (!message) {
    showToast("Add a short message for your mentor");
    return;
  }
  baseSendRequest();
  document.querySelector("#requestModal textarea").value = "";
  saveAppState();
};
const baseToggleRegister = toggleRegister;
toggleRegister = function (id, button) {
  baseToggleRegister(id, button);
  saveAppState();
};
const persistentSubmitProject = submitProject;
submitProject = function () {
  persistentSubmitProject();
  saveAppState();
};
const persistentMarkRead = markRead;
markRead = function (id) {
  persistentMarkRead(id);
  saveAppState();
};
const persistentMarkAllRead = markAllRead;
markAllRead = function () {
  persistentMarkAllRead();
  saveAppState();
};

handleLogin = function () {
  const email = normalizeEmail(document.getElementById("login-email").value);
  const password = document.getElementById("login-password").value;
  if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
    showToast("Enter your email and password");
    return;
  }
  const account = getLocalAccounts().find((item) => item.email === email);
  if (!account) {
    showToast("No local account found. Create one first.");
    switchTab("signup");
    return;
  }
  if (account.deactivated) {
    showToast("This account is deactivated.");
    return;
  }
  if (account.passwordHash !== localPasswordHash(password)) {
    showToast("Incorrect password");
    return;
  }
  startSession(account);
  document.getElementById("login-password").value = "";
  showSuccess();
};
handleSignup = function () {
  const form = document.getElementById("form-signup");
  const fields = form.querySelectorAll("input");
  const semester = form.querySelector("select");
  const [firstName, lastName, email, studentId, password] = fields;
  const normalizedEmail = normalizeEmail(email.value);
  if (
    !firstName.value.trim() ||
    !lastName.value.trim() ||
    !/^\S+@\S+\.\S+$/.test(normalizedEmail) ||
    !studentId.value.trim() ||
    !semester.value ||
    password.value.length < 8
  ) {
    showToast("Complete every field and use an 8-character password");
    return;
  }
  if (!document.getElementById("terms").checked) {
    showToast("Accept the terms to create your account");
    return;
  }
  const accounts = getLocalAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    showToast("An account with this email already exists. Sign in instead.");
    switchTab("login");
    return;
  }
  const profile = {
    ...defaultProfile,
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    displayName: `${firstName.value.trim()} ${lastName.value.trim()}`,
    email: normalizedEmail,
    semester: semester.value,
  };
  const account = {
    email: normalizedEmail,
    studentId: studentId.value.trim(),
    passwordHash: localPasswordHash(password.value),
    createdAt: new Date().toISOString(),
    profile,
    deactivated: false,
  };
  accounts.push(account);
  saveLocalAccounts(accounts, {
    email: normalizedEmail,
    signedInAt: Date.now(),
  });
  window.aptverseProfile = profile;
  renderProfile();
  renderSessionUI();
  saveAppState();
  password.value = "";
  document.getElementById("terms").checked = false;
  showSuccess();
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;
  if (
    target.classList.contains("save-btn") &&
    target.textContent.includes("Save")
  ) {
    event.preventDefault();
    saveProfile();
  }
  if (
    target.classList.contains("save-btn") &&
    target.textContent.includes("Update Password")
  ) {
    const inputs = document.querySelectorAll(
      '#spanel-account input[type="password"]',
    );
    const account = getLocalAccounts().find(
      (item) => item.email === window.aptverseSession?.email,
    );
    if (!account) showToast("Sign in before changing your password");
    else if (account.passwordHash !== localPasswordHash(inputs[0].value))
      showToast("Current password is incorrect");
    else if (inputs[1].value.length < 8 || inputs[1].value !== inputs[2].value)
      showToast("Use matching new passwords of at least 8 characters");
    else {
      account.passwordHash = localPasswordHash(inputs[1].value);
      account.passwordUpdatedAt = new Date().toISOString();
      saveLocalAccounts(
        getLocalAccounts().map((item) =>
          item.email === account.email ? account : item,
        ),
      );
      inputs.forEach((input) => (input.value = ""));
      showToast("Password updated");
    }
  }
  if (target.classList.contains("post-job-btn")) {
    openFormModal(
      "Post a role",
      [
        {
          label: "Role title",
          name: "title",
          placeholder: "e.g. Frontend Intern",
        },
        {
          label: "Company and location",
          name: "company",
          placeholder: "e.g. APT Labs · Lagos",
        },
        {
          label: "Type and skills",
          name: "tags",
          placeholder: "Internship, React, Remote",
        },
      ],
      "Post role",
      (values) => {
        if (!values.title || !values.company) {
          showToast("Add a role title and company");
          return false;
        }
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `<div class="job-logo">💼</div><div class="job-info"><div class="job-title"></div><div class="job-company"></div><div class="job-meta"></div></div><div class="job-right"><div class="job-salary">Not listed</div><div class="job-deadline">New role</div><button class="apply-btn">Apply</button></div>`;
        card.querySelector(".job-title").textContent = values.title;
        card.querySelector(".job-company").textContent = values.company;
        card.querySelector(".job-meta").textContent =
          values.tags || "Community role";
        document.querySelector(".jobs-page").appendChild(card);
        showToast("Role posted to the job board");
        saveAppState();
      },
    );
  }
  if (target.textContent.includes("Submit Event")) {
    openFormModal(
      "Submit an event",
      [
        {
          label: "Event title",
          name: "title",
          placeholder: "e.g. React study group",
        },
        {
          label: "Date and format",
          name: "details",
          placeholder: "August 12 · Virtual",
        },
      ],
      "Submit event",
      (values) => {
        if (!values.title || !values.details) {
          showToast("Add an event title and date");
          return false;
        }
        showToast("Event submitted for community review");
      },
    );
  }
  if (target.classList.contains("notif-footer")) {
    event.preventDefault();
    document.getElementById("notifDropdown").classList.remove("open");
    showPage("notifications", null);
  }
  if (target.closest(".notif-footer")) {
    event.preventDefault();
    document.getElementById("notifDropdown").classList.remove("open");
    showPage("notifications", null);
  }
  if (
    target.classList.contains("plink-btn") &&
    target.tagName === "A" &&
    target.getAttribute("href") === "#"
  ) {
    event.preventDefault();
    showToast("Project link will be available when the author adds it");
  }
});

document
  .querySelectorAll(
    '.settings-panel input[type="checkbox"], #spanel-privacy select',
  )
  .forEach((input) =>
    input.addEventListener("change", () => {
      if (input.matches("#spanel-privacy select"))
        window.aptverseProfile.visibility = input.value;
      saveAppState();
      showToast("Preference saved");
    }),
  );
document.querySelectorAll(".upload-btn").forEach((button) => {
  if (button.textContent.includes("Upload Photo"))
    button.addEventListener("click", () => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = "image/*";
      picker.addEventListener("change", () => {
        const file = picker.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          window.aptverseProfile.avatar = reader.result;
          renderProfile();
          saveAppState();
          showToast("Profile photo updated");
        };
        reader.readAsDataURL(file);
      });
      picker.click();
    });
  if (button.textContent.includes("Remove Photo"))
    button.addEventListener("click", () => {
      window.aptverseProfile.avatar = null;
      renderProfile();
      saveAppState();
    });
});

document.querySelectorAll(".modal-overlay").forEach((overlay) =>
  overlay.addEventListener("click", (event) => {
    if (event.target !== overlay) return;
    if (overlay.id === "requestModal") closeModal();
    if (overlay.id === "submitModal") closeSubmitModal();
  }),
);

function showInfoModal(title, message) {
  openFormModal(title, [], "Close", () => true);
  const modal = document.body.lastElementChild;
  modal.querySelector(".submit-project-form").innerHTML =
    `<p style="color:var(--gray);line-height:1.7">${message}</p>`;
}

confirmDelete = function () {
  if (
    !confirm(
      "Delete your local APTverse account and all saved demo data? This cannot be undone.",
    )
  )
    return;
  localStorage.removeItem(APTVERSE_STORAGE_KEY);
  window.aptverseProfile = { ...defaultProfile };
  window.aptverseSession = null;
  likedProjects = new Set();
  window.userPosts = [];
  renderProfile();
  renderProjects();
  renderChatList();
  renderNotifications();
  renderSessionUI();
  showPage("auth", null);
  switchTab("signup");
  showToast("Local account data deleted");
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;
  if (target.classList.contains("am-msg-btn")) {
    const name =
      target.closest(".active-mentor")?.querySelector(".am-name")
        ?.textContent ||
      target.closest(".mentor-card")?.querySelector(".mc-name")?.textContent;
    const contact = contacts.find((item) => item.name === name) || contacts[0];
    showPage("chat", null);
    openChat(contact.id);
  }
  if (
    target.classList.contains("danger-btn") &&
    target.textContent.trim() === "Remove"
  ) {
    target.closest(".setting-row")?.remove();
    saveAppState();
    showToast("Session removed");
  }
  if (
    target.classList.contains("danger-btn") &&
    target.textContent.trim() === "Deactivate"
  ) {
    const accounts = getLocalAccounts().map((account) =>
      account.email === window.aptverseSession?.email
        ? { ...account, deactivated: true }
        : account,
    );
    saveLocalAccounts(accounts, null);
    window.aptverseSession = null;
    renderSessionUI();
    showPage("auth", null);
    switchTab("login");
    showToast("Account deactivated locally");
  }
  if (
    target.classList.contains("upload-btn") &&
    target.textContent.trim() === "Export"
  ) {
    const blob = new Blob([JSON.stringify(loadAppState(), null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "aptverse-data.json";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Your APTverse data export has downloaded");
  }
  if (target.matches(".forgot-row a")) {
    event.preventDefault();
    openFormModal(
      "Reset password",
      [
        {
          label: "Account email",
          name: "email",
          type: "email",
          placeholder: "you@aptech.ng",
        },
      ],
      "Send reset link",
      (values) => {
        const account = getLocalAccounts().find(
          (item) => item.email === normalizeEmail(values.email),
        );
        if (!account) {
          showToast("No local account found for that email");
          return false;
        }
        setTimeout(
          () =>
            openFormModal(
              "Choose a new password",
              [
                {
                  label: "New password",
                  name: "password",
                  type: "password",
                  placeholder: "At least 8 characters",
                },
                {
                  label: "Confirm password",
                  name: "confirmPassword",
                  type: "password",
                  placeholder: "Repeat your password",
                },
              ],
              "Update password",
              (resetValues) => {
                if (
                  resetValues.password.length < 8 ||
                  resetValues.password !== resetValues.confirmPassword
                ) {
                  showToast("Use matching passwords of at least 8 characters");
                  return false;
                }
                const accounts = getLocalAccounts().map((item) =>
                  item.email === account.email
                    ? {
                        ...item,
                        passwordHash: localPasswordHash(resetValues.password),
                        passwordUpdatedAt: new Date().toISOString(),
                      }
                    : item,
                );
                saveLocalAccounts(accounts, window.aptverseSession);
                showToast("Password updated. You can sign in now.");
              },
            ),
          0,
        );
      },
    );
  }
  if (target.matches(".footer-col a:not([onclick]), .footer-bottom-links a")) {
    const label = target.textContent.trim();
    event.preventDefault();
    const copy = {
      "About APTverse":
        "APTverse is the community space for Aptech students and alumni to share work, find opportunities, and grow together.",
      "Privacy Policy":
        "Your activity in this standalone demo stays in your browser storage until you export or delete it.",
      "Terms of Service":
        "Use APTverse respectfully, share only content you have permission to share, and support the community.",
      "Help Center":
        "Try the search, filters, messages, project submission, event registration, and settings. Each feature works locally in this build.",
      "Contact Us":
        "For the production platform, contact the APTverse community team through your Aptech centre.",
      Privacy:
        "Your app data is stored only in this browser for the standalone build.",
      Terms:
        "Community guidelines and account terms will apply when the hosted service is connected.",
      Cookies:
        "This standalone build uses local browser storage for preferences and demo data.",
    };
    showInfoModal(label, copy[label] || "Information will be available here.");
  }
});

document.querySelectorAll("#form-login input").forEach((input) =>
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  }),
);
document
  .querySelectorAll("#form-signup input, #form-signup select")
  .forEach((input) =>
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSignup();
      }
    }),
  );

function initializeHomeMotion() {
  const home = document.getElementById("page-home");
  if (!home) return;
  requestAnimationFrame(() => home.classList.add("home-ready"));

  const revealTargets = [
    home.querySelector(".stats-bar"),
    home.querySelector(".features"),
    home.querySelector(".about-section"),
  ].filter(Boolean);
  const counters = [...home.querySelectorAll("[data-count]")];
  const animateCounter = (counter) => {
    if (counter.dataset.animated) return;
    counter.dataset.animated = "true";
    const end = Number(counter.dataset.count);
    const startedAt = performance.now();
    const duration = 1250;
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(end * eased);
      counter.textContent = `${end >= 1000000 ? `${(value / 1000000).toFixed(value < end ? 1 : 1)}M` : value.toLocaleString()}${counter.dataset.suffix || ""}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          if (entry.target.classList.contains("stats-bar"))
            counters.forEach(animateCounter);
          observer.unobserve(entry.target);
        }),
      { threshold: 0.18 },
    );
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("in-view"));
    counters.forEach(animateCounter);
  }

  const signal = document.getElementById("heroSignalText");
  const messages = [
    "87 builders are active right now",
    "12 mentorship requests sent today",
    "5 new roles posted this week",
    "23 projects were shared this month",
  ];
  let index = 0;
  setInterval(() => {
    if (!signal) return;
    signal.style.opacity = "0";
    setTimeout(() => {
      index = (index + 1) % messages.length;
      signal.textContent = messages[index];
      signal.style.opacity = "1";
    }, 180);
  }, 3600);
}

initializeHomeMotion();

let activeCall = null;

function callElements() {
  return {
    overlay: document.getElementById("callOverlay"),
    choice: document.getElementById("callChoice"),
    active: document.getElementById("callActive"),
    title: document.getElementById("callTitle"),
    contact: document.getElementById("callContactName"),
    icon: document.getElementById("callModeIcon"),
    status: document.getElementById("callStatus"),
    id: document.getElementById("activeCallId"),
    joinId: document.getElementById("joinCallId"),
    remote: document.getElementById("remoteVideo"),
    local: document.getElementById("localVideo"),
    avatar: document.getElementById("callAudioAvatar"),
    mute: document.getElementById("muteCallBtn"),
    camera: document.getElementById("cameraCallBtn"),
  };
}
function openCallChooser(mode) {
  if (!window.RTCPeerConnection || !navigator.mediaDevices?.getUserMedia) {
    showToast("WebRTC calling is not supported by this browser");
    return;
  }
  if (location.protocol === "file:") {
    showToast("Open APTverse through the local server before starting a call");
    return;
  }
  const elements = callElements();
  activeCall = {
    mode,
    id: null,
    side: null,
    pc: null,
    stream: null,
    poller: null,
    seenCandidates: new Set(),
    remoteDescriptionSet: false,
  };
  elements.overlay.classList.add("open");
  elements.overlay.setAttribute("aria-hidden", "false");
  elements.choice.hidden = false;
  elements.active.hidden = true;
  elements.joinId.value = "";
  elements.icon.textContent = mode === "video" ? "📹" : "📞";
  elements.title.textContent =
    mode === "video" ? "Start a video call" : "Start an audio call";
  const contact = activeContactId
    ? contacts.find((item) => item.id === activeContactId)
    : null;
  elements.contact.textContent = contact
    ? `Call ${contact.name}`
    : "Share a call ID with the person you want to reach";
  elements.avatar.textContent =
    window.aptverseProfile?.displayName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ME";
}
async function callRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Call connection failed");
  return result;
}
async function prepareCallMedia() {
  const constraints = {
    audio: true,
    video: activeCall.mode === "video" ? { facingMode: "user" } : false,
  };
  activeCall.stream = await navigator.mediaDevices.getUserMedia(constraints);
  const elements = callElements();
  elements.local.srcObject = activeCall.stream;
  elements.local.classList.toggle("has-stream", activeCall.mode === "video");
}
function createPeerConnection() {
  activeCall.pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });
  activeCall.stream
    .getTracks()
    .forEach((track) => activeCall.pc.addTrack(track, activeCall.stream));
  activeCall.pc.ontrack = (event) => {
    const [stream] = event.streams;
    const elements = callElements();
    elements.remote.srcObject = stream;
    if (stream.getVideoTracks().length)
      elements.remote.classList.add("has-stream");
    elements.status.textContent = "Connected";
  };
  activeCall.pc.onicecandidate = (event) => {
    if (!event.candidate || !activeCall?.id) return;
    callRequest(`/api/calls/${activeCall.id}/candidates`, {
      method: "POST",
      body: JSON.stringify({
        side: activeCall.side,
        candidate: event.candidate.toJSON(),
      }),
    }).catch(() => {});
  };
  activeCall.pc.onconnectionstatechange = () => {
    if (!activeCall) return;
    const state = activeCall.pc.connectionState;
    if (state === "connected") callElements().status.textContent = "Connected";
    if (state === "failed")
      callElements().status.textContent =
        "Connection failed. Try again on the same network.";
  };
}
function showActiveCall(status) {
  const elements = callElements();
  elements.choice.hidden = true;
  elements.active.hidden = false;
  elements.status.textContent = status;
  elements.id.textContent = activeCall.id;
}
async function createCall() {
  if (!activeCall) return;
  try {
    callElements().choice.hidden = true;
    callElements().active.hidden = false;
    callElements().status.textContent =
      "Requesting microphone and camera access...";
    await prepareCallMedia();
    const room = await callRequest("/api/calls", {
      method: "POST",
      body: "{}",
    });
    activeCall.id = room.id;
    activeCall.side = "caller";
    createPeerConnection();
    const offer = await activeCall.pc.createOffer();
    await activeCall.pc.setLocalDescription(offer);
    await callRequest(`/api/calls/${activeCall.id}/offer`, {
      method: "POST",
      body: JSON.stringify({ offer: activeCall.pc.localDescription }),
    });
    showActiveCall("Waiting for the other person to join");
    pollCall();
  } catch (error) {
    showToast(
      error.name === "NotAllowedError"
        ? "Allow microphone or camera access to start a call"
        : error.message,
    );
    endCall(false);
  }
}
async function joinCall() {
  if (!activeCall) return;
  const id = callElements().joinId.value.trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(id)) {
    showToast("Enter the 8-character call ID");
    return;
  }
  try {
    callElements().choice.hidden = true;
    callElements().active.hidden = false;
    callElements().status.textContent = "Joining call...";
    const room = await callRequest(`/api/calls/${id}`);
    if (!room.offer || room.ended)
      throw new Error("This call is no longer available");
    activeCall.id = id;
    activeCall.side = "guest";
    await prepareCallMedia();
    createPeerConnection();
    await activeCall.pc.setRemoteDescription(room.offer);
    activeCall.remoteDescriptionSet = true;
    const answer = await activeCall.pc.createAnswer();
    await activeCall.pc.setLocalDescription(answer);
    await callRequest(`/api/calls/${id}/answer`, {
      method: "POST",
      body: JSON.stringify({ answer: activeCall.pc.localDescription }),
    });
    showActiveCall("Connecting...");
    await processCallCandidates(room.candidates);
    pollCall();
  } catch (error) {
    showToast(
      error.name === "NotAllowedError"
        ? "Allow microphone or camera access to join"
        : error.message,
    );
    endCall(false);
  }
}
async function processCallCandidates(candidates = []) {
  if (!activeCall?.pc || !activeCall.remoteDescriptionSet) return;
  for (const entry of candidates) {
    const key = JSON.stringify(entry.candidate);
    if (entry.side === activeCall.side || activeCall.seenCandidates.has(key))
      continue;
    activeCall.seenCandidates.add(key);
    try {
      await activeCall.pc.addIceCandidate(entry.candidate);
    } catch (_) {}
  }
}
async function pollCall() {
  if (!activeCall?.id) return;
  try {
    const room = await callRequest(`/api/calls/${activeCall.id}`);
    if (room.ended) {
      showToast("The call ended");
      endCall(false);
      return;
    }
    if (
      activeCall.side === "caller" &&
      room.answer &&
      !activeCall.remoteDescriptionSet
    ) {
      await activeCall.pc.setRemoteDescription(room.answer);
      activeCall.remoteDescriptionSet = true;
      callElements().status.textContent = "Connecting...";
    }
    await processCallCandidates(room.candidates);
  } catch (error) {
    callElements().status.textContent = "Reconnecting...";
  }
  if (activeCall) activeCall.poller = setTimeout(pollCall, 1100);
}
function toggleCallMute() {
  if (!activeCall?.stream) return;
  const muted = activeCall.stream
    .getAudioTracks()
    .every((track) => !track.enabled);
  activeCall.stream.getAudioTracks().forEach((track) => {
    track.enabled = muted;
  });
  callElements().mute.textContent = muted ? "Mute" : "Unmute";
}
function toggleCallCamera() {
  if (!activeCall?.stream || activeCall.mode !== "video") return;
  const enabled = activeCall.stream
    .getVideoTracks()
    .some((track) => track.enabled);
  activeCall.stream.getVideoTracks().forEach((track) => {
    track.enabled = !enabled;
  });
  callElements().camera.textContent = enabled ? "Camera on" : "Camera off";
}
async function copyCallId() {
  if (!activeCall?.id) return;
  try {
    await navigator.clipboard.writeText(activeCall.id);
    showToast("Call ID copied");
  } catch (_) {
    showToast(`Call ID: ${activeCall.id}`);
  }
}
function endCall(notify = true) {
  if (!activeCall) {
    callElements().overlay.classList.remove("open");
    return;
  }
  const call = activeCall;
  activeCall = null;
  clearTimeout(call.poller);
  call.stream?.getTracks().forEach((track) => track.stop());
  call.pc?.close();
  if (call.id && notify)
    callRequest(`/api/calls/${call.id}/end`, {
      method: "POST",
      body: "{}",
    }).catch(() => {});
  const elements = callElements();
  elements.overlay.classList.remove("open");
  elements.overlay.setAttribute("aria-hidden", "true");
  elements.remote.srcObject = null;
  elements.local.srcObject = null;
  elements.remote.classList.remove("has-stream");
  elements.local.classList.remove("has-stream");
}
document.getElementById("joinCallId")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") joinCall();
});
