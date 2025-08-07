"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function NewCropPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ plotId: "", name: "", variety: "" });
  const [loading, setLoading] = useState(false);

  if (!session) return <p className="p-4">You must be logged in.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/crops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Failed to create crop");
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-4 text-2xl font-bold">Add Crop</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Plot ID</label>
          <input
            name="plotId"
            value={form.plotId}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border p-2"
          />
        </div>
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
          <label className="block text-sm font-medium">Variety</label>
          <input
            name="variety"
            value={form.variety}
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
