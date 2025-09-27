'use client';

// Add Google Fonts import for Inter (or Plus Jakarta Sans) in the <head> using next/head
import Head from 'next/head';
import { useSession } from '@/lib/convex/auth-client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data, isPending } = useSession();
  const router = useRouter();

  const handleStartRoom = () => {
    if (data?.session) {
      router.push('/studio');
    } else {
      router.push('/login');
    }
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
            href="#"
            className="text-xs text-neutral-400 transition hover:text-white"
          >
            Proudly open source
          </a>
          <button className="rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-neutral-950 shadow transition hover:bg-neutral-200">
            Sign In
          </button>
        </div>
      </header>
      {/* Hero Section */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="mb-2 inline-block rounded-full border border-neutral-800 bg-neutral-900/80 px-4 py-1 text-xs font-medium text-neutral-300">
              Create rooms. Collect feedback. Interview. One-to-one.
            </span>
          </div>
          <h1
            className="mb-2 text-5xl leading-tight font-extrabold tracking-tight text-white md:text-7xl"
            style={{
              fontFamily:
                "Inter, 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            Let's{' '}
            <span className="relative inline-block align-middle">
              <span className="animate-gradient-x bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 bg-clip-text font-black text-transparent drop-shadow-lg">
                hoppp in
              </span>
              <span className="absolute -top-2 -right-7 text-3xl select-none">
                🚀
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
              className="rounded-xl bg-white px-8 py-3 text-lg font-semibold text-neutral-950 shadow transition hover:bg-neutral-200"
            >
              Start a Room
            </button>
            <a
              href="#"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              See How It Works <span className="text-xl">→</span>
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-neutral-400">
              Live feedback · Audio interviews · Actually works
            </span>
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
