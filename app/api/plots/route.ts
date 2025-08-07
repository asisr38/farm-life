import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Admins see all, farmers see theirs, landowners see owned
  const filters: any = {};
  if (session.user?.role === "farmer") {
    filters.leases = { some: { farmerId: session.user.id } };
  } else if (session.user?.role === "landowner") {
    filters.ownerId = session.user.id;
  }

  const plots = await prisma.plot.findMany({
    where: filters,
    include: {
      crops: true,
      leases: true,
    },
  });
  return NextResponse.json(plots);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !["admin", "landowner"].includes(session.user?.role ?? "")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, sizeM2, location } = body;

  if (!name) {
    return NextResponse.json({ message: "Name required" }, { status: 400 });
  }

  const plot = await prisma.plot.create({
    data: {
      name,
      sizeM2: sizeM2 ? Number(sizeM2) : null,
      ownerId: session.user.id!,
      location: location ?? null,
    },
  });

  return NextResponse.json(plot, { status: 201 });
}
