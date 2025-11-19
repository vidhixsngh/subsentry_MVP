# Fix Gemini API - Simple Steps

## The Problem
Your API key `AIzaSyCKlnjmMhTKpkk8CvG5Y99qmfet-ovxUpI` is not working with the Gemini API.

## Solution: Get a New API Key (2 minutes)

### Step 1: Go to Google AI Studio
Open this link: https://aistudio.google.com/app/apikey

### Step 2: Create API Key
1. Click "Create API Key" button
2. Choose "Create API key in new project" (or select existing project)
3. Wait a few seconds
4. Copy the new API key (starts with `AIza...`)

### Step 3: Update .env File
Replace the old key in `.env`:

```env
VITE_GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

### Step 4: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test
1. Go to Analytics page
2. AI insights should now load!

---

## Alternative: Test Current Key

Before getting a new key, test if current one works:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCKlnjmMhTKpkk8CvG5Y99qmfet-ovxUpI" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

If you get an error, you definitely need a new key.

---

## Why This Happens

- API key might be from old Google AI platform
- API key might not have Gemini API enabled
- API key might be restricted

**Solution:** Just get a fresh key from https://aistudio.google.com/app/apikey

---

**Once you have the new key, send it to me and I'll update the .env file!**
