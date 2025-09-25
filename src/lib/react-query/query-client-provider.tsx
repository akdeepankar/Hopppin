'use client';

import React from 'react';

import type { ConvexReactClient } from 'convex/react';

import {
  type QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';

import { createQueryClient } from '@/lib/react-query/query-client';

let clientQueryClientSingleton: QueryClient | undefined;
const getQueryClient = ({ convex }: { convex?: ConvexReactClient }) => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient({ convex });
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient({ convex }));
  }
};

export function QueryClientProvider(props: {
  children: React.ReactNode;
  convex?: ConvexReactClient;
}) {
  const queryClient = getQueryClient({ convex: props.convex });

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {props.children}
    </TanstackQueryClientProvider>
  );
}
