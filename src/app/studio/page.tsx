'use client';

import { signOut, useSession } from '@/lib/convex/auth-client';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useEffect, useState } from 'react';
import { useCustomer, CheckoutDialog } from 'autumn-js/react';
import { Autumn as autumn } from 'autumn-js';
import { useRouter } from 'next/navigation';
import CreateSpaceModal from './CreateSpaceModal';
import { v } from 'convex/values';
import Link from 'next/link';
import React from 'react';
import { Loader } from '@/components/ui/Loader';

export default function StudioPage() {
  const { checkout } = useCustomer();
  const [loadingSpaceId, setLoadingSpaceId] = useState<string | null>(null);
  const { data, isPending } = useSession();
  const user = data?.user;
  console.log('StudioPage user:', user);
  const sessionActive = !!data?.session;
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [proAllowed, setProAllowed] = useState<boolean | null>(null);
  const [checkingProStatus, setCheckingProStatus] = useState(false);

  const convexUser = useQuery(
    api.user.getUserByEmail,
    user?.email ? { email: user.email } : 'skip'
  );
  const userSpaces = useQuery(
    api.spaces.getSpacesByUser,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  useEffect(() => {
    // Only run after spaces are loaded and user is available
    if (user) {
      (async () => {
        try {
          const res = await fetch(
            `/api/autumn-customer/${user?.userId || 'user_123'}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ feature_id: 'prostatus' }),
            }
          );
          const data = await res.json();
          setProAllowed(data.allowed);
          console.log('Autumn check data:', data);
        } catch (err) {
          setProAllowed(null);
          console.error('Error fetching Autumn customer (REST):', err);
        }
      })();
    }
  }, [user]);

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
          <span className="text-2xl font-extrabold tracking-tight text-blue-400">
            hoppp.in
          </span>
          <span className="ml-2 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-xs text-blue-300">
            Studio
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">{user?.email || '-'}</span>
          <button
            className="flex min-w-[80px] items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-200 transition hover:bg-neutral-800"
            onClick={async () => {
              setLogoutLoading(true);
              await signOut();
              // signOut should redirect, but in case it doesn't, keep spinner for a bit
              setTimeout(() => setLogoutLoading(false), 2000);
            }}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent align-middle" />
            ) : null}
            Logout
          </button>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-row">
        {/* Left column: Spaces */}
        <div className="flex max-w-md flex-1 flex-col items-center justify-start border-r border-neutral-800 p-8">
          {successMsg && (
            <div className="mb-4 rounded bg-green-700 px-4 py-2 text-center text-sm font-medium text-white shadow">
              {successMsg}
            </div>
          )}
          <div className="mb-4 w-full">
            <h2 className="text-left text-lg font-bold">Welcome 👋</h2>
            <div className="mt-1 flex items-center gap-2 text-left text-2xl font-medium text-blue-200">
              {user?.name || user?.email || 'User'}
              {proAllowed === true && (
                <span className="ml-2 inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-yellow-900 shadow">
                  <svg
                    className="mr-1 inline-block h-4 w-4 text-yellow-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 14.77l-4.77 2.51.91-5.32-3.87-3.77 5.34-.78z" />
                  </svg>
                  Pro User
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-6">
            {/* Minimal Card: Create a new Space */}
            <div className="flex min-h-50 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm transition hover:shadow-blue-900/10">
              <h3 className="mb-2 text-lg font-semibold text-blue-300">
                Create a new Space
              </h3>
              <p className="mb-4 text-center text-sm text-neutral-400">
                Start a new space to collect feedback or host a 1:1 Agent call.
              </p>
              <div className="flex w-full items-center justify-center gap-2">
                {/* Only show Create Space button after proAllowed is loaded */}
                {proAllowed !== null && !checkingProStatus && (
                  <button
                    className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setModalOpen(true)}
                    disabled={
                      userSpaces && userSpaces.length >= 1 && !proAllowed
                    }
                  >
                    Create Space
                  </button>
                )}
                {checkingProStatus && (
                  <span className="flex items-center gap-2 text-sm text-blue-300">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent align-middle" />
                    Checking status...
                  </span>
                )}
                {userSpaces &&
                  userSpaces.length >= 1 &&
                  proAllowed === false && (
                    <button
                      className="rounded-lg bg-gradient-to-r from-pink-200 to-blue-500 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:from-yellow-500 hover:to-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      disabled={checkingProStatus}
                      onClick={async () => {
                        const dialogClosed = false;
                        setCheckingProStatus(true);
                        await checkout({
                          productId: 'pro',
                          dialog: CheckoutDialog,
                        });
                        // Poll for pro status after checkout, unless dialog was dismissed
                        let attempts = 0;
                        const maxAttempts = 10; // 10 x 3s = 30s
                        let allowed = false;
                        while (attempts < maxAttempts && !dialogClosed) {
                          try {
                            const res = await fetch(
                              `/api/autumn-customer/${user?.userId || 'user_123'}`,
                              {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  feature_id: 'prostatus',
                                }),
                              }
                            );
                            const data = await res.json();
                            setProAllowed(data.allowed);
                            if (data.allowed) {
                              allowed = true;
                              break;
                            }
                          } catch (err) {
                            setProAllowed(null);
                          }
                          await new Promise((resolve) =>
                            setTimeout(resolve, 3000)
                          );
                          attempts++;
                        }
                        setCheckingProStatus(false);
                      }}
                    >
                      {checkingProStatus ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-middle" />
                          Processing...
                        </span>
                      ) : (
                        'Go Pro'
                      )}
                    </button>
                  )}
              </div>
              {/* ...existing code... */}
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
          {/* Spaces List/Loader/Empty State */}
          {userSpaces === undefined ? (
            <div className="mt-8 flex w-full items-center justify-center">
              <Loader />
            </div>
          ) : userSpaces.length === 0 ? (
            <div className="mt-8 w-full text-center text-sm text-neutral-400">
              No Spaces Available.
            </div>
          ) : (
            <div className="mt-4 w-full">
              <h4 className="mb-2 text-lg font-semibold text-blue-200">
                Your Spaces
              </h4>
              <ul className="space-y-2">
                {userSpaces.map((space) => (
                  <li key={space._id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white transition hover:border-blue-500 hover:bg-neutral-950 focus:outline-none"
                      onClick={() => {
                        setLoadingSpaceId(space._id);
                        setTimeout(() => {
                          window.location.href = `/studio/${encodeURIComponent(space.name)}`;
                        }, 300);
                      }}
                      disabled={loadingSpaceId === space._id}
                    >
                      <span className="flex items-center gap-2">
                        {loadingSpaceId === space._id && (
                          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent align-middle" />
                        )}
                        {space.name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(space.createdAt).toLocaleString()}
                      </span>
                    </button>
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
