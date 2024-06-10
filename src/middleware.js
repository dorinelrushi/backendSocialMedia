import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/", "/listofpost"],
});

// Clerk middleware configuration
export const config = {
  matcher: ["/((?!.*\\..*|_next|api|trpc).*)", "/", "/api/(.*)", "/trpc/(.*)"],
};
