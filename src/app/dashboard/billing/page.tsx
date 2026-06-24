import { BillingClient } from "./billing-client";
import { getProducts } from "../products/actions";

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const products = await getProducts();
  
  return (
    <div className="h-[calc(100vh-6rem)]">
      <BillingClient initialProducts={products} />
    </div>
  );
}
