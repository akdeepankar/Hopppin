'use client';
import { api } from '../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { Id } from '../../../convex/_generated/dataModel';
import React, { useState } from 'react';
import VapiWidget from '../../components/VapiWidget';
import { Loader } from '@/components/ui/Loader';

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

  const [passcodeInput, setPasscodeInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [passError, setPassError] = useState('');

  // Check if passcode is required
  const isProtected = !!space?.passEnabled && !!space?.passcode;

  // Handler for unlocking
  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (passcodeInput.trim() === (space?.passcode || '')) {
      setUnlocked(true);
      setPassError('');
    } else {
      setPassError('Incorrect passcode.');
    }
  }

  if (space === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <Loader />;
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

  if (isProtected && !unlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <form
          onSubmit={handleUnlock}
          className="flex flex-col items-center gap-4 rounded-2xl border border-fuchsia-800 bg-neutral-900 p-8 shadow-xl"
        >
          <h2 className="mb-2 text-2xl font-bold text-fuchsia-400">
            Protected Space
          </h2>
          <p className="mb-2 text-neutral-400">
            Enter the 4-character passcode to unlock this space.
          </p>
          <input
            type="text"
            maxLength={4}
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            className="w-32 rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-center text-lg tracking-widest text-white focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            autoFocus
          />
          {passError && <div className="text-sm text-red-500">{passError}</div>}
          <button
            type="submit"
            className="mt-2 rounded bg-fuchsia-600 px-6 py-2 font-semibold text-white transition hover:bg-fuchsia-700"
          >
            Unlock
          </button>
        </form>
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
