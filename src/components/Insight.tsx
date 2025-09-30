// TypeScript definition for API responses

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader } from '@/components/ui/Loader';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

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

  // Log summary props for debugging
  React.useEffect(() => {
    console.log('Insight component summary prop:', summary);
    console.log('Summary length:', summary?.length || 0);
  }, [summary]);

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(
        /^### (.*$)/gim,
        '<h3 style="font-size: 14px; font-weight: bold; color: #60a5fa; margin: 12px 0 6px 0;">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 style="font-size: 16px; font-weight: bold; color: #60a5fa; margin: 14px 0 8px 0;">$1</h2>'
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 style="font-size: 18px; font-weight: bold; color: #60a5fa; margin: 16px 0 10px 0;">$1</h1>'
      )
      // Bold
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight: bold; color: #ffffff;">$1</strong>'
      )
      // Italic
      .replace(
        /\*(.*?)\*/g,
        '<em style="font-style: italic; color: #d1d5db;">$1</em>'
      )
      // Code blocks
      .replace(
        /```([\s\S]*?)```/g,
        '<pre style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; margin: 8px 0; font-family: monospace; font-size: 11px; color: #e5e7eb; overflow-x: auto;"><code>$1</code></pre>'
      )
      // Inline code
      .replace(
        /`(.*?)`/g,
        '<code style="background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 11px; color: #e5e7eb;">$1</code>'
      )
      // Lists
      .replace(
        /^\* (.*$)/gim,
        '<li style="margin: 4px 0; color: #ffffff;">$1</li>'
      )
      .replace(
        /^- (.*$)/gim,
        '<li style="margin: 4px 0; color: #ffffff;">$1</li>'
      )
      // Line breaks
      .replace(/\n/g, '<br>');

    // Wrap consecutive list items in ul tags
    html = html.replace(
      /(<li[^>]*>.*?<\/li>)(\s*<br>\s*<li[^>]*>.*?<\/li>)*/g,
      (match) => {
        return (
          '<ul style="margin: 8px 0; padding-left: 16px;">' +
          match.replace(/<br>\s*/g, '') +
          '</ul>'
        );
      }
    );

    return html;
  };

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
      setStatus('Fetching chat response...');
      insightRef.current = '';
      controllerRef.current = new AbortController();
      const run = async () => {
        try {
          // Chat API request
          const body = JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `Please analyze this summary of successful calls and provide overall summary insights in 2 paragraphs and use markdown inside the paragraphs itself when needed like highliting imp points in different colors, use underlines and italics etc, not more than 1200 characters: ${summary}`,
              },
            ],
            conversationId: 'chat-1234',
          });
          const chatResp = await fetch('http://localhost:3003/api/chat', {
            method: 'POST',
            headers: {
              Authorization:
                'Bearer sk_EejD9WUWC0-a.eYQzwD1xqGC4JiRH06wQ2BcaLvVS88jCT77k4-ulKI0',
              'Content-Type': 'application/json',
            },
            body,
            signal: controllerRef.current
              ? controllerRef.current.signal
              : undefined,
          });

          const chatStatus = chatResp.status;
          if (!chatResp.ok) {
            throw new Error('Chat API error! status: ' + chatStatus);
          }

          // Handle streaming response
          setStatus('Streaming chat response...');
          const reader = chatResp.body?.getReader();
          const decoder = new TextDecoder();
          let streamedText = '';
          let fullResponse = '';

          if (reader) {
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                fullResponse += chunk;

                // Parse SSE data
                const lines = chunk.split('\n');
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const data = JSON.parse(line.slice(6));
                      if (data.type === 'text-delta' && data.delta) {
                        streamedText += data.delta;
                        setInsight(`${streamedText}`);
                        setLoading(false); // Hide loader once streaming starts
                      }
                    } catch (e) {
                      // Ignore JSON parse errors for incomplete chunks
                    }
                  }
                }
              }
            } finally {
              reader.releaseLock();
            }
          }

          // Final update with complete response
          setInsight(`${streamedText}`);
          setStatus(`Chat request complete (Status: ${chatStatus})`);
        } catch (err) {
          let errorMsg = 'Error fetching chat response.';
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
      <DialogContent className="max-h-[80vh] max-w-lg overflow-hidden border border-neutral-800 bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            <div className="flex items-center gap-2">
              <Sparkles
                className="h-3.5 w-3.5 fill-blue-400 text-blue-400"
                fill="currentColor"
              />
              Insights by<span className="text-blue-400">Inkeep</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[60vh] min-h-[180px] flex-col items-center justify-center overflow-y-auto">
          {loading && <Loader />}
          <div
            className="mt-4 w-full text-left text-sm text-white"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(insight) }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
