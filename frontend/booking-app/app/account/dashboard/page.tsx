// app/account/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Star,
  Heart,
  MessageSquare,
  UserCog,
  Menu,
  X,
  MapPin,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Trash2,
  LogOut,
  Bell,
  Sparkles,
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

const menuItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Vue d'ensemble",
    id: "overview",
  },
  {
    icon: <CalendarCheck size={18} />,
    label: "Mes réservations",
    id: "bookings",
  },
  { icon: <Star size={18} />, label: "Mes avis", id: "reviews" },
  { icon: <Heart size={18} />, label: "Favoris", id: "favorites" },
  { icon: <MessageSquare size={18} />, label: "Messages", id: "messages" },
  { icon: <UserCog size={18} />, label: "Profil & paramètres", id: "settings" },
];

// --- Donnees statiques pour l'instant ---
// A remplacer par de vrais appels API des que les endpoints existent :
// GET /api/bookings?user_id=...   (booking-service, pas encore ecrit)
// GET /api/reviews?user_id=...    (hotel-service, pas encore ecrit)
// GET /api/chat/conversations?user_id=...  (chat-service, variante cote client a ajouter)
const bookings = [
  {
    id: 1,
    hotel: "Riad Atlas Bleu",
    city: "Marrakech",
    checkIn: "2026-10-12",
    checkOut: "2026-10-15",
    status: "confirmed",
    amount: 2400,
    image: "/images/hotels/placeholder.jpg",
  },
  {
    id: 2,
    hotel: "Atlantic Resort",
    city: "Agadir",
    checkIn: "2026-11-02",
    checkOut: "2026-11-05",
    status: "pending",
    amount: 4500,
    image: "/images/hotels/placeholder.jpg",
  },
  {
    id: 3,
    hotel: "Dar Chefchaouen",
    city: "Chefchaouen",
    checkIn: "2026-05-01",
    checkOut: "2026-05-04",
    status: "completed",
    amount: 1350,
    image: "/images/hotels/placeholder.jpg",
  },
  {
    id: 4,
    hotel: "Fes Palace Hotel",
    city: "Fes",
    checkIn: "2026-04-10",
    checkOut: "2026-04-11",
    status: "cancelled",
    amount: 2000,
    image: "/images/hotels/placeholder.jpg",
  },
];

const reviews = [
  {
    id: 1,
    hotel: "Dar Chefchaouen",
    rating: 5,
    comment: "Décoration magnifique, très authentique, je recommande.",
    date: "2026-05-06",
  },
  {
    id: 2,
    hotel: "Fes Palace Hotel",
    rating: 4,
    comment: "Suite royale exceptionnelle, service impeccable.",
    date: "2026-04-13",
  },
];

const favorites = [
  {
    id: "22222222-2222-2222-2222-222222222001",
    name: "Riad Yasmine",
    city: "Marrakech",
    price: 1200,
    rating: 4.5,
    image: "/images/hotels/placeholder.jpg",
  },
  {
    id: "22222222-2222-2222-2222-222222222007",
    name: "Essaouira Ocean Vue",
    city: "Essaouira",
    price: 700,
    rating: 4,
    image: "/images/hotels/placeholder.jpg",
  },
];

const conversations = [
  {
    id: 1,
    hotel: "Riad Atlas Bleu",
    lastMessage: "Votre chambre sera prête dès 14h, à bientôt !",
    date: "Il y a 2h",
    unread: true,
  },
  {
    id: 2,
    hotel: "Atlantic Resort",
    lastMessage: "Merci pour votre question, nous vérifions la disponibilité.",
    date: "Hier",
    unread: false,
  },
];
// --- Fin des donnees statiques ---

