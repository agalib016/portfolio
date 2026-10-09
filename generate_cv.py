"""
Generate a professional, polished PDF resume for Md. Asadullahil Galib
using ReportLab.
Output: static/documents/Md_Asadullahil_Galib_CV.pdf
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_resume():
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'documents')
    os.makedirs(out_dir, exist_ok=True)
    pdf_path = os.path.join(out_dir, 'Md_Asadullahil_Galib_CV.pdf')

    # Document setup: 0.5 in margins for clean fit
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom color palette
    c_primary = colors.HexColor("#1e293b")      # Slate 800
    c_accent = colors.HexColor("#4f46e5")       # Indigo
    c_secondary = colors.HexColor("#475569")    # Slate 600
    c_border = colors.HexColor("#cbd5e1")       # Slate 300

    # Custom typography styles
    style_name = ParagraphStyle(
        'CV_Name',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        alignment=TA_CENTER
    )

    style_title = ParagraphStyle(
        'CV_Title',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_accent,
        alignment=TA_CENTER
    )

    style_contact = ParagraphStyle(
        'CV_Contact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=c_secondary,
        alignment=TA_CENTER
    )

    style_sec_heading = ParagraphStyle(
        'CV_SecHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=c_accent,
        spaceBefore=8,
        spaceAfter=2
    )

    style_item_title = ParagraphStyle(
        'CV_ItemTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12.5,
        textColor=c_primary
    )

    style_item_meta = ParagraphStyle(
        'CV_ItemMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_accent,
        alignment=TA_RIGHT
    )

    style_body = ParagraphStyle(
        'CV_Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12,
        textColor=c_primary
    )

    style_bullet = ParagraphStyle(
        'CV_Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=c_primary,
        leftIndent=12
    )

    story = []

    # Header
    story.append(Paragraph("MD. ASADULLAHIL GALIB", style_name))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Software Engineer & Computer Science Graduate | Python Web & IoT Developer", style_title))
    story.append(Spacer(1, 4))
    
    contact_text = (
        "<b>Email:</b> agalib016@gmail.com &nbsp;|&nbsp; "
        "<b>Phone:</b> +8801704680687 &nbsp;|&nbsp; "
        "<b>Location:</b> Agran, Baraigram, Natore, Bangladesh<br/>"
        "<b>LinkedIn:</b> linkedin.com/in/md-asadullahil-galib-3a23523a5 &nbsp;|&nbsp; "
        "<b>GitHub:</b> github.com/agalib016 &nbsp;|&nbsp; "
        "<b>Project:</b> orbisastra.vercel.app"
    )
    story.append(Paragraph(contact_text, style_contact))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.2, color=c_accent, spaceBefore=2, spaceAfter=6))

    # Professional Summary
    story.append(Paragraph("PROFESSIONAL SUMMARY", style_sec_heading))
    summary_text = (
        "Dedicated Computer Science & Engineering graduate from Varendra University (CGPA 3.52) with an outstanding "
        "academic background (GPA 5.00 in SSC & HSC). Proficient in building responsive full-stack web applications using "
        "<b>Python</b>, writing robust systems in <b>C, C++, Java, and PHP</b>, and designing normalized relational databases in "
        "<b>MS SQL Server</b>. Passionate about embedded systems and IoT prototyping utilizing <b>Arduino and ESP32</b> microcontrollers. "
        "Known for high productivity, clean code craftsmanship, and rapid typing turnaround (<b>60 WPM</b>)."
    )
    story.append(Paragraph(summary_text, style_body))
    story.append(Spacer(1, 6))

    # Education
    story.append(Paragraph("EDUCATION", style_sec_heading))

    edu_data = [
        [
            Paragraph("<b>B.Sc. in Computer Science & Engineering (CSE)</b><br/><font color='#475569'>Varendra University, Rajshahi</font>", style_item_title),
            Paragraph("<b>CGPA: 3.52 / 4.00</b><br/><font color='#64748b'>Passing Year: 2026</font>", style_item_meta)
        ],
        [
            Paragraph("<b>Higher Secondary Certificate (HSC) — Science</b><br/><font color='#475569'>Banpara College, Rajshahi Education Board</font>", style_item_title),
            Paragraph("<b>GPA: 5.00 / 5.00</b><br/><font color='#64748b'>Passing Year: 2022</font>", style_item_meta)
        ],
        [
            Paragraph("<b>Secondary School Certificate (SSC) — Science</b><br/><font color='#475569'>Agran High School, Rajshahi Education Board</font>", style_item_title),
            Paragraph("<b>GPA: 5.00 / 5.00</b><br/><font color='#64748b'>Passing Year: 2019</font>", style_item_meta)
        ]
    ]

    edu_table = Table(edu_data, colWidths=[380, 160])
    edu_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(edu_table)
    story.append(Spacer(1, 6))

    # Technical Skills
    story.append(Paragraph("TECHNICAL SKILLS", style_sec_heading))
    skills_lines = [
        "<b>Programming Languages:</b> Python, C, C++, Java, PHP, JavaScript (ES6+)",
        "<b>Web Technologies:</b> HTML5, Modern CSS (Glassmorphism, Flexbox, Grid), Flask, RESTful APIs, Three.js, Globe.gl",
        "<b>Database Management:</b> MS SQL Server (Relational DB Design, Schema Modeling, T-SQL, Queries & Joins)",
        "<b>IoT & Hardware Prototyping:</b> Arduino, ESP32 Microcontrollers, Sensors, Actuators, Wi-Fi/Bluetooth IoT",
        "<b>Office & Productivity:</b> MS Word, MS Excel (Formulas & Data Analysis), MS PowerPoint",
        "<b>Core Strengths:</b> Touch Typing Speed: <b>60 WPM</b>, Algorithms & Data Structures, Clean Code Principles"
    ]
    for sk in skills_lines:
        story.append(Paragraph(f"• &nbsp; {sk}", style_bullet))
    story.append(Spacer(1, 6))

    # Featured Projects
    story.append(Paragraph("FEATURED PROJECTS", style_sec_heading))

    # Project 1: OrbisAstra
    p1_head = [
        [
            Paragraph("<b>OrbisAstra — Solar System & 3D Earth Explorer</b><br/><font color='#4f46e5'><u>https://orbisastra.vercel.app/</u></font>", style_item_title),
            Paragraph("<b>Live Web Application</b>", style_item_meta)
        ]
    ]
    t1 = Table(p1_head, colWidths=[380, 160])
    t1.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    story.append(t1)
    story.append(Paragraph(
        "• &nbsp; Built an interactive 3D astronomical simulation featuring real-time planetary orbits, 3D interactive Earth globe, continents, oceans, and astronomical calculations.<br/>"
        "• &nbsp; Implemented smooth 60fps rendering, custom camera orbital controls, and responsive UI using Three.js, Globe.gl, and WebGL.",
        style_bullet
    ))
    story.append(Spacer(1, 4))

    # Project 2: Python Web Application Portal
    p2_head = [
        [
            Paragraph("<b>Python Web Application Architecture & Portal</b>", style_item_title),
            Paragraph("<b>Python & Flask</b>", style_item_meta)
        ]
    ]
    t2 = Table(p2_head, colWidths=[380, 160])
    t2.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    story.append(t2)
    story.append(Paragraph(
        "• &nbsp; Developed dynamic full-stack web architectures utilizing Python for server logic, RESTful API endpoints, and MS SQL Server for transactional persistence.<br/>"
        "• &nbsp; Implemented modern dark/light themes, client-side responsive styling, and fast server-side processing.",
        style_bullet
    ))
    story.append(Spacer(1, 4))

    # Project 3: Embedded IoT & Microcontroller Projects
    p3_head = [
        [
            Paragraph("<b>Smart IoT & Telemetry Monitoring (ESP32 & Arduino)</b>", style_item_title),
            Paragraph("<b>Hardware & IoT</b>", style_item_meta)
        ]
    ]
    t3 = Table(p3_head, colWidths=[380, 160])
    t3.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('BOTTOMPADDING', (0,0), (-1,-1), 2)]))
    story.append(t3)
    story.append(Paragraph(
        "• &nbsp; Engineered smart embedded systems integrating environmental sensors, hardware actuators, and Wi-Fi communication with ESP32 and Arduino boards.<br/>"
        "• &nbsp; Programmed C/C++ firmware routines for low-latency signal reading, data logging, and automated device actuation.",
        style_bullet
    ))
    story.append(Spacer(1, 6))

    # Languages
    story.append(Paragraph("LANGUAGES & COMMUNICATION", style_sec_heading))
    lang_text = (
        "• &nbsp; <b>English:</b> Fluent (Professional Working Proficiency)<br/>"
        "• &nbsp; <b>Bengali:</b> Native / Full Professional Fluency<br/>"
        "• &nbsp; <b>Hindi:</b> Conversational &nbsp;|&nbsp; <b>Urdu:</b> Conversational"
    )
    story.append(Paragraph(lang_text, style_body))

    doc.build(story)
    print("Resume PDF successfully built at:", pdf_path)
    print("File size:", os.path.getsize(pdf_path), "bytes")

if __name__ == '__main__':
    create_resume()
