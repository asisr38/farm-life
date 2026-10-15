import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().toLowerCase().email().max(254),
  // bcrypt ignores everything past 72 bytes
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  try {
    const parse = signupSchema.safeParse(await request.json().catch(() => null));

    if (!parse.success) {
      return NextResponse.json(
        { message: "Enter a valid email and a password of at least 8 characters" },
        { status: 400 },
      );
    }
    const { name, email, password } = parse.data;

    // Accounts created before emails were lowercased may differ only by case
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    // Two signups for the same email can both pass the check above
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
