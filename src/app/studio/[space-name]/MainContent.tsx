// CopyButton component for feedback and tooltip
function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      className={`relative rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700`}
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      title="Copy to clipboard"
    >
      <svg
        className="mr-1 inline h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
      {copied ? 'Copied!' : 'Copy'}
      {copied && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded border border-green-700 bg-neutral-800 px-2 py-1 text-xs text-green-400 shadow-lg">
          Copied!
        </span>
      )}
    </button>
  );
}
import React, { useState, useEffect } from 'react';
import CreateAssistantModal from './CreateAssistantModal';
import { ShareModal } from './ShareModal';
import { PassToggle } from '@/components/PassToggle';
import { MailHistory } from './MailHistory';
import { Button } from '@/components/ui/button';
import { CheckCircle, Delete, Edit, IdCardIcon } from 'lucide-react';

interface MainContentProps {
  spaceName: string;
  space: any;
  setModalOpen: (open: boolean) => void;
  userId?: string;
}

export function MainContent({
  spaceName,
  space,
  setModalOpen,
  userId,
}: MainContentProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'share' | 'history'>(
    'create'
  );
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [assistantData, setAssistantData] = useState<any>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${spaceName}`;

  // Fetch assistant data when update is requested
  const fetchAssistantData = async (assistantId: string) => {
    try {
      const res = await fetch(`/api/assistant?assistantId=${assistantId}`);
      const data = await res.json();
      if (data.success) {
        setAssistantData(data.assistant);
      } else {
        setAssistantData(null);
      }
    } catch {
      setAssistantData(null);
    }
  };
  return (
    <main className="flex h-full max-w-lg flex-1 flex-col items-center justify-start overflow-hidden p-8">
      <div className="w-full">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{spaceName}</h1>
          <p className="text-base text-neutral-400">
            Manage your{' '}
            <span className="font-semibold text-blue-400">Space.</span>
          </p>
        </header>
        <div className="mb-6 flex gap-2">
          <button
            className={`rounded-t-lg px-4 py-2 font-semibold transition-colors ${activeTab === 'create' ? 'bg-blue-700 text-white' : 'bg-neutral-800 text-neutral-300'}`}
            onClick={() => setActiveTab('create')}
          >
            Create
          </button>
          <button
            className={`rounded-t-lg px-4 py-2 font-semibold transition-colors ${activeTab === 'share' ? 'bg-blue-700 text-white' : 'bg-neutral-800 text-neutral-300'}`}
            onClick={() => setActiveTab('share')}
          >
            Share
          </button>
          <button
            className={`rounded-t-lg px-4 py-2 font-semibold transition-colors ${activeTab === 'history' ? 'bg-blue-700 text-white' : 'bg-neutral-800 text-neutral-300'}`}
            onClick={() => setActiveTab('history')}
          >
            Mail History
          </button>
        </div>
        <section className="space-y-8">
          {activeTab === 'create' && (
            <>
              {/* Section: Create Assistant */}
              <div className="mb-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Assistant</h2>
                  {space?.assistantId ? (
                    <span className="flex flex-row gap-2 rounded bg-green-900 px-4 py-1.5 text-sm font-medium text-green-300">
                      <CheckCircle size={20} /> Assistant Linked
                    </span>
                  ) : (
                    <button
                      className="rounded bg-blue-600 px-4 py-1.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => {
                        setIsUpdateMode(false);
                        setAssistantData(null);
                        setAssistantModalOpen(true);
                      }}
                    >
                      + Create Assistant
                    </button>
                  )}
                </div>
                {space?.assistantId ? (
                  <div className="flex w-full flex-col items-start gap-2">
                    <span className="flex gap-2 rounded-md bg-gray-700/30 p-2 text-sm break-all text-gray-300">
                      <IdCardIcon /> {space.assistantId}
                    </span>
                    <div className="mt-2 flex w-full justify-start gap-2">
                      <Button
                        className="rounded bg-gray-700/30 px-2 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                        style={{ minWidth: 'auto' }}
                        onClick={async () => {
                          setIsUpdateMode(true);
                          await fetchAssistantData(space.assistantId);
                          setAssistantModalOpen(true);
                        }}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Update
                      </Button>
                      <Button
                        className="py-1v rounded bg-gray-700/30 px-2 text-xs font-medium text-red-400 transition hover:bg-red-700"
                        style={{ minWidth: 'auto' }}
                        onClick={async () => {
                          await fetch('/api/delete-assistant', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              spaceId: space._id,
                              assistantId: space.assistantId,
                            }),
                          });
                          // Convex reactivity will update the UI automatically
                        }}
                      >
                        <Delete className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <span className="text-neutral-500">No assistants yet.</span>
                )}
                {/* Assistant Modal for Create/Update (always rendered) */}
                <CreateAssistantModal
                  open={assistantModalOpen}
                  onClose={() => setAssistantModalOpen(false)}
                  spaceId={space?._id}
                  onSuccess={() => setAssistantModalOpen(false)}
                  assistantData={assistantData}
                  isUpdateMode={isUpdateMode}
                />
              </div>

              {/* Section: Passcode */}
              {space?.assistantId && (
                <div className="mb-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Passcode</h2>
                  <PassToggle space={space} />
                </div>
              )}
            </>
          )}
          {activeTab === 'share' && space?.assistantId && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Public URL
              </h2>
              <div className="mb-2 flex w-full max-w-full items-center gap-2">
                <div className="relative flex flex-1 items-center">
                  <svg
                    className="absolute left-2 h-4 w-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="flex-1 rounded border border-neutral-700 bg-neutral-800 py-1 pr-2 pl-8 text-sm text-white transition-all duration-150 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    id="public-url-input"
                  />
                </div>
                <CopyButton url={publicUrl} />
                <button
                  className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                  onClick={() => setShareOpen(true)}
                  title="Share this space"
                >
                  <svg
                    className="mr-1 inline h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M7.05 7.05l.01.01M16.95 7.05l.01.01M16.95 16.95l.01.01M7.05 16.95l.01.01"
                    />
                  </svg>
                  Share
                </button>
              </div>

              <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                publicUrl={publicUrl}
                space={space}
                userId={userId}
              />
            </div>
          )}
          {/* Section: Mail History */}
          {activeTab === 'history' && userId && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
              <h2 className="mb-4 text-xl font-semibold">Mail History</h2>
              <MailHistory userId={userId} spaceName={spaceName} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
