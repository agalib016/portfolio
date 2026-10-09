"""
Launcher script for the Aesthetic Python Portfolio Website
Run this file with: python run.py
"""

import sys
import os

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    port = 5000
    print("=" * 60)
    print("AESTHETIC PORTFOLIO WEBSITE (PYTHON & FLASK)")
    print(f"Serving locally at: http://127.0.0.1:{port}")
    print("Light & Dark Themes: toggle via the navbar sun/moon button")
    print("Live In-Browser Editor: click 'Edit Site' or bottom-right pill")
    print("Data file: edit directly in data/portfolio.json anytime")
    print("=" * 60)
    app.run(host='127.0.0.1', port=port, debug=False)
