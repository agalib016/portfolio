import os
import json
import logging
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)
app.config['SECRET_KEY'] = 'creative-portfolio-secret-key-2026'
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.jinja_env.auto_reload = True

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
PORTFOLIO_FILE = os.path.join(DATA_DIR, 'portfolio.json')
DEFAULT_FILE = os.path.join(DATA_DIR, 'portfolio_default.json')
MESSAGES_FILE = os.path.join(DATA_DIR, 'messages.json')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_portfolio_data():
    """Load portfolio data from JSON file with fallback."""
    try:
        if os.path.exists(PORTFOLIO_FILE):
            with open(PORTFOLIO_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        elif os.path.exists(DEFAULT_FILE):
            with open(DEFAULT_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        logging.error(f"Error loading portfolio data: {e}")
    
    return {
        "brand": {"logo_text": "Portfolio.dev", "logo_symbol": "⚡"},
        "hero": {"greeting": "Hello", "name": "Developer", "bio": "Creative Technologist"},
        "meta": {"title": "Portfolio Website"}
    }

def save_portfolio_data(data):
    """Save portfolio data to JSON file with automated backup."""
    os.makedirs(DATA_DIR, exist_ok=True)
    # Create backup before write
    if os.path.exists(PORTFOLIO_FILE):
        try:
            backup_file = os.path.join(DATA_DIR, 'portfolio.backup.json')
            with open(PORTFOLIO_FILE, 'r', encoding='utf-8') as src:
                with open(backup_file, 'w', encoding='utf-8') as dst:
                    dst.write(src.read())
        except Exception as e:
            logging.warning(f"Could not create backup: {e}")

    with open(PORTFOLIO_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def save_contact_message(message_data):
    """Store contact form inquiry locally so messages aren't lost."""
    os.makedirs(DATA_DIR, exist_ok=True)
    messages = []
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                messages = json.load(f)
        except Exception:
            messages = []
    
    message_data['id'] = len(messages) + 1
    message_data['received_at'] = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    messages.append(message_data)
    
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(messages, f, indent=2, ensure_ascii=False)
    
    return message_data

@app.route('/')
def home():
    """Render the aesthetic portfolio home page."""
    data = load_portfolio_data()
    return render_template('index.html', data=data)

@app.route('/download-cv')
@app.route('/resume.pdf')
def download_cv():
    """Serve the CV / Resume PDF directly as a download."""
    cv_dir = os.path.join(BASE_DIR, 'static', 'documents')
    filename = 'Md_Asadullahil_Galib_CV.pdf'
    if not os.path.exists(os.path.join(cv_dir, filename)):
        try:
            from generate_cv import create_resume
            create_resume()
        except Exception as e:
            logging.error(f"Error generating CV: {e}")
    return send_from_directory(cv_dir, filename, as_attachment=True, download_name='Md_Asadullahil_Galib_CV.pdf')

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio_api():
    """Retrieve current portfolio JSON data."""
    data = load_portfolio_data()
    return jsonify(data)

@app.route('/api/portfolio', methods=['POST'])
def update_portfolio_api():
    """Update portfolio JSON data from the in-browser live editor."""
    try:
        updated_data = request.get_json()
        if not updated_data or not isinstance(updated_data, dict):
            return jsonify({'success': False, 'error': 'Invalid JSON payload'}), 400
        
        save_portfolio_data(updated_data)
        logging.info("Portfolio data successfully saved.")
        return jsonify({
            'success': True,
            'message': 'Portfolio successfully updated and saved to data/portfolio.json!'
        })
    except Exception as e:
        logging.error(f"Failed to update portfolio: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/portfolio/reset', methods=['POST'])
def reset_portfolio_api():
    """Reset portfolio data to default template values."""
    try:
        if os.path.exists(DEFAULT_FILE):
            with open(DEFAULT_FILE, 'r', encoding='utf-8') as f:
                default_data = json.load(f)
            save_portfolio_data(default_data)
            return jsonify({
                'success': True,
                'message': 'Portfolio reset to default template state!'
            })
        return jsonify({'success': False, 'error': 'Default template file not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def contact_api():
    """Handle contact form submissions."""
    try:
        content = request.get_json() or request.form.to_dict()
        name = content.get('name', '').strip()
        email = content.get('email', '').strip()
        subject = content.get('subject', 'Portfolio Contact Inquiry').strip()
        message = content.get('message', '').strip()

        if not name or not email or not message:
            return jsonify({'success': False, 'error': 'Please fill out all required fields (Name, Email, Message).'}), 400

        entry = {
            'name': name,
            'email': email,
            'subject': subject,
            'message': message
        }
        saved_entry = save_contact_message(entry)
        logging.info(f"New contact message from {name} <{email}>")

        return jsonify({
            'success': True,
            'message': f'Thank you {name}! Your message has been received. I will reply to {email} shortly.'
        })
    except Exception as e:
        logging.error(f"Contact form error: {e}")
        return jsonify({'success': False, 'error': 'An internal error occurred while processing your message.'}), 500

@app.route('/api/messages', methods=['GET'])
def get_messages():
    """View saved contact messages."""
    if os.path.exists(MESSAGES_FILE):
        try:
            with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
                return jsonify(json.load(f))
        except Exception:
            return jsonify([])
    return jsonify([])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("==================================================")
    print(f"Portfolio Website server running on http://127.0.0.1:{port}")
    print("Editable template: edit directly in browser or in data/portfolio.json")
    print("==================================================")
    app.run(host='127.0.0.1', port=port, debug=False)
