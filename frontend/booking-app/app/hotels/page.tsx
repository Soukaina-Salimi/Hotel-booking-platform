// app/hotels/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Grid3x3,
  List,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

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

// Forme des donnees telles que renvoyees par GET /api/hotels (voir HotelController::index)
type Hotel = {
  id: string;
  name: string;
  location: string;
  description: string | null;
  price: number | null;
  rating: number | null;
  reviews: number;
  image: string;
  amenities: string[];
  badge: string | null;
  featured: boolean;
};

const locations = [
  "Toutes",
  "Marrakech",
  "Fès",
  "Essaouira",
  "Agadir",
  "Chefchaouen",
  "Tanger",
];
const priceRanges = [
  "Tous",
  "0-500 MAD",
  "500-800 MAD",
  "800-1200 MAD",
  "1200+ MAD",
];
const amenitiesList = [
  "Spa",
  "Piscine",
  "Restaurant",
  "Wi-Fi",
  "Jardin",
  "Terrasse",
  "Parking",
];

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

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Toutes");
  const [selectedPrice, setSelectedPrice] = useState("Tous");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const router = useRouter();

  // --- Appel API reel vers hotel-service, a la place du tableau statique ---
  useEffect(() => {
    async function fetchHotels() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/hotels`);
        if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
        const json = await res.json();
        setHotels(json.data ?? []);
      } catch (err) {
        console.error(err);
        setError(
          "Impossible de charger les hôtels pour le moment. Réessayez dans un instant.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const matchSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hotel.description ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchLocation =
      selectedLocation === "Toutes" || hotel.location === selectedLocation;

    const price = hotel.price ?? 0;
    const matchPrice =
      selectedPrice === "Tous" ||
      (selectedPrice === "0-500 MAD" && price < 500) ||
      (selectedPrice === "500-800 MAD" && price >= 500 && price < 800) ||
      (selectedPrice === "800-1200 MAD" && price >= 800 && price < 1200) ||
      (selectedPrice === "1200+ MAD" && price >= 1200);

    const matchAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((a) => hotel.amenities.includes(a));

    return matchSearch && matchLocation && matchPrice && matchAmenities;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
    if (sortBy === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const renderHotelCard = (hotel: Hotel) => (
    <div
      key={hotel.id}
      className="bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/60 via-transparent to-transparent"></div>

        {hotel.badge && (
          <div className="absolute top-3 left-3">
            <span
              className="text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: palette.primary }}
            >
              {hotel.badge}
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-[#FDFDFD]/90 px-2.5 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
          <Star size={14} fill={palette.sand} color={palette.sand} />
          <span style={{ color: palette.dark }}>{hotel.rating ?? "—"}</span>
          <span style={{ color: palette.gray }} className="text-xs">
            ({hotel.reviews})
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition"
            style={{ color: palette.white }}
          >
            <Heart size={16} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition"
            style={{ color: palette.white }}
          >
            <Share2 size={16} />
          </button>
        </div>

        {hotel.featured && (
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] bg-[#E9B883] text-[#3B2E22] px-2 py-0.5 rounded-full font-medium">
              ⭐ Coup de cœur
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
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
          </div>
          <div className="text-right">
            <span
              className="text-xl font-bold"
              style={{ color: palette.primary }}
            >
              {hotel.price !== null ? hotel.price : "—"}
            </span>
            <span className="text-xs" style={{ color: palette.gray }}>
              {" "}
              MAD
            </span>
            <p className="text-xs" style={{ color: palette.gray }}>
              par nuit
            </p>
          </div>
        </div>

        <p className="text-sm mt-2 font-light" style={{ color: palette.gray }}>
          {hotel.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities.slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2.5 py-1 rounded-full"
              style={{ backgroundColor: palette.cream, color: palette.dark }}
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 4 && (
            <span
              className="text-[10px] px-2.5 py-1 rounded-full"
              style={{ backgroundColor: palette.cream, color: palette.gray }}
            >
              +{hotel.amenities.length - 4}
            </span>
          )}
        </div>

        <button
          className="w-full mt-4 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
          style={{ backgroundColor: palette.brown }}
          onClick={() => router.push(`/hotels/${hotel.id}`)}
        >
          Voir les disponibilités
        </button>
      </div>
    </div>
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

      <div
        className="relative pt-24 pb-12"
        style={{ backgroundColor: palette.primary }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#E9B883] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#FDFDFD] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl text-white mb-3">
              Découvrez nos hôtels
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Sélectionnez parmi notre collection d'établissements d'exception
              au Maroc
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-8">
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
                  placeholder="Rechercher un hôtel, une ville..."
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

      {showFilters && (
        <div className="bg-[#FDFDFD] border-b border-[#DED9D0] py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: palette.dark }}
                >
                  Localisation
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                  style={{
                    backgroundColor: palette.white,
                    borderColor: palette.cream,
                    color: palette.dark,
                  }}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

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
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  className="text-xs font-medium block mb-1.5"
                  style={{ color: palette.dark }}
                >
                  Équipements
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        selectedAmenities.includes(amenity)
                          ? "border-[#7F9BA9] bg-[#7F9BA9]/10 text-[#7F9BA9]"
                          : "border-[#DED9D0] text-[#595B57] hover:border-[#7F9BA9]/30"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm" style={{ color: palette.gray }}>
              {filteredHotels.length} hôtel
              {filteredHotels.length > 1 ? "s" : ""} trouvé
              {filteredHotels.length > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Etat de chargement */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2
                size={28}
                className="animate-spin"
                color={palette.primary}
              />
              <p className="text-sm" style={{ color: palette.gray }}>
                Chargement des hôtels...
              </p>
            </div>
          )}

          {/* Etat d'erreur */}
          {!isLoading && error && (
            <div className="text-center py-16">
              <p className="text-sm" style={{ color: palette.brown }}>
                {error}
              </p>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: palette.gray }}
                >
                  <span>{filteredHotels.length} hôtels</span>
                  <span
                    className="w-px h-4"
                    style={{ backgroundColor: palette.cream }}
                  ></span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm focus:outline-none cursor-pointer"
                    style={{ color: palette.dark }}
                  >
                    <option value="rating">⭐ Mieux notés</option>
                    <option value="price-asc">💰 Prix croissant</option>
                    <option value="price-desc">💰 Prix décroissant</option>
                    <option value="reviews">📝 Plus d'avis</option>
                  </select>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-[#7F9BA9]/10 text-[#7F9BA9]" : "text-[#595B57] hover:bg-[#7F9BA9]/5"}`}
                  >
                    <Grid3x3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-[#7F9BA9]/10 text-[#7F9BA9]" : "text-[#595B57] hover:bg-[#7F9BA9]/5"}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {filteredHotels.length > 0 ? (
                <div
                  className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid-cols-1 gap-4"}`}
                >
                  {sortedHotels.map((hotel) => (
                    <div key={hotel.id}>{renderHotelCard(hotel)}</div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3
                    className="font-display text-xl"
                    style={{ color: palette.dark }}
                  >
                    Aucun hôtel trouvé
                  </h3>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Essayez de modifier vos filtres de recherche
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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
