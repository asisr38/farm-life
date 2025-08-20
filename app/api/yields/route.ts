import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createYieldSchema = z.object({
  cropId: z.string().uuid(),
  date: z.string().datetime().optional().nullable(),
  quantityKg: z.number().nonnegative(),
  revenueNpr: z.number().optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await request.json();
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
          leases: { where: { farmerId: session.user?.id } },
        },
      },
    },
  });
  if (!crop) return NextResponse.json({ message: "Crop not found" }, { status: 404 });

  const allowed =
    session.user?.role === "admin" ||
    session.user?.id === crop.plot.ownerId ||
    crop.plot.leases.length > 0;
  if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

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
