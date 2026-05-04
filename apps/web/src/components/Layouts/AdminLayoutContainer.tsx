import { Card, SidebarInset, SidebarProvider, TooltipProvider } from '@repo/ui';
import { AppSidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';

export function AdminLayoutContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider className="bg-brand-neutral">
        <AppSidebar />
        <SidebarInset className="bg-brand-neutral overflow-y-auto">
          <Topbar />
          <div className="p-4">
            <Card>
              <div className="container p-8 md:p-12">{children}</div>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
