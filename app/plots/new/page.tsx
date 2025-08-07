"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function NewPlotPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", sizeM2: "" });
  const [loading, setLoading] = useState(false);

  if (!session || !["admin", "landowner"].includes(session.user?.role ?? "")) {
    return <p className="p-4">Forbidden</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/plots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: form.name, sizeM2: parseFloat(form.sizeM2) }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/plots");
    } else {
      alert("Failed to create plot");
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-bold">Create New Plot</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Size (m²)</label>
          <input
            name="sizeM2"
            type="number"
            value={form.sizeM2}
            onChange={handleChange}
            className="mt-1 w-full rounded border p-2"
          />
        </div>
        <Button type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </div>
  );
}
