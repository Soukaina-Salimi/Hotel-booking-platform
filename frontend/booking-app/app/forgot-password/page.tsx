// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const palette = {
  primary: "#7F9BA9",
  primaryDark: "#647C87",
  white: "#FDFDFD",
  cream: "#DED9D0",
  sand: "#E9B883",
  brown: "#7A5237",
  dark: "#3B2E22",
  gray: "#595B57",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!res.ok) throw new Error("Échec de l'envoi");

      setMessage({
        type: "success",
        text: "Un email de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.",
      });
      setEmail("");
    } catch {
      setMessage({
        type: "error",
        text: "Une erreur est survenue. Vérifiez votre email et réessayez.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: palette.cream }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: palette.primary }}
          >
            <span className="text-white font-display text-xl">د</span>
          </div>
          <span
            className="font-display text-2xl"
            style={{ color: palette.dark }}
          >
            Dar<span style={{ color: palette.brown }}>iwane</span>
          </span>
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-sm"
          style={{ backgroundColor: palette.white }}
        >
          <h1
            className="font-display text-2xl mb-2"
            style={{ color: palette.dark }}
          >
            Mot de passe oublié
          </h1>
          <p className="text-sm mb-6" style={{ color: palette.gray }}>
            Saisissez votre adresse email et nous vous enverrons un lien pour
            réinitialiser votre mot de passe.
          </p>

          {message && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-sm mb-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="text-sm font-medium block mb-1"
                style={{ color: palette.gray }}
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: palette.gray }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium text-sm transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: palette.primary }}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 mt-6 text-sm transition hover:opacity-70"
            style={{ color: palette.primary }}
          >
            <ArrowLeft size={14} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
