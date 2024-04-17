export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/admin", "/cabinet", "/type/(.*)", "/place/(.*)", "/consumables/(.*)"],
};
