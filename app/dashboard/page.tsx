import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Leaf, Sprout, Wheat } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import YieldChart from "@/components/dashboard/YieldChart";
import PlotCard from "@/components/dashboard/PlotCard";
import NepalMap from "@/components/dashboard/NepalMap";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl">You must be logged in to view this page.</p>
        <Link href="/login" className="text-farm-green-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  // Fetch plots with nested crops and yields
  const plots = await prisma.plot.findMany({
    where: {
      leases: {
        some: {
          farmerId: session.user?.id,
        },
      },
    },
    include: {
      crops: {
        include: {
          yields: true,
        },
      },
    },
  });

  // Aggregate stats
  const totalPlots = plots.length;
  const totalCrops = plots.reduce((acc, p) => acc + p.crops.length, 0);
  const totalYield = plots.reduce((acc, p) => {
    return (
      acc +
      p.crops.reduce((cropAcc, crop) => {
        return cropAcc + crop.yields.reduce((yAcc, y) => yAcc + y.quantityKg, 0);
      }, 0)
    );
  }, 0);

  // Build yield time-series data (sum per date)
  const yieldMap: Record<string, number> = {};
  plots.forEach((plot) => {
    plot.crops.forEach((crop) => {
      crop.yields.forEach((y) => {
        const dateKey = format(y.date, "yyyy-MM-dd");
        yieldMap[dateKey] = (yieldMap[dateKey] || 0) + y.quantityKg;
      });
    });
  });
  const yieldData = Object.entries(yieldMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  // Prepare plots data for map
  const plotsForMap = plots.map((plot) => {
    const plotYield = plot.crops.reduce((acc, crop) => {
      return (
        acc + crop.yields.reduce((yAcc, y) => yAcc + y.quantityKg, 0)
      );
    }, 0);

    return {
      id: plot.id,
      name: plot.name,
      sizeM2: plot.sizeM2,
      cropsCount: plot.crops.length,
      totalYield: plotYield,
      location: plot.location as { lat: number; lng: number } | null,
    };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <h1 className="text-3xl font-bold text-farm-green-700">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Plots"
          value={totalPlots}
          icon={<Leaf className="h-6 w-6" />}
        />
        <StatsCard
          title="Crops"
          value={totalCrops}
          icon={<Sprout className="h-6 w-6" />}
        />
        <StatsCard
          title="Total Yield (kg)"
          value={totalYield.toFixed(2)}
          icon={<Wheat className="h-6 w-6" />}
        />
      </div>

      {/* Map and Chart Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <NepalMap plots={plotsForMap} />
        <YieldChart data={yieldData} />
      </div>

      {/* Plots list */}
      <div>
        <h2 className="mb-4 mt-6 text-2xl font-semibold text-gray-800">My Plots</h2>
        {plots.length === 0 ? (
          <p>No plots found. Contact admin to assign a plot.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plots.map((plot) => {
              const plotYield = plot.crops.reduce((acc, crop) => {
                return (
                  acc + crop.yields.reduce((yAcc, y) => yAcc + y.quantityKg, 0)
                );
              }, 0);

              return (
                <PlotCard
                  key={plot.id}
                  id={plot.id}
                  name={plot.name}
                  sizeM2={plot.sizeM2}
                  cropsCount={plot.crops.length}
                  totalYield={plotYield}
                >
                  <Link
                    href={`/plots/${plot.id}`}
                    className="mt-2 inline-block text-sm text-farm-green-600 underline"
                  >
                    View details
                  </Link>
                </PlotCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
