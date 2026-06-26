"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export function Barcode({ value }: { value: string }) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && value) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 12,
        margin: 0,
        background: "transparent",
      });
    }
  }, [value]);

  return <svg ref={barcodeRef}></svg>;
}
