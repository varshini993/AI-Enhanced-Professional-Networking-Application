// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// ===== GET / SAVE USER =====
function getMe() {
  var u = localStorage.getItem('currentUser');
  if (!u) { window.location.href = 'index.html'; return null; }
  return JSON.parse(u);
}

function saveMe(user) {
  var users = JSON.parse(localStorage.getItem('users') || '[]');
  users = users.map(function(u) { return u.id === user.id ? user : u; });
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// ===== SHOW PROFILE =====
function showProfile() {
  var me = getMe();
  if (!me) return;

  // Show photo or letter avatar
  showAvatar(me.photo, me.name, 'avatarLetter', 'avatarPhoto');
  showAvatar(me.photo, me.name, 'editAvatarLetter', 'editAvatarPhoto');

  document.getElementById('pName').textContent = me.name;
  document.getElementById('pJob').textContent  = me.job      || 'Not set';
  document.getElementById('pInd').textContent  = me.industry || 'Not set';
  document.getElementById('pBio').textContent  = me.bio      || '';
  document.getElementById('pExp').textContent  = me.exp      || 'Not set';
  document.getElementById('pEdu').textContent  = me.education || 'Not set';
  document.getElementById('pInt').textContent  = me.interests || 'Not set';

  // Skills
  var skills = (me.skills || '').split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  var skillHtml = '';
  if (skills.length > 0) {
    skills.forEach(function(s) {
      skillHtml += '<span class="skill-tag">' + s + '</span>';
    });
  } else {
    skillHtml = '<p style="color:#666;">No skills added. Edit your profile!</p>';
  }
  document.getElementById('skillTags').innerHTML = skillHtml;

  // Pre-fill edit form
  document.getElementById('eName').value      = me.name      || '';
  document.getElementById('eJob').value       = me.job       || '';
  document.getElementById('eIndustry').value  = me.industry  || '';
  document.getElementById('eSkills').value    = me.skills    || '';
  document.getElementById('eExp').value       = me.exp       || '';
  document.getElementById('eEdu').value       = me.education || '';
  document.getElementById('eInterests').value = me.interests || '';
  document.getElementById('eBio').value       = me.bio       || '';
}

// ===== SHOW AVATAR (photo or letter) =====
function showAvatar(photo, name, letterId, photoId) {
  var letterEl = document.getElementById(letterId);
  var photoEl  = document.getElementById(photoId);
  if (!letterEl || !photoEl) return;
  if (photo) {
    letterEl.style.display = 'none';
    photoEl.src            = photo;
    photoEl.style.display  = 'block';
  } else {
    letterEl.style.display = 'flex';
    letterEl.textContent   = (name || 'U').charAt(0).toUpperCase();
    photoEl.style.display  = 'none';
  }
}

// ===== HANDLE PHOTO UPLOAD FROM FILE =====
function handlePhotoUpload(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    var base64 = e.target.result;
    savePhotoToProfile(base64);
  };
  reader.readAsDataURL(file);
}

// ===== OPEN CAMERA =====
var cameraStream = null;

function openCamera() {
  var section = document.getElementById('cameraSection');
  var video   = document.getElementById('cameraVideo');
  section.style.display = 'block';

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      cameraStream  = stream;
      video.srcObject = stream;
    })
    .catch(function() {
      alert('Could not access camera. Please allow camera permission or use "Choose from Files" instead.');
      section.style.display = 'none';
    });
}

// ===== SNAP PHOTO FROM CAMERA =====
function snapPhoto() {
  var video  = document.getElementById('cameraVideo');
  var canvas = document.getElementById('snapCanvas');
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  var base64 = canvas.toDataURL('image/jpeg', 0.8);
  savePhotoToProfile(base64);
  closeCamera();
}

// ===== CLOSE CAMERA =====
function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(function(t) { t.stop(); });
    cameraStream = null;
  }
  document.getElementById('cameraSection').style.display = 'none';
}

// ===== REMOVE PHOTO =====
function removePhoto() {
  var me   = getMe();
  me.photo = '';
  saveMe(me);
  showProfile();
}

// ===== SAVE PHOTO TO PROFILE =====
function savePhotoToProfile(base64) {
  var me   = getMe();
  me.photo = base64;
  saveMe(me);
  showProfile();
  alert('Photo updated!');
}

// ===== TOGGLE EDIT FORM =====
function toggleEdit() {
  var card = document.getElementById('editCard');
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
}

