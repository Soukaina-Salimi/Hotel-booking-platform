// app/hotels/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";

import {
  MapPin,
  Star,
  Wifi,
  Coffee,
  Utensils,
  Waves,
  Dumbbell,
  Car,
  Snowflake,
  Tv,
  Phone,
  Mail,
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  Bed,
  Maximize,
  Shield,
  Building2,
  Award,
  Sparkles,
  MessageCircle,
  Loader2,
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

// Mapping des équipements vers leurs icônes
const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={18} />,
  "Wi-Fi gratuit": <Wifi size={18} />,
  Piscine: <Waves size={18} />,
  Spa: <Dumbbell size={18} />,
  Restaurant: <Utensils size={18} />,
  "Petit-déjeuner": <Coffee size={18} />,
  Parking: <Car size={18} />,
  Climatisation: <Snowflake size={18} />,
  TV: <Tv size={18} />,
  Jardin: <Waves size={18} />,
  Terrasse: <Waves size={18} />,
  Jacuzzi: <Waves size={18} />,
  "Mini-bar": <Coffee size={18} />,
};

// Types
type Hotel = {
  id: string;
  name: string;
  location: string;
  address?: string;
  description: string;
  rating: number | null;
  reviews: number;
  image: string;
  amenities: string[];
  badge: string | null;
  featured: boolean;
  rooms: Room[];
};

type Room = {
  id: string;
  room_type: string;
  price: number;
  capacity: number;
  description: string | null;
};

