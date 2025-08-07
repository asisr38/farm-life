"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });

    if (res.ok) {
      // auto sign in
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (!signInRes?.error) {
        router.push("/dashboard");
      }
    } else {
      const { message } = await res.json();
      alert(message || "Unable to sign up");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-farm-green-600">Sign Up</h1>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-farm-green-500 focus:ring-farm-green-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
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
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-farm-green-500 focus:ring-farm-green-500"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            id="confirmPassword"
            type="password"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-farm-green-500 focus:ring-farm-green-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" isLoading={loading}>
          Sign Up
        </Button>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-farm-green-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
