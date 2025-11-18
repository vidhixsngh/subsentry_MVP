# Design Guidelines for Subsentry - Subscription Tracker

## Design Approach
**Selected Approach:** Reference-Based Design System (inspired by modern fintech/productivity apps like Linear, Stripe, and modern banking apps)
**Justification:** Subscription tracking requires trust, clarity, and calm interactions - balancing visual appeal with functional efficiency for financial data display.

## Brand Identity
**Tone:** Calm, Supportive, Empowering
**Visual Direction:** Modern minimalist with ample whitespace, soft shadows, clean card-based layouts

## Core Design Elements

### A. Typography
**Primary Font:** Inter Sans (or SF Pro, Manrope as alternatives)
- **H1 (Page Titles):** 32px, Semi-bold (600)
- **H2 (Section Headers):** 24px, Medium (500)
- **H3 (Card Titles):** 18px, Medium (500)
- **Body Text:** 16px, Regular (400)
- **Small Text/Labels:** 14px, Regular (400)
- **Minimum Size:** 14px for all text
- **Line Height:** 1.5 for body, 1.2 for headings

### B. Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24 (e.g., p-4, m-8, gap-6)
- Card padding: p-6 to p-8
- Section spacing: py-12 to py-16
- Element gaps: gap-4 for compact, gap-6 for comfortable
- Consistent 24px gutter between major sections
- **Responsive:** Mobile-first, stack cards vertically on mobile, multi-column on desktop

### C. Color Palette (No Implementation Colors)
Designer will specify exact hex values based on:
- **Base:** White/light neutral backgrounds
- **Primary Accent:** Vibrant green (used for CTAs, active states, success indicators)
- **Secondary Accents:** Pastel green and pastel blue (for categorization, subtle highlights)
- **Emphasis:** Confident black (welcome screen typography, important text)
- **Status Colors:** Green (Paid), Orange/Yellow (Pending), Red (Overdue)
- **Ensure 4.5:1 contrast ratio minimum for all text**

### D. Component Library

**Navigation:**
- Top navigation bar with logo left, profile/settings right
- Consistent back button on all sub-screens (top-left)
- Mobile: Hamburger menu pattern

**Cards:**
- Rounded corners (8-12px border radius)
- Gentle drop shadows (subtle, not dramatic)
- White background with clean borders
- Grouped information with clear visual hierarchy

**Buttons:**
- Primary CTA: Vibrant green fill, white text, rounded
- Secondary: Outlined with green border, green text
- Right-aligned for primary actions
- Minimum touch target: 44px height
- Blurred backgrounds when placed over images
- Include hover and active states (slightly darker/lighter shades)

**Forms:**
- Left-aligned labels above inputs
- Clear field boundaries with subtle borders
- Validation states: success (green), error (red with supportive message)
- Required field indicators
- Dropdown for categories, date picker for renewal dates

**Data Display:**
- Dashboard cards showing: Pending count, Paid count, Overdue count
- Upcoming renewals list with subscription name, amount, date
- Total monthly expense prominently displayed
- Status badges with appropriate colors
- Category icons using Lucide or Material Icons

**Empty States:**
- Supportive illustration or icon
- Friendly message: "No bills yet. Let's add your first one."
- Clear CTA to add first subscription

**Success/Confirmation Screens:**
- Centered content with success icon (green checkmark)
- Positive message: "You're all caught up — great job!"
- Clear navigation options

### E. Iconography
**Icon Library:** Lucide or Material Icons (clean, flat style)
- Minimal, consistent icon usage
- 20-24px standard size
- Categories have distinct icons: Streaming (play), Utilities (lightning), Productivity (briefcase), Other (grid)
- Navigation icons for dashboard, add, settings

### F. Accessibility
- All interactive elements keyboard navigable (tab order)
- ARIA labels on all inputs and buttons
- Alt text for icons and images
- Focus states clearly visible
- High contrast maintained throughout
- Form validation with clear, supportive error messages

### G. Microcopy Tone
**Supportive and Human:**
- Success: "You're all caught up — great job!"
- Empty: "No bills yet. Let's add your first one."
- Loading: "Fetching your data — one sec!"
- Errors: Friendly, actionable (avoid technical jargon)

### H. Transitions
- Smooth fade or slide transitions between screens (300-400ms)
- Subtle hover effects on interactive elements
- No distracting or excessive animations
- Loading states with gentle pulse or skeleton screens

## Screen-Specific Guidance

**Login/Signup:** Simple centered layout, Gmail CTA prominent, black typography for impact

**Dashboard:** Card-based overview, status summaries at top, upcoming renewals list below, monthly total highlighted

**Add Subscription Form:** Single-column form, clear field labels, category dropdown with icons, validation feedback inline

**Success Screens:** Centered confirmation with green accent, multiple navigation CTAs

**Reminder Setup:** Toggle or dropdown for frequency, time picker, preview of selected schedule

**Settings:** List-based layout with clear sections for profile, notifications, preferences

## Images
**Hero Image:** No large hero image needed - this is a utility-focused app
**Icons Only:** Use icon library for all visual elements
**Future Consideration:** Small brand illustration on empty states or welcome screen

---

**Implementation Priority:** Create a calm, trustworthy interface where financial information is immediately clear, actions are obvious, and users feel supported rather than stressed about their subscriptions.