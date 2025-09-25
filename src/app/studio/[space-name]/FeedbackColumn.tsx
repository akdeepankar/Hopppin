import React from 'react';
import { Section2 } from '../Section2';

interface FeedbackColumnProps {
  assistantId?: string;
}

export function FeedbackColumn({ assistantId }: FeedbackColumnProps) {
  return (
    <aside
      className="scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent flex h-full max-w-full flex-1 flex-col border-l border-neutral-800 bg-neutral-950 p-4 md:max-w-full"
      style={{ scrollbarColor: '#000 transparent', scrollbarWidth: 'thin' }}
    >
      {assistantId && <Section2 assistantId={assistantId} />}
    </aside>
  );
}
