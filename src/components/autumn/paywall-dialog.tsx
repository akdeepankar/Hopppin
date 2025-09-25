'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { usePaywall } from 'autumn-js/react';
import { getPaywallContent } from '@/lib/autumn/paywall-content';
import { cn } from '@/lib/utils';

export interface PaywallDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  featureId: string;
  entityId?: string;
}

export default function PaywallDialog(params?: PaywallDialogProps) {
  const { data: preview } = usePaywall({
    featureId: params?.featureId,
    entityId: params?.entityId,
  });

  if (!params || !preview) {
    return <></>;
  }

  const { open, setOpen } = params;
  const { title, message } = getPaywallContent(preview);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0 overflow-hidden p-0 pt-4 text-sm text-foreground">
        <DialogTitle className={cn('px-6 text-xl font-bold')}>
          {title}
        </DialogTitle>
        <div className="my-2 px-6">{message}</div>
        <DialogFooter className="mt-4 flex flex-col justify-between gap-x-4 border-t bg-secondary py-2 pr-3 pl-6 sm:flex-row">
          <Button
            size="sm"
            className="min-w-20 font-medium shadow transition"
            onClick={async () => {
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
