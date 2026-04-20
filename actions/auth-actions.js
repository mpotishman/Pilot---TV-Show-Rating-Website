"use server";
import { createAuthSection, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByUsername } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signUp(prevSate, formData) {
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  // Here you would add logic to save the user to your database
  console.log(`Signing up user with email: ${email} and password: ${password}`);

  // validating
  let errors = {};

  // validation, add username validation later

  if (!email || !email.includes("@")) {
    errors.email = "Invalid email address";
  }
  if (!password || password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // store in database logic goes here
  // add a try catch, if user does same email as already in table - UNIQUE constraint failed so throws an error
  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, username, hashedPassword);

    // create a new authentication session
    await createAuthSection(id);
    redirect("/");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email:
            "It seems like an account for the chosen email already exists.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevSate, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const existingUser = getUserByUsername(username);

  if (!existingUser) {
    return {
      errors: {
        username: "No account found for the provided username.",
      },
    };
  }

  const isvalidPassword = verifyPassword(password, existingUser.password);

  if (!isvalidPassword) {
    return {
      errors: {
        password: "The provided password is incorrect.",
      },
    };
  }

  // now log person in since theyve correctly put in details
  await createAuthSection(existingUser.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect('/');
}