// TypeScript definition for API responses

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader } from '@/components/ui/Loader';

export interface Response {
  [k: string]: unknown;
}

type InsightProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
};

export function Insight(props: InsightProps) {
  const { open, onOpenChange, summary } = props;
  const [insight, setInsight] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const controllerRef = React.useRef<AbortController | null>(null);
  const insightRef = React.useRef('');

  // Reset state on close
  React.useEffect(() => {
    if (!open) {
      setInsight('');
      setLoading(false);
      setStatus('');
      insightRef.current = '';
      if (controllerRef.current) controllerRef.current.abort();
    }
  }, [open]);

  // Always run fetch on open
  React.useEffect(() => {
    if (open) {
      setInsight('');
      setLoading(true);
      setStatus('Checking health...');
      insightRef.current = '';
      controllerRef.current = new AbortController();
      const run = async () => {
        try {
          setStatus('Fetching /health endpoint...');
          const response = await fetch('http://localhost:3002/health', {
            method: 'GET',
            signal: controllerRef.current
              ? controllerRef.current.signal
              : undefined,
          });
          const statusCode = response.status;
          if (!response.ok) {
            throw new Error('HTTP error! status: ' + statusCode);
          }
          const text = await response.text();
          let display = '';
          try {
            const json: Response = JSON.parse(text);
            display = `Health Check (Status: ${statusCode})\nJSON Response:\n${JSON.stringify(json, null, 2)}\n\nRaw Response:\n${text}`;
          } catch {
            display = `Health Check (Status: ${statusCode})\nRaw Response:\n${text}`;
          }

          // Now do the POST request as described
          setStatus('Fetching /chat/completions endpoint...');
          const body = JSON.stringify({
            model: 'string',
            messages: [
              {
                role: 'system',
                content: 'string',
              },
            ],
          });
          const chatResp = await fetch(
            'http://localhost:3003/tenants/default/projects/weather-project/graphs/brainstorm/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body,
              signal: controllerRef.current
                ? controllerRef.current.signal
                : undefined,
            }
          );
          const chatStatus = chatResp.status;
          const chatText = await chatResp.text();
          let chatDisplay = '';
          try {
            const chatJson: Response = JSON.parse(chatText);
            chatDisplay = `\n\nChat Completions (Status: ${chatStatus})\nJSON Response:\n${JSON.stringify(chatJson, null, 2)}\n\nRaw Response:\n${chatText}`;
          } catch {
            chatDisplay = `\n\nChat Completions (Status: ${chatStatus})\nRaw Response:\n${chatText}`;
          }

          setInsight(display + chatDisplay);
          setStatus(
            `Both requests complete. Health: ${statusCode}, Chat: ${chatStatus}`
          );
        } catch (err) {
          let errorMsg = 'Error fetching health or chat completions.';
          if (err instanceof Error) {
            errorMsg += ' ' + err.message;
          } else if (typeof err === 'string') {
            errorMsg += ' ' + err;
          }
          setInsight(errorMsg);
          setStatus(errorMsg);
        } finally {
          setLoading(false);
        }
      };
      run();
      return () => {
        if (controllerRef.current) controllerRef.current.abort();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-neutral-800 bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Insights by Inkeep</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-[180px] flex-col items-center justify-center">
          {loading && <Loader />}
          <div className="mt-2 min-h-[20px] w-full text-center text-xs text-blue-300">
            {status}
          </div>
          <div className="mt-4 w-full text-center text-xs whitespace-pre-line text-white">
            {insight}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
