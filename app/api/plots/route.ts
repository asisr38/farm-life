import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { visiblePlotsWhere } from "@/lib/access";
import { z } from "zod";

const createPlotSchema = z.object({
  name: z.string().min(1),
  sizeM2: z.number().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const plots = await prisma.plot.findMany({
    where: visiblePlotsWhere(user),
    include: {
      crops: true,
      leases: true,
    },
  });

  // A tenant sees only their own lease on a plot, not the terms agreed with other farmers
  const visible = plots.map((plot) =>
    user.role === "admin" || plot.ownerId === user.id
      ? plot
      : { ...plot, leases: plot.leases.filter((lease) => lease.farmerId === user.id) },
  );
  return NextResponse.json(visible);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || !["admin", "landowner"].includes(user.role ?? "")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parse = createPlotSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: { code: "INVALID_BODY", details: parse.error.flatten() } }, { status: 400 });
  }
  const { name, sizeM2, lat, lng } = parse.data;

  const plot = await prisma.plot.create({
    data: {
      name,
      sizeM2: sizeM2 ?? null,
      ownerId: user.id,
      lat: lat ?? null,
      lng: lng ?? null,
    },
  });

  return NextResponse.json(plot, { status: 201 });
}
