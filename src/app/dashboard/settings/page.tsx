import { getShopSettings } from "./actions";
import { SettingsForm } from "./settings-form";
import { SecuritySettingsForm } from "./security-form";

export default async function SettingsPage() {
  const settings = await getShopSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Shop Settings</h2>
        <p className="text-muted-foreground">Manage your store details and invoice configuration.</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <SettingsForm initialData={settings} />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mt-10">Security Settings</h2>
        <p className="text-muted-foreground">Update your master admin email and password.</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <SecuritySettingsForm />
      </div>
    </div>
  );
}
