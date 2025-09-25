import aggregate from '@convex-dev/aggregate/convex.config';
import betterAuth from './betterAuth/convex.config';
import rateLimiter from '@convex-dev/rate-limiter/convex.config';
import { defineApp } from 'convex/server';
import resend from '@convex-dev/resend/convex.config';
import autumn from "@useautumn/convex/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(rateLimiter);
app.use(resend);
app.use(autumn);

// Register all aggregates
app.use(aggregate, { name: 'aggregateUsers' });


export default app;
