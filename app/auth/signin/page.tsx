'use client';
import { getCsrfToken, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SignInPage() {
  const [csrfToken, setCsrfToken] = useState<string>("");

  useEffect(() => {
    getCsrfToken().then(token => setCsrfToken(token || ""));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">サインイン</h1>
      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label className="block mb-2">
          Email address
          <input name="email" type="email" required className="border p-2 w-full" />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign in with Email
        </button>
      </form>
    </div>
  );
}