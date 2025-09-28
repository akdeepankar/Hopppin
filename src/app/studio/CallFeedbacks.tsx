interface CallFeedbacksProps {
  calls: any[];
}
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Check, Cross, Phone, Sparkles, TicketCheck } from 'lucide-react';
import { Insight } from '@/components/Insight';
// Reusable Dialog component for transcript and summary
function InfoDialog({
  trigger,
  title,
  description,
  content,
}: {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  content: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span onClick={() => setOpen(true)} style={{ display: 'inline-block' }}>
        {trigger}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border border-neutral-800 bg-black [&_[data-slot=dialog-close]]:text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-xs text-neutral-300">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div
            className="mt-2 max-h-64 overflow-y-auto rounded border border-neutral-800 bg-neutral-900 p-3 text-xs text-neutral-200"
            style={{ minHeight: '120px' }}
          >
            {title === 'Transcript' ? (
              <div className="flex flex-col gap-2">
                {content.split('\n').map((line, idx) => {
                  if (!line.trim()) return null;
                  const isUser = line.trim().startsWith('User:');
                  return (
                    <div
                      key={idx}
                      className={
                        (isUser
                          ? 'self-end border-blue-400 bg-blue-700 text-white'
                          : 'self-start border-neutral-700 bg-neutral-800 text-neutral-200') +
                        ' w-fit max-w-[80%] rounded-lg border px-3 py-2 text-left shadow'
                      }
                      style={{ wordBreak: 'break-word' }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            ) : (
              content
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CallFeedbacks({ calls }: CallFeedbacksProps) {
  const [insightOpen, setInsightOpen] = React.useState(false);
  if (!calls || calls.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No call recordings found.
      </div>
    );
  }
  // Gather all summaries as a single string (or array if you want)
  const allSummaries = calls
    .map((c) => c.summary)
    .filter(Boolean)
    .join('\n');
  return (
    <div className="flex flex-col gap-5">
      <Insight
        open={insightOpen}
        onOpenChange={setInsightOpen}
        summary={allSummaries}
      />
      <div className="">
        {(() => {
          let success = 0,
            failed = 0;
          for (const call of calls) {
            if (
              (call.analysis && call.analysis.successEvaluation === 'true') ||
              call.status === 'completed' ||
              call.status === 'success'
            ) {
              success++;
            }
            if (
              (call.analysis && call.analysis.successEvaluation === 'false') ||
              call.endedReason ===
                'call.in-progress.error-assistant-did-not-receive-customer-audio' ||
              call.status === 'failed' ||
              call.status === 'error'
            ) {
              failed++;
            }
          }
          return (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900/80 px-4 py-2 text-sm font-semibold text-white/80 shadow-sm">
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1">
                  <Phone size={14} /> Total Calls: {calls.length}
                </span>
                <span className="flex items-center gap-1 text-green-300">
                  <Check size={14} /> Success: {success}
                </span>
                <span className="flex items-center gap-1 text-red-300">
                  <Cross size={14} /> Failed: {failed}
                </span>
              </div>
              <Button
                className="rounde ml-auto px-3 py-1 text-xs font-semibold text-white shadow transition hover:bg-sky-800"
                type="button"
                onClick={() => setInsightOpen(true)}
              >
                <Sparkles
                  className="h-3.5 w-3.5 fill-blue-400 text-blue-400"
                  fill="currentColor"
                />
                Insights by<span className="text-blue-400">Inkeep</span>
              </Button>
            </div>
          );
        })()}
      </div>
      {calls.map((call) => {
        const [showScorecard, setShowScorecard] = React.useState(false);
        return (
          <Card
            key={call.id}
            className="border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900/80 transition-shadow hover:shadow-lg"
          >
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                <span className="text-white">
                  {call.createdAt
                    ? new Date(call.createdAt).toLocaleString()
                    : 'Unknown date'}
                </span>
                {(() => {
                  let label = '';
                  let colorClass = '';
                  if (
                    call.analysis &&
                    call.analysis.successEvaluation === 'true'
                  ) {
                    label = 'Success';
                    colorClass = 'bg-green-900 text-green-300';
                  } else if (
                    call.analysis &&
                    call.analysis.successEvaluation === 'false'
                  ) {
                    label = 'Failed';
                    colorClass = 'bg-red-900 text-red-300';
                  } else if (
                    call.endedReason ===
                    'call.in-progress.error-assistant-did-not-receive-customer-audio'
                  ) {
                    label = 'Failed';
                    colorClass = 'bg-red-900 text-red-300';
                  } else if (
                    call.status === 'failed' ||
                    call.status === 'error'
                  ) {
                    label = 'Failed';
                    colorClass = 'bg-red-900 text-red-300';
                  } else if (
                    call.status === 'ended' ||
                    call.status === 'completed' ||
                    call.status === 'success'
                  ) {
                    label = 'Success';
                    colorClass = 'bg-green-900 text-green-300';
                  } else {
                    colorClass = 'bg-yellow-900 text-yellow-300';
                    label = call.status
                      ? call.status.charAt(0).toUpperCase() +
                        call.status.slice(1)
                      : 'Unknown';
                  }
                  return (
                    <span
                      className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${colorClass}`}
                    >
                      {label}
                    </span>
                  );
                })()}
              </CardTitle>
              {call.summary && (
                <div className="mt-2" style={{ maxWidth: '100%' }}>
                  <div
                    className="flex flex-col rounded-lg border border-sky-400/10 bg-sky-200/10 px-3 py-2 shadow-sm dark:bg-sky-900/40"
                    style={{ maxWidth: '100%' }}
                  >
                    <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-white dark:text-white">
                      <Sparkles
                        className="h-3.5 w-3.5 fill-blue-400 text-blue-400"
                        fill="currentColor"
                      />
                      Summary
                    </span>
                    <InfoDialog
                      trigger={
                        <span
                          className="text-md block cursor-pointer text-white select-text dark:text-sky-100"
                          style={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            maxWidth: '100%',
                          }}
                          title={call.summary}
                        >
                          {call.summary}
                        </span>
                      }
                      title="Summary"
                      description="Full call summary"
                      content={call.summary}
                    />
                  </div>
                </div>
              )}
              {/* Transcript logic remains, but Scorecard and Generate Score button removed */}
            </CardHeader>
            <CardContent className="-mt-2 flex flex-col gap-2 pt-0">
              {call.recordingUrl ? (
                <div className="flex flex-col gap-1">
                  <span className="mb-1 text-xs font-medium text-muted-foreground">
                    Audio Recording:
                  </span>
                  <div className="flex w-full flex-row items-center gap-2">
                    <div
                      className="mt-1 flex flex-grow items-center rounded-lg border border-neutral-800 bg-white p-1 shadow-inner transition focus-within:ring-2 focus-within:ring-ring hover:shadow-md"
                      style={{ height: '36px', minHeight: 'unset' }}
                    >
                      <audio
                        controls
                        src={call.recordingUrl}
                        className="h-6 w-full min-w-0 bg-transparent outline-none"
                        style={{
                          background: 'none',
                          height: '30px',
                          minHeight: 0,
                        }}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <InfoDialog
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1 w-fit text-xs"
                          >
                            View Transcript
                          </Button>
                        }
                        title="Transcript"
                        description="Full call transcript"
                        content={call.transcript}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No recording available
                </span>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
