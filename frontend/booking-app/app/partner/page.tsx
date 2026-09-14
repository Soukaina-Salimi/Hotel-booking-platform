// app/partner/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Shield,
  Zap,
  BarChart3,
  Smartphone,
  Clock,
  Gift,
  Award,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Play,
  Sparkles,
  Building2,
  Wallet,
  Globe,
  Headphones,
  BadgeCheck,
  ArrowUpRight,
  Sparkle,
  Crown,
  Gem,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";

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

// Footer links
const footerLinks = {
  destinations: [
    "Marrakech",
    "Agadir",
    "Chefchaouen",
    "Fès",
    "Essaouira",
    "Tanger",
  ],
  informations: [
    "À propos",
    "Carrières",
    "Conditions générales",
    "Confidentialité",
    "FAQ",
  ],
  contact: {
    phone: "+212 5 22 123 456",
    email: "contact@dariwane.ma",
    address: "Casablanca, Maroc",
  },
};

// Statistiques
const stats = [
  { value: "150+", label: "Hôtels partenaires" },
  { value: "12k+", label: "Réservations" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "4.9/5", label: "Note moyenne" },
];

// Avantages
const benefits = [
  {
    icon: <TrendingUp size={24} />,
    title: "Augmentez votre visibilité",
    description:
      "Soyez visible par des milliers de voyageurs chaque mois sur notre plateforme.",
  },
  {
    icon: <Users size={24} />,
    title: "Attirez de nouveaux clients",
    description:
      "Accédez à une clientèle nationale et internationale en recherche d'authenticité.",
  },
  {
    icon: <Calendar size={24} />,
    title: "Gestion simplifiée",
    description:
      "Tableau de bord intuitif pour gérer vos réservations en temps réel.",
  },
  {
    icon: <Shield size={24} />,
    title: "Paiements sécurisés",
    description:
      "Transactions sécurisées et virements automatiques après chaque séjour.",
  },
  {
    icon: <Zap size={24} />,
    title: "Réservation instantanée",
    description:
      "Les clients réservent en quelques clics, vous recevez une confirmation immédiate.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Statistiques détaillées",
    description:
      "Analysez vos performances, taux d'occupation et revenus en temps réel.",
  },
];

// Témoignages
const testimonials = [
  {
    name: "Mohammed El Fassi",
    hotel: "Royal Mansour",
    location: "Marrakech",
    avatar: "MF",
    text: "Dariwane nous a permis d'augmenter notre visibilité de 40%. La plateforme est intuitive et le support est réactif.",
    rating: 5,
  },
  {
    name: "Fatima Zahra",
    hotel: "Riad Dar El Kebira",
    location: "Chefchaouen",
    avatar: "FZ",
    text: "Grâce à Dariwane, nous avons accueilli des voyageurs du monde entier. Notre taux d'occupation a doublé !",
    rating: 5,
  },
  {
    name: "Karim Benjelloun",
    hotel: "Palais Faraj",
    location: "Fès",
    avatar: "KB",
    text: "La plateforme est parfaite pour les hôtels de charme. La commission est raisonnable et les paiements sont rapides.",
    rating: 5,
  },
];

// Fonctionnalités
const features = [
  {
    icon: <Smartphone size={20} />,
    label: "Application mobile",
    description: "Gérez vos réservations depuis votre smartphone",
  },
  {
    icon: <Clock size={20} />,
    label: "Disponibilité temps réel",
    description: "Mettez à jour vos disponibilités en temps réel",
  },
  {
    icon: <Gift size={20} />,
    label: "Offres promotionnelles",
    description: "Créez des offres spéciales pour attirer plus de clients",
  },
  {
    icon: <Award size={20} />,
    label: "Certification qualité",
    description: "Obtenez un label de qualité pour votre établissement",
  },
];

