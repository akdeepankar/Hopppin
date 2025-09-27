import { SignForm } from '@/lib/convex/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img src="/digital.svg" alt="Digital Logo" className="h-54 w-54" />
        </div>

        <SignForm />
      </div>
    </div>
  );
}
