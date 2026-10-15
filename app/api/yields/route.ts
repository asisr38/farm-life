import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { activeLeaseWhere, canManagePlot } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createYieldSchema = z.object({
  cropId: z.string().uuid(),
  date: z.string().datetime().optional().nullable(),
  quantityKg: z.number().nonnegative(),
  revenueNpr: z.number().optional().nullable(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parse = createYieldSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: { code: "INVALID_BODY", details: parse.error.flatten() } }, { status: 400 });
  }

  const { cropId, date, quantityKg, revenueNpr } = parse.data;

  // Verify permission: farmer leasing crop's plot
  const crop = await prisma.crop.findUnique({
    where: { id: cropId },
    include: {
      plot: {
        include: {
          leases: { where: activeLeaseWhere(user.id) },
        },
      },
    },
  });
  if (!crop) return NextResponse.json({ message: "Crop not found" }, { status: 404 });

  if (!canManagePlot(user, crop.plot)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const yieldRecord = await prisma.yield.create({
    data: {
      cropId,
      date: date ? new Date(date) : new Date(),
      quantityKg: Number(quantityKg),
      revenueNpr: revenueNpr != null ? Number(revenueNpr) : null,
    },
  });
  return NextResponse.json(yieldRecord, { status: 201 });
}
