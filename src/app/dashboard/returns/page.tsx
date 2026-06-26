import { ReturnsClient } from "./returns-client";

export const dynamic = "force-dynamic";

export default function ReturnsPage() {
  return (
    <div className="space-y-6 pb-10 h-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Returns & Refunds</h2>
          <p className="text-muted-foreground">Manage customer returns and restock inventory.</p>
        </div>
      </div>

      <ReturnsClient />
    </div>
  );
}
