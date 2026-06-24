import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageX } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Returns & Refunds</h2>
          <p className="text-muted-foreground">Manage customer returns and initiate refunds.</p>
        </div>
      </div>

      <Card className="glass-card flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-[#D4A017]/10 p-6 rounded-full mb-6">
          <PackageX className="h-16 w-16 text-[#D4A017]" />
        </div>
        <CardTitle className="text-2xl mb-2">Coming Soon</CardTitle>
        <CardDescription className="max-w-md mx-auto text-lg">
          The Returns & Refunds module is currently under construction and will be deployed in the next update phase.
        </CardDescription>
      </Card>
    </div>
  );
}
