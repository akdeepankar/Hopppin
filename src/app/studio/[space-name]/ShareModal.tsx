import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Share } from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  publicUrl: string;
  space: any;
  userId?: string;
}

export function ShareModal({
  open,
  onClose,
  publicUrl,
  space,
  userId,
}: ShareModalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState(`Join my space: ${space?.name || ''}`);
  const [html, setHtml] = useState(() => {
    let msg = `Hi!\n\nI invite you to join my space: ${space?.name || ''}.`;
    if (space?.passEnabled && space?.passcode) {
      msg += `\n\nPasscode: ${space.passcode}`;
    }
    msg += `\n\nJoin here: ${publicUrl}`;
    return msg;
  });

  React.useEffect(() => {
    if (!open) return;
    let msg = `Hi!\n\nI invite you to join my space: ${space?.name || ''}.`;
    if (space?.passEnabled && space?.passcode) {
      msg += `\n\nPasscode: ${space.passcode}`;
    }
    msg += `\n\nJoin here: ${publicUrl}`;
    setHtml(msg);
  }, [space, publicUrl, open]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  if (!open) return null;
  // Close modal when clicking outside the modal content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const addEmail = () => {
    const email = emailInput.trim();
    if (
      email &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
      !emails.includes(email)
    ) {
      setEmails([...emails, email]);
      setEmailInput('');
      setError('');
    } else if (email) {
      setError('Enter a valid, unique email');
    }
  };
  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };
  const handleSend = async () => {
    setSending(true);
    setError('');
    setSuccess('');
    const to = emails.join(',');
    const from = 'send@hoppp.in';
    console.log('Sending email to:', to);
    try {
      const res = await fetch('/api/send-space-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, html, userId }),
      });
      if (!res.ok) throw new Error('Failed to send emails');
      setSuccess('Emails sent!');
      setEmails([]);
    } catch (err) {
      setError('Failed to send emails.');
      console.error('Send email error:', err);
    } finally {
      setSending(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-neutral-950 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 flex gap-2 text-xl font-bold text-white">
          <Mail className="pt-1" /> Share Space
        </h2>
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Input
              type="email"
              placeholder="Add email and press Enter"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addEmail();
                }
              }}
              className="flex-1"
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              onClick={addEmail}
              disabled={!emailInput}
            >
              Add
            </Button>
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {emails.map((email) => (
              <Badge
                key={email}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {email}
                <button
                  type="button"
                  className="ml-1 text-xs text-red-400 hover:text-red-600"
                  onClick={() => removeEmail(email)}
                  aria-label={`Remove ${email}`}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="mb-2 flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              placeholder="HTML Body"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              rows={6}
              className="max-h-32 min-h-[2.5rem] resize-none overflow-auto rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{
                maxHeight: '8rem',
                minHeight: '2.5rem',
                overflow: 'auto',
              }}
            />
          </div>
          {error && <div className="mb-2 text-xs text-red-400">{error}</div>}
          {success && (
            <div className="mb-4 rounded-lg border border-green-500 bg-green-900/80 px-4 py-3 text-base font-semibold text-green-200 shadow">
              {success}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSend}
            disabled={emails.length === 0 || sending}
          >
            <Send />
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}
