// Simple Email Reminder Function - Uses Supabase Built-in Email
// Note: Supabase built-in email is limited to auth flows
// For production, integrate with Resend (free tier: 3000 emails/month)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
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
      return new Response(
        JSON.stringify({ message: "No active reminders" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;

    for (const settings of reminderSettings) {
      try {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + settings.days_before);

        // Get subscriptions renewing soon
        const { data: subscriptions } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", settings.user_id)
          .gte("renewal_date", today.toISOString().split("T")[0])
          .lte("renewal_date", futureDate.toISOString().split("T")[0]);

        if (!subscriptions || subscriptions.length === 0) continue;

        // Check if already sent today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: recentLogs } = await supabase
          .from("reminder_logs")
          .select("subscription_id")
          .eq("user_id", settings.user_id)
          .gte("sent_at", todayStart.toISOString());

        const alreadySent = new Set(recentLogs?.map((log: any) => log.subscription_id) || []);
        const subsToRemind = subscriptions.filter((sub: any) => !alreadySent.has(sub.id));

        if (subsToRemind.length === 0) continue;

        // Generate email summary
        const totalAmount = subsToRemind.reduce((sum: number, sub: any) => 
          sum + parseFloat(sub.amount), 0
        );

        const emailSummary = `
📧 Subscription Reminders for ${settings.email}

You have ${subsToRemind.length} subscription(s) renewing soon:

${subsToRemind.map((sub: any) => {
  const renewalDate = new Date(sub.renewal_date);
  const daysUntil = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return `• ${sub.name} - ₹${parseFloat(sub.amount).toFixed(2)} (${daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`})`;
}).join('\n')}

Total: ₹${totalAmount.toFixed(2)}

---
Note: This is a console log. To send actual emails, integrate with Resend.
See: https://resend.com (3000 free emails/month)
        `;

        console.log(emailSummary);

        // Log each reminder
        for (const sub of subsToRemind) {
          await supabase.from("reminder_logs").insert({
            user_id: settings.user_id,
            subscription_id: sub.id,
            email_sent_to: settings.email,
            status: "sent",
            error_message: "Logged to console (no email service configured)",
          });
        }

        processed++;
      } catch (err) {
        console.error(`Error processing user ${settings.user_id}:`, err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${processed} users`,
        note: "Emails logged to console. Integrate Resend for actual email delivery.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
