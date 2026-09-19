// app/partner/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";

import {
  LayoutDashboard,
  Bed,
  DollarSign,
  Star,
  Settings,
  Users,
  Bell,
  Link2, // ✅ NOUVEAU
  Link2Off,
  ChevronRight,
  Plus,
  Shield,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  TrendingUp,
  Calendar as CalendarIcon,
  Home,
  Menu,
  X,
  Filter,
  MoreVertical,
  BarChart3,
  PieChart,
  Activity,
  LogOut,
  HelpCircle,
  Search,
  Upload,
  Bot,
  MessageCircle,
  PhoneCall,
  Clock3,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = "https://chat-service-production-eeb1.up.railway.app/api";
import PartnerCalendar from "@/components/PartnerCalendar";

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

type Callback = {
  id: string;
  lead_name: string | null;
  lead_phone: string | null;
  summary: string | null;
  status: "in_progress" | "notified" | "contacted"; // ✅ ajout de in_progress
  messages?: { role: "user" | "assistant"; content: string }[];
  created_at: string;
};

const menuItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Tableau de bord",
    id: "dashboard",
  },
  { icon: <Bed size={18} />, label: "Chambres", id: "rooms" },
  { icon: <CalendarIcon size={18} />, label: "Agenda", id: "calendar" },
  { icon: <Users size={18} />, label: "Réservations", id: "bookings" },
  { icon: <Star size={18} />, label: "Avis", id: "reviews" },
  { icon: <BarChart3 size={18} />, label: "Statistiques", id: "stats" },
  { icon: <Settings size={18} />, label: "Paramètres", id: "settings" },
];

const statsData = {
  occupancy: 78,
  revenue: 45600,
  bookings: 34,
  upcomingBookings: 12,
  revenueChange: 12.5,
  bookingsChange: 8.3,
  occupancyChange: 5.2,
};

const upcomingBookings = [
  {
    id: 1,
    client: "Sophie Martin",
    room: "Suite Royale",
    checkIn: "2024-03-20",
    checkOut: "2024-03-23",
    status: "confirmed",
    amount: 5400,
    avatar: "SM",
  },
  {
    id: 2,
    client: "Ahmed Benali",
    room: "Chambre Deluxe",
    checkIn: "2024-03-21",
    checkOut: "2024-03-22",
    status: "pending",
    amount: 1200,
    avatar: "AB",
  },
  {
    id: 3,
    client: "Maria Garcia",
    room: "Suite Prestige",
    checkIn: "2024-03-22",
    checkOut: "2024-03-25",
    status: "confirmed",
    amount: 6600,
    avatar: "MG",
  },
  {
    id: 4,
    client: "John Smith",
    room: "Chambre Standard",
    checkIn: "2024-03-23",
    checkOut: "2024-03-24",
    status: "cancelled",
    amount: 800,
    avatar: "JS",
  },
];

const recentReviews = [
  {
    id: 1,
    client: "Sophie Martin",
    rating: 5,
    comment: "Séjour parfait, service exceptionnel !",
    date: "2024-03-18",
    room: "Suite Royale",
    avatar: "SM",
  },
  {
    id: 2,
    client: "Ahmed Benali",
    rating: 4,
    comment: "Très bel hôtel, personnel attentionné.",
    date: "2024-03-16",
    room: "Chambre Deluxe",
    avatar: "AB",
  },
];

const roomsData = [
  {
    id: 1,
    name: "Chambre Deluxe",
    price: 1200,
    capacity: 2,
    size: "35 m²",
    status: "available",
    bookings: 45,
    image: "/images/rooms/deluxe.jpg",
  },
  {
    id: 2,
    name: "Suite Royale",
    price: 1800,
    capacity: 4,
    size: "65 m²",
    status: "occupied",
    bookings: 28,
    image: "/images/rooms/royale.jpg",
  },
  {
    id: 3,
    name: "Suite Prestige",
    price: 2200,
    capacity: 4,
    size: "80 m²",
    status: "maintenance",
    bookings: 12,
    image: "/images/rooms/prestige.jpg",
  },
];

const notifications = [
  {
    id: 1,
    title: "Nouvelle réservation",
    message: "Sophie Martin a réservé la Suite Royale",
    time: "Il y a 5 min",
    type: "booking",
    read: false,
  },
  {
    id: 2,
    title: "Avis client",
    message: "Ahmed Benali a laissé un avis 4 étoiles",
    time: "Il y a 2h",
    type: "review",
    read: false,
  },
  {
    id: 3,
    title: "Confirmation requise",
    message: "Veuillez confirmer la réservation de Maria Garcia",
    time: "Il y a 4h",
    type: "alert",
    read: true,
  },
];