// ===== SAVE PROFILE =====
function saveProfile() {
  var me = getMe();

  me.name      = document.getElementById('eName').value.trim()      || me.name;
  me.job       = document.getElementById('eJob').value.trim();
  me.industry  = document.getElementById('eIndustry').value.trim();
  me.skills    = document.getElementById('eSkills').value.trim();
  me.exp       = document.getElementById('eExp').value.trim();
  me.education = document.getElementById('eEdu').value.trim();
  me.interests = document.getElementById('eInterests').value.trim();
  me.bio       = document.getElementById('eBio').value.trim();

  saveMe(me);
  document.getElementById('editCard').style.display = 'none';
  showProfile();
  alert('Profile saved successfully!');
}

// ===== AI SUMMARY (calls Flask backend, fallback if offline) =====
function genSummary() {
  var me = getMe();

  document.getElementById('aiLoader').style.display  = 'block';
  document.getElementById('aiSummary').textContent   = '';

  var prompt =
    'Write a short professional LinkedIn summary (3-4 sentences, first person) for:\n' +
    'Name: '       + me.name      + '\n' +
    'Job: '        + (me.job       || 'Professional')  + '\n' +
    'Industry: '   + (me.industry  || 'General')       + '\n' +
    'Skills: '     + (me.skills    || 'Various skills') + '\n' +
    'Experience: ' + (me.exp       || '0') + ' years\n' +
    'Education: '  + (me.education || 'Not specified')  + '\n' +
    'Interests: '  + (me.interests || 'Not specified')  + '\n' +
    'Only return the summary. No extra text.';

  // Try Flask backend first
  fetch('http://127.0.0.1:5000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    document.getElementById('aiLoader').style.display = 'none';
    document.getElementById('aiSummary').textContent  = data.result || 'Could not generate. Try again.';
  })
  .catch(function() {
    // Backend not running — use simple fallback
    document.getElementById('aiLoader').style.display = 'none';
    document.getElementById('aiSummary').textContent  = buildFallbackSummary(me);
  });
}

// ===== FALLBACK SUMMARY (works without backend) =====
function buildFallbackSummary(me) {
  var job      = me.job      || 'professional';
  var industry = me.industry || 'my field';
  var skills   = (me.skills  || '').split(',').slice(0, 3).join(', ') || 'various technologies';
  var exp      = me.exp      || '0';
  return (
    'I am a passionate ' + job + ' with ' + exp + ' years of experience in ' + industry + '. ' +
    'My core skills include ' + skills + ', which I use to build impactful solutions. ' +
    'I enjoy collaborating with teams, solving complex problems, and continuously learning new things. ' +
    'Always open to exciting new opportunities and professional connections!'
  );
}

// ===== AI NETWORKING INSIGHTS =====
function genInsights() {
  var me = getMe();

  document.getElementById('insLoader').style.display  = 'block';
  document.getElementById('aiInsights').textContent   = '';

  var prompt =
    'Give exactly 3 short, practical networking tips for this professional:\n' +
    'Job: '      + (me.job      || 'Professional') + '\n' +
    'Industry: ' + (me.industry || 'General')      + '\n' +
    'Skills: '   + (me.skills   || 'Various')      + '\n' +
    'Format as: 1. ... 2. ... 3. ... Only return the 3 tips.';

  fetch('http://127.0.0.1:5000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt })
  })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    document.getElementById('insLoader').style.display = 'none';
    document.getElementById('aiInsights').textContent  = data.result || 'Could not generate. Try again.';
  })
  .catch(function() {
    document.getElementById('insLoader').style.display = 'none';
    document.getElementById('aiInsights').textContent  = buildFallbackInsights(me);
  });
}

// ===== FALLBACK INSIGHTS =====
function buildFallbackInsights(me) {
  var job      = me.job      || 'your role';
  var industry = me.industry || 'your industry';
  return (
    '1. Join LinkedIn groups related to ' + industry + ' and actively comment on posts — visibility leads to connections.\n\n' +
    '2. Reach out to 2-3 ' + job + ' professionals every week and ask for a 15-minute virtual coffee chat.\n\n' +
    '3. Share your projects and learnings publicly — posting regularly on ProNet builds your reputation and attracts the right people.'
  );
}

// ===== ON PAGE LOAD =====
window.onload = function() {
  showProfile();
};
