import { lucia } from "@/foundation/auth";
import { createServerFn } from "@tanstack/start";
import { setCookie } from "vinxi/http";

export const getMe = createServerFn("POST", async (_, ctx) => {
  const cookie = ctx.request.headers.get("cookie");
  if (!cookie) return false;
  const sessionId = lucia.readSessionCookie(cookie);

  if (!sessionId) return false;

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  return {
    user,
  };
});
