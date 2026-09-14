// app/about/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  Heart,
  Users,
  Award,
  Shield,
  Clock,
  CheckCircle,
  Sparkles,
  Compass,
  Globe,
  Building2,
  Home,
  Camera,
  Map,
  Navigation,
  Coffee,
  Utensils,
  Dumbbell,
  Car,
  Tv,
  Bed,
  Maximize,
  Wifi,
  Waves,
  TreePine,
  Mountain,
  Sun,
  Cloud,
  Umbrella,
  Wind,
  Calendar,
  User,
  Briefcase,
  GraduationCap,
  Target,
  Eye,
  MessageCircle,
  Headphones,
  Zap,
  Gem,
  Crown,
  Leaf,
  HeartHandshake,
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

// Données des valeurs
const values = [
  {
    icon: <Heart size={24} />,
    title: "Passion",
    description:
      "Nous sommes animés par la passion de faire découvrir le Maroc et son art de vivre.",
  },
  {
    icon: <Shield size={24} />,
    title: "Confiance",
    description:
      "La transparence et la sécurité sont au cœur de nos relations avec les voyageurs.",
  },
  {
    icon: <Award size={24} />,
    title: "Excellence",
    description:
      "Nous sélectionnons avec soin chaque établissement pour garantir une qualité irréprochable.",
  },
  {
    icon: <Users size={24} />,
    title: "Proximité",
    description:
      "Une équipe dédiée à votre écoute pour vous accompagner à chaque étape.",
  },
];

// Données de l'équipe
const team = [
  {
    name: "Ahmed Benali",
    role: "CEO & Fondateur",
    avatar: "AB",
    description:
      "Passionné par l'hôtellerie marocaine, il a fondé Dariwane pour valoriser le patrimoine du Maroc.",
  },
  {
    name: "Fatima Zahra",
    role: "Directrice des opérations",
    avatar: "FZ",
    description:
      "Experte en gestion hôtelière, elle veille à la qualité de chaque séjour.",
  },
  {
    name: "Karim El Fassi",
    role: "Responsable partenariats",
    avatar: "KE",
    description:
      "Il tisse des liens avec les meilleurs établissements du Maroc.",
  },
  {
    name: "Sofia Mansour",
    role: "Responsable marketing",
    avatar: "SM",
    description:
      "Elle fait rayonner la beauté du Maroc à travers nos communications.",
  },
];

