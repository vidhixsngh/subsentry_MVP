# AI-Powered Analytics Dashboard - Implementation Plan

## Overview
Transform the hardcoded analytics dashboard into a dynamic, AI-powered insights platform using Gemini API and Recharts.

**Time Estimate:** 2-3 hours

---

## What We'll Build

### 1. **Visual Analytics**
- Monthly spend breakdown (interactive pie chart)
- Category-wise distribution (bar chart)
- Top 3 highest-cost subscriptions (cards)
- Least used app identification (card with suggestion)
- Summary text with total spend

### 2. **AI Insights (Gemini-powered)**
- Personalized spending analysis
- Alternative subscription suggestions with reasoning
- Usage pattern analysis
- Billing cycle optimization suggestions
- Gentle nudges (no forcing)

### 3. **UI/UX**
- Emerald green theme (matches brand)
- Smooth animations
- Loading states
- Refresh button for AI insights
- Interactive charts with tooltips

---

## Implementation Steps

### STEP 1: Install Dependencies (2 min)
```bash
npm install recharts @google/generative-ai
```

### STEP 2: Add Environment Variable (1 min)
Add to `.env`:
```
VITE_GEMINI_API_KEY=AIzaSyCKlnjmMhTKpkk8CvG5Y99qmfet-ovxUpI
```

### STEP 3: Create Gemini Service (5 min)
Create `client/src/lib/gemini.ts` - handles AI insights generation

### STEP 4: Update Analytics Hook (10 min)
Enhance `client/src/hooks/useAnalytics.ts` with:
- Real-time calculations
- Least used app detection
- Data formatting for charts

### STEP 5: Create AI Insights Hook (15 min)
Create `client/src/hooks/useAIInsights.ts` - manages Gemini API calls

### STEP 6: Create Chart Components (20 min)
- `SpendingPieChart.tsx` - Monthly breakdown
- `CategoryBarChart.tsx` - Category distribution
- `TopSubscriptionsCard.tsx` - Top 3 cards
- `LeastUsedCard.tsx` - Least used with suggestion

### STEP 7: Create AI Insights Component (15 min)
`AIInsightsCard.tsx` - Display AI-generated insights

### STEP 8: Update Analytics Dashboard (30 min)
Rebuild `client/src/components/AnalyticsDashboard.tsx` with all components

### STEP 9: Update Analytics Page (5 min)
Connect everything in `client/src/pages/Analytics.tsx`

### STEP 10: Test & Polish (20 min)
- Test with real data
- Verify AI insights quality
- Check responsive design
- Test loading states

---

## File Structure

```
client/src/
├── lib/
│   └── gemini.ts (NEW)
├── hooks/
│   ├── useAnalytics.ts (UPDATE)
│   └── useAIInsights.ts (NEW)
├── components/
│   ├── analytics/
│   │   ├── SpendingPieChart.tsx (NEW)
│   │   ├── CategoryBarChart.tsx (NEW)
│   │   ├── TopSubscriptionsCard.tsx (NEW)
│   │   ├── LeastUsedCard.tsx (NEW)
│   │   └── AIInsightsCard.tsx (NEW)
│   └── AnalyticsDashboard.tsx (UPDATE)
└── pages/
    └── Analytics.tsx (UPDATE)
```

---

## Features Breakdown

### Visual Analytics
✅ Monthly spend breakdown (pie chart)
✅ Category distribution (bar chart)
✅ Top 3 subscriptions (cards)
✅ Least used app (card)
✅ Summary text

### AI Insights
✅ Spending analysis
✅ Alternative suggestions with reasoning
✅ Usage pattern analysis
✅ Billing cycle optimization
✅ Gentle, non-forcing tone

### UX Features
✅ Emerald green theme
✅ Smooth animations
✅ Loading states
✅ Refresh button
✅ Interactive charts
✅ Responsive design

---

## AI Prompt Strategy

The Gemini prompt will include:
- Total monthly spending
- Number of subscriptions
- Category breakdown
- Top 3 subscriptions
- Least used subscription
- Billing cycle distribution
- Usage patterns (from last_used_date)

AI will provide:
- Spending insights (2-3 sentences)
- Alternative suggestions (if applicable)
- Optimization tips (billing cycles)
- Usage recommendations
- Gentle nudges

---

## Design System

### Colors (Emerald Theme)
- Primary: `#10b981` (emerald-500)
- Secondary: `#059669` (emerald-600)
- Light: `#d1fae5` (emerald-100)
- Background: `#f0fdf4` (emerald-50)

### Charts
- Pie Chart: Emerald gradient colors
- Bar Chart: Emerald bars with hover effects
- Tooltips: White background, emerald border

### Cards
- White background
- Subtle shadow
- Emerald accents
- Rounded corners (12px)

---

## Next Steps

1. Review this plan
2. I'll implement each step
3. Test with your real data
4. Iterate based on feedback

Ready to start? I'll begin with Step 1! 🚀
