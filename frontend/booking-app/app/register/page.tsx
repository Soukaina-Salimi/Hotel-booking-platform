// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
} from "lucide-react";

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

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "client",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (!formData.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: "client", // cette page ne cree plus que des comptes voyageur, voir logique de redirection ci-dessous
          }),
        },
      );

      if (!res.ok) {
        let message = "Impossible de créer le compte, réessayez.";
        try {
          const json = await res.json();
          message = json?.message || message;
        } catch {
          // reponse non-JSON (erreur serveur inattendue) - on garde le message generique
        }
        throw new Error(message);
      }

      const { token, user } = await res.json();
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      router.push("/account/dashboard");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue, réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    // Un compte hotelier a besoin de la fiche hotel associee - flux distinct
    // et deja construit sur /partner/register, on ne le duplique pas ici.
    if (formData.role === "hotel") {
      router.push("/partner/register");
      return;
    }

    setError("");
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
    setError("");
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
        .font-sans {
          font-family: "Work Sans", sans-serif;
        }
      `}</style>

      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm transition hover:opacity-70 mb-4"
              style={{ color: palette.brown }}
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Link>

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
              Créer un compte
            </h1>
            <p className="text-sm mt-1" style={{ color: palette.gray }}>
              Rejoignez notre communauté de voyageurs
            </p>
            <ZelligeBorder className="mt-4" />

            <div className="flex items-center gap-3 mt-6">
              <div
                className={`flex-1 h-1 rounded-full transition ${step >= 1 ? "bg-[#E9B883]" : "bg-[#DED9D0]"}`}
              ></div>
              <div
                className={`flex-1 h-1 rounded-full transition ${step >= 2 ? "bg-[#E9B883]" : "bg-[#DED9D0]"}`}
              ></div>
            </div>
            <div
              className="flex justify-between text-xs mt-1.5"
              style={{ color: palette.gray }}
            >
              <span>Informations</span>
              <span>Sécurité</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-xs font-medium block mb-1"
                      style={{ color: palette.dark }}
                    >
                      Prénom *
                    </label>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: palette.gray }}
                      />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Ahmed"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border transition focus:outline-none text-sm"
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
                      className="text-xs font-medium block mb-1"
                      style={{ color: palette.dark }}
                    >
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Benali"
                      className="w-full px-3 py-2.5 rounded-lg border transition focus:outline-none text-sm"
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
                    className="text-xs font-medium block mb-1"
                    style={{ color: palette.dark }}
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: palette.gray }}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border transition focus:outline-none text-sm"
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
                    className="text-xs font-medium block mb-1"
                    style={{ color: palette.dark }}
                  >
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: palette.gray }}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+212 6 12 34 56 78"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border transition focus:outline-none text-sm"
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
                    className="text-xs font-medium block mb-1"
                    style={{ color: palette.dark }}
                  >
                    Type de compte
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg border transition focus:outline-none text-sm"
                    style={{
                      backgroundColor: palette.white,
                      borderColor: palette.cream,
                      color: palette.dark,
                    }}
                  >
                    <option value="client">🏠 Voyageur</option>
                    <option value="hotel">🏨 Hôtelier</option>
                  </select>
                  {formData.role === "hotel" && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: palette.brown }}
                    >
                      Vous serez redirigé vers le formulaire d'inscription
                      partenaire (infos hôtel requises).
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                    <span className="text-red-500 text-sm">⚠️</span>
                    <span className="text-xs text-red-600">{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-2.5 rounded-lg text-white font-medium transition hover:opacity-90 text-sm"
                  style={{ backgroundColor: palette.primary }}
                >
                  Continuer <ArrowRight size={16} className="inline ml-1" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label
                    className="text-xs font-medium block mb-1"
                    style={{ color: palette.dark }}
                  >
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: palette.gray }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border transition focus:outline-none text-sm"
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
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs mt-1" style={{ color: palette.gray }}>
                    Minimum 6 caractères
                  </p>
                </div>

                <div>
                  <label
                    className="text-xs font-medium block mb-1"
                    style={{ color: palette.dark }}
                  >
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                      style={{ color: palette.gray }}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-lg border transition focus:outline-none text-sm"
                      style={{
                        backgroundColor: palette.white,
                        borderColor: palette.cream,
                        color: palette.dark,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70"
                      style={{ color: palette.gray }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded"
                    style={{ accentColor: palette.primary }}
                  />
                  <label
                    className="text-xs cursor-pointer"
                    style={{ color: palette.gray }}
                  >
                    J'accepte les{" "}
                    <a href="#" className="text-[#7F9BA9] hover:underline">
                      conditions d'utilisation
                    </a>{" "}
                    et la{" "}
                    <a href="#" className="text-[#7F9BA9] hover:underline">
                      politique de confidentialité
                    </a>
                  </label>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
                    <span className="text-red-500 text-sm">⚠️</span>
                    <span className="text-xs text-red-600">{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-2.5 rounded-lg border font-medium transition hover:opacity-70 text-sm"
                    style={{ borderColor: palette.cream, color: palette.gray }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-lg text-white font-medium transition hover:opacity-90 text-sm"
                    style={{ backgroundColor: palette.brown }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                        Inscription...
                      </span>
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <p
            className="text-center text-xs mt-5"
            style={{ color: palette.gray }}
          >
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium transition hover:opacity-70"
              style={{ color: palette.primary }}
            >
              Se connecter
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
                Rejoignez l'aventure
              </h2>
              <p className="text-white/70 text-sm max-w-xs">
                Créez votre compte et partez à la découverte du Maroc
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
