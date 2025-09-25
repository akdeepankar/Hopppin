import React from 'react';
import { Switch } from '@/components/ui/switch';

export function generatePasscode() {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function PassToggle({ space }: { space: any }) {
  const [pending, startTransition] = React.useTransition();
  const [enabled, setEnabled] = React.useState(!!space.passEnabled);
  const [passcode, setPasscode] = React.useState(space.passcode || '');
  React.useEffect(() => {
    setEnabled(!!space.passEnabled);
    setPasscode(space.passcode || '');
  }, [space.passEnabled, space.passcode]);

  const handleToggle = async (checked: boolean) => {
    setEnabled(checked);
    if (checked) {
      const newCode = generatePasscode();
      setPasscode(newCode);
      startTransition(async () => {
        await fetch('/api/update-space-pass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spaceId: space._id,
            passEnabled: true,
            passcode: newCode,
          }),
        });
      });
    } else {
      setPasscode('');
      startTransition(async () => {
        await fetch('/api/update-space-pass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            spaceId: space._id,
            passEnabled: false,
          }),
        });
      });
    }
  };

  return (
    <div className="mb-2 flex w-full items-center justify-between gap-2 rounded bg-neutral-800 px-3 py-2">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-neutral-300">
          Passcode Protection
        </span>
        <span className="text-xs text-neutral-400">
          Enable passcode for this space
        </span>
        {enabled && passcode && (
          <span className="mt-1 font-mono text-sm text-fuchsia-400">
            Passcode: <span className="select-all">{passcode}</span>
          </span>
        )}
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={pending}
      />
    </div>
  );
}
