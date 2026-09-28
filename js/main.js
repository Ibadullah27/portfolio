/**
 * Portfolio Dynamic Engine
 * Fetches resume.json, dynamically builds DOM, manages themes & micro-interactions.
 */

// Fallback data in case the page is opened directly via file:// protocol where fetch is restricted by browser CORS
const FALLBACK_RESUME = {
  "basics": {
    "name": "Ibadullah",
    "shortName": "IBA",
    "label": "Dedicated Student at GU Tech",
    "headline": "I study full-time and am focused on becoming a complete solution architect.",
    "summary": "Computer Science student based in Karachi, Pakistan, currently pursuing a BSCS at GU Tech. Passionate about core programming logic, OOP, and building scalable software solutions. A dedicated team player and recognized leader with a strong foundation in C, C++, and Python.",
    "location": {
      "country": "Pakistan",
      "countryCode": "PK",
      "region": "Karachi"
    },
    "email": "ibadullahibad27@gmail.com",
    "availability": "Currently at GU Tech since April 2026",
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "ibadullah",
        "url": "https://www.linkedin.com/in/ibadullah-",
        "icon": "fa-brands fa-linkedin-in"
      },
      {
        "network": "GitHub",
        "username": "ibadullah",
        "url": "https://github.com/",
        "icon": "fa-brands fa-github"
      }
    ]
  },
  "about": {
    "intro": [
      "My background in Computer Science spans from Matric (C) to Intermediate (C++), complemented by independent learning in Python.",
      "I am deeply interested in architectural design and clean code principles."
    ],
    "strengths": [
      "Core programming logic",
      "Object-Oriented Programming (OOP)",
      "Leadership & Responsibility",
      "Quick Learner"
    ]
  },
  "skills": [
    {
      "category": "Programming Languages",
      "items": ["C", "C++", "Python", "JavaScript"]
    },
    {
      "category": "Core Concepts",
      "items": ["OOP", "Data Structures", "Algorithms", "Database Systems"]
    },
    {
      "category": "Soft Skills",
      "items": ["Leadership", "Team Collaboration", "Problem Solving"]
    }
  ],
  "work": [
    {
      "company": "GU Tech",
      "position": "BSCS Student / Tech Lead (Academic Projects)",
      "website": "https://gutech.edu.pk",
      "startDate": "2026-01",
      "endDate": "Present",
      "summary": "Leading academic group projects and focusing on advanced software engineering principles.",
      "highlights": [
        "Collaborated on system design for local community projects.",
        "Maintained high academic standing in core CS modules."
      ]
    },
    {
      "company": "Freelance",
      "position": "Junior Developer",
      "startDate": "2024-07",
      "endDate": "2025-12",
      "summary": "Assisted in small-scale Python automation scripts and local business landing pages.",
      "highlights": [
        "Developed automated data entry tools using Python.",
        "Designed responsive layouts for local clients."
      ]
    }
  ],
  "projects": [
    {
      "name": "Personal Portfolio",
      "description": "A modern, premium portfolio website built with Vanilla JS, HTML, and CSS, dynamically populated from a JSON resume schema.",
      "highlights": ["Dynamic JSON Parsing", "Glassmorphism UI", "Intersection Observer Animations"],
      "keywords": ["JavaScript", "CSS3", "HTML5"],
      "url": "#"
    },
    {
      "name": "Inventory Management System",
      "description": "A C++ based console application implementing OOP principles for managing local shop inventories.",
      "highlights": ["File I/O", "Class Inheritance", "Data Persistence"],
      "keywords": ["C++", "OOP"],
      "url": "#"
    }
  ],
  "education": [
    {
      "institution": "GU Tech",
      "area": "Computer Science",
      "studyType": "BSCS",
      "startDate": "2026-01-01",
      "endDate": "2030-12-01"
    },
    {
      "institution": "govt.Dehli college",
      "area": "pre-engneering",
      "studyType": "Intermediate",
      "details": [
        "Object-Oriented Programming",
        "Database Systems"
      ],
      "startDate": "2022-08-01",
      "endDate": "2024-06-01"
    },
    {
      "institution": "usman public school system",
      "area": "Computer Science",
      "studyType": "Matric",
      "startDate": "2022-01-01",
      "endDate": "2023-12-01"
    }
  ],
  "certificates": [
    {
      "name": "IELTS",
      "issuer": "British Council",
      "url": "https://www.britishcouncil.pk/"
    },
    {
      "name": "Continental Chef",
      "issuer": "Pakistan Institute of Tourism & Hotel Management (PITHM)",
      "url": "https://www.pithm.edu.pk/"
    }
  ],
  "languages": [
    {
      "language": "English",
      "fluency": "Fluent"
    },
    {
      "language": "Urdu",
      "fluency": "Native"
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initMobileMenu();
  loadPortfolioData();
  initContactForm();
});

