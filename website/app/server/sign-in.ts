import { db } from "@/foundation/db";
import * as v from "valibot";
import { createServerFn } from "@tanstack/start";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/foundation/auth";
import { setCookie } from "vinxi/http";

const signInSchema = v.object({
  email: v.pipe(v.string(), v.nonEmpty(), v.email()),
  password: v.pipe(v.string(), v.nonEmpty()),
});

const dbResultSchema = v.pipe(
  v.object({
    id: v.string(),
    password_hash: v.string(),
  }),
  v.transform(({ id, password_hash }) => ({
    id,
    passwordHash: password_hash,
  }))
);

export const signIn = createServerFn("POST", async (formData: FormData) => {
  "use server";
  const validation = v.safeParse(
    signInSchema,
    Object.fromEntries(formData.entries())
  );

  if (!validation.success) {
    return v.flatten<typeof signInSchema>(validation.issues);
  }

  const { email, password } = validation.output;

  const dbResult = db
    .prepare("SELECT id, password_hash FROM user WHERE email = @email LIMIT 1")
    .get({ email });

  const dbValidated = v.safeParse(dbResultSchema, dbResult);

  if (dbValidated.issues) return "womp womp";
  const { id, passwordHash } = dbValidated.output;

  const isVerified = await verify(passwordHash, password);

  if (!isVerified) return false;

  const session = await lucia.createSession(id, {});
  const cookie = lucia.createSessionCookie(session.id);
  setCookie(cookie.name, cookie.value, cookie.attributes);

  return true;
});
