import { RootLayoutContainer } from '@/components/Layouts';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutContainer>{children}</RootLayoutContainer>;
}