export default function PartnerDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [selectedCallback, setSelectedCallback] = useState<Callback | null>(
    null,
  );
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [authUser, setAuthUser] = useState<{
    name: string;
    role: string;
    id: string;
  } | null>(null);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string | null>(null);
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [isLoadingCallbacks, setIsLoadingCallbacks] = useState(true);
  const [callbackFilter, setCallbackFilter] = useState("all");
  const [hotelData, setHotelData] = useState<{
    name: string;
    city: string;
    address: string;
    description: string;
    amenities: string[];
    image: string | null;
  } | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
  });
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [googleStatus, setGoogleStatus] = useState<{
    connected: boolean;
    google_email: string | null;
  } | null>(null);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const cachedUser = localStorage.getItem("auth_user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (cachedUser) setAuthUser(JSON.parse(cachedUser));

    fetch(`/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expirée");
        return res.json();
      })
      .then((data) => {
        setAuthUser(data.user);
        return fetch(`/api/hotels/mine?owner_id=${data.user.id}`);
      })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setHotelId(json.data.id);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    if (!hotelId) return;
    fetch(`/api/hotels/${hotelId}`)
      .then((res) => res.json())
      .then((json) => {
        const h = json.data;
        setHotelData(h);
        setSettingsForm({
          name: h.name ?? "",
          city: h.location ?? "",
          address: h.address ?? "",
          description: h.description ?? "",
        });
        setAmenities(h.amenities ?? []);
      })
      .catch((err) => console.error(err));
  }, [hotelId]);

  // ✅ Récupérer le statut Google Calendar de l'hôtel
  useEffect(() => {
    if (!hotelId) return;
    fetch(`${API_URL}/google/status?hotel_id=${hotelId}`)
      .then((res) => res.json())
      .then((json) => setGoogleStatus(json))
      .catch((err) => console.error("Google status error:", err));
  }, [hotelId]);

  // ✅ Détecter le retour de Google OAuth (paramètre ?google=connected)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") {
      // Re-fetch le statut après la connexion
      if (hotelId) {
        fetch(`${API_URL}/google/status?hotel_id=${hotelId}`)
          .then((res) => res.json())
          .then((json) => setGoogleStatus(json))
          .catch(console.error);
      }
      // Nettoyer l'URL
      window.history.replaceState({}, "", "/partner/dashboard");
    }
  }, [hotelId]);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function addAmenity() {
    const value = newAmenity.trim();
    if (value && !amenities.includes(value))
      setAmenities((prev) => [...prev, value]);
    setNewAmenity("");
  }

  function removeAmenity(a: string) {
    setAmenities((prev) => prev.filter((x) => x !== a));
  }

  async function handleSaveSettings() {
    if (!hotelId || !authUser) return;
    setIsSavingSettings(true);
    setSettingsMessage(null);

    const formData = new FormData();
    formData.append("owner_id", authUser.id);
    formData.append("name", settingsForm.name);
    formData.append("city", settingsForm.city);
    formData.append("address", settingsForm.address);
    formData.append("description", settingsForm.description);
    amenities.forEach((a, i) => formData.append(`amenities[${i}]`, a));
    if (coverFile) formData.append("cover_image", coverFile);

    try {
      const res = await fetch(`/api/hotels/${hotelId}`, {
        method: "POST", // POST + _method=PUT, pas de vrai PUT (upload de fichier)
        body: formData,
      });
      if (!res.ok) throw new Error("Échec de la mise à jour");
      const json = await res.json();
      setHotelData(json.data);
      setCoverFile(null);
      setCoverPreview(null);
      setSettingsMessage({
        type: "success",
        text: "Modifications enregistrées avec succès.",
      });
    } catch (err) {
      setSettingsMessage({
        type: "error",
        text: "Une erreur est survenue, réessayez.",
      });
    } finally {
      setIsSavingSettings(false);
    }
  }

  // ✅ useEffect pour fetch les callbacks
  useEffect(() => {
    if (!hotelId) return;
    setIsLoadingCallbacks(true);
    fetch(`${API_URL}/chat/todos?hotel_id=${hotelId}`)
      .then((res) => res.json())
      .then((json) => {
        const data: Callback[] = (json.data ?? []).map((cb: any) => ({
          ...cb,
          messages: cb.messages ?? [], // ✅ toujours un tableau
          lead_name: cb.lead_name ?? null,
          lead_phone: cb.lead_phone ?? null,
          summary: cb.summary ?? null,
        }));
        setCallbacks(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingCallbacks(false));
  }, [hotelId]);
  useEffect(() => {
    if (!hotelId) return;
    fetch(`/api/hotels/${hotelId}`)
      .then((res) => res.json())
      .then((json) => setHotelName(json.data?.name ?? null))
      .catch((err) => console.error(err));
  }, [hotelId]);
  async function markAsHandled(id: string) {
    await fetch(`${API_URL}/chat/todos/${id}/handled`, {
      method: "POST",
    });
    setCallbacks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "contacted" } : c)),
    );
    setShowConversationModal(false);
  }

  async function connectGoogle() {
    if (!hotelId || isConnectingGoogle) return;
    setIsConnectingGoogle(true);
    try {
      const res = await fetch(`${API_URL}/google/connect?hotel_id=${hotelId}`);
      const data = await res.json();
      if (data.auth_url) {
        // Rediriger vers Google
        window.location.href = data.auth_url;
      }
    } catch (err) {
      console.error("Erreur connexion Google:", err);
      setIsConnectingGoogle(false);
    }
  }
  const filteredCallbacks = callbacks.filter((cb) => {
    if (callbackFilter === "all") return true;
    if (callbackFilter === "in_progress") return cb.status === "in_progress";
    if (callbackFilter === "pending") return cb.status === "notified";
    if (callbackFilter === "contacted") return cb.status === "contacted";
    return true;
  });
  const pendingCallbacksCount = callbacks.filter(
    (cb) => cb.status === "notified",
  ).length;

  function getInitials(name: string | null) {
    if (!name) return "?";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getStatusInfo(status: string) {
    const statusMap: Record<
      string,
      { label: string; bg: string; text: string; dot: string }
    > = {
      in_progress: {
        label: "En cours",
        bg: "bg-red-100",
        text: "text-red-700",
        dot: "#EF4444",
      },
      notified: {
        label: "À contacter",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        dot: "#EAB308",
      },
      contacted: {
        label: "Contacté",
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "#22C55E",
      },
    };
    return statusMap[status] || statusMap.in_progress;
  }
  function toWhatsAppNumber(phone: string | null): string {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, ""); // garde uniquement les chiffres
    if (digits.startsWith("212")) return digits;
    if (digits.startsWith("0")) return "212" + digits.slice(1);
    return digits;
  }

  function buildWhatsAppLink(
    callback: Callback,
    hotelName: string | null,
  ): string {
    const number = toWhatsAppNumber(callback.lead_phone);
    const name = callback.lead_name ? callback.lead_name : "";
    const greeting = name ? `Bonjour ${name}` : "Bonjour";
    const hotelPart = hotelName ? ` de l'hôtel ${hotelName}` : "";

    const message = `${greeting}, c'est Moha${hotelPart} — vous nous avez contactés récemment au sujet de : "${callback.summary ?? "votre demande"}". Je reviens vers vous pour en discuter, êtes-vous disponible ?`;

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function openConversation(callback: Callback) {
    setSelectedCallback(callback);
    setShowConversationModal(true);
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return renderDashboard();
      case "rooms":
        return renderRooms();
      case "calendar":
        return renderCalendar();
      case "bookings":
        return renderBookings();
      case "reviews":
        return renderReviews();
      case "stats":
        return renderStats();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // ============ DASHBOARD ============
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Taux d'occupation",
            value: `${statsData.occupancy}%`,
            icon: <Home size={18} />,
            color: palette.primary,
            change: statsData.occupancyChange,
          },
          {
            label: "Revenus du mois",
            value: `${statsData.revenue.toLocaleString("fr-FR")} MAD`,
            icon: <DollarSign size={18} />,
            color: palette.sand,
            change: statsData.revenueChange,
          },
          {
            label: "Réservations",
            value: statsData.bookings,
            icon: <CalendarIcon size={18} />,
            color: palette.brown,
            change: statsData.bookingsChange,
          },
          {
            label: "Réservations à venir",
            value: statsData.upcomingBookings,
            icon: <Users size={18} />,
            color: palette.primaryDark,
            change: null,
          },
        ].map((stat, i) => (
          <div key={i} className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: palette.gray }}>
                {stat.label}
              </span>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: stat.color + "20",
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: palette.dark }}>
              {stat.value}
            </div>
            {stat.change !== null && (
              <div className="flex items-center gap-1 text-xs mt-1">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-green-500">{stat.change}%</span>
                <span style={{ color: palette.gray }}>vs mois dernier</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✅ Pavé "À faire" CORRIGÉ */}
      <div
        className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm border-l-4"
        style={{ borderLeftColor: palette.sand }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`,
              }}
            >
              <Bot size={22} color="white" />
              {pendingCallbacksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-pulse">
                  {pendingCallbacksCount}
                </span>
              )}
            </div>
            <div>
              <h3
                className="font-display text-lg flex items-center gap-2"
                style={{ color: palette.dark }}
              >
                À faire
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#E9B883]/20 text-[#7A5237]">
                  Demandes du chatbot
                </span>
              </h3>
              <p className="text-xs" style={{ color: palette.gray }}>
                {pendingCallbacksCount > 0
                  ? `${pendingCallbacksCount} personne${pendingCallbacksCount > 1 ? "s" : ""} à recontacter`
                  : "Aucune demande en attente"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "Toutes", count: callbacks.length },
              {
                id: "in_progress",
                label: "En cours",
                count: callbacks.filter((c) => c.status === "in_progress")
                  .length,
              },
              {
                id: "pending",
                label: "À contacter",
                count: pendingCallbacksCount,
              },
              {
                id: "contacted",
                label: "Traitées",
                count: callbacks.filter((c) => c.status === "contacted").length,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setCallbackFilter(filter.id)}
                className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                  callbackFilter === filter.id
                    ? "border-[#7F9BA9] bg-[#7F9BA9]/10 text-[#7F9BA9] font-medium"
                    : "border-[#DED9D0] text-[#595B57] hover:border-[#7F9BA9]/30"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {isLoadingCallbacks ? (
          <p
            className="text-sm text-center py-8"
            style={{ color: palette.gray }}
          >
            Chargement des demandes...
          </p>
        ) : filteredCallbacks.length > 0 ? (
          <div className="space-y-3">
            {filteredCallbacks.map((callback) => {
              const statusInfo = getStatusInfo(callback.status);
              return (
                <div
                  key={callback.id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                  }}
                  onClick={() => openConversation(callback)}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{ backgroundColor: palette.primary }}
                      >
                        {getInitials(callback.lead_name)}
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                        style={{
                          backgroundColor:
                            callback.status === "notified"
                              ? "#EAB308"
                              : "#22C55E",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p
                          className="font-medium text-sm"
                          style={{ color: palette.dark }}
                        >
                          {callback.lead_name ?? "Client anonyme"}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 text-xs mb-1"
                        style={{ color: palette.primary }}
                      >
                        <PhoneCall size={14} />
                        <span className="font-medium">
                          {callback.lead_phone}
                        </span>
                      </div>
                      <p
                        className="text-xs line-clamp-2"
                        style={{ color: palette.gray }}
                      >
                        💬 {callback.summary}
                      </p>
                      <div
                        className="flex items-center gap-3 mt-1.5 text-[10px]"
                        style={{ color: palette.gray }}
                      >
                        <span className="flex items-center gap-1">
                          <Clock3 size={10} />
                          {new Date(callback.created_at).toLocaleString(
                            "fr-FR",
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={10} />
                          {callback.messages?.length ?? 0} messages
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${getStatusInfo(callback.status).bg} ${getStatusInfo(callback.status).text}`}
                  >
                    {getStatusInfo(callback.status).label}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    {/* ✅ Balise <a> correctement ouverte */}
                    <a
                      href={buildWhatsAppLink(callback, hotelName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg transition hover:scale-105"
                      style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}
                      title="Contacter sur WhatsApp"
                    >
                      <PhoneCall size={14} />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openConversation(callback);
                      }}
                      className="p-2 rounded-lg transition hover:scale-105"
                      style={{
                        backgroundColor: palette.primary + "15",
                        color: palette.primary,
                      }}
                      title="Voir la conversation"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: palette.gray }}>
            <Sparkles
              size={40}
              className="mx-auto mb-2"
              style={{ color: palette.cream }}
            />
            <p className="text-sm">Aucune demande dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Réservations à venir et Avis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-display text-lg"
              style={{ color: palette.dark }}
            >
              Réservations à venir
            </h3>
            <Link
              href="#"
              className="text-sm hover:opacity-70"
              style={{ color: palette.primary }}
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingBookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#DED9D0]/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {booking.avatar}
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: palette.dark }}
                    >
                      {booking.client}
                    </p>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {booking.room} · {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status === "confirmed"
                      ? "Confirmé"
                      : booking.status === "pending"
                        ? "En attente"
                        : "Annulé"}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: palette.primary }}
                  >
                    {booking.amount} MAD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-display text-lg"
              style={{ color: palette.dark }}
            >
              Derniers avis
            </h3>
            <Link
              href="#"
              className="text-sm hover:opacity-70"
              style={{ color: palette.primary }}
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="p-3 rounded-xl hover:bg-[#DED9D0]/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: palette.sand }}
                  >
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className="font-medium text-sm"
                        style={{ color: palette.dark }}
                      >
                        {review.client}
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? palette.sand : "none"}
                            color={
                              i < review.rating ? palette.sand : palette.cream
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {review.comment}
                    </p>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {review.room} · {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ============ ROOMS ============
  const renderRooms = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
          Gestion des chambres
        </h2>
        <button
          onClick={() => setShowRoomModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
          style={{ backgroundColor: palette.primary }}
        >
          <Plus size={18} /> Ajouter une chambre
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roomsData.map((room) => (
          <div
            key={room.id}
            className="bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="relative h-40 bg-[#DED9D0]">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover"
              />
              <div
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium text-white ${
                  room.status === "available"
                    ? "bg-green-500"
                    : room.status === "occupied"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {room.status === "available"
                  ? "Disponible"
                  : room.status === "occupied"
                    ? "Occupée"
                    : "Maintenance"}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display" style={{ color: palette.dark }}>
                    {room.name}
                  </h3>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    {room.capacity} pers. · {room.size}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="font-bold"
                    style={{ color: palette.primary }}
                  >
                    {room.price}
                  </span>
                  <span className="text-xs" style={{ color: palette.gray }}>
                    {" "}
                    MAD
                  </span>
                </div>
              </div>
              <div
                className="flex items-center justify-between mt-3 pt-3 border-t"
                style={{ borderColor: palette.cream }}
              >
                <span className="text-xs" style={{ color: palette.gray }}>
                  {room.bookings} réservations
                </span>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition">
                    <Edit size={16} style={{ color: palette.gray }} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition">
                    <Trash2 size={16} style={{ color: "#EF4444" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============ CALENDAR ============
  const renderCalendar = () => {
    if (!hotelId) return null;
    return <PartnerCalendar hotelId={hotelId} apiUrl={API_URL} />;
  };

  // ============ BOOKINGS ============
  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
          Réservations
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: palette.gray }}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none"
              style={{
                borderColor: palette.cream,
                backgroundColor: palette.white,
                color: palette.dark,
              }}
            />
          </div>
          <button
            className="px-4 py-2 rounded-xl border text-sm font-medium transition hover:bg-[#DED9D0]/20"
            style={{ borderColor: palette.cream, color: palette.gray }}
          >
            <Filter size={16} className="inline mr-1" /> Filtres
          </button>
        </div>
      </div>
      <div className="bg-[#FDFDFD] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${palette.cream}` }}>
                {[
                  "Client",
                  "Chambre",
                  "Dates",
                  "Montant",
                  "Statut",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: palette.gray }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking) => (
                <tr
                  key={booking.id}
                  style={{ borderBottom: `1px solid ${palette.cream}` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                        style={{ backgroundColor: palette.primary }}
                      >
                        {booking.avatar}
                      </div>
                      <span className="text-sm" style={{ color: palette.dark }}>
                        {booking.client}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: palette.gray }}
                  >
                    {booking.room}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: palette.gray }}
                  >
                    {booking.checkIn} → {booking.checkOut}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-medium"
                    style={{ color: palette.primary }}
                  >
                    {booking.amount} MAD
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status === "confirmed"
                        ? "Confirmé"
                        : booking.status === "pending"
                          ? "En attente"
                          : "Annulé"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition">
                      <MoreVertical size={16} style={{ color: palette.gray }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============ REVIEWS ============
  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
          Avis clients
        </h2>
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: palette.gray }}
        >
          <Star size={16} fill={palette.sand} color={palette.sand} />
          <span className="font-bold" style={{ color: palette.dark }}>
            4.8
          </span>
          <span>· 342 avis</span>
        </div>
      </div>
      <div className="space-y-4">
        {recentReviews.map((review) => (
          <div
            key={review.id}
            className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: palette.sand }}
              >
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium" style={{ color: palette.dark }}>
                      {review.client}
                    </p>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {review.room} · {review.date}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? palette.sand : "none"}
                        color={i < review.rating ? palette.sand : palette.cream}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm" style={{ color: palette.gray }}>
                  {review.comment}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    className="px-4 py-1.5 rounded-lg text-white text-xs font-medium transition hover:opacity-90"
                    style={{ backgroundColor: palette.primary }}
                  >
                    Répondre
                  </button>
                  <button
                    className="px-4 py-1.5 rounded-lg border text-xs font-medium transition hover:bg-[#DED9D0]/20"
                    style={{ borderColor: palette.cream, color: palette.gray }}
                  >
                    Signaler
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ============ STATS ============
  const renderStats = () => (
    <div className="space-y-6">
      <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
        Statistiques
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} style={{ color: palette.primary }} />
            <span className="font-medium" style={{ color: palette.dark }}>
              Taux d'occupation
            </span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ color: palette.primary }}
          >
            {statsData.occupancy}%
          </div>
          <div
            className="w-full h-2 rounded-full mt-3"
            style={{ backgroundColor: palette.cream }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${statsData.occupancy}%`,
                backgroundColor: palette.primary,
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: palette.gray }}>
            Objectif : 85%
          </p>
        </div>
        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={18} style={{ color: palette.sand }} />
            <span className="font-medium" style={{ color: palette.dark }}>
              Revenus
            </span>
          </div>
          <div className="text-3xl font-bold" style={{ color: palette.sand }}>
            {statsData.revenue.toLocaleString()} MAD
          </div>
          <div className="flex items-center gap-1 text-xs mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-green-500">{statsData.revenueChange}%</span>
            <span style={{ color: palette.gray }}>vs mois dernier</span>
          </div>
        </div>
        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <PieChart size={18} style={{ color: palette.brown }} />
            <span className="font-medium" style={{ color: palette.dark }}>
              Réservations
            </span>
          </div>
          <div className="text-3xl font-bold" style={{ color: palette.brown }}>
            {statsData.bookings}
          </div>
          <div className="flex items-center gap-1 text-xs mt-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-green-500">{statsData.bookingsChange}%</span>
            <span style={{ color: palette.gray }}>vs mois dernier</span>
          </div>
        </div>
      </div>
      <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
        <div className="text-center py-12" style={{ color: palette.gray }}>
          <BarChart3
            size={48}
            className="mx-auto mb-3"
            style={{ color: palette.cream }}
          />
          <p>Graphiques d'évolution</p>
          <p className="text-sm">Visualisez vos performances sur la période</p>
        </div>
      </div>
    </div>
  );

  // ============ SETTINGS ============
  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="font-display text-2xl" style={{ color: palette.dark }}>
        Paramètres de l'hôtel
      </h2>

      {!hotelData ? (
        <p className="text-sm" style={{ color: palette.gray }}>
          Chargement...
        </p>
      ) : (
        <>
          {settingsMessage && (
            <div
              className={`p-3 rounded-xl text-sm ${settingsMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            >
              {settingsMessage.text}
            </div>
          )}

          {/* Photo de couverture */}
          <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
            <h3
              className="font-display text-lg mb-4"
              style={{ color: palette.dark }}
            >
              Photo de couverture
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-[#DED9D0] shrink-0">
                <Image
                  src={
                    coverPreview ??
                    hotelData.image ??
                    "/images/hotels/placeholder.jpg"
                  }
                  alt="Couverture"
                  fill
                  className="object-cover"
                />
              </div>
              <label
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition hover:bg-[#DED9D0]/20"
                style={{ borderColor: palette.cream, color: palette.gray }}
              >
                <Camera size={16} />
                Changer la photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Informations */}
          <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
            <h3
              className="font-display text-lg mb-4"
              style={{ color: palette.dark }}
            >
              Informations de l'établissement
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Nom de l'hôtel
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) =>
                    setSettingsForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Ville
                  </label>
                  <input
                    type="text"
                    value={settingsForm.city}
                    onChange={(e) =>
                      setSettingsForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                      color: palette.dark,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm((f) => ({
                        ...f,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                      color: palette.dark,
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Description
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.description}
                  onChange={(e) =>
                    setSettingsForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none resize-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Equipements */}
          <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
            <h3
              className="font-display text-lg mb-4"
              style={{ color: palette.dark }}
            >
              Équipements
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {amenities.map((a) => (
                <span
                  key={a}
                  className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{
                    backgroundColor: palette.cream,
                    color: palette.dark,
                  }}
                >
                  {a}
                  <button
                    onClick={() => removeAmenity(a)}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAmenity())
                }
                placeholder="Ex : Piscine, Spa, Parking..."
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{ borderColor: palette.cream, color: palette.dark }}
              />
              <button
                onClick={addAmenity}
                className="px-4 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: palette.primaryDark }}
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* ✅ NOUVELLE SECTION : Google Calendar */}
          <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon size={20} style={{ color: palette.primary }} />
                <h3
                  className="font-display text-lg"
                  style={{ color: palette.dark }}
                >
                  Google Calendar
                </h3>
              </div>
              {googleStatus?.connected && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  Connecté
                </span>
              )}
            </div>

            {googleStatus === null ? (
              // État de chargement
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: palette.gray }}
              >
                <Loader2 size={16} className="animate-spin" />
                Vérification de la connexion...
              </div>
            ) : googleStatus.connected ? (
              // Connecté
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#22C55E20", color: "#22C55E" }}
                  >
                    <CheckCircle size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm"
                      style={{ color: palette.dark }}
                    >
                      Votre agenda est connecté
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: palette.gray }}
                    >
                      {googleStatus.google_email}
                    </p>
                  </div>
                </div>

                <p className="text-xs" style={{ color: palette.gray }}>
                  Moha propose automatiquement des créneaux libres de votre
                  agenda lorsqu'un client laisse ses coordonnées.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={connectGoogle}
                    disabled={isConnectingGoogle}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition hover:bg-[#DED9D0]/20 disabled:opacity-60"
                    style={{ borderColor: palette.cream, color: palette.gray }}
                  >
                    {isConnectingGoogle ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Link2 size={16} />
                    )}
                    Reconnecter
                  </button>
                </div>
              </div>
            ) : (
              // Non connecté
              <div className="space-y-4">
                <div
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: palette.cream + "40" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: palette.primary + "20",
                      color: palette.primary,
                    }}
                  >
                    <Link2Off size={20} />
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-medium text-sm"
                      style={{ color: palette.dark }}
                    >
                      Aucun agenda connecté
                    </p>
                    <p className="text-xs mt-1" style={{ color: palette.gray }}>
                      Connectez votre Google Calendar pour que Moha propose
                      automatiquement des créneaux de rendez-vous à vos clients.
                    </p>
                  </div>
                </div>

                <button
                  onClick={connectGoogle}
                  disabled={isConnectingGoogle}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-60 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: "#4285F4" }}
                >
                  {isConnectingGoogle ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    // Icône Google officielle
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#FFF"
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                      />
                      <path
                        fill="#FFF"
                        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                      />
                      <path
                        fill="#FFF"
                        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                      />
                      <path
                        fill="#FFF"
                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                      />
                    </svg>
                  )}
                  {isConnectingGoogle
                    ? "Connexion..."
                    : "Connecter Google Calendar"}
                </button>

                <div
                  className="flex items-start gap-2 text-xs"
                  style={{ color: palette.gray }}
                >
                  <Shield size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Vos données d'agenda restent confidentielles. Nous accédons
                    uniquement à vos disponibilités pour créer les rendez-vous.
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSavingSettings}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: palette.primary }}
          >
            {isSavingSettings ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            {isSavingSettings
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </>
      )}
    </div>
  );
  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Navbar
        isAuthenticated={true}
        userRole={authUser?.role ?? "hotel"}
        userName={authUser?.name ?? "..."}
      />

      <div className="flex pt-20">
        <aside
          className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-[#FDFDFD] border-r border-[#DED9D0] transition-all duration-300 z-30 ${
            isSidebarOpen ? "w-64" : "w-16"
          } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 overflow-y-auto`}
        >
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                  activeMenu === item.id
                    ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                    : "text-[#595B57] hover:bg-[#7F9BA9]/5"
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
            <div className="border-t border-[#DED9D0] my-4 pt-4">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-[#595B57] hover:bg-[#7F9BA9]/5">
                <HelpCircle size={18} />
                {isSidebarOpen && <span>Aide</span>}
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-50">
                <LogOut size={18} />
                {isSidebarOpen && <span>Déconnexion</span>}
              </button>
            </div>
          </nav>
        </aside>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg bg-[#FDFDFD]"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <main
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-16"} p-6`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1
                className="font-display text-2xl md:text-3xl"
                style={{ color: palette.dark }}
              >
                {menuItems.find((m) => m.id === activeMenu)?.label ||
                  "Tableau de bord"}
              </h1>
              <p className="text-sm" style={{ color: palette.gray }}>
                Bienvenue dans votre espace partenaire
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-[#7F9BA9]/10 transition"
              >
                <Menu size={20} style={{ color: palette.gray }} />
              </button>
              <button className="relative p-2 rounded-lg hover:bg-[#7F9BA9]/10 transition">
                <Bell size={20} style={{ color: palette.gray }} />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>

      {/* Modal Room */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                {editingRoom ? "Modifier la chambre" : "Ajouter une chambre"}
              </h3>
              <button
                onClick={() => {
                  setShowRoomModal(false);
                  setEditingRoom(null);
                }}
                className="p-1 hover:bg-[#DED9D0]/20 rounded-lg transition"
              >
                <X size={20} style={{ color: palette.gray }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Nom de la chambre
                </label>
                <input
                  type="text"
                  placeholder="Suite Royale"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Prix par nuit (MAD)
                  </label>
                  <input
                    type="number"
                    placeholder="1200"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                      color: palette.dark,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Capacité
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                      color: palette.dark,
                    }}
                  >
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4">4 personnes</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Description de la chambre..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none resize-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Photos
                </label>
                <div
                  className="border-2 border-dashed rounded-xl p-6 text-center"
                  style={{ borderColor: palette.cream }}
                >
                  <Upload
                    size={24}
                    className="mx-auto mb-2"
                    style={{ color: palette.gray }}
                  />
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Glissez vos photos ici ou cliquez pour les télécharger
                  </p>
                </div>
              </div>
              <div
                className="flex gap-3 pt-4 border-t"
                style={{ borderColor: palette.cream }}
              >
                <button
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border font-medium text-sm transition hover:opacity-70"
                  style={{ borderColor: palette.cream, color: palette.gray }}
                >
                  Annuler
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
                  style={{ backgroundColor: palette.primary }}
                >
                  {editingRoom ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal Conversation CORRIGÉE */}
      {showConversationModal && selectedCallback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: palette.cream }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: palette.primary }}
                >
                  {getInitials(selectedCallback.lead_name)}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: palette.dark }}>
                    {selectedCallback.lead_name ?? "Client anonyme"}
                  </p>
                  <p
                    className="text-xs flex items-center gap-1.5"
                    style={{ color: palette.primary }}
                  >
                    <PhoneCall size={14} />
                    {selectedCallback.lead_phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowConversationModal(false);
                  setSelectedCallback(null);
                }}
                className="p-1.5 hover:bg-[#DED9D0]/20 rounded-lg transition"
              >
                <X size={20} style={{ color: palette.gray }} />
              </button>
            </div>

            {/* Résumé */}
            <div
              className="px-5 py-3"
              style={{ backgroundColor: palette.sand + "15" }}
            >
              <div className="flex items-start gap-2">
                <Sparkles
                  size={14}
                  style={{ color: palette.sand }}
                  className="shrink-0 mt-0.5"
                />
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: palette.dark }}
                  >
                    Résumé de la demande
                  </p>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    {selectedCallback.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
              style={{ backgroundColor: "#F8F6F3" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: palette.cream }}
                />
                <span className="text-xs" style={{ color: palette.gray }}>
                  {new Date(selectedCallback.created_at).toLocaleString(
                    "fr-FR",
                  )}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: palette.cream }}
                />
              </div>

              {(selectedCallback.messages ?? []).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-1.5 mb-1">
                      {msg.role === "assistant" ? (
                        <>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: palette.primary }}
                          >
                            <Bot size={11} color="white" />
                          </div>
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: palette.primary }}
                          >
                            Moha
                          </span>
                        </>
                      ) : (
                        <>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                            style={{ backgroundColor: palette.sand }}
                          >
                            {getInitials(selectedCallback.lead_name)}
                          </div>
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: palette.gray }}
                          >
                            {selectedCallback.lead_name ?? "Client"}
                          </span>
                        </>
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-white border border-[#DED9D0]/30 rounded-bl-sm"
                          : "bg-[#7F9BA9] text-white rounded-br-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Actions CORRIGÉES */}
            <div
              className="flex flex-col sm:flex-row gap-2 px-5 py-4 border-t"
              style={{ borderColor: palette.cream }}
            >
              <a
                // ✅ Remplacer par

                href={buildWhatsAppLink(selectedCallback, hotelName)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
                style={{ backgroundColor: "#22C55E" }}
              >
                <PhoneCall size={16} />
                Contacter sur WhatsApp
              </a>
              <button
                onClick={() => markAsHandled(selectedCallback.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-medium text-sm transition hover:opacity-70"
                style={{ borderColor: palette.cream, color: palette.gray }}
              >
                <CheckCircle size={16} />
                Marquer comme traité
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ NAVBAR ============
function Navbar({
  isAuthenticated,
  userRole,
  userName,
}: {
  isAuthenticated: boolean;
  userRole: string;
  userName: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FDFDFD]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
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
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: palette.primary }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span
              className="text-sm font-medium hidden md:block"
              style={{ color: palette.dark }}
            >
              {userName}
            </span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-70"
            style={{ color: palette.gray }}
          >
            Quitter
          </Link>
        </div>
      </nav>
    </header>
  );
}
