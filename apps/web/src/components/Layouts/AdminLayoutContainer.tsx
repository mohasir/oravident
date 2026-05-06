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
        <SidebarInset className="bg-brand-neutral flex flex-col h-screen overflow-hidden">
          <Topbar />
          <div className="px-4 pb-8 flex-1 overflow-y-auto">
            <Card className="min-h-full">
              <div className="container p-4 md:p-12">{children}</div>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
