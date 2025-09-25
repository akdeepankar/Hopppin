'use client';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
export default function CreateSpaceModal({
  open,
  onClose,
  onSuccess,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: Id<'users'>;
}) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const createSpace = useMutation(api.spaces.createSpace);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createSpace({ name: name.trim(), userId });
      setName('');
      setLoading(false);
      onClose();
      onSuccess();
    } catch (e) {
      setLoading(false);
      // Optionally show error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-white">Create a Space</h2>
        <input
          className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-white focus:border-fuchsia-500 focus:outline-none"
          placeholder="Space name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <div className="mt-2 flex gap-2">
          <button
            className="flex-1 rounded bg-fuchsia-500 px-4 py-2 font-semibold text-white transition hover:bg-fuchsia-600"
            onClick={handleCreate}
            disabled={!name.trim() || loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
          <button
            className="flex-1 rounded bg-neutral-800 px-4 py-2 text-neutral-300 transition hover:bg-neutral-700"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
