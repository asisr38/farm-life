import Link from "next/link";

interface PlotCardProps {
  id: string;
  name: string;
  sizeM2?: number | null;
  cropsCount: number;
  totalYield: number;
}

export default function PlotCard({ id, name, sizeM2, cropsCount, totalYield }: PlotCardProps) {
  return (
    <Link
      href={`#/plots/${id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <h2 className="mb-1 text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-600">Size: {sizeM2 ?? "N/A"} m²</p>
      <p className="text-sm text-gray-600">Crops: {cropsCount}</p>
      <p className="text-sm text-gray-600">Total Yield: {totalYield.toFixed(2)} kg</p>
    </Link>
  );
}

