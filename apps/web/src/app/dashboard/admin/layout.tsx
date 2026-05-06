import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/dashboard/admin-layout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = await auth();

  if (sessionClaims?.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
