import { api } from "../../../../convex/_generated/api";
import { fetchAction, fetchMutation } from "convex/nextjs";

export async function POST(req: Request) {
  const { from, to, subject, html, userId } = await req.json();
  console.log('API received:', { from, to, subject, html, userId });
  try {
    await fetchAction(api.sendEmail.sendTestEmail, {
      from,
      to,
      subject,
      html,
    });
    if (userId) {
      console.log('Saving email to Convex with userId:', userId);
      try {
        await fetchMutation(api.emails.saveEmailRecord, {
          userId,
          from,
          to,
          subject,
          html,
          sentAt: Date.now(),
        });
        console.log('Email saved to Convex successfully');
      } catch (err) {
        console.error('Error saving email to Convex:', err);
      }
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('API send error:', error);
    return new Response(JSON.stringify({ success: false, error: error?.message || error }), { status: 500 });
  }
}
