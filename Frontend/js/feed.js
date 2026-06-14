// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

function getMe() {
  var u = localStorage.getItem('currentUser');
  if (!u) { window.location.href = 'index.html'; return null; }
  return JSON.parse(u);
}

function getPosts() {
  return JSON.parse(localStorage.getItem('posts') || '[]');
}

// ===== CREATE POST =====
function createPost() {
  var me   = getMe();
  var text = document.getElementById('postText').value.trim();
  var type = document.getElementById('postType').value;

  if (!text) { alert('Please write something!'); return; }

  var posts   = getPosts();
  var newPost = {
    id:         'p_' + Date.now(),
    authorId:   me.id,
    authorName: me.name,
    authorJob:  me.job || 'Professional',
    text:       text,
    type:       type,
    likes:      [],
    comments:   [],
    date:       new Date().toISOString()
  };

  posts.push(newPost);
  localStorage.setItem('posts', JSON.stringify(posts));
  document.getElementById('postText').value = '';
  loadFeed();
}

// ===== LIKE A POST =====
function likePost(postId) {
  var me    = getMe();
  var posts = getPosts();

  posts = posts.map(function(p) {
    if (p.id === postId) {
      if (p.likes.includes(me.id)) {
        p.likes = p.likes.filter(function(id) { return id !== me.id; }); // unlike
      } else {
        p.likes.push(me.id); // like
      }
    }
    return p;
  });

  localStorage.setItem('posts', JSON.stringify(posts));
  loadFeed();
}

// ===== ADD COMMENT =====
function addComment(postId) {
  var me    = getMe();
  var input = document.getElementById('cinput_' + postId);
  var text  = input.value.trim();
  if (!text) return;

  var posts = getPosts();
  posts = posts.map(function(p) {
    if (p.id === postId) {
      p.comments.push({ name: me.name, text: text, date: new Date().toISOString() });
    }
    return p;
  });

  localStorage.setItem('posts', JSON.stringify(posts));
  loadFeed();
}

// ===== TOGGLE COMMENT BOX =====
function toggleComments(postId) {
  var box = document.getElementById('cbox_' + postId);
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

// ===== LOAD FEED =====
function loadFeed() {
  var me    = getMe();
  var posts = getPosts();

  if (posts.length === 0) {
    document.getElementById('feedList').innerHTML =
      '<div class="card"><p style="color:#666; text-align:center;">No posts yet. Be the first to post!</p></div>';
    return;
  }

  // Show newest first
  var sorted = posts.slice().reverse();
  var html   = '';

  sorted.forEach(function(p) {
    var liked    = p.likes.includes(me.id);
    var likeBtn  = liked ? '❤️ ' + p.likes.length : '🤍 ' + p.likes.length;

    var commentsHtml = '';
    p.comments.forEach(function(c) {
      commentsHtml += '<div style="padding:6px 0; border-bottom:1px solid #f5f5f5; font-size:13px;">' +
        '<b>' + c.name + ':</b> ' + c.text + '</div>';
    });

    html +=
      '<div class="post-card">' +
        '<div class="post-header">' +
          '<div class="avatar">' + p.authorName.charAt(0) + '</div>' +
          '<div>' +
            '<b>' + p.authorName + '</b><br>' +
            '<span style="font-size:12px; color:#666;">' + p.authorJob + ' · ' + new Date(p.date).toLocaleDateString() + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="post-type-label">' + p.type + '</div>' +
        '<div class="post-text">' + p.text + '</div>' +
        '<div class="post-footer">' +
          '<button onclick="likePost(\'' + p.id + '\')">' + likeBtn + ' Like</button>' +
          '<button onclick="toggleComments(\'' + p.id + '\')">💬 ' + p.comments.length + ' Comments</button>' +
        '</div>' +
        '<div id="cbox_' + p.id + '" style="display:none; margin-top:10px;">' +
          commentsHtml +
          '<div style="display:flex; gap:8px; margin-top:8px;">' +
            '<input id="cinput_' + p.id + '" type="text" placeholder="Write a comment..." style="margin:0; flex:1;" />' +
            '<button onclick="addComment(\'' + p.id + '\')" style="padding:8px 14px;">Post</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  document.getElementById('feedList').innerHTML = html;
}

// ===== ADD DEMO POSTS =====
function addDemoPosts() {
  var posts = getPosts();
  if (posts.length > 0) return;

  var demos = [
    { id:'dp1', authorId:'demo_1', authorName:'Aarav Sharma',   authorJob:'Software Engineer',  text:'Just deployed my first microservices app on AWS! 🚀 The journey from monolith to microservices was tough but worth it. Happy to share learnings with anyone interested!', type:'Achievement', likes:['demo_2','demo_3'], comments:[], date: new Date(Date.now()-3*86400000).toISOString() },
    { id:'dp2', authorId:'demo_2', authorName:'Priya Patel',    authorJob:'Data Scientist',     text:'Finished reading "Hands-On Machine Learning with Scikit-Learn" — highly recommend it to anyone starting out in ML. Perfect mix of theory and practical code! 📚', type:'Tip', likes:['demo_1'], comments:[{name:'Aarav Sharma', text:'Great book! Also try Fast.ai course!', date:new Date().toISOString()}], date: new Date(Date.now()-2*86400000).toISOString() },
    { id:'dp3', authorId:'demo_5', authorName:'Kiran Kumar',    authorJob:'Product Manager',    text:'How do you all handle stakeholder disagreements on product priorities? Looking for tips from experienced PMs. Drop your thoughts below! 👇', type:'Question', likes:[], comments:[], date: new Date(Date.now()-86400000).toISOString() },
    { id:'dp4', authorId:'demo_4', authorName:'Sneha Reddy',    authorJob:'UI/UX Designer',     text:'Just got my Google UX Design Certificate! 🎉 6 months of hard work paid off. If anyone needs design feedback on their projects, feel free to reach out!', type:'Achievement', likes:['demo_1','demo_2','demo_5'], comments:[], date: new Date(Date.now()-43200000).toISOString() },
    { id:'dp5', authorId:'demo_7', authorName:'Vikram Nair',    authorJob:'DevOps Engineer',    text:'Pro tip: Always set up cost alerts in AWS/GCP before running experiments. Learnt this the hard way last month 😅 Cloud bills can get out of hand quickly!', type:'Tip', likes:['demo_9'], comments:[], date: new Date(Date.now()-21600000).toISOString() },
  ];

  localStorage.setItem('posts', JSON.stringify(demos));
}

// ===== ON PAGE LOAD =====
window.onload = function() {
  getMe();
  addDemoPosts();
  loadFeed();
};
