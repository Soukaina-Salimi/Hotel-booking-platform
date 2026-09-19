// app/partner/dashboard/calendar/page.tsx
"use client";

import { useState, useEffect } from "react";
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
  Upload,
  FileText,
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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
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
    href: "/espace-partner/dashboard",
  },
  {
    icon: <Bed size={18} />,
    label: "Chambres",
    href: "/espace-partner/chambres",
  },
  {
    icon: <CalendarIcon size={18} />,
    label: "Agenda",
    href: "/espace-partner/calendar",
    active: true,
  },
  {
    icon: <Users size={18} />,
    label: "Réservations",
    href: "/espace-partner/bookings",
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

// Données des chambres
const roomsList = [
  { id: 1, name: "Chambre Deluxe", color: "#7F9BA9" },
  { id: 2, name: "Suite Royale", color: "#E9B883" },
  { id: 3, name: "Chambre Standard", color: "#A2836D" },
  { id: 4, name: "Suite Prestige", color: "#7A5237" },
  { id: 5, name: "Chambre Familiale", color: "#647C87" },
];

// Données du calendrier (simulées)
const generateMonthData = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  // Jours du mois précédent
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }

  // Jours du mois actuel
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }

  // Jours du mois suivant
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false });
  }

  return days;
};

// Données des disponibilités (simulées)
const availabilityData = {
  "1": {
    available: [
      1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23,
      24, 26, 27, 28, 29, 30, 31,
    ],
  },
  "2": {
    available: [
      1, 2, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 25, 26, 27,
      28, 29, 30,
    ],
  },
  "3": {
    available: [
      3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28,
      31,
    ],
  },
  "4": {
    available: [
      1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26,
      29, 30, 31,
    ],
  },
  "5": {
    available: [
      1, 2, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 27, 28, 29,
      30, 31,
    ],
  },
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

export default function CalendarManagementPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("fr-FR", { month: "long" });
  const days = generateMonthData(year, month);

  // Changer de mois
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDates([]);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDates([]);
  };

  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDates([]);
  };

  // Vérifier si un jour est disponible pour une chambre
  const isDayAvailable = (roomId: number, day: number) => {
    const roomData =
      availabilityData[String(roomId) as keyof typeof availabilityData];
    if (!roomData) return false;
    return roomData.available.includes(day);
  };

  // Toggle sélection d'un jour
  const toggleDaySelection = (day: number) => {
    if (!selectedRoom) return;
    setSelectedDates((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Vérifier si un jour est sélectionné
  const isDaySelected = (day: number) => {
    return selectedDates.includes(day);
  };

  // Appliquer les disponibilités
  const applyAvailability = (status: boolean) => {
    if (!selectedRoom || selectedDates.length === 0) return;
    console.log(
      `Mise à jour des disponibilités pour la chambre ${selectedRoom}`,
      {
        dates: selectedDates,
        status,
      },
    );
    setSelectedDates([]);
    setIsBulkModalOpen(false);
  };

  // Obtenir le nombre de jours disponibles pour une chambre
  const getAvailableDaysCount = (roomId: number) => {
    const roomData =
      availabilityData[String(roomId) as keyof typeof availabilityData];
    if (!roomData) return 0;
    return roomData.available.length;
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
                Gestion des disponibilités
              </h1>
              <p className="text-sm" style={{ color: palette.gray }}>
                Gérez les disponibilités de vos chambres par date
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
                onClick={goToday}
                className="px-4 py-2.5 rounded-xl border text-sm font-medium transition hover:bg-[#DED9D0]/20"
                style={{ borderColor: palette.cream, color: palette.gray }}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90"
                style={{ backgroundColor: palette.primary }}
              >
                <CalendarIcon size={16} />
                Gestion par lots
              </button>
            </div>
          </div>

          {/* Sélecteur de chambre */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedRoom(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedRoom === null
                  ? "bg-[#7F9BA9] text-white"
                  : "bg-[#FDFDFD] text-[#595B57] hover:bg-[#DED9D0]/20"
              }`}
            >
              Toutes les chambres
            </button>
            {roomsList.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  selectedRoom === room.id
                    ? "text-white"
                    : "bg-[#FDFDFD] text-[#595B57] hover:bg-[#DED9D0]/20"
                }`}
                style={
                  selectedRoom === room.id
                    ? { backgroundColor: room.color }
                    : {}
                }
              >
                {room.name}
              </button>
            ))}
          </div>

          {/* Légende */}
          <div
            className="flex flex-wrap items-center gap-4 mb-4 text-sm"
            style={{ color: palette.gray }}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#22C55E" }}
              ></span>
              Disponible
            </span>
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: "#EF4444" }}
              ></span>
              Indisponible
            </span>
            <span className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded border-2"
                style={{ borderColor: palette.primary }}
              ></span>
              Sélectionnée
            </span>
            {selectedRoom && selectedDates.length > 0 && (
              <span
                className="flex items-center gap-2"
                style={{ color: palette.primary }}
              >
                {selectedDates.length} jour{selectedDates.length > 1 ? "s" : ""}{" "}
                sélectionné{selectedDates.length > 1 ? "s" : ""}
                <button
                  onClick={() => setSelectedDates([])}
                  className="text-xs text-red-500 hover:underline"
                >
                  (désélectionner)
                </button>
              </span>
            )}
          </div>

          {/* Calendrier */}
          <div className="bg-[#FDFDFD] rounded-2xl shadow-sm overflow-hidden">
            {/* En-tête du calendrier */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: palette.cream }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-[#DED9D0]/20 transition"
                >
                  <ChevronLeft size={20} style={{ color: palette.gray }} />
                </button>
                <h2
                  className="font-display text-xl"
                  style={{ color: palette.dark }}
                >
                  {monthName.charAt(0).toUpperCase() + monthName.slice(1)}{" "}
                  {year}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-[#DED9D0]/20 transition"
                >
                  <ChevronRightIcon size={20} style={{ color: palette.gray }} />
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    viewMode === "month"
                      ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                      : "text-[#595B57] hover:bg-[#DED9D0]/20"
                  }`}
                >
                  Mois
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    viewMode === "week"
                      ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                      : "text-[#595B57] hover:bg-[#DED9D0]/20"
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setViewMode("day")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    viewMode === "day"
                      ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                      : "text-[#595B57] hover:bg-[#DED9D0]/20"
                  }`}
                >
                  Jour
                </button>
              </div>
            </div>

            {/* Grille du calendrier */}
            <div className="p-4 overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[700px]">
                {/* Jours de la semaine */}
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium py-2"
                      style={{ color: palette.gray }}
                    >
                      {day}
                    </div>
                  ),
                )}

                {/* Jours du mois */}
                {days.map((day, index) => {
                  const isAvailable =
                    selectedRoom && isDayAvailable(selectedRoom, day.day);
                  const isSelected = selectedRoom && isDaySelected(day.day);
                  const isToday =
                    day.day === new Date().getDate() && day.currentMonth;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (selectedRoom && day.currentMonth) {
                          toggleDaySelection(day.day);
                        }
                      }}
                      className={`relative p-2 rounded-lg text-center transition cursor-pointer ${
                        !day.currentMonth ? "opacity-30" : ""
                      } ${isSelected ? "ring-2 ring-[#7F9BA9]" : ""} ${
                        isToday ? "font-bold" : ""
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? palette.primary + "20"
                          : isAvailable
                            ? "#22C55E20"
                            : selectedRoom && day.currentMonth
                              ? "#EF444420"
                              : "transparent",
                        color: isSelected
                          ? palette.primary
                          : isAvailable
                            ? "#22C55E"
                            : selectedRoom && day.currentMonth
                              ? "#EF4444"
                              : palette.dark,
                      }}
                    >
                      <span className="text-sm">{day.day}</span>
                      {selectedRoom && day.currentMonth && (
                        <div
                          className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                            isAvailable ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Liste des chambres avec disponibilités */}
          <div className="mt-6">
            <h3
              className="font-display text-lg mb-3"
              style={{ color: palette.dark }}
            >
              Résumé des disponibilités
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {roomsList.map((room) => (
                <div
                  key={room.id}
                  className="bg-[#FDFDFD] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: room.color }}
                    ></div>
                    <span
                      className="font-medium text-sm"
                      style={{ color: palette.dark }}
                    >
                      {room.name}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm" style={{ color: palette.gray }}>
                      Disponible
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: palette.primary }}
                    >
                      {getAvailableDaysCount(room.id)}
                    </span>
                    <span className="text-xs" style={{ color: palette.gray }}>
                      / {days.filter((d) => d.currentMonth).length} jours
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 rounded-full mt-2"
                    style={{ backgroundColor: palette.cream }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(getAvailableDaysCount(room.id) / days.filter((d) => d.currentMonth).length) * 100}%`,
                        backgroundColor: room.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Légende des statuts des chambres */}
          <div className="mt-4 bg-[#FDFDFD] rounded-xl p-4 shadow-sm">
            <h4
              className="text-sm font-medium mb-2"
              style={{ color: palette.dark }}
            >
              Légende des statuts
            </h4>
            <div
              className="flex flex-wrap gap-4 text-sm"
              style={{ color: palette.gray }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#22C55E" }}
                ></span>
                Disponible
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#EF4444" }}
                ></span>
                Indisponible
              </span>
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border-2"
                  style={{ borderColor: palette.primary }}
                ></span>
                Sélectionnée
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de gestion par lots */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Gestion par lots
              </h3>
              <button
                onClick={() => setIsBulkModalOpen(false)}
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
                  Chambre
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                >
                  <option value="">Toutes les chambres</option>
                  {roomsList.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Période
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                    style={{
                      borderColor: palette.cream,
                      backgroundColor: palette.white,
                      color: palette.dark,
                    }}
                  />
                  <input
                    type="date"
                    className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
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
                  Action
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="available"
                      defaultChecked
                      className="accent-[#7F9BA9]"
                    />
                    Rendre disponible
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="unavailable"
                      className="accent-[#7F9BA9]"
                    />
                    Rendre indisponible
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="bulkAction"
                      value="seasonal"
                      className="accent-[#7F9BA9]"
                    />
                    Appliquer tarif saisonnier
                  </label>
                </div>
              </div>

              <div
                className="flex gap-3 pt-4 border-t"
                style={{ borderColor: palette.cream }}
              >
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border font-medium text-sm transition hover:opacity-70"
                  style={{ borderColor: palette.cream, color: palette.gray }}
                >
                  Annuler
                </button>
                <button
                  className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90"
                  style={{ backgroundColor: palette.primary }}
                >
                  Appliquer
                </button>
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

  useEffect(() => {
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
