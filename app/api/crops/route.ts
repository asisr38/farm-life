import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { plotId, name, variety, plantingDate } = body;
  if (!plotId || !name) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

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
      variety,
      plantingDate: plantingDate ? new Date(plantingDate) : undefined,
    },
  });
  return NextResponse.json(crop, { status: 201 });
}
