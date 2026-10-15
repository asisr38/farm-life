import type { Prisma } from "@prisma/client";

type AccessUser = { id: string; role?: string };

// A lease only grants write access while it is in force
export const activeLeaseWhere = (farmerId: string): Prisma.LeaseWhereInput => {
  const now = new Date();
  return { farmerId, startDate: { lte: now }, endDate: { gte: now } };
};

// Admins see every plot; everyone else only the plots they own or lease
export const visiblePlotsWhere = (user: AccessUser): Prisma.PlotWhereInput =>
  user.role === "admin"
    ? {}
    : { OR: [{ ownerId: user.id }, { leases: { some: { farmerId: user.id } } }] };

// `plot.leases` must already be narrowed to the user's own active leases
export const canManagePlot = (
  user: AccessUser,
  plot: { ownerId: string; leases: unknown[] },
): boolean =>
  user.role === "admin" ||
  plot.ownerId === user.id ||
  (user.role !== "viewer" && plot.leases.length > 0);
