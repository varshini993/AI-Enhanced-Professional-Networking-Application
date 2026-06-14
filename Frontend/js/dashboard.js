// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// ===== GET CURRENT USER =====
function getMe() {
  var u = localStorage.getItem('currentUser');
  if (!u) { window.location.href = 'index.html'; return null; }
  return JSON.parse(u);
}

// ===== GET ALL USERS =====
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

// ===== KNN: COMPUTE SIMILARITY BETWEEN TWO USERS =====
// This is the core ML logic - checks how similar two profiles are
function getSimilarityScore(me, other) {
  var score = 0;

  // Same industry = very similar
  if (me.industry && other.industry &&
      me.industry.toLowerCase() === other.industry.toLowerCase()) {
    score += 35;
  }

  // Shared skills
  var mySkills    = (me.skills    || '').toLowerCase().split(',').map(function(s) { return s.trim(); });
  var otherSkills = (other.skills || '').toLowerCase().split(',').map(function(s) { return s.trim(); });
  mySkills.forEach(function(skill) {
    if (skill && otherSkills.includes(skill)) {
      score += 12; // each shared skill adds points
    }
  });

  // Similar experience level
  var myExp    = parseInt(me.exp    || '0');
  var otherExp = parseInt(other.exp || '0');
  var diff     = Math.abs(myExp - otherExp);
  if      (diff === 0) score += 20;
  else if (diff <= 2)  score += 12;
  else if (diff <= 4)  score += 5;

  // Cap at 100
  return Math.min(score, 100);
}

// ===== LOAD AI RECOMMENDATIONS (KNN) =====
function loadRec() {
  var me    = getMe();
  var users = getUsers();

  // Filter: not me, not already connected
  var others = users.filter(function(u) {
    return u.id !== me.id && !(me.connections || []).includes(u.id);
  });

  if (others.length === 0) {
    document.getElementById('recGrid').innerHTML =
      '<p style="color:#666;">You are connected with everyone! 🎉</p>';
    return;
  }

  // Score each person (KNN: sort by similarity distance)
  var scored = others.map(function(u) {
    return { user: u, score: getSimilarityScore(me, u) };
  });

  // Sort highest score first (nearest neighbor first)
  scored.sort(function(a, b) { return b.score - a.score; });

  // Show top 8
  var top = scored.slice(0, 8);
  var html = '';

  top.forEach(function(item) {
    var u = item.user;
    html += '<div class="person-card">' +
      '<div class="avatar">' + u.name.charAt(0) + '</div>' +
      '<h4>' + u.name + '</h4>' +
      '<p>' + (u.job || 'Professional') + '</p>' +
      '<p style="color:#888; font-size:12px;">' + (u.industry || '') + '</p>' +
      '<div class="match-badge">🎯 ' + item.score + '% Match</div>' +
      '<br>' +
      '<button class="small green" onclick="quickConnect(\'' + u.id + '\', this)">+ Connect</button>' +
      '</div>';
  });

  document.getElementById('recGrid').innerHTML = html;
}

// ===== QUICK CONNECT FROM DASHBOARD =====
function quickConnect(targetId, btn) {
  var me    = getMe();
  var users = getUsers();

  // Add to my connections
  if (!(me.connections || []).includes(targetId)) {
    me.connections = (me.connections || []).concat(targetId);
  }

  // Add me to their connections
  users = users.map(function(u) {
    if (u.id === targetId) {
      var c = u.connections || [];
      if (!c.includes(me.id)) c.push(me.id);
      u.connections = c;
    }
    return u;
  });

  users = users.map(function(u) { return u.id === me.id ? me : u; });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(me));

  // Update button
  btn.textContent  = '✓ Connected';
  btn.className    = 'small gray';
  btn.disabled     = true;

  // Update connection count
  document.getElementById('sConn').textContent = (me.connections || []).length;
}

// ===== LOAD RECENT POSTS =====
function loadRecentPosts() {
  var posts     = JSON.parse(localStorage.getItem('posts') || '[]');
  var container = document.getElementById('recentPosts');

  if (posts.length === 0) {
    container.innerHTML = '<p style="color:#666;">No posts yet. Visit the Feed to post something!</p>';
    return;
  }

  // Show last 3 posts
  var recent  = posts.slice(-3).reverse();
  var html    = '';
  recent.forEach(function(p) {
    html += '<div style="padding:10px 0; border-bottom:1px solid #f0f0f0;">' +
      '<b>' + p.authorName + '</b> posted: ' +
      '<span style="color:#555;">' + p.text.substring(0, 100) + '...</span>' +
      '<span style="color:#999; font-size:12px; margin-left:10px;">' + new Date(p.date).toLocaleDateString() + '</span>' +
      '</div>';
  });

  container.innerHTML = html;
}

// ===== ON PAGE LOAD =====
window.onload = function() {
  var me = getMe();
  if (!me) return;

  // Welcome message
  document.getElementById('uName').textContent = me.name;
  document.getElementById('uJob').textContent  = (me.job || '') + (me.industry ? ' · ' + me.industry : '');

  // Stats
  document.getElementById('sConn').textContent  = (me.connections || []).length;
  var posts = JSON.parse(localStorage.getItem('posts') || '[]');
  var myPosts = posts.filter(function(p) { return p.authorId === me.id; });
  document.getElementById('sPosts').textContent  = myPosts.length;
  var jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
  document.getElementById('sJobs').textContent   = jobs.length;

  // Load recs and posts
  loadRec();
  loadRecentPosts();
};
