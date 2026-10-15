import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  // Prisma drops a filter whose value is undefined, so a user without an id must never get through
  if (!user?.id) return null;
  return { ...user, id: user.id };
};
