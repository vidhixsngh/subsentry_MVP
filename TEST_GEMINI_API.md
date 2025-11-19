# Test Gemini API Key

## Issue
Your Gemini API key might not be enabled for the Generative Language API.

## Steps to Fix

### 1. Verify API Key in Google AI Studio

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check if your API key `AIzaSyCKlnjmMhTKpkk8CvG5Y99qmfet-ovxUpI` is listed
3. If not, create a new one

### 2. Enable the API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one)
3. Go to "APIs & Services" → "Library"
4. Search for "Generative Language API"
5. Click "Enable"

### 3. Create New API Key (Recommended)

Since the current key might have issues, create a fresh one:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Select "Create API key in new project" or use existing
4. Copy the new key
5. Update `.env`:
   ```
   VITE_GEMINI_API_KEY=your_new_key_here
   ```
6. Restart dev server: `npm run dev`

### 4. Test with curl

Test your API key directly:

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCKlnjmMhTKpkk8CvG5Y99qmfet-ovxUpI" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello, how are you?"
      }]
    }]
  }'
```

If this returns an error, the API key needs to be regenerated.

---

## Alternative: Use Different Model

If the issue persists, try using `gemini-pro` instead:

In `client/src/lib/gemini.ts`, change:
```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

---

## Quick Fix: Disable AI Insights Temporarily

If you want to test the rest of the analytics without AI:

In `client/src/components/AnalyticsDashboard.tsx`, comment out the AI insights section:

```typescript
{/* Temporarily disabled
{analytics.totalSubscriptions > 0 && (
  <AIInsightsCard
    insights={insights}
    isLoading={isLoading}
    onRefresh={handleRefreshInsights}
  />
)}
*/}
```

This will let you see the charts and other analytics while we fix the API key issue.

---

## Most Likely Solution

The API key needs to be created in the new Google AI Studio:

1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update `.env` with the new key
4. Restart server

Let me know the new API key and I'll update it for you!
