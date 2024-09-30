import { generateIdFromEntropySize } from "lucia";

import { hash } from "@node-rs/argon2";
import { db } from "@/foundation/db";
import * as v from "valibot";
import { createServerFn } from "@tanstack/start";
import { lucia } from "@/foundation/auth";
import { setCookie } from "vinxi/http";

const signUpSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.nonEmpty(), v.email()),
    password: v.pipe(v.string(), v.minLength(8)),
    verifyPassword: v.pipe(v.string(), v.minLength(8)),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["verifyPassword"]],
      ({ password, verifyPassword }) => password === verifyPassword,
      "The passwords do not match."
    ),
    ["verifyPassword"]
  ),
  v.transform(({ email, password }) => ({ email, password }))
);

export const signUp = createServerFn("POST", async (formData: FormData) => {
  "use server";
  const validation = v.safeParse(
    signUpSchema,
    Object.fromEntries(formData.entries())
  );

  if (!validation.success) {
    return v.flatten<typeof signUpSchema>(validation.issues);
  }

  const { email, password } = validation.output;

  const userId = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  db.prepare(
    `INSERT INTO user (
          id,
          email,
          password_hash
      )
      VALUES (
          @id,
          @email,
          @passwordHash
      )`
  ).run({
    id: userId,
    email,
    passwordHash,
  });

  const session = await lucia.createSession(userId, {});

  const cookie = lucia.createSessionCookie(session.id);
  setCookie(cookie.name, cookie.value, cookie.attributes);

  return true;
});
