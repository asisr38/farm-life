"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);

    if (!res?.error) {
      router.push(callbackUrl);
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-farm-green-600">Log In</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-farm-green-500 focus:ring-farm-green-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-farm-green-500 focus:ring-farm-green-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>
          Log In
        </Button>
        <p className="text-center text-sm">
          No account?{' '}
          <a href="/signup" className="font-semibold text-farm-green-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