export default function PartnerPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>

      <Navbar isAuthenticated={false} userRole="guest" userName="" />

      {/* Hero Section */}
      <section
        className="relative pt-20 overflow-hidden"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#E9B883] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FDFDFD] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#DED9D0] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={16} className="text-[#E9B883]" />
              <span className="text-white/90 text-sm font-medium">
                🚀 Rejoignez la révolution de l'hôtellerie
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-6">
              Devenez partenaire
              <span className="block text-[#E9B883]">
                et boostez votre hôtel
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Rejoignez la première plateforme de réservation hôtelière au
              Maroc. Augmentez votre visibilité, simplifiez votre gestion et
              attirez de nouveaux clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/partner/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition hover:opacity-90"
                style={{ backgroundColor: palette.brown }}
              >
                Commencer maintenant
                <ArrowRight size={20} />
              </Link>
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/10 transition">
                <Play size={20} />
                Voir la démo
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
              <span className="flex items-center gap-1">
                <BadgeCheck size={16} className="text-[#E9B883]" />
                Inscription gratuite
              </span>
              <span className="w-px h-4 bg-white/20"></span>
              <span className="flex items-center gap-1">
                <Shield size={16} className="text-[#E9B883]" />
                Sans engagement
              </span>
              <span className="w-px h-4 bg-white/20"></span>
              <span className="flex items-center gap-1">
                <Zap size={16} className="text-[#E9B883]" />
                Mise en ligne rapide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#FDFDFD] border-b border-[#DED9D0]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: palette.primary }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: palette.gray }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi devenir partenaire */}
      <section className="py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
              Avantages
            </span>
            <h2
              className="font-display text-3xl md:text-4xl mt-2"
              style={{ color: palette.dark }}
            >
              Pourquoi rejoindre{" "}
              <span style={{ color: palette.primary }}>Dariwane</span>
            </h2>
            <p
              className="text-sm mt-2 max-w-2xl mx-auto"
              style={{ color: palette.gray }}
            >
              Découvrez tous les bénéfices de devenir partenaire hôtelier sur
              notre plateforme
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#DED9D0]/20 rounded-2xl p-6 hover:shadow-lg transition border border-[#DED9D0] hover:border-[#7F9BA9]/30 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition"
                  style={{
                    backgroundColor: palette.primary + "20",
                    color: palette.primary,
                  }}
                >
                  {benefit.icon}
                </div>
                <h3
                  className="font-display text-lg"
                  style={{ color: palette.dark }}
                >
                  {benefit.title}
                </h3>
                <p className="text-sm mt-1" style={{ color: palette.gray }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16" style={{ backgroundColor: palette.cream }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
              Fonctionnalités
            </span>
            <h2
              className="font-display text-3xl md:text-4xl mt-2"
              style={{ color: palette.dark }}
            >
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-[#FDFDFD] rounded-xl p-4 shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: palette.primary + "10",
                    color: palette.primary,
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h4
                    className="font-medium text-sm"
                    style={{ color: palette.dark }}
                  >
                    {feature.label}
                  </h4>
                  <p className="text-xs" style={{ color: palette.gray }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
              Témoignages
            </span>
            <h2
              className="font-display text-3xl md:text-4xl mt-2"
              style={{ color: palette.dark }}
            >
              Ils nous font{" "}
              <span style={{ color: palette.primary }}>confiance</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#DED9D0]/20 rounded-2xl p-6 border border-[#DED9D0]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: palette.dark }}
                    >
                      {testimonial.name}
                    </p>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {testimonial.hotel} · {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={palette.sand}
                      color={palette.sand}
                    />
                  ))}
                </div>
                <p className="text-sm italic" style={{ color: palette.gray }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Inscription */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E9B883] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FDFDFD] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Gem size={16} className="text-[#E9B883]" />
            <span className="text-white/90 text-sm font-medium">
              Offre spéciale
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl text-white mb-4">
            Prêt à <span className="text-[#E9B883]">développer</span> votre
            hôtel ?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Rejoignez Dariwane dès maintenant et bénéficiez d'un accompagnement
            personnalisé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partner/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[#3B2E22] font-semibold text-lg transition hover:opacity-90"
              style={{ backgroundColor: palette.sand }}
            >
              Devenir partenaire
              <ArrowUpRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/10 transition"
            >
              Nous contacter
            </Link>
          </div>

          {/* Newsletter */}
          <div className="mt-8 max-w-md mx-auto">
            {isSubscribed ? (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-3 text-white">
                ✅ Merci ! Vous recevrez nos actualités.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#E9B883]"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#FDFDFD] text-[#7F9BA9] font-medium hover:opacity-90 transition"
                >
                  Restez informé
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: palette.dark }}>
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="font-display text-xl text-white">
                Dar<span style={{ color: palette.sand }}>iwane</span>
              </span>
              <p className="text-sm mt-2" style={{ color: palette.cream }}>
                Votre plateforme de réservation hôtelière au Maroc.
              </p>
              <div className="flex gap-3 mt-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer hover:scale-110"
                  style={{ backgroundColor: palette.primaryDark }}
                >
                  <FaFacebookF size={16} color={palette.white} />
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer hover:scale-110"
                  style={{ backgroundColor: palette.primaryDark }}
                >
                  <FaInstagram size={16} color={palette.white} />
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer hover:scale-110"
                  style={{ backgroundColor: palette.primaryDark }}
                >
                  <FaTwitter size={16} color={palette.white} />
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer hover:scale-110"
                  style={{ backgroundColor: palette.primaryDark }}
                >
                  <FaYoutube size={16} color={palette.white} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-display text-white text-sm mb-4">
                Destinations
              </h4>
              <ul
                className="space-y-2 text-sm"
                style={{ color: palette.cream }}
              >
                {footerLinks.destinations.slice(0, 4).map((dest) => (
                  <li key={dest}>
                    <a
                      href="#"
                      className="hover:text-[#E9B883] transition flex items-center gap-1"
                    >
                      <ChevronRight size={12} className="text-[#E9B883]" />
                      {dest}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-white text-sm mb-4">
                Informations
              </h4>
              <ul
                className="space-y-2 text-sm"
                style={{ color: palette.cream }}
              >
                {footerLinks.informations.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-[#E9B883] transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display text-white text-sm mb-4">Contact</h4>
              <ul
                className="space-y-3 text-sm"
                style={{ color: palette.cream }}
              >
                <li className="flex items-center gap-2">
                  <Phone size={16} color={palette.sand} />
                  {footerLinks.contact.phone}
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} color={palette.sand} />
                  {footerLinks.contact.email}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} color={palette.sand} />
                  {footerLinks.contact.address}
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div
              className="flex items-center gap-4 text-xs"
              style={{ color: palette.cream }}
            >
              <a href="#" className="hover:text-white transition">
                Conditions générales
              </a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-white transition">
                Confidentialité
              </a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-white transition">
                Cookies
              </a>
            </div>
            <div className="text-xs" style={{ color: palette.cream }}>
              © 2026 Dariwane. Tous droits réservés.
              <span className="inline-block ml-1">❤️</span>
              <span className="ml-1">Made in Morocco</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
