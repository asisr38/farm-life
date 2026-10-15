import { getCurrentUser } from "@/lib/auth";
import { visiblePlotsWhere } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PlotsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>You must be logged in.</p>
      </div>
    );
  }

  const plots = await prisma.plot.findMany({
    where: visiblePlotsWhere(user),
    include: { crops: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plots</h1>
        {["admin", "landowner"].includes(user.role ?? "") && (
          <Link
            href="/plots/new"
            className="rounded-lg bg-farm-green-600 px-4 py-2 text-white hover:bg-farm-green-700"
          >
            New Plot
          </Link>
        )}
      </div>
      {plots.length === 0 ? (
        <p>No plots available.</p>
      ) : (
        <ul className="space-y-4">
          {plots.map((plot) => (
            <li key={plot.id} className="rounded-xl border p-4 shadow">
              <h2 className="text-lg font-semibold">{plot.name}</h2>
              <p className="text-sm text-gray-600">Size: {plot.sizeM2 ?? "N/A"} m²</p>
              <p className="text-sm text-gray-600">Crops: {plot.crops.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
