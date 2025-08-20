import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PlotsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>You must be logged in.</p>
      </div>
    );
  }

  const filters: any = {};
  if (session.user?.role === "farmer") {
    filters.leases = { some: { farmerId: session.user.id } };
  } else if (session.user?.role === "landowner") {
    filters.ownerId = session.user.id;
  }

  const plots = await prisma.plot.findMany({
    where: filters,
    include: { crops: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plots</h1>
        {["admin", "landowner"].includes(session.user.role ?? "") && (
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
