import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

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
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
