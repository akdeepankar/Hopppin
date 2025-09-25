import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface CallFeedbacksProps {
  calls: any[];
}

export function CallFeedbacks({ calls }: CallFeedbacksProps) {
  if (!calls || calls.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No call recordings found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {calls.map((call) => (
        <Card
          key={call.id}
          className="border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900/80 transition-shadow hover:shadow-lg"
        >
          <CardHeader className="pb-2">
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
                    ? call.status.charAt(0).toUpperCase() + call.status.slice(1)
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
              <div className="mt-2">
                <div className="rounded-lg border border-sky-400/10 bg-sky-200/10 px-3 py-2 shadow-sm dark:bg-sky-900/40">
                  <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-white dark:text-white">
                    <Sparkles
                      className="h-3.5 w-3.5 fill-blue-400 text-blue-400"
                      fill="currentColor"
                    />
                    Summary
                  </span>
                  <span className="text-md text-white dark:text-sky-100">
                    {call.summary}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-0">
            {call.recordingUrl ? (
              <div className="flex flex-col gap-1">
                <span className="mb-1 text-xs font-medium text-muted-foreground">
                  Audio Recording:
                </span>
                <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900/80 p-2 shadow-inner transition focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
                  <audio
                    controls
                    src={call.recordingUrl}
                    className="w-full min-w-0 bg-transparent outline-none"
                    style={{ background: 'none' }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                No recording available
              </span>
            )}
            {call.transcript && (
              <div className="mt-1 rounded bg-neutral-900/60 p-2 text-xs text-muted-foreground">
                <span className="font-semibold">Transcript:</span>{' '}
                {call.transcript}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