/**
 * Loads resume.json data using fetch() with graceful fallback
 */
async function loadPortfolioData() {
  let data = null;
  try {
    const response = await fetch('resume.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
    console.log('Successfully fetched resume.json dynamically:', data);
  } catch (err) {
    console.warn('Direct fetch failed (likely file:// protocol or offline). Loading fallback dataset.', err);
    data = FALLBACK_RESUME;
  }

  // Render all dynamic sections
  renderBasics(data.basics);
  renderAbout(data.about, data.basics);
  renderSkills(data.skills);
  renderWork(data.work);
  renderProjects(data.projects);
  renderEducation(data.education);
  renderCertificates(data.certificates);
  renderLanguages(data.languages);
  renderContact(data.basics);

  // Initialize interactive observers after DOM is populated
  initScrollSpy();
  initRevealAnimations();
}

/**
 * Render Basics / Hero / Header
 */
function renderBasics(basics) {
  if (!basics) return;

  // Nav brand
  const navShortName = document.getElementById('nav-short-name');
  if (navShortName) navShortName.textContent = basics.shortName || basics.name;
  
  const navBrandFull = document.getElementById('nav-brand-full');
  if (navBrandFull) navBrandFull.textContent = basics.name;

  // Hero Status Pill
  const heroStatusText = document.getElementById('hero-status-text');
  if (heroStatusText && basics.availability) {
    heroStatusText.textContent = basics.availability;
  }

  // Hero Name & Headline
  const heroName = document.getElementById('hero-name');
  if (heroName) heroName.textContent = basics.name;

  const heroHeadline = document.getElementById('hero-headline');
  if (heroHeadline) heroHeadline.textContent = basics.headline;

  const heroSummary = document.getElementById('hero-summary');
  if (heroSummary) heroSummary.textContent = basics.summary;

  // Social Links in Hero & Footer
  const heroSocials = document.getElementById('hero-socials');
  const footerSocials = document.getElementById('footer-socials');
  
  if (heroSocials && basics.profiles) {
    heroSocials.innerHTML = '';
    basics.profiles.forEach(profile => {
      const a = document.createElement('a');
      a.href = profile.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'social-icon-btn';
      a.title = profile.network;
      a.setAttribute('aria-label', profile.network);
      a.innerHTML = `<i class="${profile.icon || 'fa-solid fa-link'}"></i>`;
      heroSocials.appendChild(a);
    });

    // Add email direct icon
    if (basics.email) {
      const emailBtn = document.createElement('a');
      emailBtn.href = `mailto:${basics.email}`;
      emailBtn.className = 'social-icon-btn';
      emailBtn.title = 'Send Email';
      emailBtn.setAttribute('aria-label', 'Email');
      emailBtn.innerHTML = '<i class="fa-solid fa-envelope"></i>';
      heroSocials.appendChild(emailBtn);
    }
  }

  if (footerSocials && basics.profiles) {
    footerSocials.innerHTML = '';
    basics.profiles.forEach(profile => {
      const a = document.createElement('a');
      a.href = profile.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'social-icon-btn';
      a.title = profile.network;
      a.setAttribute('aria-label', profile.network);
      a.innerHTML = `<i class="${profile.icon || 'fa-solid fa-link'}"></i>`;
      footerSocials.appendChild(a);
    });
  }

  // Footer Copyright & Name
  const footerName = document.getElementById('footer-name');
  if (footerName) footerName.textContent = basics.name;

  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
}

/**
 * Render About & Strengths
 */
function renderAbout(about, basics) {
  if (!about) return;

  const aboutIntroContainer = document.getElementById('about-intro-container');
  if (aboutIntroContainer && about.intro) {
    aboutIntroContainer.innerHTML = '';
    about.intro.forEach(text => {
      const p = document.createElement('p');
      p.className = 'about-intro-text';
      p.textContent = text;
      aboutIntroContainer.appendChild(p);
    });
  }

  // Location & Details inside About card
  const aboutLocation = document.getElementById('about-location');
  if (aboutLocation && basics.location) {
    aboutLocation.textContent = `${basics.location.region}, ${basics.location.country}`;
  }

  const aboutEmail = document.getElementById('about-email');
  if (aboutEmail && basics.email) {
    aboutEmail.textContent = basics.email;
  }

  const aboutRole = document.getElementById('about-role');
  if (aboutRole && basics.label) {
    aboutRole.textContent = basics.label;
  }

  // Strengths Grid
  const strengthsGrid = document.getElementById('strengths-grid');
  if (strengthsGrid && about.strengths) {
    strengthsGrid.innerHTML = '';
    
    // Icon map for strengths
    const strengthIcons = [
      'fa-solid fa-laptop-code',
      'fa-solid fa-cubes-stacked',
      'fa-solid fa-users-gear',
      'fa-solid fa-bolt'
    ];

    about.strengths.forEach((strength, index) => {
      const icon = strengthIcons[index % strengthIcons.length];
      const item = document.createElement('div');
      item.className = 'strength-item reveal';
      item.innerHTML = `
        <div class="strength-icon">
          <i class="${icon}"></i>
        </div>
        <div class="strength-title">${escapeHTML(strength)}</div>
      `;
      strengthsGrid.appendChild(item);
    });
  }
}

/**
 * Render Skills Categories and Pills
 */
function renderSkills(skills) {
  if (!skills) return;

  const skillsContainer = document.getElementById('skills-container');
  if (!skillsContainer) return;

  skillsContainer.innerHTML = '';

  const categoryIcons = {
    "Programming Languages": "fa-solid fa-code",
    "Core Concepts": "fa-solid fa-microchip",
    "Soft Skills": "fa-solid fa-comments"
  };

  skills.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'skill-category-card reveal';
    
    const iconClass = categoryIcons[cat.category] || "fa-solid fa-layer-group";
    
    const tagsHtml = cat.items.map(item => `
      <span class="skill-pill">
        <i class="fa-solid fa-check"></i>
        <span>${escapeHTML(item)}</span>
      </span>
    `).join('');

    card.innerHTML = `
      <div class="skill-card-header">
        <div class="category-icon-box">
          <i class="${iconClass}"></i>
        </div>
        <h3 class="skill-category-title">${escapeHTML(cat.category)}</h3>
      </div>
      <div class="skill-tags-cloud">
        ${tagsHtml}
      </div>
    `;

    skillsContainer.appendChild(card);
  });
}

