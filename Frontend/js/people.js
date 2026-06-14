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

// ===== SAVE USER =====
function saveUser(user) {
  var users = getUsers();
  users = users.map(function(u) { return u.id === user.id ? user : u; });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// ===== 30 DEMO USERS (lots of people to connect!) =====
function addDemoUsers() {
  var users = getUsers();
  var demoExists = users.find(function(u) { return u.id === 'demo_1'; });
  if (demoExists) return; // already added

  var demoUsers = [
    { id:'demo_1',  name:'Aarav Sharma',    job:'Software Engineer',    industry:'Technology',   skills:'Python, React, Node.js',          exp:'3', connections:[], sentRequests:[] },
    { id:'demo_2',  name:'Priya Patel',     job:'Data Scientist',       industry:'Data Science', skills:'Python, ML, TensorFlow, SQL',      exp:'4', connections:[], sentRequests:[] },
    { id:'demo_3',  name:'Rahul Gupta',     job:'Full Stack Developer', industry:'Technology',   skills:'JavaScript, React, MongoDB',       exp:'2', connections:[], sentRequests:[] },
    { id:'demo_4',  name:'Sneha Reddy',     job:'UI/UX Designer',       industry:'Design',       skills:'Figma, Adobe XD, CSS, HTML',       exp:'3', connections:[], sentRequests:[] },
    { id:'demo_5',  name:'Kiran Kumar',     job:'Product Manager',      industry:'Technology',   skills:'Agile, JIRA, Roadmapping',         exp:'5', connections:[], sentRequests:[] },
    { id:'demo_6',  name:'Anjali Singh',    job:'Business Analyst',     industry:'Finance',      skills:'Excel, SQL, Power BI, Tableau',    exp:'4', connections:[], sentRequests:[] },
    { id:'demo_7',  name:'Vikram Nair',     job:'DevOps Engineer',      industry:'Technology',   skills:'Docker, Kubernetes, AWS, Jenkins',  exp:'6', connections:[], sentRequests:[] },
    { id:'demo_8',  name:'Meera Iyer',      job:'ML Engineer',          industry:'Data Science', skills:'Python, Deep Learning, PyTorch',   exp:'3', connections:[], sentRequests:[] },
    { id:'demo_9',  name:'Arjun Mehta',     job:'Cloud Architect',      industry:'Technology',   skills:'AWS, Azure, GCP, Terraform',       exp:'7', connections:[], sentRequests:[] },
    { id:'demo_10', name:'Divya Krishnan',  job:'Data Analyst',         industry:'Data Science', skills:'Python, SQL, Tableau, R',          exp:'2', connections:[], sentRequests:[] },
    { id:'demo_11', name:'Sanjay Verma',    job:'Cybersecurity Analyst',industry:'Technology',   skills:'Ethical Hacking, SIEM, Kali Linux', exp:'4', connections:[], sentRequests:[] },
    { id:'demo_12', name:'Nisha Agarwal',   job:'Marketing Manager',    industry:'Marketing',    skills:'SEO, Google Ads, Content, HubSpot', exp:'5', connections:[], sentRequests:[] },
    { id:'demo_13', name:'Rohan Joshi',     job:'Backend Developer',    industry:'Technology',   skills:'Java, Spring Boot, MySQL, REST API', exp:'3', connections:[], sentRequests:[] },
    { id:'demo_14', name:'Kavya Menon',     job:'HR Manager',           industry:'HR',           skills:'Recruitment, HRMS, Employee Engagement', exp:'6', connections:[], sentRequests:[] },
    { id:'demo_15', name:'Aditya Rao',      job:'Frontend Developer',   industry:'Technology',   skills:'React, Vue, TypeScript, CSS',       exp:'2', connections:[], sentRequests:[] },
    { id:'demo_16', name:'Swati Desai',     job:'Financial Analyst',    industry:'Finance',      skills:'Excel, Bloomberg, Financial Modeling', exp:'4', connections:[], sentRequests:[] },
    { id:'demo_17', name:'Manish Tiwari',   job:'Android Developer',    industry:'Technology',   skills:'Kotlin, Java, Android SDK, Firebase', exp:'3', connections:[], sentRequests:[] },
    { id:'demo_18', name:'Pooja Kapoor',    job:'Content Writer',       industry:'Marketing',    skills:'SEO Writing, Copywriting, WordPress', exp:'2', connections:[], sentRequests:[] },
    { id:'demo_19', name:'Suresh Pillai',   job:'Data Engineer',        industry:'Data Science', skills:'Python, Spark, Hadoop, Kafka, SQL',  exp:'5', connections:[], sentRequests:[] },
    { id:'demo_20', name:'Ritu Saxena',     job:'Graphic Designer',     industry:'Design',       skills:'Illustrator, Photoshop, Figma',      exp:'3', connections:[], sentRequests:[] },
    { id:'demo_21', name:'Nikhil Bhatt',    job:'iOS Developer',        industry:'Technology',   skills:'Swift, Xcode, UIKit, Core Data',     exp:'4', connections:[], sentRequests:[] },
    { id:'demo_22', name:'Ananya Bose',     job:'Research Analyst',     industry:'Finance',      skills:'Research, Excel, Equity Analysis',   exp:'2', connections:[], sentRequests:[] },
    { id:'demo_23', name:'Kunal Pandey',    job:'System Administrator', industry:'Technology',   skills:'Linux, Networking, VMware, Shell',   exp:'5', connections:[], sentRequests:[] },
    { id:'demo_24', name:'Ishaan Chopra',   job:'Game Developer',       industry:'Technology',   skills:'Unity, C#, Blender, Unreal Engine',  exp:'3', connections:[], sentRequests:[] },
    { id:'demo_25', name:'Riya Malhotra',   job:'Social Media Manager', industry:'Marketing',    skills:'Instagram, Facebook Ads, Canva',     exp:'2', connections:[], sentRequests:[] },
    { id:'demo_26', name:'Amrit Choudhury', job:'Network Engineer',     industry:'Technology',   skills:'Cisco, TCP/IP, Firewalls, VPN',      exp:'6', connections:[], sentRequests:[] },
    { id:'demo_27', name:'Shruti Bansal',   job:'QA Engineer',          industry:'Technology',   skills:'Selenium, JIRA, Manual Testing, API', exp:'3', connections:[], sentRequests:[] },
    { id:'demo_28', name:'Gaurav Mishra',   job:'BI Developer',         industry:'Data Science', skills:'Power BI, SQL, DAX, Tableau',        exp:'4', connections:[], sentRequests:[] },
    { id:'demo_29', name:'Tanvi Shah',      job:'Healthcare Analyst',   industry:'Healthcare',   skills:'Clinical Data, SPSS, R, Health Informatics', exp:'3', connections:[], sentRequests:[] },
    { id:'demo_30', name:'Vivek Dubey',     job:'Blockchain Developer', industry:'Technology',   skills:'Solidity, Ethereum, Web3.js, Smart Contracts', exp:'3', connections:[], sentRequests:[] },
  ];

  // Add email/password so they can technically be "logged in" too
  demoUsers.forEach(function(d) {
    d.email    = d.id + '@pronet.com';
    d.password = '1234';
    d.education  = 'B.Tech Computer Science';
    d.interests  = 'Technology, Startups, AI';
    d.bio        = 'Passionate professional open to networking.';
    d.createdAt  = new Date().toISOString();
    users.push(d);
  });

  localStorage.setItem('users', JSON.stringify(users));
}

// ===== CURRENT FILTER STATE =====
var currentIndustry = 'All';
var currentSearch   = '';
var currentTab      = 'all';

// ===== SHOW TAB =====
function switchTab(tab) {
  currentTab = tab;
  document.getElementById('allTab').style.display  = tab === 'all'         ? 'block' : 'none';
  document.getElementById('connTab').style.display = tab === 'connections' ? 'block' : 'none';
  document.getElementById('sentTab').style.display = tab === 'sent'        ? 'block' : 'none';

  document.getElementById('tab1').className = tab === 'all'         ? 'tab-btn active' : 'tab-btn';
  document.getElementById('tab2').className = tab === 'connections' ? 'tab-btn active' : 'tab-btn';
  document.getElementById('tab3').className = tab === 'sent'        ? 'tab-btn active' : 'tab-btn';

  renderAll();
}

// ===== FILTER BY INDUSTRY =====
function filterByIndustry(industry) {
  currentIndustry = industry;
  // Update button styles
  document.querySelectorAll('.tag-btn').forEach(function(btn) {
    btn.className = btn.textContent.trim() === industry ? 'tag-btn active' : 'tag-btn';
  });
  renderAll();
}

// ===== SEARCH =====
function filterPeople() {
  currentSearch = document.getElementById('searchBox').value.toLowerCase();
  renderAll();
}

// ===== RENDER ALL TABS =====
function renderAll() {
  renderAllPeople();
  renderConnections();
  renderSent();
}

// ===== RENDER ALL PEOPLE =====
function renderAllPeople() {
  var me    = getMe();
  var users = getUsers();

  // Filter out self
  var others = users.filter(function(u) { return u.id !== me.id; });

  // Filter by industry
  if (currentIndustry !== 'All') {
    others = others.filter(function(u) {
      return (u.industry || '').toLowerCase() === currentIndustry.toLowerCase();
    });
  }

  // Filter by search text
  if (currentSearch) {
    others = others.filter(function(u) {
      var text = (u.name + u.job + u.industry + u.skills).toLowerCase();
      return text.includes(currentSearch);
    });
  }

  var html = '';

  if (others.length === 0) {
    html = '<p style="color:#666; padding:20px;">No people found.</p>';
  } else {
    others.forEach(function(u) {
      var isConnected = (me.connections || []).includes(u.id);
      var isSent      = (me.sentRequests || []).includes(u.id);

      var btnHtml = '';
      if (isConnected) {
        btnHtml = '<button class="small gray" disabled>✓ Connected</button>';
      } else if (isSent) {
        btnHtml = '<button class="small gray" onclick="cancelRequest(\'' + u.id + '\')">✕ Cancel Request</button>';
      } else {
        btnHtml = '<button class="small green" onclick="sendRequest(\'' + u.id + '\')">+ Connect</button>';
      }

      html += '<div class="person-card" id="pcard_' + u.id + '">' +
        '<div class="avatar">' + u.name.charAt(0) + '</div>' +
        '<h4>' + u.name + '</h4>' +
        '<p>' + (u.job || 'Professional') + '</p>' +
        '<p style="color:#888;">' + (u.industry || '') + '</p>' +
        '<p style="font-size:11px; color:#aaa;">' + (u.exp || '0') + ' yrs exp</p>' +
        btnHtml +
        '</div>';
    });
  }

  document.getElementById('allPeople').innerHTML = html;
}

// ===== RENDER MY CONNECTIONS =====
function renderConnections() {
  var me    = getMe();
  var users = getUsers();

  var connected = users.filter(function(u) {
    return (me.connections || []).includes(u.id);
  });

  document.getElementById('connCount').textContent = connected.length;

  if (connected.length === 0) {
    document.getElementById('myConnections').innerHTML =
      '<p style="color:#666; padding:20px;">No connections yet. Go connect with people!</p>';
    return;
  }

  var html = '';
  connected.forEach(function(u) {
    html += '<div class="person-card">' +
      '<div class="avatar">' + u.name.charAt(0) + '</div>' +
      '<h4>' + u.name + '</h4>' +
      '<p>' + (u.job || 'Professional') + '</p>' +
      '<p style="color:#888;">' + (u.industry || '') + '</p>' +
      '<button class="small red" onclick="removeConnection(\'' + u.id + '\')">Remove</button>' +
      '</div>';
  });

  document.getElementById('myConnections').innerHTML = html;
}

// ===== RENDER SENT REQUESTS =====
function renderSent() {
  var me    = getMe();
  var users = getUsers();

  var sent = users.filter(function(u) {
    return (me.sentRequests || []).includes(u.id);
  });

  if (sent.length === 0) {
    document.getElementById('sentRequests').innerHTML =
      '<p style="color:#666; padding:20px;">No pending requests sent.</p>';
    return;
  }

  var html = '';
  sent.forEach(function(u) {
    html += '<div class="person-card">' +
      '<div class="avatar">' + u.name.charAt(0) + '</div>' +
      '<h4>' + u.name + '</h4>' +
      '<p>' + (u.job || 'Professional') + '</p>' +
      '<button class="small gray" onclick="cancelRequest(\'' + u.id + '\')">✕ Cancel Request</button>' +
      '</div>';
  });

  document.getElementById('sentRequests').innerHTML = html;
}

// ===== SEND CONNECTION REQUEST =====
// For simplicity: request is auto-accepted (instant connect)
function sendRequest(targetId) {
  var me    = getMe();
  var users = getUsers();

  // Add to my connections directly (auto accept for simplicity)
  if (!(me.connections || []).includes(targetId)) {
    me.connections = (me.connections || []).concat(targetId);
  }

  // Also add me to their connections
  users = users.map(function(u) {
    if (u.id === targetId) {
      var theirConns = u.connections || [];
      if (!theirConns.includes(me.id)) theirConns.push(me.id);
      u.connections = theirConns;
    }
    return u;
  });

  // Update me in users list
  users = users.map(function(u) { return u.id === me.id ? me : u; });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(me));

  renderAll();
}

// ===== CANCEL REQUEST =====
function cancelRequest(targetId) {
  var me    = getMe();
  me.sentRequests = (me.sentRequests || []).filter(function(id) { return id !== targetId; });
  saveUser(me);
  renderAll();
}

// ===== REMOVE CONNECTION =====
function removeConnection(targetId) {
  var me    = getMe();
  var users = getUsers();

  me.connections = (me.connections || []).filter(function(id) { return id !== targetId; });

  // Remove from their side too
  users = users.map(function(u) {
    if (u.id === targetId) {
      u.connections = (u.connections || []).filter(function(id) { return id !== me.id; });
    }
    return u;
  });

  users = users.map(function(u) { return u.id === me.id ? me : u; });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(me));

  renderAll();
}

// ===== ON PAGE LOAD =====
window.onload = function() {
  var me = getMe();
  if (!me) return;
  addDemoUsers();  // Add 30 demo users if not already added
  renderAll();
};
