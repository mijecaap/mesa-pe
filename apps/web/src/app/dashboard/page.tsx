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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Administra tu negocio desde un solo lugar.
        </p>
      </div>

      <DashboardClient />
    </div>
  );
}
