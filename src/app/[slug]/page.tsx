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
          className="flex flex-col items-center gap-4 rounded-2xl border border-blue-800 bg-neutral-900 p-8 shadow-xl"
        >
          <h2 className="mb-2 text-2xl font-bold text-blue-400">
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
            className="w-32 rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-center text-lg tracking-widest text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus
          />
          {passError && <div className="text-sm text-red-500">{passError}</div>}
          <button
            type="submit"
            className="mt-2 rounded bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-8 text-white">
      <div
        className="fixed top-0 left-0 z-50 p-8"
        style={{ pointerEvents: 'none' }}
      >
        <h1
          className="mb-1 text-6xl font-extrabold text-gray-300/30 drop-shadow-lg"
          style={{ lineHeight: 1 }}
        >
          {space.name}
        </h1>
        <div
          className="mt-2 text-lg font-light text-neutral-300 italic drop-shadow"
          style={{ fontSize: '1.1rem' }}
        >
          Created by:{' '}
          <span className="font-semibold text-neutral-100">{creatorName}</span>
        </div>
      </div>
      <main className="z-10 flex w-full flex-1 flex-col items-center justify-center">
        {space.assistantId ? (
          <div className="flex flex-col items-center justify-center gap-6 py-10">
            <VapiWidget
              apiKey={process.env.NEXT_PUBLIC_VAPI_PUBLIC_API_KEY || ''}
              assistantId={space.assistantId}
              fixed={false}
            />
          </div>
        ) : (
          <div className="mt-6 text-center text-base text-neutral-500">
            No assistant linked to this space.
          </div>
        )}
      </main>
    </div>
  );
}

export const dynamic = 'force-dynamic';
