import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { action } from "./_generated/server";


export const resend: Resend = new Resend(components.resend, { testMode: false });

export const sendTestEmail = action({
  handler: async (
    ctx,
    args: {
      from?: string;
      to?: string;
      subject?: string;
      html?: string;
    } = {}
  ) => {
    const from = typeof args.from === 'string' ? args.from : undefined;
    const to = typeof args.to === 'string' ? args.to : undefined;
    const subject = typeof args.subject === 'string' ? args.subject : undefined;
    const html = typeof args.html === 'string' ? args.html : undefined;
    console.log('Convex sendEmail args:', { from, to, subject, html });
    await resend.sendEmail(ctx, {
      from: from || "Me <test@mydomain.com>",
      to: to || "delivered@resend.dev",
      subject: subject || "Hi there",
      html: html || "This is a test email",
    });
  },
});
