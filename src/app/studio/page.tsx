'use client';

import { signOut, useSession } from '@/lib/convex/auth-client';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useEffect, useState } from 'react';
import PaywallDialog from '@/components/autumn/paywall-dialog';
// import { useCustomer } from 'autumn-js/react';
import { useRouter } from 'next/navigation';
import CreateSpaceModal from './CreateSpaceModal';
import { v } from 'convex/values';
import Link from 'next/link';
import React from 'react';
import { Loader } from '@/components/ui/Loader';

export default function StudioPage() {
  const { data, isPending } = useSession();
  const user = data?.user;
  console.log('StudioPage user:', user);
  const sessionActive = !!data?.session;
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [paywallOpen, setPaywallOpen] = useState(false);
  // Only import/use useCustomer after session is ready
  const [checkFn, setCheckFn] = useState<null | ((args: any) => Promise<any>)>(
    null
  );
  React.useEffect(() => {
    if (sessionActive) {
      // Dynamically import useCustomer only after session is ready
      import('autumn-js/react').then((mod) => {
        const { useCustomer } = mod;
        // useCustomer must be called inside a component, so we use a temp component
        function UseCustomerInit() {
          const { check } = useCustomer();
          React.useEffect(() => {
            setCheckFn(async (args: any) => check(args));
          }, [check]);
          return null;
        }
        setUseCustomerInit(() => UseCustomerInit);
      });
    }
  }, [sessionActive]);
  const [UseCustomerInit, setUseCustomerInit] = useState<any>(null);

  const convexUser = useQuery(
    api.user.getUserByEmail,
    user?.email ? { email: user.email } : 'skip'
  );
  const userSpaces = useQuery(
    api.spaces.getSpacesByUser,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  useEffect(() => {
    if (!isPending && !sessionActive) {
      router.replace('/login');
    }
  }, [isPending, sessionActive, router]);

  const handleSuccess = () => {
    setSuccessMsg('Space created successfully!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  if (isPending || !sessionActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 font-sans text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-neutral-800 px-8 py-6 shadow-sm">
        <div className="flex items-center gap-2 select-none">
          <span className="text-2xl font-extrabold tracking-tight text-fuchsia-400">
            hoppp.in
          </span>
          <span className="ml-2 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-xs text-fuchsia-300">
            Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">{user?.email || '-'}</span>
          <button
            className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-200 transition hover:bg-neutral-800"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-row">
        {/* Left column: Spaces */}
        <div className="flex max-w-xl flex-1 flex-col items-center justify-center border-r border-neutral-800 p-8">
          {successMsg && (
            <div className="mb-4 rounded bg-green-700 px-4 py-2 text-center text-sm font-medium text-white shadow">
              {successMsg}
            </div>
          )}
          <h2 className="mb-8 text-center text-3xl font-bold">
            Welcome, {user?.name || user?.email || 'User'} 👋
          </h2>
          <div className="flex w-full flex-col items-center gap-6">
            {/* Minimal Card: Create a new Space */}
            <div className="flex w-full flex-col items-center rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm transition hover:shadow-fuchsia-900/10">
              <h3 className="mb-2 text-lg font-semibold text-fuchsia-300">
                Create a new Space
              </h3>
              <p className="mb-4 text-center text-sm text-neutral-400">
                Start a new space to collect feedback or host a 1:1 call.
              </p>
              <button
                className="rounded-lg bg-fuchsia-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setModalOpen(true)}
                disabled={userSpaces && userSpaces.length >= 2}
              >
                Create Space
              </button>
              {userSpaces &&
                userSpaces.length >= 1 &&
                sessionActive &&
                checkFn && (
                  <>
                    <div className="mt-2 text-sm font-medium text-red-400">
                      Space limit exceeded. You can only create 2 spaces.
                    </div>
                    <button
                      className="animate-shimmer mt-4 w-full rounded-lg bg-gradient-to-r from-fuchsia-500 via-pink-500 to-yellow-400 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:from-fuchsia-600 hover:to-yellow-500 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none"
                      onClick={async () => {
                        const { data } = await checkFn({
                          featureId: 'ai-messages',
                          dialog: PaywallDialog,
                          dialogProps: {
                            open: true,
                            setOpen: setPaywallOpen,
                            featureId: 'ai-messages',
                          },
                        });
                        if (data && !data.allowed) {
                          setPaywallOpen(true);
                        }
                      }}
                    >
                      ✨ Get Pro ✨
                    </button>
                    <PaywallDialog
                      open={paywallOpen}
                      setOpen={setPaywallOpen}
                      featureId="ai-messages"
                    />
                    {UseCustomerInit && <UseCustomerInit />}
                    <style jsx>{`
                      .animate-shimmer {
                        background-size: 200% auto;
                        background-position: left center;
                        animation: shimmer 2s linear infinite;
                      }
                      @keyframes shimmer {
                        0% {
                          background-position: left center;
                        }
                        100% {
                          background-position: right center;
                        }
                      }
                    `}</style>
                  </>
                )}
            </div>
            {convexUser?._id && (
              <CreateSpaceModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
                userId={convexUser._id}
              />
            )}
          </div>
          {userSpaces && userSpaces.length > 0 && (
            <div className="mt-8 w-full">
              <h4 className="mb-2 text-lg font-semibold text-neutral-200">
                Your Spaces
              </h4>
              <ul className="space-y-2">
                {userSpaces.map((space) => (
                  <li key={space._id}>
                    <Link
                      href={`/studio/${encodeURIComponent(space.name)}`}
                      className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white transition hover:border-fuchsia-500 hover:bg-neutral-950"
                    >
                      <span>{space.name}</span>
                      <span className="text-xs text-neutral-400">
                        {new Date(space.createdAt).toLocaleString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800 bg-neutral-950 py-4 text-center text-xs text-neutral-600">
        &copy; {new Date().getFullYear()} hoppp.in &mdash; Creative Studio
        Dashboard
      </footer>
    </div>
  );
}
