'use client';

import { useSession } from '@/lib/convex/auth-client';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import CreateAssistantModal from './CreateAssistantModal';
import React from 'react';
import { PassToggle } from '@/components/PassToggle';
import { FeedbackColumn } from './FeedbackColumn';
import { MainContent } from './MainContent';

export default function SpaceDetailPage() {
  // All hooks must be called unconditionally and in the same order
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const params = useParams();
  const router = useRouter();
  const spaceName = params['space-name'] || params.slug || '';
  const { data, isPending } = useSession();
  const user = data?.user;
  const convexUser = useQuery(
    api.user.getUserByEmail,
    user?.email ? { email: user.email } : 'skip'
  );
  const normalizedSpaceName = Array.isArray(spaceName)
    ? spaceName[0]
    : spaceName;
  const space = useQuery(
    api.spaces.getSpaceByName,
    normalizedSpaceName ? { name: normalizedSpaceName } : 'skip'
  );

  useEffect(() => {
    if (
      !isPending &&
      space &&
      convexUser &&
      space.createdBy !== convexUser._id
    ) {
      router.replace('/studio');
    }
  }, [isPending, space, convexUser, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Show access denied if no session/user, or not the owner
  if (!user || !convexUser || !space || space.createdBy !== convexUser._id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <h1 className="mb-4 text-2xl font-bold">Access Denied</h1>
        <p className="text-neutral-400">
          You do not have permission to view this space.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Back to Studio Button */}
      <div className="absolute top-0 left-0 z-20 m-4">
        <Link
          href="/studio"
          className="flex items-center gap-2 rounded bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white shadow transition hover:bg-neutral-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Studio
        </Link>
      </div>
      {/* Sidebar */}
      <aside className="hidden w-56 flex-col border-r border-neutral-800 bg-neutral-900 p-6 md:flex">
        {/* Delete Space Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogTitle>Delete Space</DialogTitle>
            {space?.assistantId ? (
              <DialogDescription>
                You must delete the linked assistant before deleting this space.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Are you sure you want to delete this space? This action cannot
                be undone.
              </DialogDescription>
            )}
            {deleteError && (
              <div className="mt-2 text-sm text-red-500">{deleteError}</div>
            )}
            <DialogFooter>
              <button
                className="rounded bg-neutral-700 px-4 py-1.5 text-white hover:bg-neutral-800"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              {!space?.assistantId && (
                <button
                  className="rounded bg-red-600 px-4 py-1.5 text-white hover:bg-red-700"
                  onClick={async () => {
                    setDeleteError('');
                    try {
                      const res = await fetch('/api/delete-space', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ spaceId: space._id }),
                      });
                      if (!res.ok) throw new Error('Failed to delete space');
                      setDeleteDialogOpen(false);
                      router.replace('/studio');
                    } catch (err) {
                      setDeleteError('Failed to delete space.');
                    }
                  }}
                >
                  Delete
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex-1">
          <div className="mt-10 mb-4">
            <div className="mb-2 text-xs text-neutral-500 uppercase">Space</div>
            <div className="font-semibold text-white">{spaceName}</div>
          </div>
          {/* Add more sidebar items here if needed */}
        </div>
        <button
          className="mb-2 rounded bg-fuchsia-600 px-4 py-2 font-medium text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setModalOpen(true)}
          disabled={!!space?.assistantId}
        >
          + Create Assistant
        </button>
        <button
          className="mt-4 rounded bg-red-700 px-4 py-2 font-medium text-white transition hover:bg-red-800"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Space
        </button>
      </aside>

      {/* Main Content + Feedback Column */}
      <div className="flex h-full flex-1 flex-row">
        {/* Main Content */}
        <MainContent
          spaceName={normalizedSpaceName}
          space={space}
          setModalOpen={setModalOpen}
        />
        {/* Feedback Column */}
        <FeedbackColumn assistantId={space?.assistantId} />
      </div>

      <CreateAssistantModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        spaceId={space?._id}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
}
