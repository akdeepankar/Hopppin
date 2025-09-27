'use client';

import * as React from 'react';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { signIn } from '@/lib/convex/auth-client';
import { authRoutes, routes } from '@/lib/navigation/routes';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';

export function SignForm() {
  let [callbackUrl] = useQueryState('callbackUrl');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  if (!callbackUrl && !authRoutes.includes(pathname)) {
    callbackUrl = encodeURL(pathname, searchParams.toString());
  }

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    const callback = callbackUrl
      ? decodeURIComponent(callbackUrl)
      : routes.studio();

    signIn.social({
      callbackURL: `${env.NEXT_PUBLIC_SITE_URL}${callback}`,
      provider: 'google',
    });
  };

  const handleGithubSignIn = () => {
    const callback = callbackUrl
      ? decodeURIComponent(callbackUrl)
      : routes.studio();

    signIn.social({
      callbackURL: `${env.NEXT_PUBLIC_SITE_URL}${callback}`,
      provider: 'github',
    });
  };

  return (
    <div
      className={cn(
        'mx-auto grid max-w-[268px] gap-3 rounded-xl bg-neutral-950 p-6 text-white shadow-lg'
      )}
    >
      <Button
        size="lg"
        variant="default"
        className="w-full border border-neutral-700 bg-neutral-900 text-white transition-colors hover:bg-neutral-800 hover:text-blue-300"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent align-middle" />
        ) : (
          <GoogleIcon />
        )}
        <span className="ml-2 font-semibold">Continue with Google</span>
      </Button>

      {/**
      <Button
        size="lg"
        variant="default"
        className="w-full bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:text-blue-300 transition-colors"
        onClick={handleGithubSignIn}
      >
        <GitHubIcon />
        <span className="ml-2 font-semibold">Continue with Github</span>
      </Button>
      */}

      <div className="my-3 max-w-xs text-center text-xs text-balance text-muted-foreground">
        By continuing, you agree to our{' '}
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent font-semibold text-gray-300 outline-none hover:underline"
          onClick={() => {
            setModalType('terms');
            setModalOpen(true);
          }}
        >
          Terms of Service
        </button>{' '}
        and acknowledge you've read our{' '}
        <button
          type="button"
          className="cursor-pointer border-none bg-transparent font-semibold text-gray-300 outline-none hover:underline"
          onClick={() => {
            setModalType('privacy');
            setModalOpen(true);
          }}
        >
          Privacy Policy
        </button>
        .
      </div>

      {/* Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-xs rounded-lg bg-neutral-900 p-6 text-white shadow-lg">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-neutral-400 hover:text-blue-300"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-2 text-center text-lg font-bold text-blue-300">
              {modalType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm">
              {modalType === 'terms' ? (
                <>
                  <li>Use the service respectfully and lawfully.</li>
                  <li>No spamming or abusive behavior.</li>
                  <li>Accounts may be suspended for violations.</li>
                </>
              ) : (
                <>
                  <li>Your data is kept private and secure.</li>
                  <li>We do not sell your personal information.</li>
                  <li>See our full policy for more details.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const encodeURL = (pathname: string, search?: string) => {
  let callbackUrl = pathname;

  if (search) {
    if (!search.startsWith('?')) {
      search = `?${search}`;
    }

    callbackUrl += search;
  }

  return encodeURIComponent(callbackUrl);
};

function GoogleIcon(props: LucideProps) {
  return (
    <svg
      height="20"
      viewBox="0 0 512 512"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M482.56 261.36c0-16.73-1.5-32.83-4.29-48.27H256v91.29h127.01c-5.47 29.5-22.1 54.49-47.09 71.23v59.21h76.27c44.63-41.09 70.37-101.59 70.37-173.46z"
          fill="#4285f4"
        ></path>

        <path
          d="M256 492c63.72 0 117.14-21.13 156.19-57.18l-76.27-59.21c-21.13 14.16-48.17 22.53-79.92 22.53-61.47 0-113.49-41.51-132.05-97.3H45.1v61.15c38.83 77.13 118.64 130.01 210.9 130.01z"
          fill="#34a853"
        ></path>

        <path
          d="M123.95 300.84c-4.72-14.16-7.4-29.29-7.4-44.84s2.68-30.68 7.4-44.84V150.01H45.1C29.12 181.87 20 217.92 20 256c0 38.08 9.12 74.13 25.1 105.99l78.85-61.15z"
          fill="#fbbc05"
        ></path>

        <path
          d="M256 113.86c34.65 0 65.76 11.91 90.22 35.29l67.69-67.69C373.03 43.39 319.61 20 256 20c-92.25 0-172.07 52.89-210.9 130.01l78.85 61.15c18.56-55.78 70.59-97.3 132.05-97.3z"
          fill="#ea4335"
        ></path>

        <path d="M20 20h472v472H20V20z"></path>
      </g>
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  );
}
