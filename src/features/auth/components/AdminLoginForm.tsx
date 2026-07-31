"use client";

import { useMemo, useState } from "react";

import Button from "../../../components/ui/Button";
import { createClient } from "../../../lib/supabase/client";
import { signInAdmin } from "../services";

export default function AdminLoginForm() {
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
    await signInAdmin(supabase, {
  email,
  password,
});

window.location.assign(
  "/admin/dashboard",
);
      
  
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "تعذر تسجيل الدخول.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="nr-admin-login-form"
      onSubmit={handleSubmit}
    >
      <div className="nr-admin-login-field">
        <label htmlFor="admin-email">
          البريد الإلكتروني
        </label>

        <input
          id="admin-email"
          className="nr-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div className="nr-admin-login-field">
        <label htmlFor="admin-password">
          كلمة المرور
        </label>

        <input
          id="admin-password"
          className="nr-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {errorMessage ? (
        <p className="nr-admin-login-error">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "جارٍ تسجيل الدخول..."
          : "تسجيل الدخول"}
      </Button>
    </form>
  );
}