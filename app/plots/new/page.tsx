"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  sizeM2: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
  lat: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
  lng: z.preprocess((v) => (v === "" ? undefined : Number(v)), z.number().optional()),
});

export default function NewPlotPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: "", sizeM2: "", lat: "", lng: "" });
  const [loading, setLoading] = useState(false);

  if (!session || !["admin", "landowner"].includes(session.user?.role ?? "")) {
    return <p className="p-4">Forbidden</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      name: form.name,
      sizeM2: form.sizeM2,
      lat: form.lat,
      lng: form.lng,
    });
    if (!parsed.success) {
      alert("Please fill in required fields with valid values.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/plots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
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
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <input
              name="lat"
              type="number"
              step="0.000001"
              value={form.lat}
              onChange={handleChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <input
              name="lng"
              type="number"
              step="0.000001"
              value={form.lng}
              onChange={handleChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
        </div>
        <Button type="submit" isLoading={loading}>
          Create
        </Button>
      </form>
    </div>
  );
}
