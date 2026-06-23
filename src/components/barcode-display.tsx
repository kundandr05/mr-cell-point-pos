"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeDisplayProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}

export function BarcodeDisplay({ value, width = 1.5, height = 40, displayValue = true }: BarcodeDisplayProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current && value) {
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        width,
        height,
        displayValue,
        fontSize: 14,
        margin: 0,
      });
    }
  }, [value, width, height, displayValue]);

  if (!value) return null;

  return (
    <div className="flex justify-center bg-white p-2 rounded-md border">
      <svg ref={barcodeRef}></svg>
    </div>
  );
}
