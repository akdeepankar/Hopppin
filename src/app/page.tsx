'use client';

// Add Google Fonts import for Inter (or Plus Jakarta Sans) in the <head> using next/head
import Head from 'next/head';
import { useSession } from '@/lib/convex/auth-client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const { data, isPending } = useSession();
  const router = useRouter();
  const [startLoading, setStartLoading] = React.useState(false);
  const [signInLoading, setSignInLoading] = React.useState(false);

  const handleStartRoom = async () => {
    setStartLoading(true);
    if (data?.session) {
      router.push('/studio');
    } else {
      router.push('/login');
    }
    // Don't setStartLoading(false); let navigation unmount the component
  };

  const handleSignIn = async () => {
    setSignInLoading(true);
    if (data?.session) {
      router.push('/studio');
    } else {
      router.push('/login');
    }
    // Don't setSignInLoading(false); let navigation unmount the component
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-950 font-sans text-white">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
        {/* Or swap Inter for Plus Jakarta Sans if you prefer */}
        <style>{`body, html, .font-sans { font-family: 'Inter', 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; }`}</style>
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </Head>
      {/* Grid background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      {/* Header */}
      <header className="relative z-10 flex w-full items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2 select-none">
          <span className="text-lg font-bold tracking-tight">hoppp.in</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/akdeepankar/Hopppin"
            className="text-xs text-neutral-400 transition hover:text-white"
          >
            Proudly open source
          </a>
          <button
            className="flex items-center gap-2 rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-neutral-950 shadow transition hover:bg-neutral-200"
            onClick={handleSignIn}
            type="button"
            disabled={signInLoading}
          >
            {signInLoading && (
              <svg
                className="h-4 w-4 animate-spin text-neutral-700"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            Sign In
          </button>
        </div>
      </header>
      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mt-4 flex w-full max-w-2xl flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="mb-2 inline-block rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1 text-xs font-medium text-neutral-300">
              Create Space. Collect feedback. One-to-one.
            </span>
          </div>
          <h1
            className="mb-2 text-5xl leading-tight font-extrabold tracking-tight text-white md:text-6xl"
            style={{
              fontFamily:
                "Inter, 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Let's{' '}
            <span className="relative inline-block align-middle">
              <span
                className="bg-clip-text font-black text-transparent drop-shadow-lg"
                style={{
                  background:
                    'linear-gradient(270deg, #60a5fa, #a78bfa, #f472b6, #facc15, #34d399, #60a5fa)',
                  backgroundSize: '1200% 1200%',
                  backgroundPosition: '0% 50%',
                  backgroundRepeat: 'repeat',
                  animation: 'gradientShift 6s ease-in-out infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                hoppp in
              </span>
            </span>
            <br className="hidden md:block" />
            for a quick call
          </h1>
          <p
            className="mb-6 text-lg font-light text-neutral-300 md:text-xl"
            style={{
              fontFamily:
                "Inter, 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            No more ghost feedback. No more confusion. <br />
            Just real people, real conversations,{' '}
            <span className="font-semibold text-blue-400">really simple</span>.
          </p>
          <div className="mt-2 flex w-full flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleStartRoom}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 text-lg font-semibold text-neutral-950 shadow transition hover:bg-neutral-200"
              disabled={startLoading}
            >
              {startLoading && (
                <svg
                  className="h-5 w-5 animate-spin text-neutral-700"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              Start a Space
            </button>
          </div>
          {/* Powered by section */}
          <div className="mt-8 flex flex-col items-center">
            <span className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Powered by
            </span>
            <div className="flex flex-row flex-wrap items-center justify-center gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-10 w-24 items-center justify-center rounded border border-neutral-200 bg-white shadow"
                >
                  <img
                    src={`/logo${i + 1}.svg`}
                    alt={`Logo ${i + 1}`}
                    className="h-6 object-contain"
                    style={{ maxWidth: '80%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} hoppp.in &mdash; Real feedback, really
        simple
      </footer>
    </div>
  );
}
