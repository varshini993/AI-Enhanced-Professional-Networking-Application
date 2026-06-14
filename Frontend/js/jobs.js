function logout() { localStorage.removeItem('currentUser'); window.location.href='index.html'; }

function getMe() {
  var u = localStorage.getItem('currentUser');
  if (!u) { window.location.href='index.html'; return null; }
  return JSON.parse(u);
}

function getJobs() { return JSON.parse(localStorage.getItem('jobs') || '[]'); }

var currentJob = null; // the job being applied to
var currentStep = 1;

// ========== POST JOB FORM ==========
function togglePostJob() {
  var c = document.getElementById('postJobCard');
  c.style.display = c.style.display === 'none' ? 'block' : 'none';
}

function postJob() {
  var me      = getMe();
  var title   = document.getElementById('jTitle').value.trim();
  var company = document.getElementById('jCompany').value.trim();
  if (!title || !company) { alert('Title and Company are required!'); return; }

  var jobs = getJobs();
  jobs.push({
    id:       'j_' + Date.now(),
    title:    title,
    company:  company,
    location: document.getElementById('jLocation').value.trim() || 'Remote',
    skills:   document.getElementById('jSkills').value.trim(),
    desc:     document.getElementById('jDesc').value.trim(),
    contact:  document.getElementById('jContact').value.trim(),
    postedBy: me.name,
    date:     new Date().toISOString()
  });

  localStorage.setItem('jobs', JSON.stringify(jobs));
  ['jTitle','jCompany','jLocation','jSkills','jDesc','jContact'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('postJobCard').style.display = 'none';
  loadJobs();
}

// ========== FILTER ==========
function filterJobs() {
  loadJobs(document.getElementById('jobSearch').value.toLowerCase());
}

// ========== RENDER JOBS ==========
function loadJobs(search) {
  var jobs = getJobs();
  if (search) {
    jobs = jobs.filter(function(j) {
      return (j.title + j.company + j.skills).toLowerCase().includes(search);
    });
  }

  var container = document.getElementById('jobsList');
  if (!jobs.length) {
    container.innerHTML = '<div class="card"><p style="color:#666;text-align:center;padding:20px;">No jobs found. Be the first to post!</p></div>';
    return;
  }

  var html = '';
  jobs.slice().reverse().forEach(function(j) {
    var skillTags = '';
    (j.skills||'').split(',').forEach(function(s) {
      s = s.trim();
      if (s) skillTags += '<span class="skill-tag" style="font-size:12px;">' + s + '</span> ';
    });

    html +=
      '<div class="job-card" style="background:white;border-radius:10px;padding:20px;margin-bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,0.07);">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">' +
          '<div>' +
            '<h3 style="margin-bottom:4px;font-size:1.05rem;">' + j.title + '</h3>' +
            '<div style="color:#2563eb;font-weight:bold;font-size:14px;">' + j.company + '</div>' +
            '<div style="color:#666;font-size:13px;margin:4px 0;">📍 ' + (j.location||'Remote') + ' &nbsp;·&nbsp; 📅 ' + new Date(j.date).toLocaleDateString() + '</div>' +
          '</div>' +
          '<button style="background:#16a34a;padding:9px 20px;" onclick="openApply(\'' + j.id + '\')">Apply Now →</button>' +
        '</div>' +
        '<p style="font-size:14px;color:#444;margin:12px 0;line-height:1.5;">' + (j.desc||'No description provided.') + '</p>' +
        '<div style="margin-bottom:8px;">' + skillTags + '</div>' +
        '<p style="font-size:12px;color:#999;">Posted by ' + j.postedBy + '</p>' +
      '</div>';
  });

  container.innerHTML = html;
}

// ========== OPEN APPLICATION MODAL ==========
function openApply(jobId) {
  var jobs = getJobs();
  currentJob = jobs.find(function(j){ return j.id === jobId; });
  if (!currentJob) return;

  // Pre-fill with user data
  var me = getMe();
  document.getElementById('appName').value  = me.name  || '';
  document.getElementById('appEmail').value = me.email || '';
  document.getElementById('appRole').value  = me.job   || currentJob.title;
  document.getElementById('appSkills').value= me.skills|| '';

  document.getElementById('applyJobTitle').textContent = currentJob.title;
  document.getElementById('applyCompany').textContent  = currentJob.company;

  // Reset all steps
  currentStep = 1;
  ['step1','step2','step3','step4','stepSuccess'].forEach(function(s){
    document.getElementById(s).classList.remove('active');
  });
  document.getElementById('step1').classList.add('active');
  updateProgress(1);

  document.getElementById('applyOverlay').style.display = 'flex';
}

function closeApply() {
  document.getElementById('applyOverlay').style.display = 'none';
  currentJob = null;
}

// ========== STEP NAVIGATION ==========
function goStep(stepNum) {
  // Validate before going forward
  if (stepNum > currentStep) {
    if (currentStep === 1) {
      if (!document.getElementById('appName').value.trim())  { alert('Please enter your full name!'); return; }
      if (!document.getElementById('appEmail').value.trim()) { alert('Please enter your email!'); return; }
    }
    if (currentStep === 2) {
      if (!document.getElementById('appRole').value.trim())  { alert('Please enter the role you are applying for!'); return; }
      var exp = document.querySelector('input[name="exp"]:checked');
      if (!exp) { alert('Please select your years of experience!'); return; }
    }
    if (currentStep === 3) {
      if (!document.getElementById('appSkills').value.trim()) { alert('Please enter your skills!'); return; }
    }
    if (currentStep === 4) {
      if (!document.getElementById('appCover').value.trim()) { alert('Please write a short cover note!'); return; }
    }
  }

  document.getElementById('step' + currentStep).classList.remove('active');
  currentStep = stepNum;
  document.getElementById('step' + currentStep).classList.add('active');
  updateProgress(stepNum);
}

function updateProgress(step) {
  for (var i = 1; i <= 4; i++) {
    document.getElementById('ps' + i).style.background = i <= step ? '#2563eb' : '#e5e7eb';
  }
}

// ========== SUBMIT APPLICATION ==========
function submitApplication() {
  var cover = document.getElementById('appCover').value.trim();
  if (!cover) { alert('Please write a cover note!'); return; }

  var me         = getMe();
  var name       = document.getElementById('appName').value.trim();
  var email      = document.getElementById('appEmail').value.trim();
  var phone      = document.getElementById('appPhone').value.trim();
  var role       = document.getElementById('appRole').value.trim();
  var experience = document.querySelector('input[name="exp"]:checked');
  var expVal     = experience ? experience.value : 'Not specified';
  var skills     = document.getElementById('appSkills').value.trim();
  var ctc        = document.getElementById('appCtc').value.trim();
  var expCtc     = document.getElementById('appExpCtc').value.trim();
  var notice     = document.querySelector('input[name="notice"]:checked');
  var noticeVal  = notice ? notice.value : 'Not specified';
  var link       = document.getElementById('appLink').value.trim();

  // Save application to localStorage
  var apps = JSON.parse(localStorage.getItem('applications') || '[]');
  apps.push({
    id:          'app_' + Date.now(),
    jobId:       currentJob.id,
    jobTitle:    currentJob.title,
    company:     currentJob.company,
    applicantId: me.id,
    name:        name,
    email:       email,
    phone:       phone,
    role:        role,
    experience:  expVal,
    skills:      skills,
    ctc:         ctc,
    expectedCtc: expCtc,
    notice:      noticeVal,
    cover:       cover,
    link:        link,
    appliedAt:   new Date().toISOString()
  });
  localStorage.setItem('applications', JSON.stringify(apps));

  // Build email preview content
  var emailBody =
    '<b>Subject:</b> Application Received — ' + currentJob.title + ' at ' + currentJob.company + '<br><br>' +
    'Dear <b>' + name + '</b>,<br><br>' +
    'Thank you for applying for the <b>' + role + '</b> position at <b>' + currentJob.company + '</b>. We have received your application and our hiring team will review it shortly.<br><br>' +
    '<b>Your Application Summary:</b><br>' +
    '• Role Applied: ' + role + '<br>' +
    '• Experience: ' + expVal + '<br>' +
    '• Key Skills: ' + skills + '<br>' +
    (expCtc ? '• Expected CTC: ' + expCtc + '<br>' : '') +
    '• Notice Period: ' + noticeVal + '<br><br>' +
    'We will get back to you within <b>3-5 business days</b>. If shortlisted, our team will reach out to schedule an interview.<br><br>' +
    'Best regards,<br><b>HR Team, ' + currentJob.company + '</b><br>' +
    '<i>Powered by ProNet</i>';

  // Show success screen
  document.getElementById('step4').classList.remove('active');
  document.getElementById('stepSuccess').classList.add('active');
  document.getElementById('successJobTitle').textContent = currentJob.title + ' at ' + currentJob.company;
  document.getElementById('successEmail').textContent    = email;
  document.getElementById('successCompany').textContent  = currentJob.company;
  document.getElementById('emailPreviewBody').innerHTML  = emailBody;

  // Actually open email client with prefilled email (mailto)
  var subject  = encodeURIComponent('Application: ' + role + ' — ' + currentJob.company);
  var body     = encodeURIComponent(
    'Dear HR Team at ' + currentJob.company + ',\n\n' +
    'I am writing to apply for the ' + role + ' position.\n\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    (phone ? 'Phone: ' + phone + '\n' : '') +
    'Experience: ' + expVal + '\n' +
    'Skills: ' + skills + '\n' +
    (expCtc ? 'Expected CTC: ' + expCtc + '\n' : '') +
    'Notice Period: ' + noticeVal + '\n' +
    (link ? 'Portfolio/LinkedIn: ' + link + '\n' : '') +
    '\nCover Note:\n' + cover + '\n\n' +
    'Looking forward to hearing from you.\n\nBest regards,\n' + name
  );

  var recruiterEmail = currentJob.contact || 'hr@' + currentJob.company.toLowerCase().replace(/[^a-z0-9]/g,'') + '.com';
  var mailtoLink = 'mailto:' + recruiterEmail + '?subject=' + subject + '&body=' + body;

  // Open email client after short delay
  setTimeout(function() {
    window.location.href = mailtoLink;
  }, 1200);
}

// ========== DEMO JOBS ==========
function addDemoJobs() {
  var jobs = getJobs();
  if (jobs.length > 0) return;
  var demo = [
    { id:'dj1', title:'Full Stack Developer',     company:'TechSoft India',    location:'Hyderabad', skills:'React, Node.js, MongoDB, REST API',      desc:'We need a skilled Full Stack Developer to build and maintain our web applications. 2+ years experience required.',        contact:'hr@techsoftindia.com', postedBy:'HR Rekha',   date:new Date(Date.now()-4*86400000).toISOString() },
    { id:'dj2', title:'Data Scientist',            company:'Analytics Pro',     location:'Bangalore',  skills:'Python, Machine Learning, SQL, TensorFlow',desc:'Join our data team to build ML models and extract insights from large datasets.',                                        contact:'jobs@analyticspro.in', postedBy:'HR Mohan',   date:new Date(Date.now()-3*86400000).toISOString() },
    { id:'dj3', title:'UI/UX Designer',            company:'DesignHub',         location:'Remote',     skills:'Figma, Adobe XD, HTML, CSS',               desc:'Creative designer needed to redesign our mobile app. Strong portfolio required. Work from anywhere.',                   contact:'design@designhub.io',  postedBy:'HR Preethi', date:new Date(Date.now()-2*86400000).toISOString() },
    { id:'dj4', title:'DevOps Engineer',           company:'CloudNine Tech',    location:'Pune',       skills:'AWS, Docker, Kubernetes, Jenkins',          desc:'Looking for a DevOps engineer to manage our CI/CD pipelines and cloud infrastructure. 3+ years required.',             contact:'hr@cloudnine.com',     postedBy:'HR Suresh',  date:new Date(Date.now()-86400000).toISOString() },
    { id:'dj5', title:'Python Backend Developer',  company:'AI Startup',        location:'Remote',     skills:'Python, FastAPI, PostgreSQL, ML',           desc:'Fast-growing AI startup looking for a Python developer to build backend APIs and ML pipelines.',                        contact:'careers@aistartup.io', postedBy:'HR Kavya',   date:new Date(Date.now()-43200000).toISOString() },
    { id:'dj6', title:'Digital Marketing Manager', company:'BrandBoost',        location:'Mumbai',     skills:'SEO, Google Ads, Content Marketing',        desc:'Seeking a digital marketing expert to grow our online presence. B2B marketing experience preferred.',                   contact:'jobs@brandboost.in',   postedBy:'HR Divya',   date:new Date(Date.now()-21600000).toISOString() },
    { id:'dj7', title:'Android Developer',         company:'MobileFirst',       location:'Chennai',    skills:'Kotlin, Java, Android SDK, Firebase',       desc:'Build consumer-facing Android apps with millions of users. Published apps on Play Store are a big plus.',               contact:'hr@mobilefirst.in',    postedBy:'HR Anand',   date:new Date(Date.now()-10800000).toISOString() },
    { id:'dj8', title:'Business Analyst',          company:'FinanceCorp',       location:'Delhi',      skills:'Excel, SQL, Power BI, Requirements',        desc:'Work with stakeholders to gather requirements and translate them into technical specifications for the dev team.',        contact:'ba@financecorp.com',   postedBy:'HR Ritu',    date:new Date(Date.now()-7200000).toISOString() },
    { id:'dj9', title:'Machine Learning Engineer', company:'DeepTech Labs',     location:'Hyderabad',  skills:'Python, PyTorch, NLP, Computer Vision',    desc:'Work on cutting-edge ML research and production models. Experience with LLMs is a strong plus.',                        contact:'ml@deeptechlabs.com',  postedBy:'HR Sanjay',  date:new Date(Date.now()-3600000).toISOString() },
    { id:'dj10',title:'React Native Developer',    company:'AppStudio',         location:'Remote',     skills:'React Native, JavaScript, Redux, Firebase', desc:'Build cross-platform mobile apps for our growing client base. 1-3 years React Native experience required.',             contact:'dev@appstudio.io',     postedBy:'HR Meena',   date:new Date(Date.now()-1800000).toISOString() },
  ];
  localStorage.setItem('jobs', JSON.stringify(demo));
}

window.onload = function() { getMe(); addDemoJobs(); loadJobs(); };
