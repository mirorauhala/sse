import { createServerFn } from "@tanstack/start";
import { lucia } from "@/foundation/auth";

export const logOut = createServerFn("POST", async (_, ctx) => {
  "use server";
  const cookie = ctx.request.headers.get("cookie");
  if (!cookie) return true;

  const sessionId = lucia.readSessionCookie(cookie);
  if (!sessionId) return true;

  await lucia.invalidateSession(sessionId);

  return true;
});
