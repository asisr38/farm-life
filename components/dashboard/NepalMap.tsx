"use client";

import dynamic from "next/dynamic";
import type { NepalMapProps } from "./NepalMapInner";

// Leaflet reads `window` as soon as it is imported, so the module that pulls it in
// must only ever be loaded in the browser.
const NepalMapInner = dynamic(() => import("./NepalMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
      <div className="text-center">
        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-farm-green-600 border-t-transparent"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function NepalMap(props: NepalMapProps) {
  return <NepalMapInner {...props} />;
}
