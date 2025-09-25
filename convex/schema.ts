import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents';
import { v } from 'convex/values';

const schema = defineEntSchema(
  {
    // --------------------
    // Core User & Session Models
    // --------------------
    users: defineEnt({
      // Profile fields
      name: v.optional(v.string()),
      bio: v.optional(v.string()),
      image: v.optional(v.string()),

      // Organization tracking
      lastActiveOrganizationId: v.optional(v.string()),
      personalOrganizationId: v.string(),

      // Timestamps
      deletedAt: v.optional(v.number()),
    })
      .field('email', v.string(), { unique: true })
      .field('customerId', v.optional(v.string()), { index: true })
      .edges('subscriptions', { to: 'subscriptions', ref: 'userId' }),

    // --------------------
    // Spaces Table
    // --------------------
    spaces: defineEnt({
  name: v.string(),
  createdBy: v.string(), // user id or email
  createdAt: v.number(),
  assistantId: v.optional(v.string()),
  passEnabled: v.optional(v.boolean()),
  passcode: v.optional(v.string()),
    })
      .index('createdBy', ['createdBy']),

    // --------------------
    // Polar Payment Tables
    // --------------------
    subscriptions: defineEnt({
      createdAt: v.string(),
      modifiedAt: v.optional(v.union(v.string(), v.null())),
      amount: v.optional(v.union(v.number(), v.null())),
      currency: v.optional(v.union(v.string(), v.null())),
      recurringInterval: v.optional(v.union(v.string(), v.null())),
      status: v.string(),
      currentPeriodStart: v.string(),
      currentPeriodEnd: v.optional(v.union(v.string(), v.null())),
      cancelAtPeriodEnd: v.boolean(),
      startedAt: v.optional(v.union(v.string(), v.null())),
      endedAt: v.optional(v.union(v.string(), v.null())),
      priceId: v.optional(v.string()),
      productId: v.string(),
      checkoutId: v.optional(v.union(v.string(), v.null())),
      metadata: v.record(v.string(), v.any()),
      customerCancellationReason: v.optional(v.union(v.string(), v.null())),
      customerCancellationComment: v.optional(v.union(v.string(), v.null())),
    })
      .field('subscriptionId', v.string(), { unique: true })
      .field('organizationId', v.string(), { index: true })
      .edge('user', { to: 'users', field: 'userId' })
      .index('organizationId_status', ['organizationId', 'status'])
      .index('userId_organizationId_status', [
        'userId',
        'organizationId',
        'status',
      ])
      .index('userId_endedAt', ['userId', 'endedAt']),

  },
  {
    schemaValidation: true,
  }
);

export default schema;

// Export ent definitions for use throughout the app
export const entDefinitions = getEntDefinitions(schema);