/**
 * Render Experience / Work Timeline
 */
function renderWork(workList) {
  if (!workList) return;

  const timelineContainer = document.getElementById('work-timeline');
  if (!timelineContainer) return;

  timelineContainer.innerHTML = '';

  workList.forEach(job => {
    const item = document.createElement('div');
    item.className = 'timeline-item reveal';

    const companyHtml = job.website 
      ? `<a href="${escapeHTML(job.website)}" target="_blank" rel="noopener noreferrer" class="job-company">${escapeHTML(job.company)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i></a>`
      : `<span class="job-company">${escapeHTML(job.company)}</span>`;

    const highlightsHtml = (job.highlights || []).map(hl => `
      <li class="job-highlight-item">
        <i class="fa-solid fa-angle-right"></i>
        <span>${escapeHTML(hl)}</span>
      </li>
    `).join('');

    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-card">
        <div class="timeline-header-row">
          <div>
            <h3 class="job-role">${escapeHTML(job.position)}</h3>
            <div>${companyHtml}</div>
          </div>
          <span class="job-period">${escapeHTML(job.startDate)} — ${escapeHTML(job.endDate)}</span>
        </div>
        <p class="job-summary">${escapeHTML(job.summary || '')}</p>
        ${highlightsHtml ? `<ul class="job-highlights">${highlightsHtml}</ul>` : ''}
      </div>
    `;

    timelineContainer.appendChild(item);
  });
}

/**
 * Render Featured Projects
 */
function renderProjects(projectsList) {
  if (!projectsList) return;

  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = '';

  const projectIcons = [
    'fa-solid fa-wand-magic-sparkles',
    'fa-solid fa-boxes-stacked',
    'fa-solid fa-code-branch'
  ];

  projectsList.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';

    const icon = projectIcons[idx % projectIcons.length];

    const highlightsHtml = (proj.highlights || []).map(h => `
      <span class="project-highlight-badge">${escapeHTML(h)}</span>
    `).join('');

    const keywordsHtml = (proj.keywords || []).map(k => `
      <span class="project-keyword">${escapeHTML(k)}</span>
    `).join('');

    card.innerHTML = `
      <div class="project-banner">
        <div class="project-banner-pattern"></div>
        <i class="${icon} project-icon-large"></i>
      </div>
      <div class="project-content">
        <h3 class="project-title">${escapeHTML(proj.name)}</h3>
        <p class="project-desc">${escapeHTML(proj.description)}</p>
        
        ${proj.highlights && proj.highlights.length ? `
          <div class="project-highlights-box">
            <div class="project-highlights-title">Key Highlights</div>
            <div class="project-highlights-list">
              ${highlightsHtml}
            </div>
          </div>
        ` : ''}

        <div class="project-keywords-box">
          ${keywordsHtml}
        </div>

        <div class="project-links">
          <a href="${proj.url || '#'}" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;" target="_blank" rel="noopener noreferrer">
            <span>View Project</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    projectsGrid.appendChild(card);
  });
}

/**
 * Render Education
 */
