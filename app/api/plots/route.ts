import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";

const createPlotSchema = z.object({
  name: z.string().min(1),
  sizeM2: z.number().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

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

  const json = await request.json();
  const parse = createPlotSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: { code: "INVALID_BODY", details: parse.error.flatten() } }, { status: 400 });
  }
  const { name, sizeM2, lat, lng } = parse.data;

  const plot = await prisma.plot.create({
    data: {
      name,
      sizeM2: sizeM2 ?? null,
      ownerId: session.user!.id!,
      lat: lat ?? null,
      lng: lng ?? null,
    } as any,
  });

  return NextResponse.json(plot, { status: 201 });
}
