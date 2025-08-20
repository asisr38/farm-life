import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCropSchema = z.object({
  plotId: z.string().uuid(),
  name: z.string().min(1),
  variety: z.string().optional().nullable(),
  plantingDate: z.string().datetime().optional().nullable(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const json = await request.json();
  const parse = createCropSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: { code: "INVALID_BODY", details: parse.error.flatten() } }, { status: 400 });
  }

  const { plotId, name, variety, plantingDate } = parse.data;

  // check permissions: only plot owner or farmer leasing the plot can add crop
  const plot = await prisma.plot.findUnique({
    where: { id: plotId },
    include: {
      leases: { where: { farmerId: session.user?.id } },
    },
  });
  if (!plot) return NextResponse.json({ message: "Plot not found" }, { status: 404 });

  const isAllowed =
    session.user?.role === "admin" ||
    session.user?.id === plot.ownerId ||
    (session.user?.role === "farmer" && plot.leases.length > 0);

  if (!isAllowed) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const crop = await prisma.crop.create({
    data: {
      plotId,
      name,
      variety: variety ?? undefined,
      plantingDate: plantingDate ? new Date(plantingDate) : undefined,
    },
  });
  return NextResponse.json(crop, { status: 201 });
}
