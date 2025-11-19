import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('Gemini API key not found. Please check your .env file.');
} else {
  console.log('Gemini API key loaded');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface SubscriptionData {
  name: string;
  amount: number;
  category: string;
  billingCycle: string;
  lastUsedDate?: string | null;
}

export interface AnalyticsData {
  totalMonthly: number;
  totalSubscriptions: number;
  categoryBreakdown: Record<string, number>;
  top3: SubscriptionData[];
  leastUsed: SubscriptionData | null;
}

export async function generateAIInsights(data: AnalyticsData): Promise<string> {
  if (!genAI) {
    return "AI insights are currently unavailable. Please check your API configuration.";
  }

  try {
    // Use gemini-2.5-flash (latest model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });

    const prompt = `You are a friendly financial wellness advisor for SubSentry, a subscription management app. Analyze this user's subscription data and provide personalized, gentle insights.

User's Subscription Data:
- Total Monthly Spending: ₹${data.totalMonthly.toFixed(2)}
- Number of Subscriptions: ${data.totalSubscriptions}
- Category Breakdown: ${JSON.stringify(data.categoryBreakdown, null, 2)}
- Top 3 Subscriptions: ${data.top3.map(s => `${s.name} (₹${s.amount}/${s.billingCycle})`).join(', ')}
${data.leastUsed ? `- Least Used: ${data.leastUsed.name} (Last used: ${data.leastUsed.lastUsedDate || 'Unknown'})` : ''}

Please provide:
1. A brief spending analysis (2-3 sentences) - be encouraging and non-judgmental
2. Suggest 1-2 alternative subscriptions if applicable (with reasoning) - focus on Indian market alternatives
3. Billing cycle optimization tips if relevant (e.g., annual vs monthly savings)
4. Gentle usage recommendations - never force, only suggest

Guidelines:
- Keep tone warm, friendly, and supportive
- Use Indian context (₹, popular Indian services)
- Be specific with numbers and savings
- Suggest alternatives like: Disney+ Hotstar, Amazon Prime, JioSaavn, Spotify, YouTube Premium, etc.
- If spending is reasonable, acknowledge it positively
- Keep total response under 200 words
- Use emojis sparingly (1-2 max)
- Format with clear sections using markdown

Example alternatives for common subscriptions:
- Netflix → Disney+ Hotstar (₹299/month, more Indian content)
- Spotify → JioSaavn (₹99/month, similar features)
- YouTube Premium → Consider family plan (₹189/month for 5 members)

Respond in a structured format with clear headings.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return "Unable to generate insights at the moment. Please try refreshing.";
  }
}