// Données des statistiques
const stats = [
  { value: "150+", label: "Hôtels partenaires", icon: <Building2 size={20} /> },
  { value: "12k+", label: "Réservations", icon: <Calendar size={20} /> },
  { value: "98%", label: "Satisfaction client", icon: <Star size={20} /> },
  { value: "24/7", label: "Support client", icon: <Headphones size={20} /> },
];

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

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
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
                Qui sommes-nous ?
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-6">
              L'art de vivre à la{" "}
              <span className="text-[#E9B883]">marocaine</span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Dariwane est une plateforme de réservation hôtelière qui met en
              lumière les plus beaux établissements du Maroc.
            </p>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
                Notre histoire
              </span>
              <h2
                className="font-display text-3xl md:text-4xl mt-2 mb-4"
                style={{ color: palette.dark }}
              >
                Une passion pour le{" "}
                <span className="text-[#E9B883]">Maroc</span>
              </h2>
              <div
                className="space-y-4 text-sm"
                style={{ color: palette.gray }}
              >
                <p>
                  Dariwane est né d'une passion pour le Maroc et son art de
                  vivre. Fondée par des amoureux de ce pays, notre plateforme a
                  pour mission de faire découvrir les trésors cachés du royaume
                  à travers une sélection d'établissements d'exception.
                </p>
                <p>
                  Chaque hôtel, riad ou maison d'hôtes que nous proposons a été
                  choisi avec soin pour son authenticité, son charme et la
                  qualité de son service. Nous croyons que chaque voyage est une
                  histoire unique et nous nous engageons à la rendre
                  inoubliable.
                </p>
                <p>
                  Aujourd'hui, Dariwane c'est plus de 150 établissements
                  partenaires à travers le Maroc, des milliers de voyageurs
                  satisfaits et une équipe passionnée qui travaille chaque jour
                  pour vous offrir le meilleur du Maroc.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <div
                  className="absolute inset-0 flex items-center justify-center text-8xl opacity-20"
                  style={{ color: palette.primary }}
                >
                  🏛️
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: palette.primary }}
                    >
                      <span className="text-white font-display text-lg">د</span>
                    </div>
                    <div>
                      <p
                        className="font-display text-lg"
                        style={{ color: palette.dark }}
                      >
                        Dar<span style={{ color: palette.brown }}>iwane</span>
                      </p>
                      <p className="text-xs" style={{ color: palette.gray }}>
                        Depuis 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16" style={{ backgroundColor: palette.cream }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
              Chiffres clés
            </span>
            <h2
              className="font-display text-3xl md:text-4xl mt-2"
              style={{ color: palette.dark }}
            >
              Dariwane en{" "}
              <span className="text-[#E9B883]">quelques chiffres</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#FDFDFD] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{
                    backgroundColor: palette.primary + "20",
                    color: palette.primary,
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  className="font-display text-3xl font-bold"
                  style={{ color: palette.primary }}
                >
                  {stat.value}
                </div>
                <div className="text-sm mt-1" style={{ color: palette.gray }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
              Nos valeurs
            </span>
            <h2
              className="font-display text-3xl md:text-4xl mt-2"
              style={{ color: palette.dark }}
            >
              Ce qui nous <span className="text-[#E9B883]">anime</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[#DED9D0]/20 rounded-2xl p-6 text-center hover:shadow-md transition border border-[#DED9D0] hover:border-[#7F9BA9]/30"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: palette.primary + "20",
                    color: palette.primary,
                  }}
                >
                  {value.icon}
                </div>
                <h3
                  className="font-display text-lg"
                  style={{ color: palette.dark }}
                >
                  {value.title}
                </h3>
                <p className="text-sm mt-2" style={{ color: palette.gray }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre mission */}
      <section className="py-16" style={{ backgroundColor: palette.primary }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Target size={16} className="text-[#E9B883]" />
              <span className="text-white/90 text-sm font-medium">
                Notre mission
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Rendre le Maroc <span className="text-[#E9B883]">accessible</span>{" "}
              à tous
            </h2>

            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Notre mission est de démocratiser l'accès à l'excellence hôtelière
              marocaine en proposant une plateforme simple, sécurisée et
              transparente. Nous souhaitons faire découvrir la richesse et la
              diversité du Maroc à travers ses hébergements, en mettant en avant
              l'authenticité, la qualité et le savoir-faire local.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-[#E9B883]" />
                  <span className="font-medium">Authenticité</span>
                </div>
                <p className="text-sm text-white/70">
                  Des établissements qui racontent une histoire
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-[#E9B883]" />
                  <span className="font-medium">Qualité</span>
                </div>
                <p className="text-sm text-white/70">
                  Une sélection rigoureuse des meilleurs hôtels
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-[#E9B883]" />
                  <span className="font-medium">Accessibilité</span>
                </div>
                <p className="text-sm text-white/70">
                  Des prix transparents et sans surprises
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre équipe */}
      <section className="py-16 bg-[#FDFDFD]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider">
              Notre équipe
            </span>
            <h2
              className="font-display text-3xl md:text-4xl mt-2"
              style={{ color: palette.dark }}
            >
              Des passionnés à votre{" "}
              <span className="text-[#E9B883]">service</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-[#DED9D0]/20 rounded-2xl p-6 text-center hover:shadow-md transition border border-[#DED9D0] hover:border-[#7F9BA9]/30"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4"
                  style={{ backgroundColor: palette.primary }}
                >
                  {member.avatar}
                </div>
                <h3
                  className="font-display text-lg"
                  style={{ color: palette.dark }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-sm font-medium"
                  style={{ color: palette.primary }}
                >
                  {member.role}
                </p>
                <p className="text-sm mt-2" style={{ color: palette.gray }}>
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E9B883] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FDFDFD] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <HeartHandshake size={16} className="text-[#E9B883]" />
            <span className="text-white/90 text-sm font-medium">
              Rejoignez-nous
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            Prêt à <span className="text-[#E9B883]">voyager</span> avec nous ?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Découvrez notre sélection d'hôtels et laissez-vous inspirer par la
            beauté du Maroc.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition hover:opacity-90"
              style={{ backgroundColor: palette.brown }}
            >
              Voir les hôtels
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg border-2 border-white/30 hover:bg-white/10 transition"
            >
              <Compass size={20} />
              Explorer les destinations
            </Link>
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
