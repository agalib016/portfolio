/**
 * Portfolio Website - Main JavaScript Controller
 * Handles Theme Toggling, Typewriter Animation, Filtering, Modals, Forms & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initTypewriter();
    initHeroCardTilt();
    initSkillFilters();
    initProjectFilters();
    initTimelineFilters();
    initProjectModal();
    initContactForm();
    initCopyButtons();
    initScrollSpy();
    initBackToTop();
});

/* ==========================================================================
   THEME TOGGLE (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 
                       (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            showToast(`Switched to ${newTheme} theme 🌓`, 'info');
        });
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme}`;
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '⚡';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    // Close when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================================================
   TYPEWRITER EFFECT (HERO SECTION)
   ========================================================================== */
function initTypewriter() {
    const typedElem = document.getElementById('typed-role');
    if (!typedElem) return;

    // Load roles from window.PORTFOLIO_DATA or defaults
    const roles = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.hero && window.PORTFOLIO_DATA.hero.roles) || [
        "Full Stack Engineer",
        "Python & AI Architect",
        "Creative Web Designer",
        "Problem Solver"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            typedElem.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            typedElem.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 110;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            typingSpeed = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 400; // Short pause before new word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   HERO 3D CARD TILT
   ========================================================================== */
function initHeroCardTilt() {
    const card = document.getElementById('hero-card-3d');
    if (!card) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
}

/* ==========================================================================
   SKILLS CATEGORY FILTERS
   ========================================================================== */
function initSkillFilters() {
    const tabs = document.querySelectorAll('#skill-filter-tabs .tab-btn');
    const cards = document.querySelectorAll('#skills-grid .skill-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;

            cards.forEach(card => {
                const cardCat = card.dataset.category;
                if (category === 'All' || cardCat === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.opacity = '1'; }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT FILTERS
   ========================================================================== */
function initProjectFilters() {
    const tabs = document.querySelectorAll('#project-filter-tabs .tab-btn');
    const cards = document.querySelectorAll('#projects-grid .project-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;

            cards.forEach(card => {
                const cardCategory = card.dataset.category;
                if (filter === 'all' || cardCategory === filter) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.opacity = '1'; }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   TIMELINE FILTERS (WORK VS EDUCATION)
   ========================================================================== */
function initTimelineFilters() {
    const tabs = document.querySelectorAll('#timeline-toggle-tabs .tab-btn');
    const items = document.querySelectorAll('#experience-timeline .timeline-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const type = tab.dataset.type;

            items.forEach(item => {
                const itemType = item.dataset.type;
                if (type === 'all' || itemType === type) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   PROJECT QUICK VIEW MODAL
   ========================================================================== */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-project-content');

    if (!modal || !closeBtn || !modalContent) return;

    // Close handlers
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Delegate quick view triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.btn-quick-view');
        if (trigger) {
            const projId = trigger.dataset.projectId;
            const projects = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];
            const project = projects.find(p => p.id === projId);

            if (project) {
                renderModalProject(project, modalContent);
                modal.classList.add('active');
            }
        }
    });
}

function renderModalProject(proj, container) {
    const tagsHtml = (proj.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join(' ');
    
    container.innerHTML = `
        <img src="${proj.image}" alt="${proj.title}" class="modal-project-img">
        <div class="project-meta-top">
            <span class="proj-category">${proj.category}</span>
            ${proj.metrics ? `<span class="proj-metric">${proj.metrics}</span>` : ''}
        </div>
        <h2 class="project-title" style="font-size: 1.8rem; margin: 0.5rem 0 1rem;">${proj.title}</h2>
        <p class="project-desc" style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">${proj.description}</p>
        <div class="project-tags" style="margin-bottom: 1.75rem;">${tagsHtml}</div>
        <div class="project-actions" style="margin-top: 1.5rem;">
            ${proj.live_url && proj.live_url !== '#' ? `<a href="${proj.live_url}" target="_blank" rel="noopener" class="btn btn-primary">Live Demo ↗</a>` : ''}
            ${proj.github_url && proj.github_url !== '#' ? `<a href="${proj.github_url}" target="_blank" rel="noopener" class="btn btn-outline">GitHub Repository ↗</a>` : ''}
        </div>
    `;
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-form-btn');
    const statusMsg = document.getElementById('form-status-msg');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.elements['name'].value.trim();
        const email = form.elements['email'].value.trim();
        const subject = form.elements['subject'].value.trim();
        const message = form.elements['message'].value.trim();

        if (!name || !email || !message) {
            statusMsg.className = 'form-status-msg error';
            statusMsg.textContent = 'Please fill out all required fields.';
            return;
        }

        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');

        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        btnSpinner.style.display = 'inline-block';
        statusMsg.textContent = '';

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await res.json();

            if (data.success) {
                statusMsg.className = 'form-status-msg success';
                statusMsg.textContent = 'Message sent successfully!';
                showToast(data.message, 'success');
                form.reset();
            } else {
                statusMsg.className = 'form-status-msg error';
                statusMsg.textContent = data.error || 'Failed to send message.';
                showToast(data.error || 'Submission error', 'error');
            }
        } catch (err) {
            console.error('Contact error:', err);
            statusMsg.className = 'form-status-msg error';
            statusMsg.textContent = 'Network error. Please try again.';
            showToast('Could not reach backend server', 'error');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            btnSpinner.style.display = 'none';
        }
    });
}

/* ==========================================================================
   ONE-CLICK COPY HELPERS
   ========================================================================== */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.dataset.copy;
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied to clipboard: ${textToCopy}`, 'success');
            }).catch(() => {
                showToast('Failed to copy', 'error');
            });
        });
    });
}

/* ==========================================================================
   SCROLL SPY & BACK TO TOP
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
