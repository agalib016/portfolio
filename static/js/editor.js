/**
 * Portfolio In-Browser Live Editor
 * Allows customizing all sections and saving directly back to Python data/portfolio.json
 */

document.addEventListener('DOMContentLoaded', () => {
    initEditorUI();
});

let currentEditorData = {};

function initEditorUI() {
    const editorModal = document.getElementById('editor-modal');
    const openBtns = [
        document.getElementById('open-editor-btn'),
        document.getElementById('floating-edit-btn')
    ];
    const closeBtns = [
        document.getElementById('editor-close-btn'),
        document.getElementById('editor-cancel-btn')
    ];
    const saveBtns = [
        document.getElementById('save-portfolio-btn'),
        document.getElementById('save-portfolio-btn-footer')
    ];
    const resetBtn = document.getElementById('reset-default-btn');

    if (!editorModal) return;

    // Open Drawer
    openBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                loadDataIntoEditor();
                editorModal.classList.add('active');
            });
        }
    });

    // Close Drawer
    closeBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                editorModal.classList.remove('active');
            });
        }
    });

    editorModal.addEventListener('click', (e) => {
        if (e.target === editorModal) {
            editorModal.classList.remove('active');
        }
    });

    // Tab Navigation within Editor
    const tabBtns = document.querySelectorAll('.editor-tab-btn');
    const panes = document.querySelectorAll('.editor-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(btn.dataset.tab);
            if (targetPane) targetPane.classList.add('active');

            // If switching to raw JSON, sync current state
            if (btn.dataset.tab === 'tab-raw') {
                syncFormToData();
                const rawTextarea = document.getElementById('raw-json-editor');
                if (rawTextarea) {
                    rawTextarea.value = JSON.stringify(currentEditorData, null, 2);
                }
            }
        });
    });

    // Save Handlers
    saveBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', handleSavePortfolio);
        }
    });

    // Reset Defaults Handler
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetDefault);
    }

    // Dynamic Item Adders
    setupDynamicAdders();
    setupRawJsonTools();
}

/**
 * Populate editor form fields with current data
 */
function loadDataIntoEditor() {
    currentEditorData = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA || {}));
    const d = currentEditorData;

    // Brand & Hero
    setValue('edit-brand-symbol', d.brand?.logo_symbol || '⚡');
    setValue('edit-brand-text', d.brand?.logo_text || 'Alex.dev');
    setValue('edit-brand-tagline', d.brand?.tagline || '');
    setValue('edit-hero-greeting', d.hero?.greeting || 'Hello, world! I am');
    setValue('edit-hero-name', d.hero?.name || 'Alex Rivera');
    setValue('edit-hero-roles', (d.hero?.roles || []).join(', '));
    setValue('edit-hero-status', d.availability?.status || 'Available for new projects');
    setValue('edit-hero-bio', d.hero?.bio || '');

    // Metrics
    renderMetricsEditor(d.stats || []);

    // About
    setValue('edit-about-headline', d.about?.headline || '');
    setValue('edit-about-paragraphs', (d.about?.paragraphs || []).join('\n\n'));
    setValue('edit-about-highlights', (d.about?.highlights || []).join('\n'));

    // Skills, Projects, Experience
    renderSkillsEditor(d.skills?.list || d.skills?.items || []);
    renderProjectsEditor(d.projects || []);
    renderExperienceEditor(d.experience || []);

    // Contact
    setValue('edit-contact-email', d.contact?.email || '');
    setValue('edit-contact-phone', d.contact?.phone || '');
    setValue('edit-contact-location', d.contact?.location || '');
    setValue('edit-contact-response', d.contact?.response_time || '');

    // Raw JSON
    const rawTextarea = document.getElementById('raw-json-editor');
    if (rawTextarea) {
        rawTextarea.value = JSON.stringify(d, null, 2);
    }
}

function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

/**
 * Render Metrics Editor
 */
