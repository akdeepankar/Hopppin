import { HOUR, MINUTE, RateLimiter, SECOND } from '@convex-dev/rate-limiter';
import { ConvexError } from 'convex/values';

import type { ActionCtx, MutationCtx } from '../_generated/server';
import type { SessionUser } from '../authShared';

import { components } from '../_generated/api';

// Define rate limits matching the existing Upstash configuration
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Project limits
  'project/create:free': { kind: 'fixed window', period: MINUTE, rate: 5 },
  'project/create:premium': { kind: 'fixed window', period: MINUTE, rate: 20 },

  'project/update:free': { kind: 'fixed window', period: MINUTE, rate: 20 },
  'project/update:premium': { kind: 'fixed window', period: MINUTE, rate: 60 },

  'project/member:free': { kind: 'fixed window', period: MINUTE, rate: 10 },
  'project/member:premium': { kind: 'fixed window', period: MINUTE, rate: 30 },

  // Tag limits
  'tag/create:free': { kind: 'fixed window', period: MINUTE, rate: 10 },
  'tag/create:premium': { kind: 'fixed window', period: MINUTE, rate: 30 },

  'tag/delete:free': { kind: 'fixed window', period: MINUTE, rate: 10 },
  'tag/delete:premium': { kind: 'fixed window', period: MINUTE, rate: 30 },

  'tag/update:free': { kind: 'fixed window', period: MINUTE, rate: 20 },
  'tag/update:premium': { kind: 'fixed window', period: MINUTE, rate: 60 },

  // Todo limits
  'todo/create:free': { kind: 'fixed window', period: MINUTE, rate: 20 },
  'todo/create:premium': { kind: 'fixed window', period: MINUTE, rate: 60 },

  'todo/update:free': { kind: 'fixed window', period: MINUTE, rate: 30 },
  'todo/update:premium': { kind: 'fixed window', period: MINUTE, rate: 100 },

  'todo/delete:free': { kind: 'fixed window', period: MINUTE, rate: 20 },
  'todo/delete:premium': { kind: 'fixed window', period: MINUTE, rate: 60 },

  // Scraper limits (admin only)
  scraper: { kind: 'fixed window', period: MINUTE, rate: 10 },

  // General rate limits
  free: { kind: 'token bucket', period: 10 * SECOND, rate: 40 },
  premium: { kind: 'token bucket', period: 10 * SECOND, rate: 100 },
  public: { kind: 'token bucket', period: 10 * SECOND, rate: 20 },
  vercel: { kind: 'token bucket', period: 10 * SECOND, rate: 3 },
});

// Helper function to get rate limit key based on user tier
export function getRateLimitKey(
  baseKey: string,
  tier: 'free' | 'premium' | 'public'
): string {
  // For general limits without tiers and admin-only limits
  if (['free', 'premium', 'public', 'scraper', 'vercel'].includes(baseKey)) {
    return baseKey;
  }

  // For specific feature limits with tiers
  return `${baseKey}:${tier}`;
}

// Helper to get user tier based on session user
export function getUserTier(
  user: { isAdmin?: boolean; plan?: SessionUser['plan'] } | null
): 'free' | 'premium' | 'public' {
  if (!user) return 'public';
  if (user.isAdmin) return 'premium'; // Admins bypass rate limits by getting premium tier
  if (user.plan) return 'premium';

  return 'free';
}

// Helper function to check rate limit for mutations
export async function rateLimitGuard(
  ctx: (ActionCtx | MutationCtx) & {
    rateLimitKey: string;
    user: Pick<SessionUser, 'id' | 'plan'> | null;
  }
) {
  const tier = getUserTier(ctx.user);
  const limitKey = getRateLimitKey(ctx.rateLimitKey, tier) as any;
  const identifier = ctx.user?.id ?? 'anonymous';

  const status = await rateLimiter.limit(ctx, limitKey, {
    key: identifier,
  });

  if (!status.ok) {
    throw new ConvexError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: status.retryAfter,
    });
  }
}
