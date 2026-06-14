function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}
function getMe() {
  var u = localStorage.getItem('currentUser');
  if (!u) { window.location.href = 'index.html'; return null; }
  return JSON.parse(u);
}
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

var activeId   = null;
var activeName = null;
var activeJob  = 'Professional';
var activeUser = null;
var isFetching = false;

// ===== CONTACTS =====
function loadContacts() {
  var me    = getMe();
  var users = getUsers();
  var contacts = users.filter(function(u) {
    return (me.connections || []).includes(u.id);
  });
  if (!contacts.length) {
    contacts = users.filter(function(u) {
      return u.id.startsWith('demo_') && parseInt(u.id.split('_')[1]) <= 5;
    });
  }
  renderContactsList(contacts);
}

function renderContactsList(contacts) {
  var html = '';
  contacts.forEach(function(u) {
    var safeId   = u.id.replace(/'/g, '');
    var safeName = u.name.replace(/'/g, '');
    var safeJob  = (u.job || 'Professional').replace(/'/g, '');
    var av = u.photo
      ? '<img src="' + u.photo + '" style="width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;" />'
      : '<div class="avatar" style="flex-shrink:0;">' + u.name.charAt(0) + '</div>';
    html +=
      '<div class="contact-row" id="cr_' + safeId + '" onclick="openChat(\'' + safeId + '\',\'' + safeName + '\',\'' + safeJob + '\')">' +
      av + '<div><div style="font-weight:bold;font-size:14px;">' + u.name + '</div>' +
      '<div style="font-size:12px;color:#888;">' + (u.job || 'Professional') + '</div></div></div>';
  });
  if (!html) html = '<p style="color:#666;padding:10px;font-size:13px;">No contacts yet. Click ✏️ New Chat!</p>';
  document.getElementById('contactsList').innerHTML = html;
}

// ===== NEW CHAT POPUP =====
function openNewChat() {
  document.getElementById('newChatPopup').style.display = 'flex';
  document.getElementById('newChatSearch').value = '';
  renderNewChatList('');
}
function closeNewChat() {
  document.getElementById('newChatPopup').style.display = 'none';
}
function filterNewChat() {
  renderNewChatList(document.getElementById('newChatSearch').value.toLowerCase());
}
function renderNewChatList(query) {
  var me    = getMe();
  var users = getUsers();
  var others = users.filter(function(u) { return u.id !== me.id; });
  if (query) {
    others = others.filter(function(u) {
      return (u.name + ' ' + (u.job || '')).toLowerCase().includes(query);
    });
  }
  if (!others.length) {
    document.getElementById('newChatList').innerHTML = '<p style="color:#666;text-align:center;padding:20px;">No users found.</p>';
    return;
  }
  var html = '';
  others.forEach(function(u) {
    var safeId   = u.id.replace(/'/g, '');
    var safeName = u.name.replace(/'/g, '');
    var safeJob  = (u.job || 'Professional').replace(/'/g, '');
    var isConn = (me.connections || []).includes(u.id);
    var badge  = isConn
      ? '<span style="font-size:11px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:10px;margin-left:6px;">🤝 Connected</span>'
      : '<span style="font-size:11px;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:10px;margin-left:6px;">Not connected</span>';
    var av = u.photo
      ? '<img src="' + u.photo + '" style="width:40px;height:40px;border-radius:50%;object-fit:cover;flex-shrink:0;" />'
      : '<div style="width:40px;height:40px;border-radius:50%;background:#3b82f6;color:white;font-weight:bold;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' + u.name.charAt(0) + '</div>';
    html +=
      '<div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;cursor:pointer;margin-bottom:4px;" ' +
      'onmouseover="this.style.background=\'#f0f4f8\'" onmouseout="this.style.background=\'transparent\'" ' +
      'onclick="startChatWith(\'' + safeId + '\',\'' + safeName + '\',\'' + safeJob + '\')">' +
      av + '<div style="flex:1;"><div style="font-weight:bold;font-size:14px;">' + u.name + badge + '</div>' +
      '<div style="font-size:12px;color:#888;">' + (u.job || 'Professional') + ' · ' + (u.industry || '') + '</div></div>' +
      '<span style="color:#2563eb;font-size:20px;">💬</span></div>';
  });
  document.getElementById('newChatList').innerHTML = html;
}
function startChatWith(userId, userName, userJob) {
  closeNewChat();
  var me    = getMe();
  var users = getUsers();
  var contacts = users.filter(function(u) { return (me.connections || []).includes(u.id); });
  if (!contacts.find(function(c) { return c.id === userId; })) {
    var t = users.find(function(u) { return u.id === userId; });
    if (t) contacts.push(t);
  }
  renderContactsList(contacts);
  openChat(userId, userName, userJob);
}

// ===== OPEN CHAT =====
function openChat(userId, userName, userJob) {
  activeId   = userId;
  activeName = userName;
  activeJob  = userJob || 'Professional';
  var users  = getUsers();
  activeUser = users.find(function(u) { return u.id === userId; }) || {};

  document.querySelectorAll('.contact-row').forEach(function(r) { r.classList.remove('active'); });
  var row = document.getElementById('cr_' + userId);
  if (row) row.classList.add('active');

  var av = (activeUser && activeUser.photo)
    ? '<img src="' + activeUser.photo + '" style="width:34px;height:34px;border-radius:50%;object-fit:cover;margin-right:8px;vertical-align:middle;" />'
    : '<span style="display:inline-flex;width:34px;height:34px;border-radius:50%;background:#3b82f6;color:white;font-weight:bold;align-items:center;justify-content:center;margin-right:8px;vertical-align:middle;">' + userName.charAt(0) + '</span>';

  document.getElementById('chatWith').innerHTML =
    av + userName + '<span style="font-size:12px;color:#888;font-weight:normal;margin-left:8px;">· ' + activeJob + '</span>';
  document.getElementById('chatInput').style.display = 'flex';
  loadMessages();
}

// ===== LOAD MESSAGES =====
function loadMessages() {
  var me   = getMe();
  var key  = chatKey(me.id, activeId);
  var msgs = JSON.parse(localStorage.getItem('chat_' + key) || '[]');
  var c    = document.getElementById('chatMessages');
  if (!msgs.length) {
    c.innerHTML = '<p style="color:#999;text-align:center;margin-top:40px;">Say hi to ' + activeName + '! 👋</p>';
    return;
  }
  var html = '';
  msgs.forEach(function(m) {
    var mine = m.senderId === me.id;
    var t    = m.time ? new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    html +=
      '<div style="display:flex;flex-direction:column;align-items:' + (mine ? 'flex-end' : 'flex-start') + ';margin-bottom:8px;">' +
      '<div class="bubble ' + (mine ? 'me' : 'them') + '" style="max-width:75%;">' + escHtml(m.text) + '</div>' +
      '<span style="font-size:10px;color:#bbb;margin-top:2px;padding:0 4px;">' + t + '</span></div>';
  });
  c.innerHTML = html;
  c.scrollTop = c.scrollHeight;
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ===== SEND MESSAGE =====
function sendMsg() {
  if (isFetching) return;
  var me   = getMe();
  var text = document.getElementById('msgInput').value.trim();
  if (!text || !activeId) return;

  var key  = chatKey(me.id, activeId);
  var msgs = JSON.parse(localStorage.getItem('chat_' + key) || '[]');
  msgs.push({ senderId: me.id, text: text, time: new Date().toISOString() });
  localStorage.setItem('chat_' + key, JSON.stringify(msgs));
  document.getElementById('msgInput').value = '';
  loadMessages();

  isFetching = true;
  showTyping();

  // Build the conversation as proper alternating Claude API messages
  // me = user role, the other person = assistant role
  var history = msgs.slice(-16); // last 16 msgs for context
  var apiMsgs = [];
  history.forEach(function(m) {
    var role = (m.senderId === me.id) ? 'user' : 'assistant';
    var last = apiMsgs[apiMsgs.length - 1];
    if (last && last.role === role) {
      // Merge consecutive same-role (API needs strict alternating)
      last.content += '\n' + m.text;
    } else {
      apiMsgs.push({ role: role, content: m.text });
    }
  });
  // Must start with user
  if (!apiMsgs.length || apiMsgs[0].role !== 'user') {
    apiMsgs.unshift({ role: 'user', content: text });
  }
  // Must end with user (the last sent message)
  if (apiMsgs[apiMsgs.length - 1].role !== 'user') {
    apiMsgs.push({ role: 'user', content: text });
  }

  var system =
    'You are playing the role of ' + activeName + ', a real human professional working as a ' + activeJob + '. ' +
    'You are chatting with ' + me.name +
    (me.job ? ' (a ' + me.job + ')' : '') +
    (me.industry ? ' in ' + me.industry : '') +
    ' on ProNet, a professional networking platform. ' +
    'IMPORTANT RULES:\n' +
    '- Read the user\'s LAST message carefully and reply ONLY to what they said.\n' +
    '- If they say "good morning" → reply with a warm good morning greeting.\n' +
    '- If they ask a question → answer THAT specific question.\n' +
    '- If they mention something → comment on THAT specific thing.\n' +
    '- Keep replies short: 1 to 3 sentences max.\n' +
    '- Sound like a real human texting. Casual, warm, natural.\n' +
    '- Never use generic openers like "Great to connect!" or "Happy to chat!".\n' +
    '- Never repeat what you said before.\n' +
    '- Do NOT prefix your reply with "' + activeName + ':" or any name.';

  // ===== CALL ANTHROPIC API =====
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getApiKey(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: system,
      messages: apiMsgs
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    hideTyping();
    isFetching = false;
    var reply = '';
    if (d && d.content && d.content[0] && d.content[0].text) {
      reply = d.content[0].text.trim();
      // Remove any accidental name prefix
      reply = reply.replace(/^[A-Za-z][\w ]{0,20}:\s*/, '');
    }
    if (!reply || reply.length < 2) {
      reply = preciseFallback(text, activeName, activeJob, me);
    }
    appendReply(key, reply);
  })
  .catch(function() {
    hideTyping();
    isFetching = false;
    appendReply(key, preciseFallback(text, activeName, activeJob, me));
  });
}

function getApiKey() {
  // Check if user has stored a key
  return localStorage.getItem('anthropic_key') || 'YOUR_KEY_HERE';
}

function appendReply(key, text) {
  var msgs = JSON.parse(localStorage.getItem('chat_' + key) || '[]');
  msgs.push({ senderId: activeId, text: text, time: new Date().toISOString() });
  localStorage.setItem('chat_' + key, JSON.stringify(msgs));
  loadMessages();
}

// ===== TYPING DOTS =====
function showTyping() {
  var c  = document.getElementById('chatMessages');
  var el = document.createElement('div');
  el.id  = 'typingDot';
  el.style.cssText = 'padding:10px 14px;color:#999;font-size:13px;display:flex;align-items:center;gap:8px;';
  el.innerHTML =
    '<div style="display:flex;gap:4px;">' +
    '<span style="width:7px;height:7px;background:#bbb;border-radius:50%;display:inline-block;animation:typeBounce 1s infinite 0s;"></span>' +
    '<span style="width:7px;height:7px;background:#bbb;border-radius:50%;display:inline-block;animation:typeBounce 1s infinite 0.2s;"></span>' +
    '<span style="width:7px;height:7px;background:#bbb;border-radius:50%;display:inline-block;animation:typeBounce 1s infinite 0.4s;"></span>' +
    '</div><span>' + activeName + ' is typing...</span>';
  c.appendChild(el);
  c.scrollTop = c.scrollHeight;
}
function hideTyping() {
  var el = document.getElementById('typingDot');
  if (el) el.remove();
}

// ===== PRECISE FALLBACK =====
// This is the fallback when API key is not set.
// It reads EXACTLY what the user typed, word by word, and gives a direct precise reply.
function preciseFallback(text, name, job, me) {
  var raw   = text.trim();
  var lower = raw.toLowerCase();

  // ---- Greetings ----
  if (/^(hi|hello|hey+|heyy|hiii|helo|howdy)\b/.test(lower))
    return 'Hey ' + me.name.split(' ')[0] + '! Good to hear from you 😊';

  if (/good morning/.test(lower))
    return 'Good morning! Hope you have a great and productive day ahead! ☀️';

  if (/good afternoon/.test(lower))
    return 'Good afternoon! Hope the day is going well for you 😊';

  if (/good evening/.test(lower))
    return 'Good evening! How did your day go?';

  if (/good night/.test(lower))
    return 'Good night! Rest well 🌙 Talk soon!';

  // ---- How are you ----
  if (/how (are|r) (you|u)\??$/.test(lower) || /^(how are you|how r u|hows it going|how.s it)\??$/.test(lower))
    return "I'm doing well, thanks for asking! Keeping busy with " + job + " work. What about you?";

  // ---- What are you doing ----
  if (/what.?(are|r) you.?(doing|up to)\??/.test(lower) || /what.?s up\??/.test(lower))
    return "Just wrapping up some " + job + " tasks. What's on your mind?";

  // ---- Who are you / introduce yourself ----
  if (/who are you|introduce yourself|tell me about yourself/.test(lower))
    return "I'm " + name + ", a " + job + " on ProNet. Always happy to connect with fellow professionals!";

  // ---- Job/career/opportunity ----
  if (/\b(job|career|hiring|vacancy|opening|opportunity|work|employment|position)\b/.test(lower))
    return "Yes, there are some interesting openings in the " + job + " space right now. What kind of role are you exploring?";

  // ---- Skills / what skills ----
  if (/\bskill(s)?\b/.test(lower) && /\b(learn|improve|need|require|what)\b/.test(lower))
    return "For " + job + " roles, I'd say focus on practical projects and keep up with industry trends. What's your current skill set?";

  // ---- Tech / tools ----
  if (/\b(python|java|react|node|javascript|sql|aws|docker|kubernetes|ml|ai|machine learning|data science|flutter|kotlin|swift)\b/.test(lower))
    return "Oh nice! That's a great stack. I've been working with similar tools in my " + job + " role. What are you building with it?";

  // ---- Collaboration / project ----
  if (/\b(collaborat|project|team up|work together|partner|join|build)\b/.test(lower))
    return "That sounds interesting! Tell me more about the project — I'm open to collaborating.";

  // ---- Help / advice ----
  if (/\b(help|advice|suggest|guide|tips?|recommend)\b/.test(lower))
    return "Happy to help! What specifically are you looking for guidance on?";

  // ---- Interview ----
  if (/\b(interview|offer|selection|shortlist|hr round|technical round)\b/.test(lower))
    return "Interviews can be tough! Focus on problem-solving approach and be honest about what you know. Which round are you preparing for?";

  // ---- Resume / CV ----
  if (/\b(resume|cv|portfolio|profile)\b/.test(lower))
    return "Keep your resume concise — 1 page if possible. Highlight impact with numbers, not just responsibilities. Want me to suggest more?";

  // ---- Salary / CTC ----
  if (/\b(salary|ctc|pay|package|hike|raise|compensation|lpa)\b/.test(lower))
    return "Research market rates on Glassdoor for your role and experience level. Always negotiate — most companies expect it!";

  // ---- Thank you ----
  if (/\b(thank(s| you)|thnx|thx|appreciate|grateful)\b/.test(lower))
    return "You're welcome! Anytime — happy to help 😊";

  // ---- Bye / goodbye ----
  if (/\b(bye|goodbye|see you|talk later|ttyl|gotta go|cya|tc)\b/.test(lower))
    return "Take care! Great talking with you. Let's stay in touch 👋";

  // ---- Yes / agreement ----
  if (/^(yes|yeah|yep|yup|sure|absolutely|definitely|of course|agreed|exactly|right|ok|okay|sounds good)\.?$/.test(lower))
    return "Great! So what would you like to discuss next?";

  // ---- No / disagree ----
  if (/^(no|nope|not really|nah|i don.?t think so)\.?$/.test(lower))
    return "Alright, I understand. What's your take on it then?";

  // ---- Question asked ----
  if (lower.endsWith('?'))
    return "Good question! From my experience as a " + job + ", it really depends on the situation. What's the specific context you're dealing with?";

  // ---- Long message (sharing info) ----
  if (raw.length > 100)
    return "That's really helpful context, thanks for sharing! Let me think about this — I'd love to discuss it further.";

  // ---- Compliment ----
  if (/\b(nice|cool|awesome|great|amazing|wow|impressive|fantastic|brilliant)\b/.test(lower))
    return "Haha thanks! Appreciate that 😄 What's on your mind today?";

  // ---- I need / I want / I am looking ----
  if (/\b(i need|i want|i am looking|i'm looking|looking for)\b/.test(lower))
    return "Got it! Tell me more about what you're looking for — I'll help however I can.";

  // ---- Default — acknowledge and ask back ----
  return "Interesting! Could you tell me a bit more about that? I want to make sure I give you a proper reply.";
}

function chatKey(id1, id2) {
  return [id1, id2].sort().join('__');
}

window.onload = function() {
  getMe();
  loadContacts();
};
