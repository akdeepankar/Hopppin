"use client";

// Add Google Fonts import for Inter (or Plus Jakarta Sans) in the <head> using next/head
import Head from "next/head";
import { useSession } from "@/lib/convex/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data, isPending } = useSession();
  const router = useRouter();

  const handleStartRoom = () => {
    if (data?.session) {
      router.push("/studio");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-neutral-950 text-white overflow-hidden font-sans">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        {/* Or swap Inter for Plus Jakarta Sans if you prefer */}
        <style>{`body, html, .font-sans { font-family: 'Inter', 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; }`}</style>
      </Head>
      {/* Grid background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]" />
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 z-10 relative">
        <div className="flex items-center gap-2 select-none">
          <span className="text-lg font-bold tracking-tight">hoppp.in</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-xs text-neutral-400 hover:text-white transition">Proudly open source</a>
          <button className="bg-white text-neutral-950 rounded-full px-5 py-1.5 font-semibold text-sm shadow hover:bg-neutral-200 transition">Sign In</button>
        </div>
      </header>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 z-10 relative">
        <div className="flex flex-col gap-4 items-center max-w-2xl w-full mt-8">
          <div className="flex flex-col gap-2">
            <span className="inline-block bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-1 text-xs font-medium text-neutral-300 mb-2">Create rooms. Collect feedback. Interview. One-to-one.</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-2" style={{fontFamily: "Inter, 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"}}>
            Let's <span className="relative inline-block align-middle">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-blue-400 to-fuchsia-400 animate-gradient-x font-black drop-shadow-lg">hoppp in</span>
              <span className="absolute -right-7 -top-2 text-3xl select-none">🚀</span>
            </span>
            <br className="hidden md:block" />
            for a quick call
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 font-light mb-6" style={{fontFamily: "Inter, 'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif"}}>
            No more ghost feedback. No more confusion. <br />
            Just real people, real conversations, <span className="font-semibold text-fuchsia-400">really simple</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full mt-2">
            <button
              type="button"
              onClick={handleStartRoom}
              className="bg-white text-neutral-950 font-semibold px-8 py-3 rounded-xl text-lg shadow hover:bg-neutral-200 transition"
            >
              Start a Room
            </button>
            <a href="#" className="border border-white/30 text-white font-semibold px-8 py-3 rounded-xl text-lg hover:bg-white/10 transition flex items-center justify-center gap-2">See How It Works <span className="text-xl">→</span></a>
          </div>
          <div className="flex items-center gap-2 mt-6 justify-center">
            <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
            <span className="text-xs text-neutral-400">Live feedback · Audio interviews · Actually works</span>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-neutral-500 z-10 relative">
        &copy; {new Date().getFullYear()} hoppp.in &mdash; Real feedback, really simple
      </footer>
    </div>
  );
}





