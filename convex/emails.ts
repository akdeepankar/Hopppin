import { query } from "./_generated/server";

export const getEmailsByUserAndSpace = query({
  args: {
    userId: v.id("users"),
    spaceName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find emails sent by this user for this space (by subject or html containing spaceName)
    return await ctx.db
      .query("emails")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect()
      .then((emails) =>
        emails.filter(
          (e) =>
            e.subject?.toLowerCase().includes(args.spaceName.toLowerCase()) ||
            e.html?.toLowerCase().includes(args.spaceName.toLowerCase())
        )
      );
  },
});
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const saveEmailRecord = mutation({
  args: {
    userId: v.id("users"),
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    sentAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emails", {
      userId: args.userId,
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      sentAt: args.sentAt,
    });
    return { success: true };
  },
});
