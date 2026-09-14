// app/destinations/[id]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  Search,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  Heart,
  Share2,
  Calendar,
  Users,
  Thermometer,
  Sun,
  Cloud,
  Umbrella,
  Wind,
  Mountain,
  Waves,
  TreePine,
  Compass,
  Sparkles,
  Award,
  Shield,
  Clock,
  CheckCircle,
  Filter,
  Grid3x3,
  List,
  X,
  ChevronDown,
  Wifi,
  Coffee,
  Utensils,
  Dumbbell,
  Car,
  Tv,
  Bed,
  Maximize,
  Building2,
  Home,
  Camera,
  Map,
  Navigation,
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

// Données de la destination
const destinationData = {
  id: 1,
  name: "Marrakech",
  country: "Maroc",
  description:
    "La ville rouge, célèbre pour ses souks, ses palais et ses jardins luxuriants",
  longDescription:
    "Marrakech, surnommée la ville rouge, est une destination incontournable du Maroc. Fondée au XIe siècle, elle est connue pour ses souks animés, ses palais majestueux et ses jardins luxuriants. La médina, classée au patrimoine mondial de l'UNESCO, est un labyrinthe de ruelles colorées où se mêlent artisans, marchands et voyageurs. La célèbre place Jemaa El-Fna s'anime chaque soir avec ses conteurs, musiciens et vendeurs de rue, offrant une expérience unique et authentique.",
  image: "/images/destinations/marrakech.jpg",
  heroImage: "/images/destinations/marrakech-hero-2.jpg",
  icon: "🏛️",
  rating: 4.9,
  hotelsCount: 128, // Renommé pour éviter la confusion
  price: "450 MAD",
  temp: "28°C",
  season: "Toute l'année",
  tags: ["Médina", "Souks", "Riads", "Palais", "Jardins", "Culture"],
  featured: true,
  bestTime: "Mars à Mai et Septembre à Novembre",
  language: "Arabe, Français, Anglais",
  currency: "MAD",
  timezone: "UTC+1",
  attractions: [
    {
      name: "Place Jemaa El-Fna",
      icon: "🕌",
      description: "Cœur battant de la ville",
    },
    {
      name: "Jardins Majorelle",
      icon: "🌿",
      description: "Jardin botanique et artistique",
    },
    {
      name: "Palais de la Bahia",
      icon: "🏛️",
      description: "Palais du XIXe siècle",
    },
    {
      name: "Médina",
      icon: "🏘️",
      description: "Centre historique classé UNESCO",
    },
    {
      name: "Mosquée Koutoubia",
      icon: "🕌",
      description: "Plus grande mosquée de Marrakech",
    },
    { name: "Souks", icon: "🛍️", description: "Marchés traditionnels" },
  ],
  hotels: [
    {
      id: 1,
      name: "Royal Mansour",
      location: "Marrakech",
      price: 1200,
      rating: 4.9,
      reviews: 342,
      image: "/images/hotels/royal-mansour.jpg",
      description: "Palais royal au cœur de la médina",
      amenities: ["Spa", "Piscine", "Restaurant", "Jardin"],
      badge: "Luxe",
    },
    {
      id: 2,
      name: "La Mamounia",
      location: "Marrakech",
      price: 980,
      rating: 4.8,
      reviews: 287,
      image: "/images/hotels/la-mamounia.jpg",
      description: "Jardin millénaire et élégance intemporelle",
      amenities: ["Spa", "Piscine", "Jardin", "Terrasse"],
      badge: "Iconique",
    },
    {
      id: 3,
      name: "Palais Medina",
      location: "Marrakech",
      price: 1100,
      rating: 4.8,
      reviews: 234,
      image: "/images/hotels/palais-medina.jpg",
      description: "Palais moderne avec piscine à débordement",
      amenities: ["Spa", "Piscine", "Restaurant", "Jardin"],
      badge: "Moderne",
    },
  ],
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

export default function DestinationDetailPage() {
  const params = useParams();
  const destinationId = params.id;
  const destination = destinationData;

  const [activeTab, setActiveTab] = useState("hotels");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les hôtels
  const filteredHotels = destination.hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
      <section className="relative pt-20">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <Image
            src={destination.heroImage || destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/80 via-[#3B2E22]/40 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-24 md:top-28 left-3 md:left-8 flex flex-wrap gap-2">
            <span
              className="text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full"
              style={{ backgroundColor: palette.sand }}
            >
              ⭐ Coup de cœur
            </span>
            <span
              className="text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full"
              style={{ backgroundColor: palette.primary }}
            >
              🏛️ Patrimoine UNESCO
            </span>
          </div>

          {/* Actions */}
          <div className="absolute top-24 md:top-28 right-3 md:right-8 flex gap-2">
            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition text-white">
              <Heart size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition text-white">
              <Share2 size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>

          {/* Informations */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-xs md:text-sm text-white/80 hover:text-white transition mb-2 md:mb-4"
            >
              <ChevronRight size={14} className="rotate-180" />
              Retour aux destinations
            </Link>
            <h1 className="font-display text-3xl md:text-5xl mb-2">
              {destination.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="md:w-4 md:h-4" />
                {destination.country}
              </span>
              <span className="flex items-center gap-1">
                <Star
                  size={14}
                  fill={palette.sand}
                  color={palette.sand}
                  className="md:w-4 md:h-4"
                />
                {destination.rating} ({destination.hotelsCount} hôtels)
              </span>
              <span className="flex items-center gap-1">
                <Thermometer size={14} className="md:w-4 md:h-4" />
                {destination.temp}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
              <h2
                className="font-display text-xl md:text-2xl mb-3 md:mb-4"
                style={{ color: palette.dark }}
              >
                À propos de {destination.name}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: palette.gray }}
              >
                {destination.longDescription}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {destination.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded-full bg-[#7F9BA9]/10 text-[#7F9BA9]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Informations pratiques */}
            <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
              <h2
                className="font-display text-xl md:text-2xl mb-3 md:mb-4"
                style={{ color: palette.dark }}
              >
                Informations pratiques
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-[#DED9D0]/20 rounded-xl p-3 text-center">
                  <span className="text-2xl block mb-1">🌤️</span>
                  <p
                    className="text-xs font-medium"
                    style={{ color: palette.dark }}
                  >
                    Meilleure période
                  </p>
                  <p className="text-xs" style={{ color: palette.gray }}>
                    {destination.bestTime}
                  </p>
                </div>
                <div className="bg-[#DED9D0]/20 rounded-xl p-3 text-center">
                  <span className="text-2xl block mb-1">🗣️</span>
                  <p
                    className="text-xs font-medium"
                    style={{ color: palette.dark }}
                  >
                    Langues
                  </p>
                  <p className="text-xs" style={{ color: palette.gray }}>
                    {destination.language}
                  </p>
                </div>
                <div className="bg-[#DED9D0]/20 rounded-xl p-3 text-center">
                  <span className="text-2xl block mb-1">💰</span>
                  <p
                    className="text-xs font-medium"
                    style={{ color: palette.dark }}
                  >
                    Monnaie
                  </p>
                  <p className="text-xs" style={{ color: palette.gray }}>
                    {destination.currency}
                  </p>
                </div>
              </div>
            </section>

            {/* Attractions */}
            <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
              <h2
                className="font-display text-xl md:text-2xl mb-3 md:mb-4"
                style={{ color: palette.dark }}
              >
                Attractions incontournables
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {destination.attractions.map((attraction, index) => (
                  <div
                    key={index}
                    className="bg-[#DED9D0]/20 rounded-xl p-3 text-center hover:shadow-md transition cursor-pointer"
                  >
                    <span className="text-2xl block mb-1">
                      {attraction.icon}
                    </span>
                    <p
                      className="text-xs font-medium"
                      style={{ color: palette.dark }}
                    >
                      {attraction.name}
                    </p>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {attraction.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Hôtels */}
            <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h2
                  className="font-display text-xl md:text-2xl"
                  style={{ color: palette.dark }}
                >
                  Hôtels à {destination.name}
                </h2>
                <div className="relative w-full sm:w-48">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: palette.gray }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm focus:outline-none"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                      color: palette.dark,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <Link
                    key={hotel.id}
                    href={`/hotels/${hotel.id}`}
                    className="block border rounded-xl p-4 hover:shadow-md transition border-[#DED9D0] hover:border-[#7F9BA9]/30"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-40 h-32 rounded-lg overflow-hidden">
                        <Image
                          src={hotel.image}
                          alt={hotel.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                className="font-display text-lg"
                                style={{ color: palette.dark }}
                              >
                                {hotel.name}
                              </h3>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: palette.primary }}
                              >
                                {hotel.badge}
                              </span>
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: palette.gray }}
                            >
                              {hotel.description}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <span
                              className="text-xl font-bold"
                              style={{ color: palette.primary }}
                            >
                              {hotel.price}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: palette.gray }}
                            >
                              {" "}
                              MAD
                            </span>
                            <p
                              className="text-xs"
                              style={{ color: palette.gray }}
                            >
                              par nuit
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className="flex items-center gap-1 text-xs"
                            style={{ color: palette.gray }}
                          >
                            <Star
                              size={12}
                              fill={palette.sand}
                              color={palette.sand}
                            />
                            {hotel.rating} ({hotel.reviews} avis)
                          </span>
                          <span
                            className="w-px h-3"
                            style={{ backgroundColor: palette.cream }}
                          ></span>
                          <div className="flex flex-wrap gap-1">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: palette.cream,
                                  color: palette.dark,
                                }}
                              >
                                {amenity}
                              </span>
                            ))}
                            {hotel.amenities.length > 3 && (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: palette.cream,
                                  color: palette.gray,
                                }}
                              >
                                +{hotel.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="mt-3 px-4 py-1.5 rounded-lg text-white text-sm font-medium transition hover:opacity-90"
                          style={{ backgroundColor: palette.brown }}
                        >
                          Voir l'hôtel
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href={`/hotels?destination=${destination.name}`}
                className="mt-4 w-full py-2.5 rounded-xl border-2 font-medium text-sm transition hover:opacity-70 flex items-center justify-center gap-2"
                style={{ borderColor: palette.primary, color: palette.primary }}
              >
                Voir tous les hôtels à {destination.name}
                <ArrowRight size={16} />
              </Link>
            </section>
          </div>

          {/* Colonne droite - Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Carte de résumé */}
            <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm sticky top-24">
              <h3
                className="font-display text-lg mb-4"
                style={{ color: palette.dark }}
              >
                {destination.name} en bref
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: palette.gray }}>⭐ Note</span>
                  <span className="font-medium" style={{ color: palette.dark }}>
                    {destination.rating}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: palette.gray }}>🏨 Hôtels</span>
                  <span className="font-medium" style={{ color: palette.dark }}>
                    {destination.hotelsCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: palette.gray }}>🌡️ Température</span>
                  <span className="font-medium" style={{ color: palette.dark }}>
                    {destination.temp}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: palette.gray }}>📅 Saison</span>
                  <span className="font-medium" style={{ color: palette.dark }}>
                    {destination.season}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: palette.gray }}>💰 Prix moyen</span>
                  <span className="font-medium" style={{ color: palette.dark }}>
                    {destination.price}
                  </span>
                </div>
              </div>

              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: palette.cream }}
              >
                <Link
                  href={`/hotels?destination=${destination.name}`}
                  className="w-full py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: palette.primary }}
                >
                  <Search size={16} />
                  Rechercher un hôtel
                </Link>
              </div>

              <div
                className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs"
                style={{ color: palette.gray }}
              >
                <span className="flex items-center gap-1">
                  <Shield size={12} style={{ color: palette.primary }} />
                  Paiement sécurisé
                </span>
                <span
                  className="w-px h-3"
                  style={{ backgroundColor: palette.cream }}
                ></span>
                <span className="flex items-center gap-1">
                  <CheckCircle size={12} style={{ color: "#22C55E" }} />
                  Réservation instantanée
                </span>
              </div>
            </div>

            {/* Météo */}
            <div className="bg-[#FDFDFD] rounded-2xl p-4 shadow-sm">
              <h4
                className="font-medium text-sm mb-3"
                style={{ color: palette.dark }}
              >
                🌤️ Météo
              </h4>
              <div className="flex items-center gap-4">
                <div className="text-4xl">☀️</div>
                <div>
                  <div
                    className="text-xl font-bold"
                    style={{ color: palette.dark }}
                  >
                    {destination.temp}
                  </div>
                  <div className="text-xs" style={{ color: palette.gray }}>
                    Ensoleillé
                  </div>
                </div>
              </div>
              <div
                className="grid grid-cols-4 gap-1 mt-3 text-center text-xs"
                style={{ color: palette.gray }}
              >
                <div>
                  <span>☀️</span>
                  <p>Lun</p>
                  <p>28°</p>
                </div>
                <div>
                  <span>⛅</span>
                  <p>Mar</p>
                  <p>26°</p>
                </div>
                <div>
                  <span>☀️</span>
                  <p>Mer</p>
                  <p>29°</p>
                </div>
                <div>
                  <span>🌤️</span>
                  <p>Jeu</p>
                  <p>27°</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
