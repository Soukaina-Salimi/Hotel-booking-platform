// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Star,
  ShieldCheck,
  Wallet,
  Phone,
  Mail,
  ChevronRight,
  Home,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import Image from "next/image";
import Navbar from "@/components/Navbar"; // Import du navbar isolé

const palette = {
  primary: "#7F9BA9",
  primaryDark: "#647C87",
  background: "#7F9BA9",
  white: "#FDFDFD",
  cream: "#DED9D0",
  sand: "#E9B883",
  wood: "#A2836D",
  brown: "#7A5237",
  dark: "#3B2E22",
  gray: "#595B57",
};

const destinations = [
  { city: "Marrakech", count: "128 hebergements", tag: "Medina & riads" },
  { city: "Agadir", count: "94 hebergements", tag: "Plages & resorts" },
  { city: "Chefchaouen", count: "41 hebergements", tag: "Ville bleue" },
  { city: "Fes", count: "76 hebergements", tag: "Patrimoine" },
];

const popularHotels = [
  {
    name: "Royal Mansour",
    location: "Marrakech",
    price: "1 200",
    rating: 4.9,
    reviews: 342,
    description: "Palais royal au cœur de la médina",
    amenities: ["Spa", "Piscine", "Restaurant", "Jardin"],
    badge: "Luxe",
    image: "/images/hotels/royal-mansour2.jpg",
  },
  {
    name: "La Mamounia",
    location: "Marrakech",
    price: "980",
    rating: 4.8,
    reviews: 287,
    description: "Jardin millénaire et élégance intemporelle",
    amenities: ["Spa", "Piscine", "Jardin", "Terrasse"],
    badge: "Iconique",
    image: "/images/hotels/la-mamounia.jpg",
  },
  {
    name: "Palais Faraj",
    location: "Fès",
    price: "750",
    rating: 4.7,
    reviews: 195,
    description: "Vue panoramique sur la médina",
    amenities: ["Spa", "Restaurant", "Vue", "Terrasse"],
    badge: "Authentique",
    image: "/images/hotels/palais-faraj.jpg",
  },
  {
    name: "Le Jardin des Douars",
    location: "Essaouira",
    price: "680",
    rating: 4.6,
    reviews: 163,
    description: "Écrin de verdure près de l'océan",
    amenities: ["Piscine", "Jardin", "Terrasse", "Wi-Fi"],
    badge: "Nature",
    image: "/images/hotels/jardin-des-douars.jpg",
  },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Paiement securise",
    text: "CIB, carte bancaire ou virement, avec confirmation immediate.",
  },
  {
    icon: Wallet,
    title: "Meilleur prix garanti",
    text: "Comparez les tarifs directement aupres des hotels partenaires.",
  },
  {
    icon: Star,
    title: "Avis verifies",
    text: "Seuls les clients ayant reellement sejourne peuvent noter un hotel.",
  },
];

