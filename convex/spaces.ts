export const deleteSpace = mutation({
  args: { spaceId: v.id('spaces') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.spaceId);
    return { success: true };
  },
});
export const updateSpacePass = mutation({
  args: {
    spaceId: v.id('spaces'),
    passEnabled: v.boolean(),
    passcode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.spaceId, {
      passEnabled: args.passEnabled,
      passcode: args.passEnabled ? args.passcode : undefined,
    });
    return { success: true };
  },
});
// Query to fetch passEnabled and passcode for a space by name
export const getSpacePassInfo = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const space = await ctx.db.query('spaces').filter(q => q.eq(q.field('name'), args.name)).first();
    if (!space) return null;
    return {
      passEnabled: space.passEnabled ?? false,
      passcode: space.passcode ?? null,
    };
  },
});
export const updateSpaceAssistantId = mutation({
  args: {
    spaceId: v.id('spaces'),
    assistantId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.spaceId, {
      assistantId: args.assistantId,
    });
    return { success: true };
  },
});
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { Id } from 'convex/_generated/dataModel';

export const createSpace = mutation({
  args: {
    name: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { name, userId } = args;
    const spaceId = await ctx.db.insert('spaces', {
      name,
      createdBy: userId,
      createdAt: Date.now(),
    });
    return spaceId;
  },
});

export const getSpacesByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.query('spaces')
      .filter(q => q.eq(q.field('createdBy'), args.userId))
      .collect();
  },
});

export const getSpaceByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const spaces = await ctx.db.query('spaces').filter(q => q.eq(q.field('name'), args.name)).collect();
    return spaces.length > 0 ? spaces[0] : null;
  },
});
