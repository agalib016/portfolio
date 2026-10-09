# ⚡ Aesthetic & Creative Developer Portfolio Template (Python)

A modern, creative, and highly aesthetic portfolio website built with **Python (Flask)**, **Modern Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid)**, and **Interactive JavaScript**.

Includes an **In-Browser Live Customizer / Editor** that saves your updates directly back to `data/portfolio.json` with automatic backup!

---

## ✨ Highlights & Features

- 🌓 **Dynamic Light & Dark Theme**: Hand-crafted color palettes, glassmorphism, glowing accents, and persistence in `localStorage`.
- ⚡ **Full Python Backend**: Built with lightweight Flask (`app.py`), serving templated Jinja2 views and REST APIs for portfolio updates and contact submissions.
- ✏️ **Dual Editing Modes**:
  1. **In-Browser Live Editor**: Click **"Edit Site"** in the navbar or the floating **"✏️ Customize Template"** pill to modify bio, roles, skills, projects, and contact details with 1 click.
  2. **Direct JSON Configuration**: Open [`data/portfolio.json`](file:///c:/Users/User/Documents/code/antigravity/portfolio_website/data/portfolio.json) in your code editor to populate your details whenever you are ready.
- 🚀 **Interactive UI & Micro-animations**:
  - Typewriter role animation cycling through your developer titles
  - 3D-tilting code console card with Python class snippet & metrics
  - Filterable Skills grid by category (Backend, Frontend, AI & Data, DevOps, Tools)
  - Showcase project cards with quick-view details modal and external link buttons
  - Interactive career journey timeline (Work history vs Education filters)
  - Functional contact form that logs submissions directly to `data/messages.json`
  - One-click copy email button and quick social links
- 📱 **100% Responsive**: Looks stunning on desktops, tablets, and smartphones.

---

## 🛠️ Project Structure

```
portfolio_website/
├── app.py                     # Flask server with routes & update APIs
├── run.py                     # Simple launcher script
├── requirements.txt           # Python dependencies (Flask, Jinja2)
├── data/
│   ├── portfolio.json         # Master portfolio data (Edit this anytime!)
│   ├── portfolio_default.json # Backup of original template defaults
│   └── messages.json          # Stores messages submitted via the contact form
├── static/
│   ├── css/
│   │   ├── style.css          # Main styling (themes, variables, glassmorphism)
│   │   └── editor.css         # Styling for the live editor drawer
│   ├── js/
│   │   ├── main.js            # Theme toggle, typewriter, filters, modals
│   │   └── editor.js          # In-browser live customizer engine
│   └── images/                # Avatars and project preview mockups
└── templates/
    └── index.html             # Main Jinja2 portfolio layout
```

---

## 🚀 How to Run Locally

1. Open your terminal in this directory:
   ```bash
   cd portfolio_website
   ```

2. Run the application with Python:
   ```bash
   python run.py
   ```
   *(or `python app.py`)*

3. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

---

## 📝 How to Customize With Your Information

You have two simple ways to personalize this portfolio:

### Method 1: In the Browser (Easiest)
1. Start the server and open `http://127.0.0.1:5000`.
2. Click **"Edit Site"** in the top navigation or the floating **"Customize Template"** button in the lower-right corner.
3. Fill in your name, bio, skills, projects, and contact info.
4. Click **"💾 Save Changes"**. The page will reload with your personal info updated!

### Method 2: Direct File Editing
Open [`data/portfolio.json`](file:///c:/Users/User/Documents/code/antigravity/portfolio_website/data/portfolio.json) in your editor and replace any fields you want. Whenever you give me your information, I can also update it for you instantly!
