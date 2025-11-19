// Email Reminder Function with Resend Integration
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Subscription {
  id: string;
  name: string;
  amount: string;
  renewal_date: string;
  billing_cycle: string;
  user_id: string;
}

interface ReminderSettings {
  user_id: string;
  email: string;
  frequency: string;
  days_before: number;
  notifications_enabled: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { type } = await req.json();
    const reminderType = type || "daily";

    console.log(`Processing ${reminderType} reminders...`);

    // Get users with notifications enabled
    const { data: reminderSettings, error: settingsError } = await supabase
      .from("user_reminder_settings")
      .select("*")
      .eq("notifications_enabled", true)
      .eq("frequency", reminderType);

    if (settingsError) throw settingsError;

    if (!reminderSettings || reminderSettings.length === 0) {
      console.log("No users with active reminders found");
      return new Response(
        JSON.stringify({ message: "No active reminders to process" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    console.log(`Found ${reminderSettings.length} users with ${reminderType} reminders enabled`);

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const settings of reminderSettings as ReminderSettings[]) {
      try {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + settings.days_before);

        // Get subscriptions renewing soon
        const { data: subscriptions, error: subsError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", settings.user_id)
          .gte("renewal_date", today.toISOString().split("T")[0])
          .lte("renewal_date", futureDate.toISOString().split("T")[0]);

        if (subsError) {
          console.error(`Error fetching subscriptions for user ${settings.user_id}:`, subsError);
          continue;
        }

        if (!subscriptions || subscriptions.length === 0) {
          console.log(`No upcoming renewals for user ${settings.user_id}`);
          continue;
        }

        // Check if already sent today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: recentLogs } = await supabase
          .from("reminder_logs")
          .select("subscription_id")
          .eq("user_id", settings.user_id)
          .gte("sent_at", todayStart.toISOString());

        const alreadySentIds = new Set(recentLogs?.map((log: any) => log.subscription_id) || []);
        const subsToRemind = subscriptions.filter((sub: Subscription) => !alreadySentIds.has(sub.id));

        if (subsToRemind.length === 0) {
          console.log(`Already sent reminders today for user ${settings.user_id}`);
          continue;
        }

        // Generate email HTML
        const emailHtml = generateEmailContent(subsToRemind as Subscription[], settings);
        
        // Send email via Resend
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'SubSentry <onboarding@resend.dev>',
            to: settings.email,
            subject: `🔔 ${subsToRemind.length} Subscription${subsToRemind.length > 1 ? 's' : ''} Renewing Soon`,
            html: emailHtml,
          }),
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          throw new Error(`Resend API error: ${JSON.stringify(emailResult)}`);
        }

        console.log(`Email sent successfully to ${settings.email}`, emailResult);

        // Log each subscription reminder
        for (const sub of subsToRemind) {
          await supabase.from("reminder_logs").insert({
            user_id: settings.user_id,
            subscription_id: sub.id,
            email_sent_to: settings.email,
            status: "sent",
            error_message: null,
          });
        }

        emailsSent++;
      } catch (userError: any) {
        emailsFailed++;
        console.error(`Error processing user ${settings.user_id}:`, userError);
        
        // Log failure
        await supabase.from("reminder_logs").insert({
          user_id: settings.user_id,
          subscription_id: null,
          email_sent_to: settings.email,
          status: "failed",
          error_message: userError.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${reminderType} reminders`,
        emailsSent,
        emailsFailed,
        totalUsers: reminderSettings.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error: any) {
    console.error("Error in send-reminder-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

function generateEmailContent(subscriptions: Subscription[], settings: ReminderSettings): string {
  const totalAmount = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.amount), 0);
  const today = new Date();
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 0;
          font-size: 16px;
          opacity: 0.95;
        }
        .content { 
          padding: 30px; 
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #111827;
        }
        .subscription-card { 
          background: #f9fafb; 
          border-left: 4px solid #10b981; 
          padding: 20px; 
          margin: 15px 0; 
          border-radius: 8px; 
        }
        .subscription-name { 
          font-weight: 600; 
          font-size: 18px; 
          color: #111827; 
          margin-bottom: 8px;
        }
        .subscription-amount { 
          color: #10b981; 
          font-size: 24px; 
          font-weight: 700; 
          margin-bottom: 8px;
        }
        .subscription-date { 
          color: #6b7280; 
          font-size: 14px; 
        }
        .subscription-cycle {
          display: inline-block;
          background: #e5e7eb;
          color: #374151;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
        }
        .total-section {
          background: #f0fdf4;
          border: 2px solid #10b981;
          padding: 20px;
          border-radius: 8px;
          margin: 25px 0;
          text-align: center;
        }
        .total-label {
          color: #065f46;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .total-amount {
          color: #059669;
          font-size: 32px;
          font-weight: 700;
        }
        .button { 
          display: inline-block; 
          background: #10b981; 
          color: white; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 8px; 
          margin: 20px 0;
          font-weight: 600;
          font-size: 16px;
        }
        .button:hover {
          background: #059669;
        }
        .footer { 
          background: #f9fafb; 
          padding: 25px 30px; 
          text-align: center; 
          color: #6b7280; 
          font-size: 14px; 
          border-top: 1px solid #e5e7eb;
        }
        .footer-logo {
          font-weight: 700;
          color: #10b981;
          font-size: 16px;
          margin-bottom: 10px;
        }
        .footer p {
          margin: 8px 0;
        }
        .footer-small {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Subscription Reminders</h1>
          <p>You have ${subscriptions.length} subscription${subscriptions.length > 1 ? 's' : ''} renewing soon</p>
        </div>
        
        <div class="content">
          <div class="greeting">Hi there! 👋</div>
          <p style="margin-bottom: 25px; color: #4b5563;">Here are your upcoming subscription renewals in the next ${settings.days_before} days:</p>
  `;

  subscriptions.forEach((sub) => {
    const renewalDate = new Date(sub.renewal_date);
    const daysUntil = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const dateStr = renewalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const urgency = daysUntil === 0 ? '🔴 Today!' : daysUntil === 1 ? '🟡 Tomorrow' : `🟢 in ${daysUntil} days`;
    
    html += `
      <div class="subscription-card">
        <div class="subscription-name">${sub.name}</div>
        <div class="subscription-amount">₹${parseFloat(sub.amount).toFixed(2)}</div>
        <div class="subscription-date">
          Renews on ${dateStr} ${urgency}
        </div>
        <span class="subscription-cycle">${sub.billing_cycle}</span>
      </div>
    `;
  });

  html += `
          <div class="total-section">
            <div class="total-label">Total Upcoming Charges</div>
            <div class="total-amount">₹${totalAmount.toFixed(2)}</div>
          </div>
          
          <p style="margin: 25px 0; color: #4b5563;">Want to review or cancel any subscriptions?</p>
          
          <center>
            <a href="${Deno.env.get("SUPABASE_URL") || 'https://yourapp.com'}" class="button">
              View Dashboard →
            </a>
          </center>
        </div>
        
        <div class="footer">
          <div class="footer-logo">SubSentry</div>
          <p>You're receiving this because you enabled ${settings.frequency} reminders in SubSentry.</p>
          <p>Manage your notification preferences in Settings.</p>
          <p class="footer-small">
            © ${new Date().getFullYear()} SubSentry - Your financial wellness companion
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}
