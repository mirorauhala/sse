import { generateIdFromEntropySize, Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import sqlite from "better-sqlite3";
import { hash } from "@node-rs/argon2";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}

const db = sqlite("./db.sqlite3", {
  fileMustExist: true,
});

db.pragma("journal_mode = WAL");

const adapter = new BetterSqlite3Adapter(db, {
  user: "user",
  session: "session",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    };
  },
});

const signUp = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const userId = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  console.log("before");

  console.log("asdasdasdas");
  db.prepare(
    `INSERT INTO user (
          id,
          display_name,
          email,
          password_hash
      )
      VALUES (
          @id,
          @displayName,
          @email,
          @passwordHash
      )`
  ).run({
    id: userId,
    displayName: "moi",
    email,
    passwordHash,
  });
  const session = await lucia.createSession(userId, {});

  return lucia.createSessionCookie(session.id);
};

export default { signUp };
