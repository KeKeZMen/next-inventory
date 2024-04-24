export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/admin/(.*)", "/consumable/(.*)", "/orders/(.*)", "/place/(.*)", "/type/(.*)", "/cabinet"]
};
