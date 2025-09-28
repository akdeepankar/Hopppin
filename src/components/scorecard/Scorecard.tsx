import React, { useState } from 'react';
import Scorecard from 'scorecard-ai';

interface ScorecardCreateTestcaseProps {
  user_prompt: string;
  expected_response: string;
}

export default function ScorecardCreateTestcase({
  user_prompt,
  expected_response,
}: ScorecardCreateTestcaseProps) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateTestcase() {
    setLoading(true);
    setError(null);
    setItems(null);
    try {
      const scorecard = new Scorecard({
        apiKey: process.env['NEXT_PUBLIC_SCORECARD_API_KEY'] || '',
      });
      const testcase = await scorecard.testcases.create('13833', {
        items: [
          {
            jsonData: {
              user_prompt,
              expected_response,
            },
          },
        ],
      });
      setItems(testcase.items);
    } catch (err: any) {
      setError(err?.message || 'Error creating testcase');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-900 text-xs text-white">
      <button
        className="mb-2 rounded bg-gray-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
        onClick={handleCreateTestcase}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Prompt data for Analysis'}
      </button>
      {items && <div className="text-green-400">Thank you.</div>}
      {error && <div className="mt-2 text-red-400">{error}</div>}
    </div>
  );
}
