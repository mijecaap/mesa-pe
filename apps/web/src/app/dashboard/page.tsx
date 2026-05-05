import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard | Mesa.pe",
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-coffee md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-warm-gray">
          Administra tu negocio desde un solo lugar.
        </p>
      </div>

      <DashboardClient />
    </div>
  );
}
