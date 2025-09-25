import React from 'react';
import { PassToggle } from '@/components/PassToggle';

interface MainContentProps {
  spaceName: string;
  space: any;
  setModalOpen: (open: boolean) => void;
}

export function MainContent({
  spaceName,
  space,
  setModalOpen,
}: MainContentProps) {
  return (
    <main className="flex h-full max-w-lg flex-1 flex-col items-center justify-start overflow-hidden p-8">
      <div className="w-full">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{spaceName}</h1>
          <p className="text-base text-neutral-400">
            Welcome to your{' '}
            <span className="font-semibold text-fuchsia-400">
              Interactive Space
            </span>{' '}
            dashboard.
          </p>
        </header>
        <section className="space-y-8">
          {/* Section: Create Assistant */}
          <div className="mb-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Assistant</h2>
              <button
                className="rounded bg-fuchsia-600 px-4 py-1.5 font-medium text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setModalOpen(true)}
                disabled={!!space?.assistantId}
              >
                + Create Assistant
              </button>
            </div>
            {space?.assistantId ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold text-fuchsia-400">
                  Assistant Linked
                </span>
                <span className="break-all text-neutral-300">
                  ID: {space.assistantId}
                </span>
                <button
                  className="mt-2 rounded bg-red-600 px-4 py-1.5 font-medium text-white transition hover:bg-red-700"
                  onClick={async () => {
                    await fetch('/api/delete-assistant', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        spaceId: space._id,
                        assistantId: space.assistantId,
                      }),
                    });
                    // Convex reactivity will update the UI automatically
                  }}
                >
                  Delete Assistant
                </button>
              </div>
            ) : (
              <span className="text-neutral-500">No assistants yet.</span>
            )}
          </div>

          {/* Section: Passcode */}
          {space?.assistantId && (
            <div className="mb-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Passcode</h2>
              <PassToggle space={space} />
            </div>
          )}

          {/* Section: Public URL */}
          {space?.assistantId && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Public URL</h2>
              <div className="flex w-full max-w-full items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${spaceName}`}
                  className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
                  id="public-url-input"
                />
                <button
                  className="rounded bg-fuchsia-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-fuchsia-700"
                  onClick={async () => {
                    const url = `${window.location.origin}/${spaceName}`;
                    await navigator.clipboard.writeText(url);
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