function ArchFrame({ className = "", children }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ borderRadius: "999px 999px 12px 12px" }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 voyageurs");

  // État pour l'authentification (à connecter avec votre système d'auth)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("guest");
  const [userName, setUserName] = useState("");

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

  return (
    <div
      style={{
        backgroundColor: palette.white,
        fontFamily: "'Work Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      {/* Navbar - Appel du composant isolé */}
      <Navbar
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        userName={userName}
      />

      {/* Hero */}
      <section
        className="relative pt-20 md:pt-28"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-24 md:pt-14 md:pb-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm mb-4" style={{ color: palette.dark }}>
              Reservation d'hotels au Maroc
            </p>
            <h1
              className="font-display text-3xl md:text-5xl leading-tight mb-6"
              style={{ color: palette.dark }}
            >
              Trouvez votre prochain sejour, du riad de Marrakech au resort
              d'Agadir.
            </h1>
            <p
              className="text-sm md:text-base max-w-md"
              style={{ color: "#2E2419" }}
            >
              Des centaines d'hebergements verifies, une reservation en quelques
              clics et un paiement securise, pense pour le voyageur marocain.
            </p>
          </div>

          <div className="relative hidden md:block" style={{ height: "340px" }}>
            <ArchFrame className="absolute right-0 top-0 w-64 h-full">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(/images/zlij.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </ArchFrame>
            <ArchFrame
              className="absolute left-0 bottom-0 w-40"
              style={{ height: "220px" }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(180deg, ${palette.cream}, ${palette.sand})`,
                }}
              />
            </ArchFrame>
          </div>
        </div>

        {/* Search card, overlapping into next section */}
        <div className="max-w-5xl mx-auto px-4 absolute left-0 right-0 -bottom-12 md:-bottom-16">
          <div
            className="rounded-2xl shadow-lg p-4 md:p-5 grid md:grid-cols-[2fr_1.2fr_1.2fr_1fr_auto] gap-3 items-stretch"
            style={{ backgroundColor: palette.white }}
          >
            <label
              className="flex items-center gap-2 px-3 py-3 rounded-xl"
              style={{ backgroundColor: palette.cream }}
            >
              <MapPin size={18} color={palette.brown} />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ville ou hotel"
                className="bg-transparent outline-none w-full text-sm"
                style={{ color: palette.dark }}
              />
            </label>
            <label
              className="flex items-center gap-2 px-3 py-3 rounded-xl"
              style={{ backgroundColor: palette.cream }}
            >
              <Calendar size={18} color={palette.brown} />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
                style={{ color: palette.dark }}
              />
            </label>
            <label
              className="flex items-center gap-2 px-3 py-3 rounded-xl"
              style={{ backgroundColor: palette.cream }}
            >
              <Calendar size={18} color={palette.brown} />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
                style={{ color: palette.dark }}
              />
            </label>
            <label
              className="flex items-center gap-2 px-3 py-3 rounded-xl"
              style={{ backgroundColor: palette.cream }}
            >
              <Users size={18} color={palette.brown} />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
                style={{ color: palette.dark }}
              >
                <option>1 voyageur</option>
                <option>2 voyageurs</option>
                <option>3 voyageurs</option>
                <option>4+ voyageurs</option>
              </select>
            </label>
            <button
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-white text-sm font-medium transition hover:opacity-90"
              style={{ backgroundColor: palette.brown }}
            >
              <Search size={16} />
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-6xl mx-auto px-4 pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
            Destinations populaires
          </h2>
          <a
            href="/destinations"
            className="text-sm flex items-center gap-1 hover:opacity-70 transition"
            style={{ color: palette.brown }}
          >
            Voir tout <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {destinations.map((d, i) => (
            <div key={d.city} className="group cursor-pointer">
              <ArchFrame className="w-full h-32 md:h-40 mb-3 overflow-hidden">
                <div
                  className="w-full h-full relative bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(/images/destinations/${d.city.toLowerCase()}.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay dégradé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/70 via-[#3B2E22]/20 to-transparent"></div>

                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white font-display text-sm md:text-base drop-shadow-md">
                      {d.city}
                    </span>
                    <span className="block text-white/70 text-xs drop-shadow-md">
                      {d.tag}
                    </span>
                  </div>

                  {/* Effet de survol */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E9B883]/50 transition-all duration-300 rounded-[999px_999px_12px_12px]"></div>
                </div>
              </ArchFrame>
              <p
                className="font-display text-base md:text-lg"
                style={{ color: palette.dark }}
              >
                {d.city}
              </p>
              <p className="text-xs md:text-sm" style={{ color: palette.gray }}>
                {d.tag} · {d.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hôtels populaires */}
      <section
        style={{ backgroundColor: palette.cream }}
        className="py-12 md:py-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Home size={18} color={palette.brown} />
                <h2
                  className="font-display text-2xl"
                  style={{ color: palette.dark }}
                >
                  Hôtels populaires
                </h2>
              </div>
              <p className="text-sm" style={{ color: palette.gray }}>
                Les établissements les plus recherchés
              </p>
            </div>
            <a
              href="/hotels"
              className="text-sm flex items-center gap-1 hover:opacity-70 transition"
              style={{ color: palette.brown }}
            >
              Voir tout <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popularHotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-[#DED9D0] to-[#7F9BA9]/20">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                    priority={index < 2}
                  />
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-white text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    >
                      {hotel.badge}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-[#FDFDFD]/90 px-2.5 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
                    <Star size={14} fill={palette.sand} color={palette.sand} />
                    <span style={{ color: palette.dark }}>{hotel.rating}</span>
                    <span style={{ color: palette.gray }} className="text-xs">
                      ({hotel.reviews})
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className="font-display text-lg"
                    style={{ color: palette.dark }}
                  >
                    {hotel.name}
                  </h3>
                  <p
                    className="text-sm flex items-center gap-1"
                    style={{ color: palette.gray }}
                  >
                    <MapPin size={14} color={palette.primary} />
                    {hotel.location}
                  </p>
                  <p className="text-xs mt-1" style={{ color: palette.gray }}>
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hotel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: palette.cream,
                          color: palette.dark,
                        }}
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Price & Button */}
                  <div
                    className="mt-4 flex items-center justify-between pt-3 border-t"
                    style={{ borderColor: palette.cream }}
                  >
                    <div>
                      <span
                        className="text-xl font-bold"
                        style={{ color: palette.primary }}
                      >
                        {hotel.price}
                      </span>
                      <span className="text-xs" style={{ color: palette.gray }}>
                        {" "}
                        MAD
                      </span>
                    </div>
                    <button
                      className="px-4 py-1.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
                      style={{ backgroundColor: palette.brown }}
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section style={{ backgroundColor: palette.cream }}>
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-3 gap-8">
          {trustPoints.map((t) => (
            <div key={t.title}>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: palette.white }}
              >
                <t.icon size={20} color={palette.brown} />
              </div>
              <p
                className="font-display text-lg mb-1"
                style={{ color: palette.dark }}
              >
                {t.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: palette.gray }}
              >
                {t.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA hotel partners */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3
            className="font-display text-2xl md:text-3xl mb-4"
            style={{ color: palette.dark }}
          >
            Vous gerez un hotel ?
          </h3>
          <p
            className="text-sm md:text-base mb-6 max-w-md"
            style={{ color: palette.gray }}
          >
            Creez votre espace, publiez vos chambres et vos tarifs, et suivez
            vos reservations depuis un tableau de bord pense pour les hoteliers.
          </p>
          <a
            href="/partner"
            className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-white text-sm transition hover:opacity-90"
            style={{ backgroundColor: palette.primaryDark }}
          >
            Referencer mon hotel <ArrowRight size={16} />
          </a>
        </div>
        <ArchFrame className="w-full h-48 md:h-56">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(/images/management.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </ArchFrame>
      </section>

      {/* Footer complet */}
      <footer style={{ backgroundColor: palette.dark }}>
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            {/* Brand */}
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

            {/* Destinations */}
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

            {/* Informations */}
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

            {/* Contact */}
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

          {/* Bottom bar */}
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