type Review = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
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

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id;

  // États pour les données dynamiques
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les dates et les sélections
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les détails de l'hôtel
        const response = await fetch(`/api/hotels/${hotelId}`);

        if (!response.ok) {
          throw new Error("Hôtel non trouvé");
        }

        const data = await response.json();
        const hotelData = data.data;

        // Transformer les données de l'API au format attendu
        const formattedHotel: Hotel = {
          id: hotelData.id,
          name: hotelData.name,
          location: hotelData.location,
          address: hotelData.address,
          description: hotelData.description || "",
          rating: hotelData.rating,
          reviews: hotelData.reviews,
          image: hotelData.image,
          amenities: hotelData.amenities || [],
          badge: hotelData.badge,
          featured: hotelData.featured,
          rooms: hotelData.rooms.map((room: any) => ({
            id: room.id,
            room_type: room.room_type,
            price: room.price,
            capacity: room.capacity,
            description: room.description,
          })),
        };

        setHotel(formattedHotel);

        // Récupérer les avis
        const reviewsResponse = await fetch(`/api/hotels/${hotelId}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotel();
    }
  }, [hotelId]);

  // Récupérer les dates depuis l'URL si présentes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCheckIn = urlParams.get("checkIn");
    const urlCheckOut = urlParams.get("checkOut");
    const urlGuests = urlParams.get("guests");
    const urlRoom = urlParams.get("room");

    if (urlCheckIn) setCheckInDate(urlCheckIn);
    if (urlCheckOut) setCheckOutDate(urlCheckOut);
    if (urlGuests) setGuests(parseInt(urlGuests));
    if (urlRoom) setSelectedRoom(urlRoom);
  }, []);

  // Fonction pour rediriger vers la page de booking
  const handleBookingRedirect = (roomId: string) => {
    if (!hotel) return;

    setIsLoading(true);

    const params = new URLSearchParams();
    if (checkInDate) params.append("checkIn", checkInDate);
    if (checkOutDate) params.append("checkOut", checkOutDate);
    if (guests) params.append("guests", guests.toString());
    params.append("room", roomId);

    setTimeout(() => {
      router.push(`/hotels/${hotel.id}/booking?${params.toString()}`);
    }, 300);
  };

  // Vérifier si les dates sont valides
  const areDatesValid = () => {
    if (!checkInDate || !checkOutDate) return false;
    return new Date(checkInDate) < new Date(checkOutDate);
  };

  // Calculer le nombre de nuits
  const getNights = () => {
    if (!areDatesValid()) return 0;
    return Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  };

  // Obtenir la chambre sélectionnée
  const selectedRoomData = hotel?.rooms.find((r) => r.id === selectedRoom);

  // Afficher le chargement
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.cream }}
      >
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin mx-auto mb-4"
            style={{ color: palette.primary }}
          />
          <p style={{ color: palette.gray }}>Chargement de l'hôtel...</p>
        </div>
      </div>
    );
  }

  // Afficher l'erreur
  if (error || !hotel) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.cream }}
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2
            className="font-display text-2xl mb-2"
            style={{ color: palette.dark }}
          >
            Hôtel non trouvé
          </h2>
          <p className="text-sm mb-6" style={{ color: palette.gray }}>
            {error ||
              "L'hôtel que vous recherchez n'existe pas ou a été supprimé."}
          </p>
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: palette.primary }}
          >
            <ArrowLeft size={16} />
            Retour aux hôtels
          </Link>
        </div>
      </div>
    );
  }

  // Images par défaut (l'API ne retourne qu'une seule image cover)
  const images = [hotel.image, hotel.image, hotel.image];

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      <Navbar isAuthenticated={false} userRole="guest" userName="" />

      {/* En-tête avec image */}
      <div className="relative pt-20">
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={images[selectedImage] || hotel.image}
            alt={hotel.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B2E22]/80 via-[#3B2E22]/40 to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-24 md:top-28 left-3 md:left-8 flex flex-wrap gap-2">
            {hotel.featured && (
              <span
                className="text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full"
                style={{ backgroundColor: palette.primary }}
              >
                ⭐ Coup de cœur
              </span>
            )}
            {hotel.badge && (
              <span
                className="text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 rounded-full"
                style={{ backgroundColor: palette.sand }}
              >
                {hotel.badge}
              </span>
            )}
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

          {/* Informations sur l'image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 text-xs md:text-sm text-white/80 hover:text-white transition mb-2 md:mb-4"
            >
              <ArrowLeft size={14} className="md:w-4 md:h-4" />
              Retour aux hôtels
            </Link>
            <h1 className="font-display text-2xl md:text-5xl mb-2">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="md:w-4 md:h-4" />
                {hotel.location}
              </span>
              {hotel.rating && (
                <span className="flex items-center gap-1">
                  <Star
                    size={14}
                    fill={palette.sand}
                    color={palette.sand}
                    className="md:w-4 md:h-4"
                  />
                  {hotel.rating} ({hotel.reviews} avis)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Miniatures */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition ${
                selectedImage === index
                  ? "border-[#E9B883]"
                  : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`Photo ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 pt-12 md:pt-8 pb-8 max-w-7xl">
        <div className="space-y-6 md:space-y-8">
          {/* Description */}
          <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
            <h2
              className="font-display text-xl md:text-2xl mb-3 md:mb-4"
              style={{ color: palette.dark }}
            >
              À propos de l'hôtel
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: palette.gray }}
            >
              {hotel.description || "Aucune description disponible."}
            </p>
          </section>

          {/* Équipements */}
          {hotel.amenities.length > 0 && (
            <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
              <h2
                className="font-display text-xl md:text-2xl mb-3 md:mb-4"
                style={{ color: palette.dark }}
              >
                Équipements & services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {hotel.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 md:p-3 rounded-xl bg-[#DED9D0]/20"
                  >
                    <span style={{ color: palette.primary }}>
                      {amenityIcons[amenity] || <CheckCircle size={18} />}
                    </span>
                    <span
                      className="text-[10px] md:text-xs"
                      style={{ color: palette.dark }}
                    >
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Chambres disponibles */}
          <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-4">
              <h2
                className="font-display text-xl md:text-2xl"
                style={{ color: palette.dark }}
              >
                Chambres disponibles
              </h2>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                <label
                  className="flex items-center gap-1"
                  style={{ color: palette.gray }}
                >
                  <Calendar size={14} className="md:w-4 md:h-4" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="px-2 py-1 rounded border text-xs w-[120px] md:w-auto"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                    }}
                  />
                </label>
                <label
                  className="flex items-center gap-1"
                  style={{ color: palette.gray }}
                >
                  <Calendar size={14} className="md:w-4 md:h-4" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="px-2 py-1 rounded border text-xs w-[120px] md:w-auto"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                    }}
                  />
                </label>
                <label
                  className="flex items-center gap-1"
                  style={{ color: palette.gray }}
                >
                  <Users size={14} className="md:w-4 md:h-4" />
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="px-2 py-1 rounded border text-xs"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                    }}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} pers.
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {areDatesValid() && (
              <div className="text-sm mb-4 p-3 rounded-xl bg-[#7F9BA9]/10 text-[#7F9BA9]">
                📅 {getNights()} nuit{getNights() > 1 ? "s" : ""} du{" "}
                {new Date(checkInDate).toLocaleDateString("fr-FR")} au{" "}
                {new Date(checkOutDate).toLocaleDateString("fr-FR")}
              </div>
            )}

            <div className="space-y-4">
              {hotel.rooms.length > 0 ? (
                hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`border rounded-xl p-3 md:p-4 transition ${
                      selectedRoom === room.id
                        ? "border-[#7F9BA9] bg-[#7F9BA9]/5"
                        : "border-[#DED9D0]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                      <div className="relative w-full md:w-40 h-48 md:h-32 rounded-lg overflow-hidden bg-[#DED9D0]">
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                          🛏️
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <h3
                              className="font-display text-base md:text-lg"
                              style={{ color: palette.dark }}
                            >
                              {room.room_type}
                            </h3>
                            {room.description && (
                              <p
                                className="text-xs md:text-sm"
                                style={{ color: palette.gray }}
                              >
                                {room.description}
                              </p>
                            )}
                          </div>
                          <div className="text-left sm:text-right">
                            <span
                              className="text-lg md:text-xl font-bold"
                              style={{ color: palette.primary }}
                            >
                              {room.price}
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
                              / nuit
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex flex-wrap gap-2 md:gap-3 mt-2 text-xs"
                          style={{ color: palette.gray }}
                        >
                          <span className="flex items-center gap-1">
                            <Users size={14} /> {room.capacity} pers.
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
                          <span className="text-xs font-medium flex items-center gap-1 text-green-600">
                            <CheckCircle size={14} />
                            Disponible
                          </span>
                          <button
                            onClick={() => {
                              setSelectedRoom(room.id);
                              handleBookingRedirect(room.id);
                            }}
                            disabled={isLoading}
                            className={`w-full sm:w-auto px-4 py-1.5 rounded-lg text-white text-sm font-medium transition ${
                              isLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:opacity-90"
                            }`}
                            style={{ backgroundColor: palette.brown }}
                          >
                            {isLoading && selectedRoom === room.id ? (
                              <span className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" />
                                Chargement...
                              </span>
                            ) : (
                              "Réserver"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="text-center py-8"
                  style={{ color: palette.gray }}
                >
                  <p>Aucune chambre disponible pour le moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* Localisation */}
          <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
            <h2
              className="font-display text-xl md:text-2xl mb-3 md:mb-4"
              style={{ color: palette.dark }}
            >
              Localisation
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: palette.primary + "20" }}
              >
                <MapPin size={24} style={{ color: palette.primary }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: palette.dark }}>
                  {hotel.address || hotel.location}
                </p>
              </div>
            </div>
            <div className="mt-4 h-40 md:h-48 rounded-xl overflow-hidden bg-[#DED9D0] flex items-center justify-center">
              <span className="text-sm" style={{ color: palette.gray }}>
                🗺️ Carte interactive (à intégrer)
              </span>
            </div>
          </section>

          {/* Avis clients */}
          <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <h2
                className="font-display text-xl md:text-2xl"
                style={{ color: palette.dark }}
              >
                Avis clients
              </h2>
              {hotel.rating && (
                <div className="flex items-center gap-1">
                  <Star size={20} fill={palette.sand} color={palette.sand} />
                  <span
                    className="text-xl font-bold"
                    style={{ color: palette.dark }}
                  >
                    {hotel.rating}
                  </span>
                  <span className="text-sm" style={{ color: palette.gray }}>
                    ({hotel.reviews} avis)
                  </span>
                </div>
              )}
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-[#DED9D0]/50 pb-4 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm shrink-0"
                        style={{ backgroundColor: palette.primary }}
                      >
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="font-medium text-sm md:text-base"
                            style={{ color: palette.dark }}
                          >
                            {review.user}
                          </span>
                          {review.verified && (
                            <span
                              className="text-[10px] flex items-center gap-0.5"
                              style={{ color: palette.primary }}
                            >
                              <CheckCircle size={12} />
                              Vérifié
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < review.rating ? palette.sand : "none"}
                                color={
                                  i < review.rating
                                    ? palette.sand
                                    : palette.cream
                                }
                              />
                            ))}
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: palette.gray }}
                          >
                            {review.date}
                          </span>
                        </div>
                        <p
                          className="text-sm mt-1"
                          style={{ color: palette.gray }}
                        >
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: palette.gray }}>
                <p>Aucun avis pour le moment.</p>
              </div>
            )}

            <button
              className="w-full mt-4 py-2.5 rounded-xl border-2 font-medium text-sm transition hover:opacity-70"
              style={{
                borderColor: palette.primary,
                color: palette.primary,
              }}
            >
              Voir tous les avis
            </button>
          </section>

          {/* Politique d'annulation */}
          <section className="bg-[#FDFDFD] rounded-2xl p-4 md:p-6 shadow-sm">
            <h2
              className="font-display text-xl md:text-2xl mb-3 md:mb-4"
              style={{ color: palette.dark }}
            >
              Politique d'annulation
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle
                  size={20}
                  style={{ color: "#22C55E" }}
                  className="shrink-0"
                />
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: palette.dark }}
                  >
                    Annulation gratuite
                  </p>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Annulation gratuite jusqu'à 7 jours avant l'arrivée
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  size={20}
                  style={{ color: palette.sand }}
                  className="shrink-0"
                />
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: palette.dark }}
                  >
                    Annulation partielle
                  </p>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Annulation partielle entre 7 et 3 jours avant l'arrivée
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle
                  size={20}
                  style={{ color: "#EF4444" }}
                  className="shrink-0"
                />
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: palette.dark }}
                  >
                    Pas de remboursement
                  </p>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Pas de remboursement en cas d'annulation moins de 3 jours
                    avant
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-xl bg-[#DED9D0]/30">
                <p className="text-xs" style={{ color: palette.gray }}>
                  <Info size={14} className="inline mr-1" />
                  En cas de no-show, la totalité du séjour sera facturée. Toute
                  modification est soumise à disponibilité.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ChatWidget hotelId={hotel.id} />
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
              className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs"
              style={{ color: palette.cream }}
            >
              <a href="#" className="hover:text-white transition">
                Conditions générales
              </a>
              <span className="opacity-30 hidden md:inline">|</span>
              <a href="#" className="hover:text-white transition">
                Confidentialité
              </a>
              <span className="opacity-30 hidden md:inline">|</span>
              <a href="#" className="hover:text-white transition">
                Cookies
              </a>
            </div>
            <div
              className="text-xs text-center"
              style={{ color: palette.cream }}
            >
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
