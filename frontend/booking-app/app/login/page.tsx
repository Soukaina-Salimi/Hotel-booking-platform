// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const palette = {
  primary: "#7F9BA9",
  primaryDark: "#647C87",
  white: "#FDFDFD",
  cream: "#DED9D0",
  sand: "#E9B883",
  wood: "#A2836D",
  brown: "#7A5237",
  dark: "#3B2E22",
  gray: "#595B57",
};

function ZelligeBorder({ className = "" }) {
  return (
    <div className={`flex justify-center gap-1 ${className}`}>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-sm"
          style={{
            backgroundColor:
              i % 3 === 0
                ? palette.sand
                : i % 3 === 1
                  ? palette.brown
                  : palette.primary,
            opacity: 0.3 + (i % 4) * 0.1,
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Email ou mot de passe incorrect.");
      }

      const { token, user } = await res.json();

      // Stockage simple du token - a terme, envisager httpOnly cookie cote serveur
      // pour la production, mais localStorage suffit pour ce stade du projet.
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      // Redirection selon le role du compte
      if (user.role === "hotel") {
        router.push("/espace-partner/dashboard");
      } else if (user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/account/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue, réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: palette.cream }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: palette.primary }}
              >
                <span className="text-white font-display text-2xl">د</span>
              </div>
              <span
                className="font-display text-2xl"
                style={{ color: palette.dark }}
              >
                Dar<span style={{ color: palette.brown }}>iwane</span>
              </span>
            </div>
            <h1
              className="font-display text-3xl"
              style={{ color: palette.dark }}
            >
              Bienvenue
            </h1>
            <p className="text-sm mt-1" style={{ color: palette.gray }}>
              Connectez-vous à votre compte
            </p>
            <ZelligeBorder className="mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="text-sm font-medium block mb-1.5"
                style={{ color: palette.dark }}
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: palette.gray }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none"
                  style={{
                    backgroundColor: palette.white,
                    borderColor: palette.cream,
                    color: palette.dark,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="text-sm font-medium block mb-1.5"
                style={{ color: palette.dark }}
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: palette.gray }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border transition-all focus:outline-none"
                  style={{
                    backgroundColor: palette.white,
                    borderColor: palette.cream,
                    color: palette.dark,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70"
                  style={{ color: palette.gray }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: palette.primary }}
                />
                <span style={{ color: palette.gray }}>Se souvenir de moi</span>
              </label>
              <a
                href="#"
                className="text-sm transition hover:opacity-70"
                style={{ color: palette.primary }}
              >
                Mot de passe oublié ?
              </a>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <span className="text-red-500">⚠️</span>
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition hover:opacity-90"
              style={{ backgroundColor: palette.brown }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Se connecter <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full border-t"
                style={{ borderColor: palette.cream }}
              ></div>
            </div>
          </div>

          <p
            className="text-center text-sm mt-6"
            style={{ color: palette.gray }}
          >
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-semibold transition hover:opacity-70"
              style={{ color: palette.primary }}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/maroc-hotel-v2.jpg"
            alt="Hôtel traditionnel marocain"
            fill
            className="object-cover"
            sizes="55vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/70 via-[#3B2E22]/20 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-8">
          <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
              <span className="text-white text-xs font-medium">✨ Nouveau</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
              <span className="text-white text-xs font-medium">⭐ 4.9/5</span>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <h2 className="font-display text-2xl text-white">
                L'art du voyage
              </h2>
              <p className="text-white/70 text-sm max-w-xs">
                Découvrez des séjours d'exception au cœur du Maroc
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
              <p className="text-white font-bold text-lg">150+</p>
              <p className="text-white/60 text-xs">Hôtels</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
              <p className="text-white font-bold text-lg">98%</p>
              <p className="text-white/60 text-xs">Satisfaction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
              <p className="text-white font-bold text-lg">24/7</p>
              <p className="text-white/60 text-xs">Support</p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
      </div>
    </div>
  );
}
