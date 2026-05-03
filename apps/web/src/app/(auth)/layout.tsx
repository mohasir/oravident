import { AuthLayoutContainer } from '@/features/auth/components/AuthLayoutContainer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutContainer>{children}</AuthLayoutContainer>;
}
