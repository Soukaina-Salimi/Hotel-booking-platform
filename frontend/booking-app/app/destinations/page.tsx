// app/destinations/page.tsx
"use client";

import { useState } from "react";
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
  Compass,
  Sparkles,
  Filter,
  Grid3x3,
  List,
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

// Données des destinations avec images locales
const destinationsData = [
  {
    id: 1,
    name: "Marrakech",
    country: "Maroc",
    description:
      "La ville rouge, célèbre pour ses souks, ses palais et ses jardins luxuriants",
    image: "/images/destinations/marrakech.jpg",
    icon: "🏛️",
    rating: 4.9,
    hotels: 128,
    price: "450 MAD",
    temp: "28°C",
    season: "Toute l'année",
    tags: ["Médina", "Souks", "Riads", "Palais"],
    featured: true,
  },
  {
    id: 2,
    name: "Chefchaouen",
    country: "Maroc",
    description:
      "La ville bleue, un écrin de paix au pied des montagnes du Rif",
    image: "/images/destinations/chefchaouen.jpg",
    icon: "💙",
    rating: 4.8,
    hotels: 41,
    price: "380 MAD",
    temp: "22°C",
    season: "Printemps - Été",
    tags: ["Ville bleue", "Rif", "Artisanat", "Randonnée"],
    featured: true,
  },
  {
    id: 3,
    name: "Fès",
    country: "Maroc",
    description: "La capitale spirituelle, avec la plus grande médina du monde",
    image: "/images/destinations/fes.jpg",
    icon: "🕌",
    rating: 4.7,
    hotels: 76,
    price: "320 MAD",
    temp: "25°C",
    season: "Toute l'année",
    tags: ["Médina", "Patrimoine", "Tanneries", "Artisanat"],
    featured: true,
  },
  {
    id: 4,
    name: "Essaouira",
    country: "Maroc",
    description:
      "La perle de l'Atlantique, ville côtière au charme authentique",
    image: "/images/destinations/essaouira.jpg",
    icon: "🌊",
    rating: 4.9,
    hotels: 53,
    price: "280 MAD",
    temp: "20°C",
    season: "Printemps - Été",
    tags: ["Plage", "Vent", "Port", "Remparts"],
    featured: true,
  },
  {
    id: 5,
    name: "Agadir",
    country: "Maroc",
    description:
      "La station balnéaire par excellence, avec ses plages de sable fin",
    image: "/images/destinations/agadir.jpg",
    icon: "🏖️",
    rating: 4.6,
    hotels: 94,
    price: "350 MAD",
    temp: "26°C",
    season: "Toute l'année",
    tags: ["Plage", "Resort", "Soleil", "Promenade"],
    featured: true,
  },
  {
    id: 6,
    name: "Tanger",
    country: "Maroc",
    description:
      "La porte du Maroc, ville cosmopolite aux influences méditerranéennes",
    image: "/images/destinations/tanger.jpg",
    icon: "⛵",
    rating: 4.5,
    hotels: 67,
    price: "400 MAD",
    temp: "23°C",
    season: "Printemps - Automne",
    tags: ["Détroit", "Cosmopolite", "Art", "Histoire"],
    featured: false,
  },
  {
    id: 7,
    name: "Ouarzazate",
    country: "Maroc",
    description:
      "La porte du désert, célèbre pour ses kasbahs et ses studios de cinéma",
    image: "/images/destinations/ouarzazate.jpg",
    icon: "🏜️",
    rating: 4.4,
    hotels: 32,
    price: "290 MAD",
    temp: "32°C",
    season: "Automne - Printemps",
    tags: ["Désert", "Kasbah", "Cinéma", "Aventure"],
    featured: false,
  },
  {
    id: 8,
    name: "Casablanca",
    country: "Maroc",
    description: "La capitale économique, entre modernité et tradition",
    image: "/images/destinations/casablanca.jpg",
    icon: "🏙️",
    rating: 4.3,
    hotels: 112,
    price: "420 MAD",
    temp: "24°C",
    season: "Toute l'année",
    tags: ["Moderne", "Affaires", "Corniche", "Mosquée"],
    featured: false,
  },
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

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("Tous");
  const [selectedPrice, setSelectedPrice] = useState("Tous");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Filtrer les destinations
  const filteredDestinations = destinationsData.filter((dest) => {
    const matchSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchSeason =
      selectedSeason === "Tous" || dest.season.includes(selectedSeason);

    const matchPrice =
      selectedPrice === "Tous" ||
      (selectedPrice === "Moins de 300 MAD" && parseInt(dest.price) < 300) ||
      (selectedPrice === "300-400 MAD" &&
        parseInt(dest.price) >= 300 &&
        parseInt(dest.price) < 400) ||
      (selectedPrice === "400+ MAD" && parseInt(dest.price) >= 400);

    return matchSearch && matchSeason && matchPrice;
  });

  // Statistiques
  const stats = [
    { value: "8", label: "Destinations", icon: <Compass size={20} /> },
    { value: "150+", label: "Hôtels", icon: <MapPin size={20} /> },
    { value: "4.8", label: "Note moyenne", icon: <Star size={20} /> },
    { value: "12k+", label: "Voyageurs", icon: <Users size={20} /> },
  ];

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      <Navbar isAuthenticated={false} userRole="guest" userName="" />

      {/* En-tête */}
      <section
        className="relative pt-24 pb-12 overflow-hidden"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#E9B883] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FDFDFD] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <Compass size={16} className="text-[#E9B883]" />
              <span className="text-white/90 text-sm font-medium">
                Explorez le Maroc
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
              Destinations <span className="text-[#E9B883]">d'exception</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Découvrez les plus belles villes du Maroc et trouvez l'endroit
              parfait pour votre prochain séjour
            </p>

            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 flex gap-2">
                <div className="flex-1 relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une destination..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filtres</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 bg-[#FDFDFD] border-b border-[#DED9D0]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#DED9D0]/20"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: palette.primary + "20",
                    color: palette.primary,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    className="font-display text-xl md:text-2xl"
                    style={{ color: palette.dark }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: palette.gray }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-[#FDFDFD] border-b border-[#DED9D0] py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Saison */}
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: palette.dark }}
                >
                  Saison
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                  style={{
                    backgroundColor: palette.white,
                    borderColor: palette.cream,
                    color: palette.dark,
                  }}
                >
                  <option value="Tous">Toutes les saisons</option>
                  <option value="Printemps">Printemps</option>
                  <option value="Été">Été</option>
                  <option value="Automne">Automne</option>
                  <option value="Hiver">Hiver</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: palette.dark }}
                >
                  Budget
                </label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                  style={{
                    backgroundColor: palette.white,
                    borderColor: palette.cream,
                    color: palette.dark,
                  }}
                >
                  <option value="Tous">Tous les budgets</option>
                  <option value="Moins de 300 MAD">Moins de 300 MAD</option>
                  <option value="300-400 MAD">300 - 400 MAD</option>
                  <option value="400+ MAD">400+ MAD</option>
                </select>
              </div>

              {/* Résultats */}
              <div className="flex items-end">
                <div className="text-sm" style={{ color: palette.gray }}>
                  {filteredDestinations.length} destination
                  {filteredDestinations.length > 1 ? "s" : ""} trouvée
                  {filteredDestinations.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des destinations */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Barre d'outils */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm" style={{ color: palette.gray }}>
              {filteredDestinations.length} destination
              {filteredDestinations.length > 1 ? "s" : ""}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                    : "text-[#595B57] hover:bg-[#7F9BA9]/5"
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                    : "text-[#595B57] hover:bg-[#7F9BA9]/5"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Grille des destinations */}
          {filteredDestinations.length > 0 ? (
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className={`group bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all ${
                    viewMode === "grid" ? "" : "flex flex-col md:flex-row"
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "grid" ? "h-56" : "md:w-64 h-48 md:h-auto"
                    }`}
                  >
                    {imageErrors[dest.id] ? (
                      // Fallback : afficher l'icône avec un fond coloré
                      <div
                        className="w-full h-full flex items-center justify-center text-7xl"
                        style={{
                          background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`,
                        }}
                      >
                        {dest.icon}
                      </div>
                    ) : (
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-700"
                        onError={() => handleImageError(dest.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/60 via-transparent to-transparent"></div>

                    {/* Badge featured */}
                    {dest.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-[#E9B883] text-[#3B2E22]">
                          ⭐ Coup de cœur
                        </span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-[#FDFDFD]/90 px-2.5 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
                      <Star
                        size={14}
                        fill={palette.sand}
                        color={palette.sand}
                      />
                      <span style={{ color: palette.dark }}>{dest.rating}</span>
                    </div>

                    {/* Actions */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition text-white">
                        <Heart size={16} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition text-white">
                        <Share2 size={16} />
                      </button>
                    </div>

                    {/* Infos sur l'image */}
                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-white font-display text-lg md:text-xl">
                        {dest.name}
                      </h3>
                      <p className="text-white/70 text-xs">{dest.country}</p>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className="font-display text-lg"
                              style={{ color: palette.dark }}
                            >
                              {dest.name}
                            </h3>
                            <span
                              className="text-xs"
                              style={{ color: palette.gray }}
                            >
                              · {dest.country}
                            </span>
                          </div>
                          <p
                            className="text-xs md:text-sm mt-1 font-light"
                            style={{ color: palette.gray }}
                          >
                            {dest.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className="text-lg font-bold"
                            style={{ color: palette.primary }}
                          >
                            {dest.price}
                          </span>
                          <p
                            className="text-xs"
                            style={{ color: palette.gray }}
                          >
                            par nuit
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {dest.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: palette.cream,
                              color: palette.dark,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Infos supplémentaires */}
                      <div
                        className="flex flex-wrap items-center gap-3 mt-3 text-xs"
                        style={{ color: palette.gray }}
                      >
                        <span className="flex items-center gap-1">
                          <Thermometer size={14} />
                          {dest.temp}
                        </span>
                        <span
                          className="w-px h-3"
                          style={{ backgroundColor: palette.cream }}
                        ></span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {dest.season}
                        </span>
                        <span
                          className="w-px h-3"
                          style={{ backgroundColor: palette.cream }}
                        ></span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {dest.hotels} hôtels
                        </span>
                      </div>
                    </div>

                    {/* Bouton */}
                    <Link
                      href={`/destinations/1`}
                      className="mt-4 w-full py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90 flex items-center justify-center gap-2 group"
                      style={{ backgroundColor: palette.primary }}
                    >
                      Explorer {dest.name}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌍</div>
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Aucune destination trouvée
              </h3>
              <p className="text-sm" style={{ color: palette.gray }}>
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Inspirez-vous */}
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
            <Sparkles size={16} className="text-[#E9B883]" />
            <span className="text-white/90 text-sm font-medium">
              Inspiration
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">
            Prêt à <span className="text-[#E9B883]">voyager</span> ?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Découvrez nos offres spéciales et trouvez la destination de vos
            rêves
          </p>

          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition hover:opacity-90"
            style={{ backgroundColor: palette.brown }}
          >
            Voir tous les hôtels
            <ArrowRight size={20} />
          </Link>
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
