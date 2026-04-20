"use server";
import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import db from "./db";
import { cookies } from "next/headers";
import { getUserById } from "./user";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export async function createAuthSection(userId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // communicating with cookies
  // (await cookies()).get/set/...;
}

// function to ensure certain pages are protected by logged in users
export async function verifyAuth() {
  // check if authenticated user
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  // looks in the database to see if theres a cookie with that value in the database
  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      lucia.createSessionCookie(result.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      // clear the cookie
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return result;
}

export async function getCurrentUser() {
  const cookie = (await cookies()).get(lucia.sessionCookieName);
  if (!cookie) return null;

  const sessionId = cookie.value;
  if (!sessionId) return null;

  const result = await lucia.validateSession(sessionId);
  if (!result || !result.session) return null;

  // session should include the user id
  const userId =
    result.session.userId ??
    result.session.user?.id ??
    result.session.user?.userId;
  // fallback: if Lucia returned a user object on `result.user`, you can use that instead.
  // But to be certain we have all columns from our users table, fetch from the DB:
  const userRow = getUserById(userId);
  if (!userRow) return { session: result.session, user: null };

  // sanitize: remove password before returning
  const { password, ...safeUser } = userRow;
  return {
    session: result.session,
    user: safeUser,
  };
}

// delete session from database and clear the cookie
export async function destroySession() {
  const { session } = await verifyAuth();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  // clear the cookie
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
