import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhooks(.*)",
]);

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/dashboard/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Dashboard routes must be checked BEFORE public routes
  // because the old slug matcher /:slug would otherwise match /dashboard
  if (isDashboardRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const isAdmin = sessionClaims?.role === "admin";

    // Non-admin trying to access admin routes
    if (isAdminRoute(req) && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Admin on non-admin dashboard routes should go to admin panel
    if (!isAdminRoute(req) && isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }

    return NextResponse.next();
  }

  // Public routes: no auth required
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Everything else (business slugs, etc.) is public
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