function renderEducation(educationList) {
  if (!educationList) return;

  const eduContainer = document.getElementById('education-timeline');
  if (!eduContainer) return;

  eduContainer.innerHTML = '';

  educationList.forEach(edu => {
    const card = document.createElement('div');
    card.className = 'edu-card reveal';

    const detailsHtml = (edu.details || []).map(d => `
      <span class="edu-tag">${escapeHTML(d)}</span>
    `).join('');

    const startYear = edu.startDate ? edu.startDate.slice(0, 4) : '';
    const endYear = edu.endDate ? edu.endDate.slice(0, 4) : 'Present';
    const dateStr = startYear ? `${startYear} - ${endYear}` : '';

    card.innerHTML = `
      <div class="edu-degree">${escapeHTML(edu.studyType)} in ${escapeHTML(edu.area)}</div>
      <div class="edu-school">${escapeHTML(edu.institution)}</div>
      ${dateStr ? `<div class="edu-dates"><i class="fa-regular fa-calendar-days"></i> ${dateStr}</div>` : ''}
      ${detailsHtml ? `<div class="edu-details">${detailsHtml}</div>` : ''}
    `;

    eduContainer.appendChild(card);
  });
}

/**
 * Render Certificates
 */
function renderCertificates(certList) {
  if (!certList) return;

  const certContainer = document.getElementById('cert-list');
  if (!certContainer) return;

  certContainer.innerHTML = '';

  certList.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'cert-card reveal';

    const linkHtml = cert.url ? `
      <a href="${escapeHTML(cert.url)}" target="_blank" rel="noopener noreferrer" class="cert-link-btn" title="Verify Certificate">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    ` : '';

    card.innerHTML = `
      <div>
        <div class="cert-name">${escapeHTML(cert.name)}</div>
        <div class="cert-issuer">${escapeHTML(cert.issuer)}</div>
      </div>
      ${linkHtml}
    `;

    certContainer.appendChild(card);
  });
}

/**
 * Render Languages
 */
function renderLanguages(langList) {
  if (!langList) return;

  const langContainer = document.getElementById('lang-list');
  if (!langContainer) return;

  langContainer.innerHTML = '';

  const fluencyPercentage = {
    'Native': '100%',
    'Fluent': '90%',
    'Professional': '75%',
    'Intermediate': '60%',
    'Basic': '40%'
  };

  langList.forEach(lang => {
    const card = document.createElement('div');
    card.className = 'lang-card reveal';

    const width = fluencyPercentage[lang.fluency] || '80%';

    card.innerHTML = `
      <div class="lang-header">
        <span class="lang-name">${escapeHTML(lang.language)}</span>
        <span class="lang-fluency">${escapeHTML(lang.fluency)}</span>
      </div>
      <div class="lang-bar-bg">
        <div class="lang-bar-fill" style="width: ${width};"></div>
      </div>
    `;

    langContainer.appendChild(card);
  });
}

/**
 * Render Contact Details
 */
function renderContact(basics) {
  if (!basics) return;

  const contactEmail = document.getElementById('contact-email-text');
  if (contactEmail && basics.email) {
    contactEmail.textContent = basics.email;
    contactEmail.href = `mailto:${basics.email}`;
  }

  const contactLocation = document.getElementById('contact-location-text');
  if (contactLocation && basics.location) {
    contactLocation.textContent = `${basics.location.region}, ${basics.location.country}`;
  }

  const contactAvailability = document.getElementById('contact-avail-text');
  if (contactAvailability && basics.availability) {
    contactAvailability.textContent = basics.availability;
  }

  // Copy email click handler
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn && basics.email) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(basics.email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        // Fallback
        showToast('Direct email: ' + basics.email);
      });
    });
  }
}

/**
 * Theme Manager (Dark / Light)
 */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('portfolio-theme');
  
  // Default to dark theme unless user previously chose light
  const initialTheme = storedTheme || 'dark';
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (icon) {
    if (theme === 'light') {
      icon.className = 'fa-solid fa-moon';
    } else {
      icon.className = 'fa-solid fa-sun';
    }
  }
}

/**
 * Top Scroll Progress Indicator
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (header) {
      if (winScroll > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });
}

/**
 * Mobile Navigation Menu
 */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

/**
 * Active navigation spy using IntersectionObserver
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * Scroll Reveal Animation via IntersectionObserver
 */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Contact Form Interaction
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const message = document.getElementById('form-message').value;

      // Construct mailto link
      const mailtoLink = `mailto:ibadullahibad27@gmail.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      
      window.location.href = mailtoLink;
      showToast('Opening your email client...');
      form.reset();
    });
  }
}

/**
 * Toast Notification System
 */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 3.2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3200);
}

/**
 * HTML Escaping helper for safe rendering
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
