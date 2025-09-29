'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  InkeepEmbeddedChat,
  type InkeepEmbeddedChatProps,
} from '@inkeep/cxkit-react-oss';

import { useEffect } from 'react';
import ScorecardCreateTestset from '@/components/scorecard/Scorecard';
import { AsteriskSquare, SkipBack, Stars } from 'lucide-react';

interface CreateAssistantModalProps {
  open: boolean;
  onClose: () => void;
  spaceId: string | undefined;
  onSuccess?: () => void;
  assistantData?: any;
  isUpdateMode?: boolean;
}

export default function CreateAssistantModal({
  open,
  onClose,
  spaceId,
  onSuccess,
  assistantData,
  isUpdateMode,
}: CreateAssistantModalProps) {
  const [name, setName] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [voice, setVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [content, setContent] = useState(
    'You are a friendly support assistant. Keep responses under 30 words.'
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showScorecard, setShowScorecard] = useState(false);
  const [enhanceSuccess, setEnhanceSuccess] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);

  // Prefill state when assistantData changes (for update mode)
  useEffect(() => {
    if (isUpdateMode && assistantData) {
      setName(assistantData.name || '');
      setModel(assistantData.model?.model || 'gpt-4o');
      setVoice(assistantData.voice?.voiceId || '21m00Tcm4TlvDq8ikWAM');
      // Try to get system prompt from messages
      const sysMsg = assistantData.model?.messages?.find(
        (m: any) => m.role === 'system'
      );
      setContent(
        sysMsg?.content ||
          'You are a friendly support assistant. Keep responses under 30 words.'
      );
    } else if (!isUpdateMode) {
      setName('');
      setModel('gpt-4o');
      setVoice('21m00Tcm4TlvDq8ikWAM');
      setContent(
        'You are a friendly support assistant. Keep responses under 30 words.'
      );
    }
  }, [assistantData, isUpdateMode, open]);

  if (!open) return null;

  async function handleCreateAssistant(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      let url = '/api/create-assistant';
      const body: any = {
        name,
        model,
        voice,
        content,
        spaceId,
      };
      if (isUpdateMode && assistantData?.id) {
        url = '/api/update-assistant';
        body.assistantId = assistantData.id;
      }
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        let message = isUpdateMode
          ? 'Failed to update assistant.'
          : 'Failed to create assistant.';
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {}
        throw new Error(message);
      }
      setSuccess(true);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err?.message ||
          (isUpdateMode
            ? 'Failed to update assistant. Please try again.'
            : 'Failed to create assistant. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-colors duration-300"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-5xl flex-row gap-8 rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-lg transition-all duration-300"
        style={{ height: '95vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Assistant Form */}
        <div className="min-w-[320px] flex-1">
          <AsteriskSquare />
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-white">
            {isUpdateMode ? 'Update Assistant' : 'Create an Assistant'}
          </h2>
          <form onSubmit={handleCreateAssistant} className="space-y-6">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  Assistant Name
                </label>
                <Input
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Support Assistant"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  Model
                </label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">
                      OpenAI GPT-3.5 Turbo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-neutral-300">
                  Voice
                </label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21m00Tcm4TlvDq8ikWAM">
                      11labs - Default
                    </SelectItem>
                    {/* Add more voices as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="block text-sm font-medium text-neutral-300">
                  System Prompt (about the assistant)
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 py-1 text-xs text-black"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      setEnhanceSuccess(false);
                      setOriginalPrompt(content); // Save original before enhancing
                      try {
                        const res = await fetch('/api/enhance-prompt', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ prompt: content }),
                        });
                        if (!res.ok)
                          throw new Error('Failed to enhance prompt');
                        const data = await res.json();
                        if (data?.enhanced) {
                          setContent(data.enhanced);
                          setEnhanceSuccess(true);
                        }
                      } catch (err) {
                        alert('Error enhancing prompt');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? (
                      <svg
                        className="mr-2 inline h-4 w-4 animate-spin text-black"
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
                    ) : (
                      <>
                        <Stars /> Enhance
                      </>
                    )}
                  </Button>
                  {enhanceSuccess && originalPrompt && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 bg-transparent px-2 py-1 text-xs text-white"
                      disabled={loading}
                      onClick={() => {
                        setContent(originalPrompt);
                        setEnhanceSuccess(false);
                      }}
                    >
                      <SkipBack />
                      Revert
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Textarea
                  className="min-h-[200px] border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                Describe your assistant's behavior, personality, or rules.
              </div>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            {success && (
              <div className="text-sm text-green-500">Assistant created!</div>
            )}
            <Button
              type="submit"
              variant={'secondary'}
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
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
                  {isUpdateMode ? 'Updating...' : 'Creating...'}
                </span>
              ) : isUpdateMode ? (
                'Update Assistant'
              ) : (
                'Create Assistant'
              )}
            </Button>
          </form>
          {/* Show Scorecard only if Enhance Prompt is successful */}
          {enhanceSuccess && (
            <div className="mt-6">
              <ScorecardCreateTestset
                user_prompt={originalPrompt ?? ''}
                expected_response={content}
              />
            </div>
          )}
        </div>
        {/* Right: Inkeep Chat */}
        <div className="flex h-[90vh] min-w-[320px] flex-1 flex-col border-l border-neutral-800 pl-8">
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {(() => {
              const embeddedChatProps: InkeepEmbeddedChatProps = {
                aiChatSettings: {
                  graphUrl: 'http://localhost:3003/api/chat',
                  apiKey: process.env['REACT_APP_INKEEP_API_KEY'] || '', // Your API key
                },
              };
              return <InkeepEmbeddedChat {...embeddedChatProps} />;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