function renderMetricsEditor(stats) {
    const container = document.getElementById('metrics-editor-list');
    if (!container) return;

    container.innerHTML = stats.map((stat, idx) => `
        <div class="metric-edit-item">
            <div style="flex: 1;">
                <label style="font-size: 0.72rem; color: var(--text-muted);">Value</label>
                <input type="text" class="editor-input metric-val" data-idx="${idx}" value="${stat.value}">
            </div>
            <div style="flex: 1.5;">
                <label style="font-size: 0.72rem; color: var(--text-muted);">Label</label>
                <input type="text" class="editor-input metric-label" data-idx="${idx}" value="${stat.label}">
            </div>
        </div>
    `).join('');
}

/**
 * Render Skills Editor
 */
function renderSkillsEditor(skills) {
    const container = document.getElementById('skills-editor-container');
    if (!container) return;

    container.innerHTML = skills.map((skill, idx) => `
        <div class="editor-card-item skill-edit-row" data-idx="${idx}">
            <div class="editor-card-header">
                <span class="editor-card-title">${skill.icon} ${skill.name} (${skill.category})</span>
                <button type="button" class="btn-remove-item remove-skill-btn" data-idx="${idx}">Remove</button>
            </div>
            <div class="editor-form-grid">
                <div class="field-group">
                    <label>Skill Name</label>
                    <input type="text" class="editor-input skill-name-inp" value="${skill.name}">
                </div>
                <div class="field-group">
                    <label>Category</label>
                    <select class="editor-select skill-cat-inp">
                        <option value="Backend" ${skill.category === 'Backend' ? 'selected' : ''}>Backend</option>
                        <option value="Frontend" ${skill.category === 'Frontend' ? 'selected' : ''}>Frontend</option>
                        <option value="AI & Data" ${skill.category === 'AI & Data' ? 'selected' : ''}>AI & Data</option>
                        <option value="DevOps & Cloud" ${skill.category === 'DevOps & Cloud' ? 'selected' : ''}>DevOps & Cloud</option>
                        <option value="Tools" ${skill.category === 'Tools' ? 'selected' : ''}>Tools</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Icon / Emoji</label>
                    <input type="text" class="editor-input skill-icon-inp" value="${skill.icon}">
                </div>
                <div class="field-group">
                    <label>Proficiency (%)</label>
                    <input type="number" min="10" max="100" class="editor-input skill-level-inp" value="${skill.level}">
                </div>
                <div class="field-group full-width">
                    <label>Description / Sub-technologies</label>
                    <input type="text" class="editor-input skill-desc-inp" value="${skill.description}">
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.remove-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            currentEditorData.skills.items.splice(idx, 1);
            renderSkillsEditor(currentEditorData.skills.items);
        });
    });
}

/**
 * Render Projects Editor
 */
function renderProjectsEditor(projects) {
    const container = document.getElementById('projects-editor-container');
    if (!container) return;

    container.innerHTML = projects.map((p, idx) => `
        <div class="editor-card-item project-edit-row" data-idx="${idx}">
            <div class="editor-card-header">
                <span class="editor-card-title">${p.title}</span>
                <button type="button" class="btn-remove-item remove-project-btn" data-idx="${idx}">Remove</button>
            </div>
            <div class="editor-form-grid">
                <div class="field-group full-width">
                    <label>Project Title</label>
                    <input type="text" class="editor-input proj-title-inp" value="${p.title}">
                </div>
                <div class="field-group">
                    <label>Category</label>
                    <select class="editor-select proj-cat-inp">
                        <option value="AI & Data" ${p.category === 'AI & Data' ? 'selected' : ''}>AI & Data</option>
                        <option value="Backend" ${p.category === 'Backend' ? 'selected' : ''}>Backend</option>
                        <option value="Frontend" ${p.category === 'Frontend' ? 'selected' : ''}>Frontend</option>
                        <option value="DevOps & Cloud" ${p.category === 'DevOps & Cloud' ? 'selected' : ''}>DevOps & Cloud</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Badge (e.g. Featured, Trending)</label>
                    <input type="text" class="editor-input proj-badge-inp" value="${p.badge || 'Featured'}">
                </div>
                <div class="field-group full-width">
                    <label>Description</label>
                    <textarea class="editor-textarea proj-desc-inp" rows="2">${p.description}</textarea>
                </div>
                <div class="field-group">
                    <label>Live URL (or #)</label>
                    <input type="text" class="editor-input proj-live-inp" value="${p.live_url || '#'}">
                </div>
                <div class="field-group">
                    <label>GitHub URL (or #)</label>
                    <input type="text" class="editor-input proj-github-inp" value="${p.github_url || '#'}">
                </div>
                <div class="field-group">
                    <label>Metric / Key Stat</label>
                    <input type="text" class="editor-input proj-metric-inp" value="${p.metrics || ''}">
                </div>
                <div class="field-group">
                    <label>Tags (comma separated)</label>
                    <input type="text" class="editor-input proj-tags-inp" value="${(p.tags || []).join(', ')}">
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.remove-project-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            currentEditorData.projects.splice(idx, 1);
            renderProjectsEditor(currentEditorData.projects);
        });
    });
}

