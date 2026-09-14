// app/partner/dashboard/bookings/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  DollarSign,
  Star,
  Settings,
  Users,
  MessageSquare,
  Bell,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Home,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Filter,
  Download,
  Printer,
  MoreVertical,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Building2,
  User,
  KeyRound,
  Shield,
  LogOut,
  HelpCircle,
  Search,
  RefreshCw,
  CheckCircle,
  Check,
  AlertTriangle,
  Wifi,
  Coffee,
  Utensils,
  Waves,
  Dumbbell,
  Car,
  Snowflake,
  Tv,
  Maximize,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
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

// Menu de navigation du dashboard
const menuItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Tableau de bord",
    href: "/partner/dashboard",
  },
  {
    icon: <Bed size={18} />,
    label: "Chambres",
    href: "/espace-partner/chambres",
  },
  {
    icon: <CalendarIcon size={18} />,
    label: "Disponibilités",
    href: "/espace-partner/calendar",
  },
  {
    icon: <Users size={18} />,
    label: "Réservations",
    href: "/espace-partner/bookings",
    active: true,
  },
  {
    icon: <Star size={18} />,
    label: "Avis",
    href: "/espace-partner/reviews",
  },
  {
    icon: <BarChart3 size={18} />,
    label: "Statistiques",
    href: "/partner/dashboard/stats",
  },
  {
    icon: <Settings size={18} />,
    label: "Paramètres",
    href: "/partner/dashboard/settings",
  },
];

// Données des réservations
const bookingsData = [
  {
    id: 1,
    client: "Sophie Martin",
    avatar: "SM",
    email: "sophie.martin@email.com",
    phone: "+212 6 12 34 56 78",
    room: "Suite Royale",
    roomId: 2,
    checkIn: "2024-03-20",
    checkOut: "2024-03-23",
    nights: 3,
    guests: 2,
    amount: 5400,
    status: "confirmed",
    payment: "paid",
    createdAt: "2024-03-15",
    specialRequests: "Vue sur le jardin",
  },
  {
    id: 2,
    client: "Ahmed Benali",
    avatar: "AB",
    email: "ahmed.benali@email.com",
    phone: "+212 6 98 76 54 32",
    room: "Chambre Deluxe",
    roomId: 1,
    checkIn: "2024-03-21",
    checkOut: "2024-03-22",
    nights: 1,
    guests: 2,
    amount: 1200,
    status: "pending",
    payment: "pending",
    createdAt: "2024-03-16",
    specialRequests: "",
  },
  {
    id: 3,
    client: "Maria Garcia",
    avatar: "MG",
    email: "maria.garcia@email.com",
    phone: "+212 6 55 44 33 22",
    room: "Suite Prestige",
    roomId: 4,
    checkIn: "2024-03-22",
    checkOut: "2024-03-25",
    nights: 3,
    guests: 4,
    amount: 6600,
    status: "confirmed",
    payment: "paid",
    createdAt: "2024-03-18",
    specialRequests: "Lit bébé, chaise haute",
  },
  {
    id: 4,
    client: "John Smith",
    avatar: "JS",
    email: "john.smith@email.com",
    phone: "+212 6 11 22 33 44",
    room: "Chambre Standard",
    roomId: 3,
    checkIn: "2024-03-23",
    checkOut: "2024-03-24",
    nights: 1,
    guests: 1,
    amount: 800,
    status: "cancelled",
    payment: "refunded",
    createdAt: "2024-03-10",
    specialRequests: "",
  },
  {
    id: 5,
    client: "Fatima Zahra",
    avatar: "FZ",
    email: "fatima.zahra@email.com",
    phone: "+212 6 77 88 99 00",
    room: "Chambre Deluxe",
    roomId: 1,
    checkIn: "2024-03-24",
    checkOut: "2024-03-26",
    nights: 2,
    guests: 2,
    amount: 2400,
    status: "pending",
    payment: "pending",
    createdAt: "2024-03-19",
    specialRequests: "Petit-déjeuner végétarien",
  },
  {
    id: 6,
    client: "Pierre Dubois",
    avatar: "PD",
    email: "pierre.dubois@email.com",
    phone: "+212 6 66 55 44 33",
    room: "Suite Royale",
    roomId: 2,
    checkIn: "2024-03-25",
    checkOut: "2024-03-28",
    nights: 3,
    guests: 2,
    amount: 5400,
    status: "confirmed",
    payment: "paid",
    createdAt: "2024-03-17",
    specialRequests: "Bouteille de champagne",
  },
  {
    id: 7,
    client: "Yasmine El Fassi",
    avatar: "YE",
    email: "yasmine.elfassi@email.com",
    phone: "+212 6 44 33 22 11",
    room: "Suite Prestige",
    roomId: 4,
    checkIn: "2024-03-26",
    checkOut: "2024-03-28",
    nights: 2,
    guests: 4,
    amount: 4400,
    status: "completed",
    payment: "paid",
    createdAt: "2024-03-20",
    specialRequests: "",
  },
  {
    id: 8,
    client: "Karim Benjelloun",
    avatar: "KB",
    email: "karim.benjelloun@email.com",
    phone: "+212 6 33 22 11 00",
    room: "Suite Royale",
    roomId: 2,
    checkIn: "2024-03-27",
    checkOut: "2024-03-29",
    nights: 2,
    guests: 2,
    amount: 3600,
    status: "pending",
    payment: "pending",
    createdAt: "2024-03-21",
    specialRequests: "Salle de sport",
  },
];