function statusInfo(status: string) {
  switch (status) {
    case "confirmed":
      return {
        label: "Confirmée",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle size={12} />,
      };
    case "pending":
      return {
        label: "En attente",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <Clock size={12} />,
      };
    case "cancelled":
      return {
        label: "Annulée",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle size={12} />,
      };
    case "completed":
      return {
        label: "Terminée",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: <CheckCircle size={12} />,
      };
    default:
      return {
        label: status,
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: null,
      };
  }
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<
    "all" | "upcoming" | "past"
  >("all");
  const [authUser, setAuthUser] = useState<{
    name: string;
    email: string;
    phone?: string;
  } | null>(null);

  // --- Authentification reelle : recupere le nom/email via auth-service ---
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const cachedUser = localStorage.getItem("auth_user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (cachedUser) setAuthUser(JSON.parse(cachedUser));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expirée");
        return res.json();
      })
      .then((data) => setAuthUser(data.user))
      .catch(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        router.push("/login");
      });
  }, [router]);

  function handleLogout() {
    const token = localStorage.getItem("auth_token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      router.push("/");
    });
  }

  const now = new Date();
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === "all") return true;
    const checkIn = new Date(b.checkIn);
    if (bookingFilter === "upcoming")
      return checkIn >= now && b.status !== "cancelled";
    return checkIn < now || b.status === "cancelled";
  });

  const upcomingCount = bookings.filter(
    (b) => new Date(b.checkIn) >= now && b.status !== "cancelled",
  ).length;

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return renderOverview();
      case "bookings":
        return renderBookings();
      case "reviews":
        return renderReviews();
      case "favorites":
        return renderFavorites();
      case "messages":
        return renderMessages();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: palette.gray }}>
              Réservations à venir
            </span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palette.primary + "20",
                color: palette.primary,
              }}
            >
              <CalendarCheck size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: palette.dark }}>
            {upcomingCount}
          </div>
        </div>

        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: palette.gray }}>
              Avis laissés
            </span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palette.sand + "20",
                color: palette.sand,
              }}
            >
              <Star size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: palette.dark }}>
            {reviews.length}
          </div>
        </div>

        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: palette.gray }}>
              Hôtels favoris
            </span>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: palette.brown + "20",
                color: palette.brown,
              }}
            >
              <Heart size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold" style={{ color: palette.dark }}>
            {favorites.length}
          </div>
        </div>
      </div>

      <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg" style={{ color: palette.dark }}>
            Prochaine réservation
          </h3>
          <button
            onClick={() => setActiveMenu("bookings")}
            className="text-sm hover:opacity-70"
            style={{ color: palette.primary }}
          >
            Voir tout
          </button>
        </div>
        {(() => {
          const next = bookings
            .filter(
              (b) => new Date(b.checkIn) >= now && b.status !== "cancelled",
            )
            .sort(
              (a, b) =>
                new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
            )[0];
          if (!next)
            return (
              <p className="text-sm" style={{ color: palette.gray }}>
                Aucune réservation à venir.
              </p>
            );
          const s = statusInfo(next.status);
          return (
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={next.image}
                  alt={next.hotel}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: palette.dark }}>
                  {next.hotel}
                </p>
                <p
                  className="text-sm flex items-center gap-1"
                  style={{ color: palette.gray }}
                >
                  <MapPin size={13} color={palette.primary} /> {next.city}
                </p>
                <p className="text-xs mt-1" style={{ color: palette.gray }}>
                  {next.checkIn} → {next.checkOut}
                </p>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${s.bg} ${s.text}`}
              >
                {s.icon}
                {s.label}
              </span>
            </div>
          );
        })()}
      </div>

      <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
        <h3
          className="font-display text-lg mb-4"
          style={{ color: palette.dark }}
        >
          Messages récents
        </h3>
        <div className="space-y-2">
          {conversations.slice(0, 2).map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveMenu("messages")}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-[#DED9D0]/20 transition cursor-pointer"
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: palette.dark }}
                >
                  {c.hotel}
                </p>
                <p
                  className="text-xs line-clamp-1"
                  style={{ color: palette.gray }}
                >
                  {c.lastMessage}
                </p>
              </div>
              {c.unread && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: palette.brown }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
          Mes réservations
        </h2>
        <div className="flex gap-1.5">
          {[
            { id: "all", label: "Toutes" },
            { id: "upcoming", label: "À venir" },
            { id: "past", label: "Passées" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setBookingFilter(f.id as any)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                bookingFilter === f.id
                  ? "border-[#7F9BA9] bg-[#7F9BA9]/10 text-[#7F9BA9] font-medium"
                  : "border-[#DED9D0] text-[#595B57]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredBookings.map((b) => {
          const s = statusInfo(b.status);
          return (
            <div
              key={b.id}
              className="bg-[#FDFDFD] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4"
            >
              <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={b.image}
                  alt={b.hotel}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium" style={{ color: palette.dark }}>
                    {b.hotel}
                  </p>
                  <p
                    className="text-sm flex items-center gap-1"
                    style={{ color: palette.gray }}
                  >
                    <MapPin size={13} color={palette.primary} /> {b.city}
                  </p>
                  <p className="text-xs mt-1" style={{ color: palette.gray }}>
                    {b.checkIn} → {b.checkOut}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-2 ${s.bg} ${s.text}`}
                  >
                    {s.icon}
                    {s.label}
                  </span>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span
                    className="font-bold"
                    style={{ color: palette.primary }}
                  >
                    {b.amount} MAD
                  </span>
                  <div className="flex gap-2">
                    {b.status === "confirmed" && (
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg border"
                        style={{
                          borderColor: palette.cream,
                          color: palette.brown,
                        }}
                      >
                        Annuler
                      </button>
                    )}
                    {b.status === "completed" && (
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg text-white"
                        style={{ backgroundColor: palette.primary }}
                      >
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredBookings.length === 0 && (
          <p
            className="text-sm text-center py-10"
            style={{ color: palette.gray }}
          >
            Aucune réservation dans cette catégorie.
          </p>
        )}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-4">
      <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
        Mes avis
      </h2>
      {reviews.map((r) => (
        <div key={r.id} className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium" style={{ color: palette.dark }}>
              {r.hotel}
            </p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < r.rating ? palette.sand : "none"}
                  color={i < r.rating ? palette.sand : palette.cream}
                />
              ))}
            </div>
          </div>
          <p className="text-sm" style={{ color: palette.gray }}>
            {r.comment}
          </p>
          <p className="text-xs mt-1" style={{ color: palette.gray }}>
            {r.date}
          </p>
        </div>
      ))}
      {reviews.length === 0 && (
        <p className="text-sm" style={{ color: palette.gray }}>
          Vous n'avez pas encore laissé d'avis.
        </p>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-4">
      <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
        Favoris
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((f) => (
          <Link
            href={`/hotels/${f.id}`}
            key={f.id}
            className="bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex"
          >
            <div className="relative w-28 shrink-0">
              <Image src={f.image} alt={f.name} fill className="object-cover" />
            </div>
            <div className="p-4 flex-1">
              <p className="font-medium" style={{ color: palette.dark }}>
                {f.name}
              </p>
              <p
                className="text-sm flex items-center gap-1"
                style={{ color: palette.gray }}
              >
                <MapPin size={13} color={palette.primary} /> {f.city}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className="text-xs flex items-center gap-1"
                  style={{ color: palette.gray }}
                >
                  <Star size={12} fill={palette.sand} color={palette.sand} />{" "}
                  {f.rating}
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: palette.primary }}
                >
                  {f.price} MAD
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {favorites.length === 0 && (
        <p className="text-sm" style={{ color: palette.gray }}>
          Aucun hôtel favori pour l'instant.
        </p>
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-4">
      <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
        Messages
      </h2>
      <div
        className="bg-[#FDFDFD] rounded-2xl shadow-sm divide-y"
        style={{ borderColor: palette.cream }}
      >
        {conversations.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-4 hover:bg-[#DED9D0]/10 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: palette.primary }}
              >
                {c.hotel.charAt(0)}
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: palette.dark }}
                >
                  {c.hotel}
                </p>
                <p
                  className="text-xs line-clamp-1"
                  style={{ color: palette.gray }}
                >
                  {c.lastMessage}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs" style={{ color: palette.gray }}>
                {c.date}
              </span>
              {c.unread && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: palette.brown }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {conversations.length === 0 && (
        <p className="text-sm" style={{ color: palette.gray }}>
          Aucun message pour l'instant.
        </p>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
        Profil & paramètres
      </h2>

      <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
        <h3
          className="font-display text-lg mb-4"
          style={{ color: palette.dark }}
        >
          Informations personnelles
        </h3>
        <div className="space-y-3 max-w-md">
          <div>
            <label
              className="text-sm font-medium block mb-1"
              style={{ color: palette.gray }}
            >
              Nom complet
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="text"
                defaultValue={authUser?.name ?? ""}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: palette.cream, color: palette.dark }}
              />
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium block mb-1"
              style={{ color: palette.gray }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="email"
                defaultValue={authUser?.email ?? ""}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: palette.cream, color: palette.dark }}
              />
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium block mb-1"
              style={{ color: palette.gray }}
            >
              Téléphone
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="tel"
                defaultValue={authUser?.phone ?? ""}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: palette.cream, color: palette.dark }}
              />
            </div>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: palette.primary }}
          >
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
        <h3
          className="font-display text-lg mb-4"
          style={{ color: palette.dark }}
        >
          Mot de passe
        </h3>
        <div className="space-y-3 max-w-md">
          <div>
            <label
              className="text-sm font-medium block mb-1"
              style={{ color: palette.gray }}
            >
              Mot de passe actuel
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="password"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: palette.cream, color: palette.dark }}
              />
            </div>
          </div>
          <div>
            <label
              className="text-sm font-medium block mb-1"
              style={{ color: palette.gray }}
            >
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="password"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: palette.cream, color: palette.dark }}
              />
            </div>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: palette.primary }}
          >
            Mettre à jour le mot de passe
          </button>
        </div>
      </div>

      <div
        className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm border-l-4"
        style={{ borderLeftColor: "#EF4444" }}
      >
        <h3
          className="font-display text-lg mb-2"
          style={{ color: palette.dark }}
        >
          Zone sensible
        </h3>
        <p className="text-sm mb-3" style={{ color: palette.gray }}>
          La suppression de votre compte est définitive et efface toutes vos
          données.
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ backgroundColor: "#EF4444" }}
        >
          <Trash2 size={15} /> Supprimer mon compte
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Navbar simplifiee, coherente avec celle du dashboard partenaire */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDFD]/95 backdrop-blur-md shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: palette.primary }}
            >
              <span className="text-white font-display text-lg">د</span>
            </div>
            <span
              className="font-display text-xl"
              style={{ color: palette.dark }}
            >
              Dar<span style={{ color: palette.brown }}>iwane</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-[#7F9BA9]/10 transition">
              <Bell size={20} style={{ color: palette.gray }} />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: palette.primary }}
              >
                {authUser?.name ? authUser.name.charAt(0).toUpperCase() : "?"}
              </div>
              <span
                className="text-sm font-medium hidden md:block"
                style={{ color: palette.dark }}
              >
                {authUser?.name ?? "..."}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 transition"
              title="Déconnexion"
            >
              <LogOut size={18} style={{ color: "#EF4444" }} />
            </button>
          </div>
        </nav>
      </header>

      <div className="flex pt-20">
        <aside
          className={`fixed left-0 top-20 h-[calc(100vh-80px)] w-64 bg-[#FDFDFD] border-r border-[#DED9D0] overflow-y-auto z-30 transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                  activeMenu === item.id
                    ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                    : "text-[#595B57] hover:bg-[#7F9BA9]/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg bg-[#FDFDFD]"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <main className="flex-1 lg:ml-64 p-6">
          <div className="mb-6">
            <h1
              className="font-display text-2xl md:text-3xl"
              style={{ color: palette.dark }}
            >
              {menuItems.find((m) => m.id === activeMenu)?.label}
            </h1>
            <p className="text-sm" style={{ color: palette.gray }}>
              {authUser?.name
                ? `Bienvenue, ${authUser.name.split(" ")[0]}`
                : "Bienvenue"}
            </p>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
