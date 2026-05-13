"use server";
import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getAuthUserByUsername, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signUp(prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const username = formData.get("username")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  let errors = {};

  if (!email || !email.includes("@")) {
    errors.email = "Invalid email address";
  }
  if (!username || username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }
  if (!password || password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (getUserByEmail(email)) {
    errors.email = "An account with that email already exists.";
  }
  if (getAuthUserByUsername(username)) {
    errors.username = "That username is already taken.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, username, hashedPassword);

    // create a new authentication session
    await createAuthSession(id);
    redirect("/");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          general: "An account with that email or username already exists.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString() ?? "";

  const existingUser = getAuthUserByUsername(username);

  if (!existingUser) {
    return {
      errors: {
        username: "No account found for the provided username.",
      },
    };
  }

  const isValidPassword = verifyPassword(password, existingUser.password);

  if (!isValidPassword) {
    return {
      errors: {
        password: "The provided password is incorrect.",
      },
    };
  }

  // now log person in since theyve correctly put in details
  await createAuthSession(existingUser.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect('/');
}
