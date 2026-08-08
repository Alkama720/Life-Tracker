import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and display 'Page X of Y' 
    along with an executive header and footer styling.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 812, "LIFE OPERATING SYSTEM — EXECUTIVE COMMAND CENTER")
            self.drawRightString(559, 812, "STRICTLY PRIVATE & CONFIDENTIAL")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(36, 804, 559, 804)
        
        # Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 42, 559, 42)
        
        self.setFont("Helvetica", 8)
        self.drawString(36, 30, "System Architecture: Systems Over Motivation | Track Reality, Not Intentions")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(559, 30, page_text)
        self.restoreState()


def create_life_os_pdf(output_filename="public/Life_OS_Personal_Command_Center.pdf"):
    os.makedirs(os.path.dirname(output_filename), exist_ok=True)
    
    # Page setup - A4 (595.27 x 841.89 pt) with 0.5 inch (36 pt) margins
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=48,
        bottomMargin=54
    )
    
    printable_width = 523.27  # 595.27 - 72

    # Color Palette (Executive Dark Slate / Minimal Clean)
    C_PRIMARY = colors.HexColor("#0F172A")    # Deep Slate / Near-Black
    C_SECONDARY = colors.HexColor("#1E293B")  # Charcoal Border / Dark Header
    C_ACCENT = colors.HexColor("#0284C7")     # Restrained Blue Accent
    C_BG_LIGHT = colors.HexColor("#F8FAFC")   # Light Grey Table Alternate
    C_TEXT_DARK = colors.HexColor("#0F172A")  # Dark Text
    C_TEXT_MUTED = colors.HexColor("#64748B") # Slate Grey
    C_BORDER = colors.HexColor("#CBD5E1")     # Light Border Grey
    C_ALERT = colors.HexColor("#DC2626")      # Muted Red for Bottlenecks

    # Base Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=C_PRIMARY,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=C_ACCENT,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=C_PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=C_SECONDARY,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=C_TEXT_DARK
    )

    body_bold = ParagraphStyle(
        'BodyDarkBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=C_PRIMARY
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1 # Centered
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=C_TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=C_PRIMARY
    )

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10.5,
        textColor=C_TEXT_MUTED,
        spaceBefore=4,
        spaceAfter=4
    )

    story = []

    # Helper function for section banners
    def make_section_banner(title_text, subtitle_text=""):
        p_title = Paragraph(f"<b>{title_text.upper()}</b>", ParagraphStyle(
            'BannerTitle', fontName='Helvetica-Bold', fontSize=10, leading=12, textColor=colors.white
        ))
        p_sub = Paragraph(f"<i>{subtitle_text}</i>", ParagraphStyle(
            'BannerSub', fontName='Helvetica', fontSize=7.5, leading=9, textColor=colors.HexColor("#94A3B8")
        )) if subtitle_text else Paragraph("", body_style)
        
        t = Table([[p_title, p_sub]], colWidths=[printable_width*0.6, printable_width*0.4])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), C_PRIMARY),
            ('ALIGN', (0,0), (0,0), 'LEFT'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    # Helper for form input box table cells
    def make_field(label="____________________", height_pts=12):
        return Paragraph(f"<font color='#94A3B8'>{label}</font>", table_cell_style)

    # =========================================================================
    # PART 1: COVER & EXECUTIVE PROFILE (LAYER 1 - VISION & RULES)
    # =========================================================================
    story.append(Paragraph("PERSONAL LIFE OPERATING SYSTEM", title_style))
    story.append(Paragraph("EXECUTIVE COMMAND CENTER & BEHAVIORAL TRACKER — VER 1.0", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=C_ACCENT, spaceBefore=0, spaceAfter=10))

    profile_data = [
        [
            Paragraph("<b>OPERATOR PROFILE</b>", table_cell_bold),
            Paragraph("Age: 21 | Location: Mumbai, India", table_cell_style),
            Paragraph("Base Salary: ₹20,000 / month", table_cell_style)
        ],
        [
            Paragraph("<b>WORK ENVIRONMENT</b>", table_cell_bold),
            Paragraph("Role: B2B Sales / Business Dev @ Starz AI", table_cell_style),
            Paragraph("Work Window: Mon–Sat (10:30 AM – 7:00 PM)", table_cell_style)
        ],
        [
            Paragraph("<b>COMMUTE & SLEEP</b>", table_cell_bold),
            Paragraph("Commute: 09:30 AM Depart | 20:00 PM Arrival", table_cell_style),
            Paragraph("Sleep Target: 12:00 AM Sleep – 08:00 AM Wake (8 Hrs)", table_cell_style)
        ]
    ]
    t_profile = Table(profile_data, colWidths=[120, 200, 203.27])
    t_profile.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_profile)
    story.append(Spacer(1, 10))

    # Core Operating Rules Matrix
    story.append(make_section_banner("LAYER 1: VISION, IDENTITY & CORE OPERATING RULES", "Philosophy: Systems Over Motivation"))
    story.append(Spacer(1, 4))
    
    rules_data = [
        [Paragraph("<b>CORE OPERATING PRINCIPLES</b>", table_header_style), Paragraph("<b>12-MONTH IDENTITY & CONSTRAINTS MATRIX</b>", table_header_style)],
        [
            Paragraph("""
            1. <b>Consistency over intensity:</b> Daily 1% actions compound over time.<br/>
            2. <b>Progress over perfection:</b> Flawless execution is a trap. Track reality.<br/>
            3. <b>Systems over motivation:</b> Motivation fails; routines enforce behavior.<br/>
            4. <b>Track reality, not intentions:</b> Record exact numbers, not desires.<br/>
            5. <b>Protect health & sleep:</b> Non-negotiable foundation for sales & income.<br/>
            6. <b>Single-habit focus:</b> Never attempt 10 habit changes simultaneously.<br/>
            7. <b>No self-deception:</b> Review failures ruthlessly without shame.<br/>
            8. <b>Income-producing focus:</b> Prioritize sales mastery over low-leverage tasks.
            """, body_style),
            Paragraph("""
            <b>12-Month Target Identity:</b> Elite B2B Sales Performer, Financially Disciplined, Physical Health Stable, Content Builder.<br/><br/>
            <b>Primary Bottlenecks:</b><br/>
            • 3-4 hrs/day lost to scrolling & gaming.<br/>
            • Cigarette count (6+/day) & THC drag.<br/>
            • Restricted monthly budget (₹20k base).<br/><br/>
            <b>Primary Opportunities:</b><br/>
            • High-commission B2B deals at Starz AI.<br/>
            • AI automation skills (no Python required).<br/>
            • Faceless YouTube side-income engine.
            """, body_style)
        ]
    ]
    t_rules = Table(rules_data, colWidths=[260, 263.27])
    t_rules.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), C_SECONDARY),
        ('BACKGROUND', (1,0), (1,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_rules)
    story.append(Spacer(1, 12))

    # =========================================================================
    # PART 2: PRIORITY HIERARCHY MATRIX (LAYER 2 & LAYER 3)
    # =========================================================================
    story.append(make_section_banner("LAYER 2 & 3: STRICT PRIORITY HIERARCHY & GOAL MATRIX", "Conflict Rule: Higher Priority Always Wins"))
    story.append(Spacer(1, 4))

    prio_headers = [
        Paragraph("<b>P#</b>", table_header_style),
        Paragraph("<b>PRIORITY AREA</b>", table_header_style),
        Paragraph("<b>WHY IT MATTERS</b>", table_header_style),
        Paragraph("<b>DESIRED OUTCOME</b>", table_header_style),
        Paragraph("<b>CURRENT BOTTLENECK</b>", table_header_style),
        Paragraph("<b>NEXT ACTION</b>", table_header_style),
        Paragraph("<b>STATUS</b>", table_header_style)
    ]

    prio_rows = [
        ["1", "Health", "Foundation for energy, focus & longevity", "Consistent exercise, reduce smoking, hair care", "No gym, smoking 6+/day, high screen time", "30-min daily morning movement routine", "ACTIVE"],
        ["2", "Money", "Achieve financial independence & stability", "Increase monthly income, build emergency fund", "Fixed ₹20k salary, limited savings buffer", "Drive Starz AI sales commissions & track spending", "ACTIVE"],
        ["3", "Sales Mastery", "Primary vehicle for rapid income growth", "Become top B2B closer at Starz AI", "Objection handling & call volume consistency", "Log 30+ daily calls & complete evening review", "ACTIVE"],
        ["4", "Discipline", "Bridge between intentions & execution", "Zero non-essential phone use during deep work", "3-4 hrs daily screen/gaming distraction", "Enforce 2-hr phone shutdown blocks", "ACTIVE"],
        ["5", "Peace of Mind", "Sustained high performance without burnout", "Calm mental focus, clean evening wind-down", "Substance dependency & screen overstimulation", "Nightly 3-min reflection journal at 10:30 PM", "ACTIVE"],
        ["6", "AI Skills", "Leverage multiplier for sales & efficiency", "Master practical AI tools for B2B workflow", "Time scarcity & avoiding Python confusion", "30-min Tue/Thu practical AI tool application", "ACTIVE"],
        ["7", "Faceless YouTube", "Scalable asset for secondary cashflow", "Publish 2 sustainable videos / month", "Time constraints & scripting friction", "Wed/Fri script & production rotation", "NOT STARTED"],
        ["8", "Content Creation", "Personal authority & distribution", "Repurpose sales/AI insights into posts", "Prioritizing sales & health first", "Batch 1 post on Sunday planning session", "PAUSED"],
        ["9", "College", "Formal qualification completion", "Maintain passing status without burnout", "Time conflict with Starz AI work hours", "Lightweight exam & assignment tracking", "ACTIVE"]
    ]

    table_data_prio = [prio_headers]
    for r in prio_rows:
        table_data_prio.append([
            Paragraph(f"<b>{r[0]}</b>", table_cell_bold),
            Paragraph(f"<b>{r[1]}</b>", table_cell_bold),
            Paragraph(r[2], table_cell_style),
            Paragraph(r[3], table_cell_style),
            Paragraph(f"<font color='#DC2626'>{r[4]}</font>", table_cell_style),
            Paragraph(r[5], table_cell_style),
            Paragraph(f"<b>{r[6]}</b>", table_cell_style)
        ])

    t_prio = Table(table_data_prio, colWidths=[20, 65, 95, 95, 95, 105, 48.27])
    t_prio.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_prio)
    story.append(Spacer(1, 14))

    story.append(PageBreak()) # Clean page break for Daily & Weekly Systems

    # =========================================================================
    # PART 3: DAILY EXECUTION & ROTATING EVENING SYSTEM (LAYER 4 & PART 6)
    # =========================================================================
    story.append(make_section_banner("LAYER 4: DAILY EXECUTION & ROTATING TIME-BLOCK SYSTEM", "Default Schedule & Rotational Focus Engine"))
    story.append(Spacer(1, 4))

    sched_headers = [
        Paragraph("<b>TIME WINDOW</b>", table_header_style),
        Paragraph("<b>ACTIVITY BLOCK</b>", table_header_style),
        Paragraph("<b>CORE OBJECTIVE & ENFORCEMENT RULES</b>", table_header_style),
        Paragraph("<b>CHECK</b>", table_header_style)
    ]

    sched_rows = [
        ["08:00 – 08:30 AM", "Morning Routine", "Wake strictly at 08:00 AM. 500ml water. Zero social media / phone scrolling.", "[  ]"],
        ["08:30 – 09:00 AM", "Movement / Exercise", "Bodyweight routine (pushups, squats, stretching) / light jog. Protect physical health.", "[  ]"],
        ["09:00 – 09:30 AM", "Breakfast & Prep", "Nutritious meal, shower, get ready for commute.", "[  ]"],
        ["09:30 – 10:30 AM", "Commute to Starz AI", "Listen to sales podcast / objection audio / reading. Productive commute.", "[  ]"],
        ["10:30 AM – 07:00 PM", "Starz AI Work Block", "Core B2B Sales Execution: Prospecting, Cold Calls, Meetings, Demos, Follow-ups.", "[  ]"],
        ["07:00 – 08:00 PM", "Commute Home", "Wind down from work day, decompress, audio learning.", "[  ]"],
        ["08:00 – 08:45 PM", "Dinner & Recovery", "Meal with family/solitude. Zero work stress.", "[  ]"],
        ["08:45 – 09:30 PM", "ROTATING EVENING BLOCK", "Execute ONLY today's assigned theme (Sales / AI / YouTube / Review).", "[  ]"],
        ["09:30 – 10:00 PM", "Night Movement / Walk", "30-minute evening walk. Scalp/hair routine application.", "[  ]"],
        ["10:00 – 10:30 PM", "Wind Down", "Screen shutdown. Prepare clothes & tasks for tomorrow.", "[  ]"],
        ["10:30 – 11:00 PM", "3-Minute Journal & Review", "Log daily metrics (cigs, screen time, sales), answer 4 reflection questions.", "[  ]"],
        ["11:00 – 12:00 AM", "Reading & Sleep Prep", "Read physical book / sales guide. In bed by 11:45 PM. Lights out at 12:00 AM.", "[  ]"]
    ]

    table_data_sched = [sched_headers]
    for r in sched_rows:
        table_data_sched.append([
            Paragraph(f"<b>{r[0]}</b>", table_cell_bold),
            Paragraph(f"<b>{r[1]}</b>", table_cell_bold),
            Paragraph(r[2], table_cell_style),
            Paragraph(f"<b>{r[3]}</b>", table_cell_bold)
        ])

    t_sched = Table(table_data_sched, colWidths=[90, 110, 283.27, 40])
    t_sched.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_sched)
    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 4: ROTATING WEEKLY THEME SYSTEM (PART 7)
    # =========================================================================
    story.append(make_section_banner("PART 7: MON–SUN ROTATING EVENING THEME PLANNER", "Preventing Multi-Goal Burnout"))
    story.append(Spacer(1, 4))

    weekly_headers = [
        Paragraph("<b>DAY</b>", table_header_style),
        Paragraph("<b>PRIMARY EVENING THEME (08:45–09:30 PM)</b>", table_header_style),
        Paragraph("<b>SPECIFIC DELIVERABLE / FOCUS</b>", table_header_style),
        Paragraph("<b>SALES TARGET</b>", table_header_style),
        Paragraph("<b>HEALTH FOCUS</b>", table_header_style)
    ]

    weekly_rows = [
        ["MONDAY", "Sales Outreach Focus", "Review lead list, craft customized B2B pitch scripts", "30 Calls / 5 Leads", "Morning Movement"],
        ["TUESDAY", "Objection Handling + AI Tools", "Practice pitch responses; test ChatGPT sales prompt templates", "30 Calls / 2 Meetings", "Hair Care Routine"],
        ["WEDNESDAY", "Prospecting + YouTube Scripting", "Mine LinkedIn/database for decision makers + outline 1 YT video", "30 Calls / 5 Leads", "Morning Exercise"],
        ["THURSDAY", "Sales Call Review + AI Automation", "Listen to call recordings; build email follow-up automations", "30 Calls / 2 Meetings", "Hair Care Routine"],
        ["FRIDAY", "Closing Skills + YouTube Production", "Roleplay closing objection handles; edit voiceover/visuals", "Closing Follow-ups", "30-min Night Walk"],
        ["SATURDAY", "Pipeline Review & CRM Maintenance", "Update pipeline stages, log metrics, clean CRM contacts", "Weekly Review", "Full Exercise Session"],
        ["SUNDAY", "Recovery, Planning & Content Batching", "Complete 20-min Weekly Review, meal prep, batch YouTube assets", "Zero Sales Calls", "Rest & Reset"]
    ]

    table_data_weekly = [weekly_headers]
    for r in weekly_rows:
        table_data_weekly.append([
            Paragraph(f"<b>{r[0]}</b>", table_cell_bold),
            Paragraph(f"<b>{r[1]}</b>", table_cell_bold),
            Paragraph(r[2], table_cell_style),
            Paragraph(r[3], table_cell_style),
            Paragraph(r[4], table_cell_style)
        ])

    t_weekly = Table(table_data_weekly, colWidths=[65, 140, 168.27, 80, 70])
    t_weekly.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_weekly)
    story.append(Spacer(1, 14))

    story.append(PageBreak()) # Page 3: Habit Tracker & Sales Command Center

    # =========================================================================
    # PART 5: WEEKLY HABIT & SUBSTANCE TRACKER (PART 8 & 12)
    # =========================================================================
    story.append(make_section_banner("PART 8 & 12: HABIT, SUBSTANCE & RECLAIMED SCREEN-TIME TRACKER", "Track Reality: Numeric Logins For Trends"))
    story.append(Spacer(1, 4))

    habit_headers = [
        Paragraph("<b>METRIC / HABIT</b>", table_header_style),
        Paragraph("<b>TARGET</b>", table_header_style),
        Paragraph("<b>MON</b>", table_header_style),
        Paragraph("<b>TUE</b>", table_header_style),
        Paragraph("<b>WED</b>", table_header_style),
        Paragraph("<b>THU</b>", table_header_style),
        Paragraph("<b>FRI</b>", table_header_style),
        Paragraph("<b>SAT</b>", table_header_style),
        Paragraph("<b>SUN</b>", table_header_style),
        Paragraph("<b>WEEKLY TOTAL / AVG</b>", table_header_style)
    ]

    habit_rows = [
        ["Wake on Time (08:00 AM)", "7 / 7", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "___ / 7 Days"],
        ["Sleep on Time (12:00 AM)", "7 / 7", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "___ / 7 Days"],
        ["Water Intake (Liters)", "3.0 L", "____", "____", "____", "____", "____", "____", "____", "Avg: ___ L"],
        ["Movement / Exercise (Mins)", "30 Mins", "____", "____", "____", "____", "____", "____", "____", "Total: ___ Mins"],
        ["Sales Practice (Calls)", "30 / day", "____", "____", "____", "____", "____", "____", "REST", "Total: ___ Calls"],
        ["AI / YouTube Learning", "45 Mins", "____", "____", "____", "____", "____", "____", "____", "Total: ___ Mins"],
        ["Hair / Scalp Routine", "Daily", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "___ / 7 Days"],
        ["Cigarettes Smoked (Count)", "< 4 / day", "____", "____", "____", "____", "____", "____", "____", "Total: ___ Cigs"],
        ["THC Used (Yes / No / Qty)", "0 / Low", "____", "____", "____", "____", "____", "____", "____", "Total: ___ Days"],
        ["Instagram Screen Time (Mins)", "< 30m", "____", "____", "____", "____", "____", "____", "____", "Avg: ___ Mins"],
        ["YouTube Screen Time (Mins)", "< 45m", "____", "____", "____", "____", "____", "____", "____", "Avg: ___ Mins"],
        ["Gaming Screen Time (Mins)", "0 Mins", "____", "____", "____", "____", "____", "____", "____", "Total: ___ Mins"],
        ["Total Screen Time (Hours)", "< 1.5 hrs", "____", "____", "____", "____", "____", "____", "____", "Avg: ___ Hrs"],
        ["Expenses Logged (Yes/No)", "Daily", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "___ / 7 Days"]
    ]

    table_data_habit = [habit_headers]
    for r in habit_rows:
        table_data_habit.append([
            Paragraph(f"<b>{r[0]}</b>", table_cell_bold),
            Paragraph(f"<font color='#0284C7'><b>{r[1]}</b></font>", table_cell_style),
            Paragraph(r[2], table_cell_style),
            Paragraph(r[3], table_cell_style),
            Paragraph(r[4], table_cell_style),
            Paragraph(r[5], table_cell_style),
            Paragraph(r[6], table_cell_style),
            Paragraph(r[7], table_cell_style),
            Paragraph(r[8], table_cell_style),
            Paragraph(f"<b>{r[9]}</b>", table_cell_style)
        ])

    t_habit = Table(table_data_habit, colWidths=[120, 55, 35, 35, 35, 35, 35, 35, 35, 98.27])
    t_habit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_habit)
    story.append(Spacer(1, 6))

    # Reclaimed Screen-Time Allocation Box
    reclaimed_data = [
        [
            Paragraph("<b>RECLAIMED TIME CONVERSION LOG</b>", table_cell_bold),
            Paragraph("<b>Target Recovery:</b> Reclaim 2.0 hrs/day from scrolling & gaming.", table_cell_style)
        ],
        [
            Paragraph("<b>Where did recovered time go this week?</b>", table_cell_style),
            Paragraph("[  ] Sleep / Rest &nbsp;&nbsp;&nbsp; [  ] Exercise &nbsp;&nbsp;&nbsp; [  ] Sales Calls &nbsp;&nbsp;&nbsp; [  ] Practical AI &nbsp;&nbsp;&nbsp; [  ] YouTube Pipeline", table_cell_bold)
        ]
    ]
    t_reclaimed = Table(reclaimed_data, colWidths=[170, 353.27])
    t_reclaimed.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0F9FF")),
        ('BOX', (0,0), (-1,-1), 0.5, C_ACCENT),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_reclaimed)
    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 6: B2B SALES COMMAND CENTER & LOG (PART 9)
    # =========================================================================
    story.append(make_section_banner("PART 9: B2B SALES DASHBOARD — STARZ AI", "Primary Revenue Engine"))
    story.append(Spacer(1, 4))

    sales_headers = [
        Paragraph("<b>DATE</b>", table_header_style),
        Paragraph("<b>CALLS</b>", table_header_style),
        Paragraph("<b>CONV.</b>", table_header_style),
        Paragraph("<b>LEADS</b>", table_header_style),
        Paragraph("<b>MEETS</b>", table_header_style),
        Paragraph("<b>DEMOS</b>", table_header_style),
        Paragraph("<b>CLOSES</b>", table_header_style),
        Paragraph("<b>REVENUE</b>", table_header_style),
        Paragraph("<b>MAIN OBJECTION ENCOUNTERED</b>", table_header_style),
        Paragraph("<b>DAILY LESSON / CHANGE</b>", table_header_style)
    ]

    table_data_sales = [sales_headers]
    for i in range(6):
        table_data_sales.append([
            make_field("DD/MM"), make_field("__"), make_field("__"), make_field("__"),
            make_field("__"), make_field("__"), make_field("__"), make_field("₹_____"),
            make_field("e.g. Budget / Price"), make_field("One key pitch tweak...")
        ])

    t_sales = Table(table_data_sales, colWidths=[40, 35, 35, 35, 35, 35, 40, 55, 110, 103.27])
    t_sales.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_sales)
    story.append(Spacer(1, 14))

    story.append(PageBreak()) # Page 4: Finance, Health & YouTube

    # =========================================================================
    # PART 7: DYNAMIC FINANCIAL SYSTEM & PRIORITY LADDER (PART 10)
    # =========================================================================
    story.append(make_section_banner("PART 10: DYNAMIC FINANCIAL SYSTEM & PRIORITY LADDER", "Base Salary: ₹20,000 / month"))
    story.append(Spacer(1, 4))

    fin_data = [
        [
            Paragraph("<b>MONTHLY INCOME LEDGER</b>", table_header_style),
            Paragraph("<b>EXPENSE CATEGORIES (DYNAMIC)</b>", table_header_style),
            Paragraph("<b>NET METRICS & CALCULATIONS</b>", table_header_style)
        ],
        [
            Paragraph("""
            <b>Base Salary (Starz AI):</b> ₹20,000<br/>
            <b>Sales Commissions:</b> ₹___________<br/>
            <b>Side Income (YT/Other):</b> ₹___________<br/>
            <b>Total Monthly Income:</b> ₹___________
            """, body_style),
            Paragraph("""
            • Travel / Commute: ₹___________<br/>
            • Food & Groceries: ₹___________<br/>
            • Family / Bills: ₹___________<br/>
            • Subscriptions / Learning: ₹___________<br/>
            • Health / Personal Care: ₹___________<br/>
            • Miscellaneous: ₹___________<br/>
            <b>Total Expenses:</b> ₹___________
            """, body_style),
            Paragraph("""
            <b>Net Monthly Savings:</b> ₹___________<br/>
            <b>Savings Rate (%):</b> _________%<br/>
            <b>Emergency Buffer Fund:</b> ₹___________<br/>
            <b>Current Net Worth:</b> ₹___________<br/><br/>
            <font color='#0284C7'><i>Rule: Targets expand dynamically as sales commissions grow.</i></font>
            """, body_style)
        ]
    ]
    t_fin = Table(fin_data, colWidths=[165, 180, 178.27])
    t_fin.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), C_SECONDARY),
        ('BACKGROUND', (1,0), (1,0), C_SECONDARY),
        ('BACKGROUND', (2,0), (2,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_fin)
    story.append(Spacer(1, 6))

    # Financial Priority Ladder
    ladder_text = Paragraph("""
    <b>FINANCIAL PRIORITY LADDER:</b> 
    <b>[1] Track Expenses</b> &nbsp;➔&nbsp; 
    <b>[2] Control Unnecessary Spend</b> &nbsp;➔&nbsp; 
    <b>[3] Build Emergency Buffer</b> &nbsp;➔&nbsp; 
    <b>[4] Increase Sales Income</b> &nbsp;➔&nbsp; 
    <b>[5] Build Savings</b> &nbsp;➔&nbsp; 
    <b>[6] Invest Wisely</b>
    """, ParagraphStyle('Ladder', parent=body_style, fontSize=8, alignment=1, textColor=C_PRIMARY))
    t_ladder = Table([[ladder_text]], colWidths=[printable_width])
    t_ladder.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), C_BG_LIGHT),
        ('BOX', (0,0), (0,0), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (0,0), 4),
        ('BOTTOMPADDING', (0,0), (0,0), 4),
    ]))
    story.append(t_ladder)
    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 8: HEALTH SYSTEM & HAIR/SCALP TRACKER (PART 11)
    # =========================================================================
    story.append(make_section_banner("PART 11: HEALTH SYSTEM & HAIR/SCALP OBSERVATION LOG", "Non-Medical Observation & Clinician Preparation"))
    story.append(Spacer(1, 2))
    story.append(Paragraph("<b>MEDICAL DISCLAIMER:</b> Medical diagnostic & treatment decisions must be made in consultation with a qualified healthcare professional. This log strictly records observations, symptom changes, treatment adherence, and preparation questions for clinician visits.", disclaimer_style))
    story.append(Spacer(1, 4))

    hair_headers = [
        Paragraph("<b>DATE</b>", table_header_style),
        Paragraph("<b>SCALP / HAIR OBSERVATION</b>", table_header_style),
        Paragraph("<b>VISIBLE CHANGES</b>", table_header_style),
        Paragraph("<b>TREATMENT / APPOINTMENT</b>", table_header_style),
        Paragraph("<b>ADHERENCE</b>", table_header_style),
        Paragraph("<b>QUESTIONS FOR CLINICIAN</b>", table_header_style)
    ]

    table_data_hair = [hair_headers]
    for i in range(4):
        table_data_hair.append([
            make_field("DD/MM"),
            make_field("Patch status, density, scalp sensation..."),
            make_field("New growth / shedding..."),
            make_field("Consultation / routine..."),
            make_field("[ ] 100%"),
            make_field("Specific query for doctor...")
        ])

    t_hair = Table(table_data_hair, colWidths=[45, 125, 95, 100, 45, 113.27])
    t_hair.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_hair)
    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 9: FACELESS YOUTUBE PIPELINE & PRACTICAL AI LOG (PART 13 & 14)
    # =========================================================================
    story.append(make_section_banner("PART 13 & 14: FACELESS YOUTUBE PIPELINE & PRACTICAL AI LOG", "Scalable Media Engine & Practical Automation (No Python)"))
    story.append(Spacer(1, 4))

    yt_pipeline_box = Paragraph("""
    <b>10-STAGE FACELESS YOUTUBE PIPELINE:</b><br/>
    [1] IDEA &nbsp;➔&nbsp; 
    [2] RESEARCH &nbsp;➔&nbsp; 
    [3] HOOK &nbsp;➔&nbsp; 
    [4] SCRIPT &nbsp;➔&nbsp; 
    [5] VOICEOVER &nbsp;➔&nbsp; 
    [6] VISUALS &nbsp;➔&nbsp; 
    [7] EDIT &nbsp;➔&nbsp; 
    [8] THUMBNAIL &nbsp;➔&nbsp; 
    [9] UPLOAD &nbsp;➔&nbsp; 
    [10] ANALYZE
    """, ParagraphStyle('YTPipeline', parent=body_style, fontSize=7.5, alignment=1, textColor=C_PRIMARY))
    
    t_yt_pipe = Table([[yt_pipeline_box]], colWidths=[printable_width])
    t_yt_pipe.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), C_BG_LIGHT),
        ('BOX', (0,0), (0,0), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (0,0), 3),
        ('BOTTOMPADDING', (0,0), (0,0), 3),
    ]))
    story.append(t_yt_pipe)
    story.append(Spacer(1, 4))

    yt_headers = [
        Paragraph("<b>VIDEO TITLE / TOPIC</b>", table_header_style),
        Paragraph("<b>HOOK HIGHLIGHT</b>", table_header_style),
        Paragraph("<b>STAGE / STATUS</b>", table_header_style),
        Paragraph("<b>VIEWS</b>", table_header_style),
        Paragraph("<b>CTR %</b>", table_header_style),
        Paragraph("<b>AVG DUR</b>", table_header_style),
        Paragraph("<b>KEY LESSON LEARNED</b>", table_header_style)
    ]

    table_data_yt = [yt_headers]
    for i in range(3):
        table_data_yt.append([
            make_field("Video topic..."),
            make_field("First 5-sec hook..."),
            make_field("Script / Edit / Upload"),
            make_field("____"),
            make_field("____%"),
            make_field("____m"),
            make_field("Thumbnail / pacing takeaway...")
        ])

    t_yt = Table(table_data_yt, colWidths=[110, 110, 80, 40, 40, 40, 103.27])
    t_yt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT])
    ]))
    story.append(t_yt)
    story.append(Spacer(1, 14))

    story.append(PageBreak()) # Page 5: Reflection, College & Daily Command Center

    # =========================================================================
    # PART 10: COLLEGE TRACKER & REFLECTION JOURNAL (PART 15 & 16)
    # =========================================================================
    story.append(make_section_banner("PART 15 & 16: COLLEGE TRACKER & MULTI-TIER REFLECTION", "Lightweight College Oversight & Ruthless Review Cadence"))
    story.append(Spacer(1, 4))

    college_headers = [
        Paragraph("<b>SUBJECT / COURSE</b>", table_header_style),
        Paragraph("<b>ASSIGNMENT / EXAM TASK</b>", table_header_style),
        Paragraph("<b>DEADLINE</b>", table_header_style),
        Paragraph("<b>PRIORITY</b>", table_header_style),
        Paragraph("<b>STATUS</b>", table_header_style)
    ]
    table_data_col = [college_headers]
    for i in range(2):
        table_data_col.append([
            make_field("Subject name..."), make_field("Exam / project detail..."),
            make_field("DD/MM"), make_field("Low / Med"), make_field("[ ] Pending  [ ] Done")
        ])

    t_col = Table(table_data_col, colWidths=[120, 200, 60, 50, 93.27])
    t_col.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 3),
        ('RIGHTPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_col)
    story.append(Spacer(1, 8))

    # Reflection Questions Box
    ref_data = [
        [
            Paragraph("<b>DAILY 3-MINUTE EVENING REVIEW (10:30 PM)</b>", table_header_style),
            Paragraph("<b>WEEKLY 20-MINUTE REVIEW (SUNDAY)</b>", table_header_style)
        ],
        [
            Paragraph("""
            1. <b>What did I accomplish today?</b><br/>
            &nbsp;&nbsp;&nbsp;_________________________________________________<br/>
            2. <b>What did I avoid or procrastinate on?</b><br/>
            &nbsp;&nbsp;&nbsp;_________________________________________________<br/>
            3. <b>Why did I avoid it? (Root Bottleneck)</b><br/>
            &nbsp;&nbsp;&nbsp;_________________________________________________<br/>
            4. <b>What is tomorrow's single #1 priority action?</b><br/>
            &nbsp;&nbsp;&nbsp;_________________________________________________
            """, body_style),
            Paragraph("""
            1. <b>What worked well & produced sales/health results?</b><br/>
            2. <b>Where did I waste time or lose focus?</b><br/>
            3. <b>What habit or distraction should I STOP doing?</b><br/>
            4. <b>What successful routine should I CONTINUE?</b><br/>
            5. <b>What is next week's #1 non-negotiable objective?</b>
            """, body_style)
        ]
    ]
    t_ref = Table(ref_data, colWidths=[260, 263.27])
    t_ref.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), C_SECONDARY),
        ('BACKGROUND', (1,0), (1,0), C_SECONDARY),
        ('BOX', (0,0), (-1,-1), 0.5, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_ref)
    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 11: ONE-PAGE DAILY PERSONAL COMMAND CENTER DASHBOARD (PART 18)
    # =========================================================================
    story.append(make_section_banner("PART 18: ONE-PAGE DAILY PERSONAL COMMAND CENTER", "Daily Execution & Focus Sheet"))
    story.append(Spacer(1, 4))

    cmd_data = [
        [
            Paragraph("<b>DATE:</b> ___________", table_cell_bold),
            Paragraph("<b>DAY:</b> M &nbsp; T &nbsp; W &nbsp; T &nbsp; F &nbsp; S &nbsp; S", table_cell_bold),
            Paragraph("<b>DAILY LEVERAGE QUESTION:</b>", table_cell_bold)
        ],
        [
            Paragraph("<b>TOP 3 DAILY PRIORITIES</b><br/>1. _______________________<br/>2. _______________________<br/>3. _______________________", body_style),
            Paragraph("<b>TODAY'S SCHEDULE BLOCK</b><br/>08:00 WAKE & MOVEMENT<br/>10:30 STARZ AI WORK<br/>20:45 EVENING THEME<br/>22:30 REVIEW & SLEEP", body_style),
            Paragraph("<i>'What is the highest-leverage action I can take today that makes everything else easier or unnecessary?'</i><br/><br/><b>Answer:</b> ____________________________________", body_style)
        ],
        [
            Paragraph("<b>HEALTH SNAPSHOT</b><br/>Water: ___L | Cigs: ___<br/>Exercise: [ ] Done<br/>Hair Care: [ ] Done", body_style),
            Paragraph("<b>SALES TARGETS</b><br/>Calls: ___ / 30<br/>Meetings: ___ / 2<br/>Revenue: ₹_______", body_style),
            Paragraph("<b>SCREEN TIME & MONEY</b><br/>Screen Time: ___ hrs<br/>Money Spent Today: ₹_______<br/>Current Streak: ___ Days", body_style)
        ]
    ]

    t_cmd = Table(cmd_data, colWidths=[160, 160, 203.27])
    t_cmd.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, C_PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_cmd)
    story.append(Spacer(1, 10))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated Life OS PDF: {output_filename}")

if __name__ == '__main__':
    create_life_os_pdf()