/**
 * Render Experience Editor
 */
function renderExperienceEditor(experiences) {
    const container = document.getElementById('experience-editor-container');
    if (!container) return;

    container.innerHTML = experiences.map((exp, idx) => `
        <div class="editor-card-item exp-edit-row" data-idx="${idx}">
            <div class="editor-card-header">
                <span class="editor-card-title">${exp.role} @ ${exp.company}</span>
                <button type="button" class="btn-remove-item remove-exp-btn" data-idx="${idx}">Remove</button>
            </div>
            <div class="editor-form-grid">
                <div class="field-group">
                    <label>Role / Degree</label>
                    <input type="text" class="editor-input exp-role-inp" value="${exp.role}">
                </div>
                <div class="field-group">
                    <label>Company / University</label>
                    <input type="text" class="editor-input exp-company-inp" value="${exp.company}">
                </div>
                <div class="field-group">
                    <label>Type</label>
                    <select class="editor-select exp-type-inp">
                        <option value="work" ${exp.type === 'work' ? 'selected' : ''}>Work History</option>
                        <option value="education" ${exp.type === 'education' ? 'selected' : ''}>Education</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Period (e.g. 2023 - Present)</label>
                    <input type="text" class="editor-input exp-period-inp" value="${exp.period}">
                </div>
                <div class="field-group full-width">
                    <label>Location</label>
                    <input type="text" class="editor-input exp-location-inp" value="${exp.location}">
                </div>
                <div class="field-group full-width">
                    <label>Overview</label>
                    <textarea class="editor-textarea exp-desc-inp" rows="2">${exp.description}</textarea>
                </div>
                <div class="field-group full-width">
                    <label>Technologies / Tags (comma separated)</label>
                    <input type="text" class="editor-input exp-tech-inp" value="${(exp.technologies || []).join(', ')}">
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.remove-exp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            currentEditorData.experience.splice(idx, 1);
            renderExperienceEditor(currentEditorData.experience);
        });
    });
}

/**
 * Handle Adding New Items
 */
function setupDynamicAdders() {
    // Add Skill
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            if (!currentEditorData.skills) currentEditorData.skills = { items: [] };
            if (!currentEditorData.skills.items) currentEditorData.skills.items = [];
            currentEditorData.skills.items.unshift({
                name: "New Skill",
                category: "Backend",
                icon: "⚡",
                level: 80,
                description: "Skill details and libraries"
            });
            renderSkillsEditor(currentEditorData.skills.items);
            showToast('New skill added to editor', 'info');
        });
    }

    // Add Project
    const addProjectBtn = document.getElementById('add-project-btn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            if (!currentEditorData.projects) currentEditorData.projects = [];
            const newId = `proj-${Date.now()}`;
            currentEditorData.projects.unshift({
                id: newId,
                title: "New Project Title",
                category: "Frontend",
                badge: "New",
                description: "Describe the key objectives and accomplishments of this project.",
                image: "/static/images/project1.png",
                tags: ["Python", "JavaScript", "HTML/CSS"],
                live_url: "#",
                github_url: "#",
                metrics: "Live"
            });
            renderProjectsEditor(currentEditorData.projects);
            showToast('New project added to editor', 'info');
        });
    }

    // Add Experience
    const addExpBtn = document.getElementById('add-experience-btn');
    if (addExpBtn) {
        addExpBtn.addEventListener('click', () => {
            if (!currentEditorData.experience) currentEditorData.experience = [];
            currentEditorData.experience.unshift({
                id: `exp-${Date.now()}`,
                type: "work",
                role: "New Role",
                company: "Company Name",
                period: "2024 - Present",
                location: "Remote",
                description: "Describe key responsibilities and impact in this role.",
                achievements: ["Delivered major feature release on time."],
                technologies: ["Python", "Git"]
            });
            renderExperienceEditor(currentEditorData.experience);
            showToast('New timeline milestone added', 'info');
        });
    }
}

/**
 * Synchronize editor form inputs into currentEditorData structure
 */
function syncFormToData() {
    if (!currentEditorData.brand) currentEditorData.brand = {};
    if (!currentEditorData.hero) currentEditorData.hero = {};
    if (!currentEditorData.availability) currentEditorData.availability = {};
    if (!currentEditorData.about) currentEditorData.about = {};
    if (!currentEditorData.contact) currentEditorData.contact = {};

    // Brand
    currentEditorData.brand.logo_symbol = getValue('edit-brand-symbol') || '⚡';
    currentEditorData.brand.logo_text = getValue('edit-brand-text') || 'Alex.dev';
    currentEditorData.brand.tagline = getValue('edit-brand-tagline');

    // Hero
    currentEditorData.hero.greeting = getValue('edit-hero-greeting');
    currentEditorData.hero.name = getValue('edit-hero-name');
    currentEditorData.hero.roles = getValue('edit-hero-roles').split(',').map(s => s.trim()).filter(Boolean);
    currentEditorData.availability.status = getValue('edit-hero-status');
    currentEditorData.hero.bio = getValue('edit-hero-bio');

    // Metrics
    document.querySelectorAll('.metric-edit-item').forEach(item => {
        const valInp = item.querySelector('.metric-val');
        const labelInp = item.querySelector('.metric-label');
        const idx = parseInt(valInp.dataset.idx, 10);
        if (currentEditorData.stats && currentEditorData.stats[idx]) {
            currentEditorData.stats[idx].value = valInp.value.trim();
            currentEditorData.stats[idx].label = labelInp.value.trim();
        }
    });

    // About
    currentEditorData.about.headline = getValue('edit-about-headline');
    currentEditorData.about.paragraphs = getValue('edit-about-paragraphs').split('\n\n').map(s => s.trim()).filter(Boolean);
    currentEditorData.about.highlights = getValue('edit-about-highlights').split('\n').map(s => s.trim()).filter(Boolean);

    // Sync Skills from rows
    const skillRows = document.querySelectorAll('.skill-edit-row');
    const updatedSkills = [];
    skillRows.forEach(row => {
        updatedSkills.push({
            name: row.querySelector('.skill-name-inp').value.trim(),
            category: row.querySelector('.skill-cat-inp').value,
            icon: row.querySelector('.skill-icon-inp').value.trim(),
            level: parseInt(row.querySelector('.skill-level-inp').value, 10) || 80,
            description: row.querySelector('.skill-desc-inp').value.trim()
        });
    });
    if (updatedSkills.length > 0) {
        if (!currentEditorData.skills) currentEditorData.skills = { categories: ["All", "Backend", "Frontend", "AI & Data", "DevOps & Cloud", "Tools"] };
        currentEditorData.skills.list = updatedSkills;
        currentEditorData.skills.items = updatedSkills;
    }

    // Sync Projects from rows
    const projRows = document.querySelectorAll('.project-edit-row');
    const updatedProjects = [];
    projRows.forEach((row, i) => {
        const originalProj = (currentEditorData.projects && currentEditorData.projects[i]) || {};
        updatedProjects.push({
            id: originalProj.id || `proj-${i + 1}`,
            title: row.querySelector('.proj-title-inp').value.trim(),
            category: row.querySelector('.proj-cat-inp').value,
            badge: row.querySelector('.proj-badge-inp').value.trim(),
            description: row.querySelector('.proj-desc-inp').value.trim(),
            image: originalProj.image || '/static/images/project1.png',
            live_url: row.querySelector('.proj-live-inp').value.trim(),
            github_url: row.querySelector('.proj-github-inp').value.trim(),
            metrics: row.querySelector('.proj-metric-inp').value.trim(),
            tags: row.querySelector('.proj-tags-inp').value.split(',').map(t => t.trim()).filter(Boolean)
        });
    });
    if (updatedProjects.length > 0) {
        currentEditorData.projects = updatedProjects;
    }

    // Sync Experience from rows
    const expRows = document.querySelectorAll('.exp-edit-row');
    const updatedExp = [];
    expRows.forEach((row, i) => {
        const originalExp = (currentEditorData.experience && currentEditorData.experience[i]) || {};
        updatedExp.push({
            id: originalExp.id || `exp-${i + 1}`,
            role: row.querySelector('.exp-role-inp').value.trim(),
            company: row.querySelector('.exp-company-inp').value.trim(),
            type: row.querySelector('.exp-type-inp').value,
            period: row.querySelector('.exp-period-inp').value.trim(),
            location: row.querySelector('.exp-location-inp').value.trim(),
            description: row.querySelector('.exp-desc-inp').value.trim(),
            achievements: originalExp.achievements || [],
            technologies: row.querySelector('.exp-tech-inp').value.split(',').map(t => t.trim()).filter(Boolean)
        });
    });
    if (updatedExp.length > 0) {
        currentEditorData.experience = updatedExp;
    }

    // Contact
    currentEditorData.contact.email = getValue('edit-contact-email');
    currentEditorData.contact.phone = getValue('edit-contact-phone');
    currentEditorData.contact.location = getValue('edit-contact-location');
    currentEditorData.contact.response_time = getValue('edit-contact-response');
}

/**
 * Handle Save Changes to Python Backend
 */
async function handleSavePortfolio() {
    // Check if on Raw JSON tab
    const rawPane = document.getElementById('tab-raw');
    if (rawPane && rawPane.classList.contains('active')) {
        try {
            const rawVal = document.getElementById('raw-json-editor').value;
            currentEditorData = JSON.parse(rawVal);
        } catch (e) {
            showToast('Invalid JSON in Raw tab: ' + e.message, 'error');
            return;
        }
    } else {
        syncFormToData();
    }

    showToast('Saving to Python backend...', 'info');

    try {
        const res = await fetch('/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentEditorData)
        });

        const data = await res.json();

        if (data.success) {
            showToast('Changes saved to data/portfolio.json! Reloading...', 'success');
            window.PORTFOLIO_DATA = currentEditorData;
            setTimeout(() => {
                window.location.reload();
            }, 1200);
        } else {
            showToast(data.error || 'Failed to save portfolio', 'error');
        }
    } catch (err) {
        console.error('Save error:', err);
        showToast('Network error while saving', 'error');
    }
}

/**
 * Reset to Template Defaults
 */
async function handleResetDefault() {
    if (!confirm('Are you sure you want to reset all portfolio fields to initial template defaults?')) {
        return;
    }

    showToast('Resetting template...', 'info');

    try {
        const res = await fetch('/api/portfolio/reset', { method: 'POST' });
        const data = await res.json();

        if (data.success) {
            showToast('Template reset successfully! Reloading...', 'success');
            setTimeout(() => window.location.reload(), 1200);
        } else {
            showToast(data.error || 'Reset failed', 'error');
        }
    } catch (err) {
        showToast('Network error while resetting', 'error');
    }
}

/**
 * Raw JSON tools (Format & Copy)
 */
function setupRawJsonTools() {
    const formatBtn = document.getElementById('format-json-btn');
    const copyBtn = document.getElementById('copy-json-btn');
    const rawTextarea = document.getElementById('raw-json-editor');

    if (formatBtn && rawTextarea) {
        formatBtn.addEventListener('click', () => {
            try {
                const parsed = JSON.parse(rawTextarea.value);
                rawTextarea.value = JSON.stringify(parsed, null, 2);
                showToast('JSON formatted', 'success');
            } catch (e) {
                showToast('Invalid JSON: ' + e.message, 'error');
            }
        });
    }

    if (copyBtn && rawTextarea) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(rawTextarea.value).then(() => {
                showToast('JSON copied to clipboard', 'success');
            });
        });
    }
}
