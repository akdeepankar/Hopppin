import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';
import { Loader } from '@/components/ui/Loader';

export function MailHistory({
  userId,
  spaceName,
}: {
  userId?: string;
  spaceName: string;
}) {
  const [openMail, setOpenMail] = useState<string | null>(null);
  const emails = useQuery(
    api.emails.getEmailsByUserAndSpace,
    userId && spaceName ? { userId: userId as Id<'users'>, spaceName } : 'skip'
  );

  if (!userId) return <div className="text-neutral-400">No user session.</div>;
  if (!emails)
    return (
      <div className="text-neutral-400">
        <Loader />;
      </div>
    );
  if (emails.length === 0)
    return (
      <div className="text-neutral-400">No emails sent for this space.</div>
    );

  return (
    <div className="space-y-2">
      {emails.map((email: any) => (
        <div
          key={email._id}
          className="cursor-pointer rounded border border-neutral-700 bg-neutral-900 p-2 text-xs transition hover:border-blue-400"
          onClick={() => setOpenMail(email._id)}
        >
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">
              {new Date(email.sentAt).toLocaleString()}
            </span>
            <span className="font-semibold text-blue-300">To: {email.to}</span>
          </div>
          <div className="max-w-full truncate text-neutral-200">
            Subject: {email.subject}
          </div>
          <div
            className="max-w-full truncate text-neutral-400"
            style={{ maxWidth: '100%' }}
          >
            {typeof email.html === 'string' && email.html.length > 120
              ? email.html.slice(0, 120) + '...'
              : email.html}
          </div>
        </div>
      ))}
      {openMail &&
        (() => {
          const email = emails.find((e: any) => e._id === openMail);
          if (!email) return null;
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setOpenMail(null)}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="bg-opacity-95 relative w-full max-w-2xl rounded-lg border border-blue-400 bg-neutral-900 p-6 text-xs text-neutral-100 shadow-lg"
                onClick={(e) => e.stopPropagation()}
                tabIndex={0}
              >
                <button
                  className="absolute top-2 right-2 text-sm text-neutral-400 hover:text-white"
                  onClick={() => setOpenMail(null)}
                >
                  ×
                </button>
                <div className="mb-2 text-xs text-neutral-400">
                  {new Date(email.sentAt).toLocaleString()}
                </div>
                <div className="mb-1 font-semibold text-blue-300">
                  To: {email.to}
                </div>
                <div className="mb-1 text-sm text-neutral-200">
                  Subject: {email.subject}
                </div>
                <div className="max-h-[60vh] overflow-auto break-words whitespace-pre-line text-neutral-300">
                  {email.html}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
