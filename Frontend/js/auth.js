// ===== HELPER FUNCTIONS =====
function show(id) { document.getElementById(id).style.display = 'block'; }
function hide(id) { document.getElementById(id).style.display = 'none'; }

// ===== GET ALL USERS FROM STORAGE =====
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

// ===== REGISTER =====
function register() {
  var name     = document.getElementById('rName').value.trim();
  var email    = document.getElementById('rEmail').value.trim();
  var password = document.getElementById('rPass').value.trim();
  var job      = document.getElementById('rJob').value.trim();
  var industry = document.getElementById('rIndustry').value.trim();
  var skills   = document.getElementById('rSkills').value.trim();
  var exp      = document.getElementById('rExp').value.trim();

  // Simple validation
  if (!name || !email || !password) {
    alert('Please fill in Name, Email and Password!');
    return;
  }

  var users = getUsers();

  // Check if email already exists
  var exists = users.find(function(u) { return u.email === email; });
  if (exists) {
    alert('This email is already registered. Please login.');
    return;
  }

  // Create new user object
  var newUser = {
    id:          'u_' + Date.now(),
    name:        name,
    email:       email,
    password:    password,
    job:         job,
    industry:    industry,
    skills:      skills,
    exp:         exp,
    education:   '',
    interests:   '',
    bio:         '',
    connections: [],   // list of user IDs they are connected with
    sentRequests: [],  // list of user IDs they sent request to
    createdAt:   new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));

  alert('Account created! Welcome to ProNet.');
  window.location.href = 'profile.html';
}

// ===== LOGIN =====
function login() {
  var email    = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('Please enter email and password!');
    return;
  }

  var users = getUsers();
  var user  = users.find(function(u) { return u.email === email && u.password === password; });

  if (!user) {
    alert('Wrong email or password. Please try again.');
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  window.location.href = 'dashboard.html';
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// If already logged in, go to dashboard
if (localStorage.getItem('currentUser')) {
  window.location.href = 'dashboard.html';
}
