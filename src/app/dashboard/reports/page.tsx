import { getReportsData } from "./actions";
import { ReportsClient } from "./reports-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData();

  return (
    <div className="space-y-6 pb-10 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        <p className="text-muted-foreground">View real-time analytics and generated reports based on live database data.</p>
      </div>
      
      <ReportsClient data={data} />
    </div>
  );
}
