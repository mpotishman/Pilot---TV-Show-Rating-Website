// components/modal/log-in-modal.js
"use client";
import React from "react";
import TabButtons from "../buttons/tab-buttons";
import { useState } from "react";
import { useActionState } from "react";
import { signUp } from "../../actions/auth-actions";
import { login } from "../../actions/auth-actions";

export default function LogInModal({ onClose, standalone = false }) {
  const [content, setContent] = useState("login");

  const [signUpState, signUpFormAction] = useActionState(signUp, {});
  const [logInState, logInFormAction] = useActionState(login, {});

  let bottomSection;
  if (content === "signup") {
    bottomSection = (
      <form id="auth-form" action={signUpFormAction} className="mt-6">
        <p>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-2 bg-[#0b1220] text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </p>
        <p>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 bg-[#0b1220] text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </p>
        <p className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 bg-[#0b1220] text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </p>

        {signUpState.errors && (
          <ul id="form-errors">
            {Object.keys(signUpState.errors).map((error) => (
              <li key={error} className="text-sm text-red-400 mt-4">
                {signUpState.errors[error]}
              </li>
            ))}
          </ul>
        )}

        <p>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Account
          </button>
        </p>
      </form>
    );
  } else {
    bottomSection = (
      <form id="auth-form" action={logInFormAction} className="mt-6">
        <p>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-3 py-2 bg-[#0b1220] text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </p>
        <p className="mt-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-3 py-2 bg-[#0b1220] text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </p>

        {logInState.errors && (
          <ul id="form-errors">
            {Object.keys(logInState.errors).map((error) => (
              <li key={error} className="text-sm text-red-400 mt-4">
                {logInState.errors[error]}
              </li>
            ))}
          </ul>
        )}

        <p>
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Log in
          </button>
        </p>
      </form>
    );
  }

  // The form content
  const formContent = (
    <>
      <div className="select-buttons flex gap-4 justify-center mt-6">
        <TabButtons
          onClick={() => setContent("login")}
          active={content === "login"}
        >
          Log In
        </TabButtons>
        <TabButtons
          onClick={() => setContent("signup")}
          active={content === "signup"}
        >
          Sign Up
        </TabButtons>
      </div>
      {bottomSection}
    </>
  );

  // If standalone, wrap in modal structure
  if (standalone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <div className="relative bg-[#161d29] rounded-lg p-6 w-full max-w-md mx-4 z-10 animate-modalIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
          >
            ✕
          </button>
          {formContent}
        </div>
      </div>
    );
  }

  // Otherwise, just return the form content (for use inside ModalContainer)
  return formContent;
}