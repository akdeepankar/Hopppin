import React from 'react';
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
    <div className="space-y-4">
      {emails.map((email: any) => (
        <div
          key={email._id}
          className="rounded border border-neutral-700 bg-neutral-800 p-4"
        >
          <div className="mb-1 text-xs text-neutral-400">
            {new Date(email.sentAt).toLocaleString()}
          </div>
          <div className="mb-1 font-semibold text-blue-300">To: {email.to}</div>
          <div className="mb-1 text-sm text-neutral-200">
            Subject: {email.subject}
          </div>
          <div className="whitespace-pre-line text-neutral-300">
            {email.html}
          </div>
        </div>
      ))}
    </div>
  );
}
