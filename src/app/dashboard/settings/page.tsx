import { PrismaClient } from "@prisma/client";
import { SettingsClient } from "./settings-client";

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const shop = await prisma.shopSettings.findFirst();

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">
            Shop Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your MR Cell Point shop information. This data will be used on all invoices and reports.
          </p>
        </div>

        <SettingsClient initialData={shop} />
      </div>
    </div>
  );
}
