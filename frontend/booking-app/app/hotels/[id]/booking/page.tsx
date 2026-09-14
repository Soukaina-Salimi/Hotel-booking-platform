// app/hotels/[id]/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle,
  Shield,
  ArrowRight,
  Clock,
  Info,
  AlertCircle,
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

type Room = {
  id: string;
  room_type: string;
  price: number;
  capacity: number;
  description: string | null;
  image?: string | null;
  size?: string | null;
  bed?: string | null;
  amenities?: string[] | null;
};

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hotelId = params.id as string;

  // États du formulaire
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState(
    searchParams.get("check_in") || searchParams.get("checkIn") || "",
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.get("check_out") || searchParams.get("checkOut") || "",
  );
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 2);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Données dynamiques (fetch API)
  const [hotelName, setHotelName] = useState<string>("");
  const [roomsData, setRoomsData] = useState<Room[]>([]);

  // Données du client
  const [clientData, setClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // room_id depuis l'URL (fourni par Moha / page hôtel)
  const roomIdFromUrl = searchParams.get("room_id");

  // --- Fetch hôtel + chambres ---
  useEffect(() => {
    setIsInitialLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hotels/${hotelId}`)
      .then((res) => res.json())
      .then((json) => {
        setHotelName(json.data?.name ?? "");
        const rooms: Room[] = json.data?.rooms ?? [];
        setRoomsData(rooms);

        // Pré-sélection si room_id dans l'URL
        if (roomIdFromUrl) {
          const matched = rooms.find((r) => r.id === roomIdFromUrl);
          if (matched) setSelectedRoom(matched.id);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les informations de l'hôtel.");
      })
      .finally(() => setIsInitialLoading(false));
  }, [hotelId, roomIdFromUrl]);

  // --- Pré-remplir les infos client depuis le cache auth ---
  useEffect(() => {
    const cached = localStorage.getItem("auth_user");
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setClientData((prev) => ({
          ...prev,
          firstName: u.first_name ?? u.firstName ?? "",
          lastName: u.last_name ?? u.lastName ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
        }));
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Calcul du prix total
  const selectedRoomData = roomsData.find((r) => r.id === selectedRoom);
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const totalPrice = selectedRoomData ? selectedRoomData.price * nights : 0;

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedRoom) {
        setError("Veuillez sélectionner une chambre");
        return;
      }
      if (!checkInDate || !checkOutDate) {
        setError("Veuillez sélectionner vos dates");
        return;
      }
      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        setError("La date d'arrivée doit être avant la date de départ");
        return;
      }
    }

    if (step === 2) {
      if (!clientData.firstName || !clientData.lastName || !clientData.email) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }

    setError("");
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleBooking();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // --- Réservation réelle via API ---
  const handleBooking = async () => {
    setError("");
    setIsLoading(true);

    // Vérification auth
    const cachedUser = localStorage.getItem("auth_user");
    if (!cachedUser) {
      router.push(
        `/login?redirect=/hotels/${hotelId}/booking?room_id=${selectedRoom}&check_in=${checkInDate}&check_out=${checkOutDate}`,
      );
      setIsLoading(false);
      return;
    }

    let userId: string | number;
    try {
      userId = JSON.parse(cachedUser).id;
    } catch {
      router.push(`/login?redirect=/hotels/${hotelId}/booking`);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          room_id: selectedRoom,
          check_in: checkInDate,
          check_out: checkOutDate,
          // Optionnels — à ignorer côté API si non gérés
          guests,
          special_requests: clientData.specialRequests || undefined,
        }),
      });

      if (!res.ok) throw new Error("Échec de la réservation");

      setSuccess(true);
      // Redirection vers le dashboard après un court délai
      setTimeout(() => router.push("/account/dashboard"), 1800);
    } catch {
      setError("Une erreur est survenue, réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu du step
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // Étape 1 - Sélection de la chambre
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Dates */}
      <div className="bg-[#DED9D0]/20 rounded-xl p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label
              className="text-sm font-medium block mb-1.5"
              style={{ color: palette.dark }}
            >
              Arrivée *
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none"
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
              Départ *
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none"
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
              Voyageurs *
            </label>
            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none"
                style={{
                  backgroundColor: palette.white,
                  borderColor: palette.cream,
                  color: palette.dark,
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} voyageur{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {nights > 0 && (
          <p className="text-sm mt-3" style={{ color: palette.gray }}>
            📅 {nights} nuit{nights > 1 ? "s" : ""} du{" "}
            {new Date(checkInDate).toLocaleDateString("fr-FR")} au{" "}
            {new Date(checkOutDate).toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      {/* Chambres disponibles */}
      <div>
        <h3
          className="font-display text-lg mb-3"
          style={{ color: palette.dark }}
        >
          Choisissez votre chambre
        </h3>
        <div className="space-y-3">
          {roomsData.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.id)}
              className={`w-full text-left border rounded-xl p-4 transition ${
                selectedRoom === room.id
                  ? "border-[#7F9BA9] bg-[#7F9BA9]/5"
                  : "border-[#DED9D0] hover:border-[#7F9BA9]/30"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden bg-[#DED9D0]/40">
                  {room.image ? (
                    <Image
                      src={room.image}
                      alt={room.room_type}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4
                        className="font-display"
                        style={{ color: palette.dark }}
                      >
                        {room.room_type}
                      </h4>
                      <p className="text-sm" style={{ color: palette.gray }}>
                        {room.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-lg font-bold"
                        style={{ color: palette.primary }}
                      >
                        {room.price}
                      </span>
                      <span className="text-xs" style={{ color: palette.gray }}>
                        {" "}
                        MAD / nuit
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex flex-wrap gap-3 mt-2 text-xs"
                    style={{ color: palette.gray }}
                  >
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {room.capacity} pers.
                    </span>
                    {room.size && (
                      <span className="flex items-center gap-1">
                        📐 {room.size}
                      </span>
                    )}
                    {room.bed && (
                      <span className="flex items-center gap-1">
                        🛏️ {room.bed}
                      </span>
                    )}
                  </div>
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {room.amenities.map((amenity, idx) => (
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
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Étape 2 - Informations client (inchangée)
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Prénom *
          </label>
          <input
            type="text"
            name="firstName"
            value={clientData.firstName}
            onChange={(e) =>
              setClientData({ ...clientData, firstName: e.target.value })
            }
            placeholder="Ahmed"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Nom *
          </label>
          <input
            type="text"
            name="lastName"
            value={clientData.lastName}
            onChange={(e) =>
              setClientData({ ...clientData, lastName: e.target.value })
            }
            placeholder="Benali"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={clientData.email}
            onChange={(e) =>
              setClientData({ ...clientData, email: e.target.value })
            }
            placeholder="exemple@email.com"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Téléphone
          </label>
          <input
            type="tel"
            name="phone"
            value={clientData.phone}
            onChange={(e) =>
              setClientData({ ...clientData, phone: e.target.value })
            }
            placeholder="+212 6 12 34 56 78"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none"
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
          Demandes spéciales
        </label>
        <textarea
          name="specialRequests"
          value={clientData.specialRequests}
          onChange={(e) =>
            setClientData({ ...clientData, specialRequests: e.target.value })
          }
          placeholder="Besoin particulier, allergies, etc."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border transition focus:outline-none resize-none"
          style={{
            backgroundColor: palette.white,
            borderColor: palette.cream,
            color: palette.dark,
          }}
        />
      </div>

      <div className="bg-[#DED9D0]/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info
            size={20}
            style={{ color: palette.primary }}
            className="shrink-0 mt-0.5"
          />
          <div>
            <p className="text-sm font-medium" style={{ color: palette.dark }}>
              Politique d'annulation
            </p>
            <p className="text-xs" style={{ color: palette.gray }}>
              Annulation gratuite jusqu'à 7 jours avant l'arrivée. Au-delà, des
              frais peuvent s'appliquer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Étape 3 - Confirmation (inchangée)
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-[#DED9D0]/20 rounded-xl p-4">
        <h4
          className="font-display text-lg mb-3"
          style={{ color: palette.dark }}
        >
          Résumé de votre réservation
        </h4>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span style={{ color: palette.gray }}>Hôtel</span>
            <span className="font-medium" style={{ color: palette.dark }}>
              {hotelName}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: palette.gray }}>Chambre</span>
            <span className="font-medium" style={{ color: palette.dark }}>
              {selectedRoomData?.room_type}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: palette.gray }}>Dates</span>
            <span className="font-medium" style={{ color: palette.dark }}>
              {new Date(checkInDate).toLocaleDateString("fr-FR")} -{" "}
              {new Date(checkOutDate).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: palette.gray }}>Nuits</span>
            <span className="font-medium" style={{ color: palette.dark }}>
              {nights} nuit{nights > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: palette.gray }}>Voyageurs</span>
            <span className="font-medium" style={{ color: palette.dark }}>
              {guests} personne{guests > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: palette.gray }}>Prix / nuit</span>
            <span className="font-medium" style={{ color: palette.dark }}>
              {selectedRoomData?.price} MAD
            </span>
          </div>
          <div className="pt-3 border-t" style={{ borderColor: palette.cream }}>
            <div className="flex justify-between">
              <span className="font-bold" style={{ color: palette.dark }}>
                Total
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: palette.primary }}
              >
                {totalPrice} MAD
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#DED9D0]/20 rounded-xl p-4">
        <h4
          className="font-display text-sm mb-2"
          style={{ color: palette.dark }}
        >
          Informations du client
        </h4>
        <div className="space-y-1 text-sm" style={{ color: palette.gray }}>
          <p>
            <span className="font-medium">Nom :</span> {clientData.firstName}{" "}
            {clientData.lastName}
          </p>
          <p>
            <span className="font-medium">Email :</span> {clientData.email}
          </p>
          {clientData.phone && (
            <p>
              <span className="font-medium">Téléphone :</span>{" "}
              {clientData.phone}
            </p>
          )}
          {clientData.specialRequests && (
            <p>
              <span className="font-medium">Demandes spéciales :</span>{" "}
              {clientData.specialRequests}
            </p>
          )}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield size={24} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Paiement sécurisé</p>
            <p className="text-sm text-green-700">
              Vous serez redirigé vers notre plateforme de paiement sécurisée
              pour finaliser votre réservation. CIB, carte bancaire et virement
              acceptés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Loading initial ---
  if (isInitialLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.cream }}
      >
        <Loader2 className="animate-spin" color={palette.primary} />
      </div>
    );
  }

  // Page de succès
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.cream }}
      >
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="font-display text-3xl" style={{ color: palette.dark }}>
            Réservation confirmée ! 🎉
          </h2>
          <p className="text-sm mt-3" style={{ color: palette.gray }}>
            Votre réservation a été enregistrée. Vous allez être redirigé vers
            votre espace client.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/account/dashboard"
              className="block w-full py-3 rounded-xl text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: palette.primary }}
            >
              Voir mes réservations
            </Link>
            <Link
              href={`/hotels/${hotelId}`}
              className="block w-full py-3 rounded-xl border-2 font-medium transition hover:opacity-70"
              style={{ borderColor: palette.cream, color: palette.gray }}
            >
              Retour à l'hôtel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      <Navbar isAuthenticated={false} userRole="guest" userName="" />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* En-tête */}
          <div className="mb-8">
            <Link
              href={`/hotels/${hotelId}`}
              className="inline-flex items-center gap-2 text-sm transition hover:opacity-70 mb-4"
              style={{ color: palette.brown }}
            >
              <ArrowLeft size={16} />
              Retour à l'hôtel
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: palette.primary }}
              >
                <span className="text-white font-display text-2xl">د</span>
              </div>
              <div>
                <span
                  className="font-display text-2xl"
                  style={{ color: palette.dark }}
                >
                  Dar<span style={{ color: palette.brown }}>iwane</span>
                </span>
                <p className="text-sm" style={{ color: palette.gray }}>
                  Réservation · {hotelName}
                </p>
              </div>
            </div>

            <h1
              className="font-display text-3xl"
              style={{ color: palette.dark }}
            >
              Finalisez votre réservation
            </h1>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition ${
                  s <= step ? "bg-[#7F9BA9]" : "bg-[#DED9D0]"
                }`}
              />
            ))}
          </div>
          <div
            className="flex justify-between text-xs mb-6"
            style={{ color: palette.gray }}
          >
            <span className={step >= 1 ? "text-[#7F9BA9] font-medium" : ""}>
              1. Chambre
            </span>
            <span className={step >= 2 ? "text-[#7F9BA9] font-medium" : ""}>
              2. Coordonnées
            </span>
            <span className={step >= 3 ? "text-[#7F9BA9] font-medium" : ""}>
              3. Confirmation
            </span>
          </div>

          {/* Formulaire */}
          <div className="bg-[#FDFDFD] rounded-2xl shadow-sm p-6 md:p-8">
            {renderStep()}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mt-6">
                <AlertCircle size={18} className="text-red-500" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {/* Boutons de navigation */}
            <div
              className="flex gap-3 mt-8 pt-6 border-t"
              style={{ borderColor: palette.cream }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-xl border font-medium transition hover:opacity-70"
                  style={{
                    borderColor: palette.cream,
                    color: palette.gray,
                  }}
                >
                  Retour
                </button>
              )}
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-xl text-white font-medium transition hover:opacity-90 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                style={{ backgroundColor: palette.primary }}
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
                    En cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {step === 3 ? "Confirmer la réservation" : "Continuer"}
                    <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>

            {/* Sécurité */}
            <div
              className="flex items-center justify-center gap-3 mt-6 text-xs"
              style={{ color: palette.gray }}
            >
              <span className="flex items-center gap-1">
                <Shield size={14} style={{ color: palette.primary }} />
                Paiement sécurisé
              </span>
              <span
                className="w-px h-3"
                style={{ backgroundColor: palette.cream }}
              ></span>
              <span className="flex items-center gap-1">
                <Clock size={14} style={{ color: palette.sand }} />
                Confirmation immédiate
              </span>
              <span
                className="w-px h-3"
                style={{ backgroundColor: palette.cream }}
              ></span>
              <span className="flex items-center gap-1">
                <CheckCircle size={14} style={{ color: "#22C55E" }} />
                Sans engagement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (inchangé) */}
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
              ></ul>
            </div>

            <div>
              <h4 className="font-display text-white text-sm mb-4">
                Informations
              </h4>
              <ul
                className="space-y-2 text-sm"
                style={{ color: palette.cream }}
              ></ul>
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
