import { AutumnWrapper } from '@/components/AutumnWrapper';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AutumnWrapper>{children}</AutumnWrapper>;
}
