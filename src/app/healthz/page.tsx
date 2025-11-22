"use client";
import { useEffect, useState } from "react";

export default function HealthPage() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch("/api/healthz")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ ok: false }));
  }, []);

  if (!health)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Checking system health...
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-gray-800">
      <div className="bg-white shadow rounded-xl p-8 w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-bold text-blue-600 text-center">
          🩺 System Health
        </h1>

        <p className="text-gray-600 text-center">
          <strong>Status:</strong>{" "}
          {health.ok ? "✅ Healthy" : "❌ Unhealthy"}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-500">Platform</p>
            <p className="font-semibold">{health.system.platform}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-500">Architecture</p>
            <p className="font-semibold">{health.system.arch}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-500">Release</p>
            <p className="font-semibold">{health.system.release}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-500">Uptime</p>
            <p className="font-semibold">{health.system.uptime}</p>
          </div>
        </div>

        <div className="text-sm text-gray-400 text-center mt-4">
          <p>Node Version: {health.version}</p>
          <p>Checked at: {new Date(health.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </main>
  );
}
