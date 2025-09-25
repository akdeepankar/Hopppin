import React from 'react';
import { CallStats } from './CallStats';
import { CallFeedbacks } from './CallFeedbacks';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Section2({ assistantId }: { assistantId: string }) {
  const [calls, setCalls] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string>('');
  const [stats, setStats] = React.useState<any>({});

  React.useEffect(() => {
    if (!assistantId) return;
    setLoading(true);
    setError(null);
    setStatus('');
    fetch(`/api/assistant-calls?assistantId=${assistantId}`)
      .then(async (res) => {
        setStatus(res.status + ' ' + res.statusText);
        const data = await res.json();
        if (data.success) {
          // Only show calls that match the current assistantId
          const filtered = (data.calls || []).filter(
            (call: any) => call.assistantId === assistantId
          );
          setCalls(filtered);
          // Compute enhanced stats
          let userTurns = 0;
          let botTurns = 0;
          let totalResponseTime = 0;
          let responseCount = 0;
          let totalUserConfidence = 0;
          let userConfidenceCount = 0;
          let successCount = 0;
          let failCount = 0;
          let callsToday = 0;
          let callsThisWeek = 0;
          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay()); // Sunday as start of week
          // let endedCount = 0;
          filtered.forEach((call: any) => {
            // Calls today/this week
            if (call.createdAt) {
              const callDate = new Date(call.createdAt);
              if (
                callDate.getFullYear() === today.getFullYear() &&
                callDate.getMonth() === today.getMonth() &&
                callDate.getDate() === today.getDate()
              ) {
                callsToday++;
              }
              if (callDate >= weekStart && callDate <= now) {
                callsThisWeek++;
              }
            }
            // Count user/bot turns
            if (Array.isArray(call.messages)) {
              userTurns += call.messages.filter(
                (m: any) => m.role === 'user'
              ).length;
              botTurns += call.messages.filter(
                (m: any) => m.role === 'bot' || m.role === 'assistant'
              ).length;
              // Average response time (bot message duration)
              call.messages.forEach((m: any) => {
                if (m.role === 'bot' && typeof m.duration === 'number') {
                  totalResponseTime += m.duration;
                  responseCount++;
                }
                // User confidence from metadata
                if (
                  m.role === 'user' &&
                  m.metadata &&
                  Array.isArray(m.metadata.wordLevelConfidence)
                ) {
                  m.metadata.wordLevelConfidence.forEach((w: any) => {
                    if (typeof w.confidence === 'number') {
                      totalUserConfidence += w.confidence;
                      userConfidenceCount++;
                    }
                  });
                }
              });
            }
            // Use analysis.successEvaluation for success/fail
            if (call.analysis && call.analysis.successEvaluation === 'true') {
              successCount++;
            } else if (
              call.analysis &&
              call.analysis.successEvaluation === 'false'
            ) {
              failCount++;
            } else if (
              call.endedReason ===
              'call.in-progress.error-assistant-did-not-receive-customer-audio'
            ) {
              failCount++;
            } else {
              // fallback: treat ended as neutral, failed/error as fail
              if (call.status === 'failed' || call.status === 'error')
                failCount++;
            }
          });
          setStats({
            total: filtered.length,
            withRecording: filtered.filter((c: any) => !!c.recordingUrl).length,
            callsToday,
            callsThisWeek,
            successful: successCount,
            failed: failCount,
            userTurns,
            botTurns,
            avgResponseTime:
              responseCount > 0
                ? (totalResponseTime / responseCount).toFixed(0)
                : '-',
            avgUserConfidence:
              userConfidenceCount > 0
                ? (totalUserConfidence / userConfidenceCount).toFixed(2)
                : '-',
            successRate:
              filtered.length > 0
                ? ((successCount / filtered.length) * 100).toFixed(0) + '%'
                : '-',
          });
        } else {
          setError(data.error || 'Failed to fetch calls');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [assistantId]);

  return (
    <Tabs defaultValue="stats" className="flex h-full w-full flex-col">
      <TabsList className="sticky top-0 z-10 mb-4 border-b border-neutral-800 bg-neutral-950">
        <TabsTrigger
          value="stats"
          className="text-white data-[state=active]:text-foreground"
        >
          Stats
        </TabsTrigger>
        <TabsTrigger
          value="feedbacks"
          className="text-white data-[state=active]:text-foreground"
        >
          Feedbacks
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-auto">
        <TabsContent value="stats">
          <div className="h-full w-full max-w-full">
            <CallStats
              total={stats.total ?? 0}
              callsToday={stats.callsToday ?? 0}
              callsThisWeek={stats.callsThisWeek ?? 0}
              withRecording={stats.withRecording ?? 0}
              successful={stats.successful ?? 0}
              failed={stats.failed ?? 0}
              userTurns={stats.userTurns ?? 0}
              botTurns={stats.botTurns ?? 0}
              avgResponseTime={stats.avgResponseTime ?? '-'}
              avgUserConfidence={stats.avgUserConfidence ?? '-'}
              successRate={stats.successRate ?? '-'}
            />
          </div>
        </TabsContent>
        <TabsContent value="feedbacks">
          {loading && (
            <div className="text-sm text-neutral-400">Loading...</div>
          )}
          {error && <div className="text-sm text-red-400">{error}</div>}
          {!loading && !error && <CallFeedbacks calls={calls} />}
        </TabsContent>
      </div>
    </Tabs>
  );
}
