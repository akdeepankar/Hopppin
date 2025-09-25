'use client';
import { api } from '../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { Id } from '../../../convex/_generated/dataModel';
import React from 'react';
import VapiWidget from '../../components/VapiWidget';

export default function PublicSpacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const space = useQuery(api.spaces.getSpaceByName, { name: slug });
  // Try to fetch user by email or by ID
  const creatorByEmail = useQuery(
    api.user.getUserByEmail,
    space?.createdBy && space.createdBy.includes('@')
      ? { email: space.createdBy }
      : 'skip'
  );
  const creatorById = useQuery(
    api.user.getUserById,
    space?.createdBy && !space.createdBy.includes('@')
      ? { id: space.createdBy as Id<'users'> }
      : 'skip'
  );
  const creatorName =
    creatorByEmail?.name || creatorById?.name || space?.createdBy;

  if (space === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (space === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <p>Space not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-neutral-800 bg-neutral-900 p-8 md:flex">
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-fuchsia-400">
          Space Dashboard
        </h2>
        <div className="flex-1">
          <div className="mb-6">
            <div className="mb-2 text-xs text-neutral-500 uppercase">
              Space Name
            </div>
            <div className="text-lg font-semibold text-white">{space.name}</div>
          </div>
          <div className="mb-4 text-sm text-neutral-400">
            <span className="mb-1 block">
              <span className="font-medium text-neutral-300">Created by:</span>{' '}
              <span className="text-neutral-200">{creatorName}</span>
            </span>
            <span className="block">
              <span className="font-medium text-neutral-300">Created at:</span>{' '}
              <span>{new Date(space.createdAt).toLocaleString()}</span>
            </span>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-10 shadow-2xl">
          <div className="my-6 h-px w-full bg-neutral-800/60" />
          {space.assistantId ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-fuchsia-900/40 bg-neutral-950 p-6 shadow-inner">
              <VapiWidget
                apiKey={process.env.NEXT_PUBLIC_VAPI_PUBLIC_API_KEY || ''}
                assistantId={space.assistantId}
              />
            </div>
          ) : (
            <div className="mt-6 text-center text-base text-neutral-500">
              No assistant linked to this space.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