// Statistiques des réservations
const statsData = {
  total: bookingsData.length,
  confirmed: bookingsData.filter((b) => b.status === "confirmed").length,
  pending: bookingsData.filter((b) => b.status === "pending").length,
  cancelled: bookingsData.filter((b) => b.status === "cancelled").length,
  completed: bookingsData.filter((b) => b.status === "completed").length,
  totalRevenue: bookingsData.reduce(
    (sum, b) => (b.status !== "cancelled" ? sum + b.amount : sum),
    0,
  ),
  paid: bookingsData.filter((b) => b.payment === "paid").length,
  pendingPayment: bookingsData.filter((b) => b.payment === "pending").length,
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

export default function BookingsManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtrer les réservations
  const filteredBookings = bookingsData.filter((booking) => {
    const matchSearch =
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery);

    const matchStatus =
      statusFilter === "all" || booking.status === statusFilter;
    const matchPayment =
      paymentFilter === "all" || booking.payment === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  // Obtenir le statut affiché
  const getStatusInfo = (status: string) => {
    const statusMap = {
      confirmed: {
        label: "Confirmée",
        color: "#22C55E",
        bg: "bg-green-100",
        text: "text-green-700",
      },
      pending: {
        label: "En attente",
        color: "#EAB308",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      },
      cancelled: {
        label: "Annulée",
        color: "#EF4444",
        bg: "bg-red-100",
        text: "text-red-700",
      },
      completed: {
        label: "Terminée",
        color: "#3B82F6",
        bg: "bg-blue-100",
        text: "text-blue-700",
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // Obtenir le statut de paiement
  const getPaymentInfo = (payment: string) => {
    const paymentMap = {
      paid: {
        label: "Payé",
        color: "#22C55E",
        bg: "bg-green-100",
        text: "text-green-700",
      },
      pending: {
        label: "En attente",
        color: "#EAB308",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      },
      refunded: {
        label: "Remboursé",
        color: "#8B5CF6",
        bg: "bg-purple-100",
        text: "text-purple-700",
      },
    };
    return paymentMap[payment] || paymentMap.pending;
  };

  // Ouvrir le détail d'une réservation
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Confirmer une réservation
  const handleConfirm = (id: number) => {
    console.log("Réservation confirmée", id);
    // Logique de confirmation
  };

  // Annuler une réservation
  const handleCancel = (id: number) => {
    console.log("Réservation annulée", id);
    // Logique d'annulation
  };

  // Contacter le client
  const handleContact = (booking) => {
    console.log("Contacter le client", booking);
    // Logique de contact
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Layout principal */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-[#FDFDFD] border-r border-[#DED9D0] transition-all duration-300 z-30 ${
            isSidebarOpen ? "w-64" : "w-16"
          } ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 overflow-y-auto`}
        >
          <nav className="p-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                  item.active
                    ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                    : "text-[#595B57] hover:bg-[#7F9BA9]/5"
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}

            <div className="border-t border-[#DED9D0] my-4 pt-4">
              <Link
                href="/help"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-[#595B57] hover:bg-[#7F9BA9]/5"
              >
                <HelpCircle size={18} />
                {isSidebarOpen && <span>Aide</span>}
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-50">
                <LogOut size={18} />
                {isSidebarOpen && <span>Déconnexion</span>}
              </button>
            </div>
          </nav>
        </aside>

        {/* Toggle sidebar mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full shadow-lg bg-[#FDFDFD]"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Contenu principal */}
        <main
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-16"} p-6`}
        >
          {/* En-tête */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1
                className="font-display text-2xl md:text-3xl"
                style={{ color: palette.dark }}
              >
                Gestion des réservations
              </h1>
              <p className="text-sm" style={{ color: palette.gray }}>
                Consultez et gérez toutes vos réservations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-[#7F9BA9]/10 transition"
              >
                <Menu size={20} style={{ color: palette.gray }} />
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition hover:bg-[#DED9D0]/20"
                style={{ borderColor: palette.cream, color: palette.gray }}
              >
                <Download size={16} />
                Exporter
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
                style={{ backgroundColor: palette.primary }}
              >
                <RefreshCw size={16} />
                Actualiser
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div
                className="text-xl font-bold"
                style={{ color: palette.dark }}
              >
                {statsData.total}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Total
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#22C55E" }}>
                {statsData.confirmed}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Confirmées
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#EAB308" }}>
                {statsData.pending}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                En attente
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#3B82F6" }}>
                {statsData.completed}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Terminées
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#EF4444" }}>
                {statsData.cancelled}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Annulées
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div
                className="text-xl font-bold"
                style={{ color: palette.primary }}
              >
                {statsData.totalRevenue.toLocaleString()} MAD
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Revenus
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div
                className="text-xl font-bold"
                style={{ color: palette.sand }}
              >
                {statsData.pendingPayment}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Paiements en attente
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: palette.gray }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une réservation..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{
                  borderColor: palette.cream,
                  backgroundColor: palette.white,
                  color: palette.dark,
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{
                borderColor: palette.cream,
                backgroundColor: palette.white,
                color: palette.dark,
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="confirmed">Confirmée</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{
                borderColor: palette.cream,
                backgroundColor: palette.white,
                color: palette.dark,
              }}
            >
              <option value="all">Tous les paiements</option>
              <option value="paid">Payé</option>
              <option value="pending">En attente</option>
              <option value="refunded">Remboursé</option>
            </select>
            <button
              className="p-2.5 rounded-xl border text-sm font-medium transition hover:bg-[#DED9D0]/20"
              style={{ borderColor: palette.cream, color: palette.gray }}
            >
              <Filter size={18} />
            </button>
          </div>

          {/* Liste des réservations */}
          {filteredBookings.length > 0 ? (
            <div className="bg-[#FDFDFD] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${palette.cream}` }}>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Client
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Chambre
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Dates
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Montant
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Statut
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Paiement
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: palette.gray }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const statusInfo = getStatusInfo(booking.status);
                      const paymentInfo = getPaymentInfo(booking.payment);
                      return (
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
                              <div>
                                <div
                                  className="text-sm font-medium"
                                  style={{ color: palette.dark }}
                                >
                                  {booking.client}
                                </div>
                                <div
                                  className="text-xs"
                                  style={{ color: palette.gray }}
                                >
                                  {booking.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="text-sm"
                              style={{ color: palette.dark }}
                            >
                              {booking.room}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: palette.gray }}
                            >
                              {booking.guests} pers.
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="text-sm"
                              style={{ color: palette.dark }}
                            >
                              {booking.checkIn}
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: palette.gray }}
                            >
                              → {booking.checkOut}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              className="text-sm font-medium"
                              style={{ color: palette.primary }}
                            >
                              {booking.amount.toLocaleString()} MAD
                            </div>
                            <div
                              className="text-xs"
                              style={{ color: palette.gray }}
                            >
                              {booking.nights} nuit
                              {booking.nights > 1 ? "s" : ""}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}
                            >
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${paymentInfo.bg} ${paymentInfo.text}`}
                            >
                              {paymentInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewDetails(booking)}
                                className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition"
                                title="Voir les détails"
                              >
                                <Eye
                                  size={16}
                                  style={{ color: palette.gray }}
                                />
                              </button>
                              {booking.status === "pending" && (
                                <button
                                  onClick={() => handleConfirm(booking.id)}
                                  className="p-1.5 rounded-lg hover:bg-green-50 transition"
                                  title="Confirmer"
                                >
                                  <Check
                                    size={16}
                                    style={{ color: "#22C55E" }}
                                  />
                                </button>
                              )}
                              {booking.status !== "cancelled" &&
                                booking.status !== "completed" && (
                                  <button
                                    onClick={() => handleCancel(booking.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 transition"
                                    title="Annuler"
                                  >
                                    <XCircle
                                      size={16}
                                      style={{ color: "#EF4444" }}
                                    />
                                  </button>
                                )}
                              <button
                                onClick={() => handleContact(booking)}
                                className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition"
                                title="Contacter"
                              >
                                <MessageSquare
                                  size={16}
                                  style={{ color: palette.gray }}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FDFDFD] rounded-2xl">
              <CalendarIcon
                size={48}
                className="mx-auto mb-3"
                style={{ color: palette.cream }}
              />
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Aucune réservation trouvée
              </h3>
              <p className="text-sm" style={{ color: palette.gray }}>
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de détail */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Détails de la réservation
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-[#DED9D0]/20 rounded-lg transition"
              >
                <X size={20} style={{ color: palette.gray }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Client */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#DED9D0]/20 rounded-xl p-4">
                  <h4
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: palette.gray }}
                  >
                    Client
                  </h4>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                      style={{ backgroundColor: palette.primary }}
                    >
                      {selectedBooking.avatar}
                    </div>
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: palette.dark }}
                      >
                        {selectedBooking.client}
                      </p>
                      <p className="text-sm" style={{ color: palette.gray }}>
                        {selectedBooking.email}
                      </p>
                      <p className="text-sm" style={{ color: palette.gray }}>
                        {selectedBooking.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#DED9D0]/20 rounded-xl p-4">
                  <h4
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: palette.gray }}
                  >
                    Réservation
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span
                        className="font-medium"
                        style={{ color: palette.gray }}
                      >
                        Référence :
                      </span>{" "}
                      <span style={{ color: palette.dark }}>
                        #RES-{String(selectedBooking.id).padStart(4, "0")}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span
                        className="font-medium"
                        style={{ color: palette.gray }}
                      >
                        Date de réservation :
                      </span>{" "}
                      <span style={{ color: palette.dark }}>
                        {selectedBooking.createdAt}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span
                        className="font-medium"
                        style={{ color: palette.gray }}
                      >
                        Statut :
                      </span>{" "}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${getStatusInfo(selectedBooking.status).bg} ${getStatusInfo(selectedBooking.status).text}`}
                      >
                        {getStatusInfo(selectedBooking.status).label}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chambre */}
              <div className="bg-[#DED9D0]/20 rounded-xl p-4">
                <h4
                  className="text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: palette.gray }}
                >
                  Chambre
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      Nom
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.dark }}
                    >
                      {selectedBooking.room}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      Voyageurs
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.dark }}
                    >
                      {selectedBooking.guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      Nuits
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.dark }}
                    >
                      {selectedBooking.nights}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      Prix total
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.primary }}
                    >
                      {selectedBooking.amount.toLocaleString()} MAD
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-[#DED9D0]/20 rounded-xl p-4">
                <h4
                  className="text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: palette.gray }}
                >
                  Séjour
                </h4>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      Arrivée
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.dark }}
                    >
                      {selectedBooking.checkIn}
                    </p>
                  </div>
                  <ArrowRight size={20} style={{ color: palette.gray }} />
                  <div>
                    <p className="text-xs" style={{ color: palette.gray }}>
                      Départ
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: palette.dark }}
                    >
                      {selectedBooking.checkOut}
                    </p>
                  </div>
                </div>
              </div>

              {/* Demandes spéciales */}
              {selectedBooking.specialRequests && (
                <div className="bg-[#DED9D0]/20 rounded-xl p-4">
                  <h4
                    className="text-xs font-medium uppercase tracking-wider mb-2"
                    style={{ color: palette.gray }}
                  >
                    Demandes spéciales
                  </h4>
                  <p className="text-sm" style={{ color: palette.dark }}>
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Paiement */}
              <div className="bg-[#DED9D0]/20 rounded-xl p-4">
                <h4
                  className="text-xs font-medium uppercase tracking-wider mb-2"
                  style={{ color: palette.gray }}
                >
                  Paiement
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: palette.gray }}>
                    Statut du paiement
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPaymentInfo(selectedBooking.payment).bg} ${getPaymentInfo(selectedBooking.payment).text}`}
                  >
                    {getPaymentInfo(selectedBooking.payment).label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex gap-3 pt-4 border-t"
                style={{ borderColor: palette.cream }}
              >
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 py-2.5 rounded-xl border font-medium text-sm transition hover:opacity-70"
                  style={{ borderColor: palette.cream, color: palette.gray }}
                >
                  Fermer
                </button>
                {selectedBooking.status === "pending" && (
                  <button
                    onClick={() => {
                      handleConfirm(selectedBooking.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
                    style={{ backgroundColor: "#22C55E" }}
                  >
                    Confirmer
                  </button>
                )}
                {selectedBooking.status !== "cancelled" &&
                  selectedBooking.status !== "completed" && (
                    <button
                      onClick={() => {
                        handleCancel(selectedBooking.id);
                        setShowDetailModal(false);
                      }}
                      className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      Annuler
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Navbar
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useState(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FDFDFD]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
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

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-[#7F9BA9]/10 transition">
            <Bell size={20} style={{ color: palette.gray }} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: palette.primary }}
            >
              AB
            </div>
            <span
              className="text-sm font-medium hidden md:block"
              style={{ color: palette.dark }}
            >
              Ahmed Benali
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
