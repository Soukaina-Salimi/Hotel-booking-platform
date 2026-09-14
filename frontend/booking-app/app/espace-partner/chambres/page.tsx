// app/partner/dashboard/chambres/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Bed,
  DollarSign,
  Star,
  Settings,
  Users,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  Menu,
  X,
  Search,
  Upload,
  BarChart3,
  Calendar as CalendarIcon,
  HelpCircle,
  LogOut,
  FileText,
  Maximize,
  Loader2,
} from "lucide-react";
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
    active: true,
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
  },
  { icon: <Star size={18} />, label: "Avis", href: "/espace-partner/reviews" },
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

const AMENITY_OPTIONS = [
  "Wi-Fi",
  "Climatisation",
  "TV",
  "Mini-bar",
  "Terrasse",
  "Jacuzzi",
  "Bain",
  "Salon",
];

type Room = {
  id: string;
  room_type: string;
  description: string | null;
  price: number;
  capacity: number;
  size: string | null;
  bed_type: string | null;
  status: "available" | "occupied" | "maintenance";
  image: string | null;
  amenities: string[];
  featured: boolean;
};

type RoomForm = {
  room_type: string;
  price: string;
  description: string;
  capacity: string;
  size: string;
  bed_type: string;
  status: Room["status"];
  amenities: string[];
};

const EMPTY_FORM: RoomForm = {
  room_type: "",
  price: "",
  description: "",
  capacity: "2",
  size: "",
  bed_type: "",
  status: "available",
  amenities: [],
};

export default function RoomsManagementPage() {
  const router = useRouter();

  // Auth / hôtel
  const [authUser, setAuthUser] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);
  const [hotelId, setHotelId] = useState<string | null>(null);

  // Chambres
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // UI
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Modal d'ajout/édition
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<RoomForm>(EMPTY_FORM);
  const [roomImageFile, setRoomImageFile] = useState<File | null>(null);
  const [roomImagePreview, setRoomImagePreview] = useState<string | null>(null);
  const [isSavingRoom, setIsSavingRoom] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal de détail (Eye)
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);

  // --------------------------------------------------------------------
  // Auth + récupération de l'hôtel du partenaire connecté
  // --------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expirée");
        return res.json();
      })
      .then((data) => {
        setAuthUser(data.user);
        return fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/hotels/mine?owner_id=${data.user.id}`,
        );
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

  // --------------------------------------------------------------------
  // Chambres : fetch
  // --------------------------------------------------------------------
  async function fetchRooms(id: string) {
    setIsLoadingRooms(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms?hotel_id=${id}`,
      );
      const json = await res.json();
      setRooms(json.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRooms(false);
    }
  }

  useEffect(() => {
    if (hotelId) fetchRooms(hotelId);
  }, [hotelId]);

  // --------------------------------------------------------------------
  // Filtrage
  // --------------------------------------------------------------------
  const filteredRooms = rooms.filter((room) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      room.room_type.toLowerCase().includes(q) ||
      (room.description ?? "").toLowerCase().includes(q) ||
      (room.bed_type ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || room.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statsData = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  // --------------------------------------------------------------------
  // Modal add/edit — ouverture / fermeture
  // --------------------------------------------------------------------
  function openAddModal() {
    setEditingRoom(null);
    setRoomForm(EMPTY_FORM);
    setRoomImageFile(null);
    setRoomImagePreview(null);
    setFormError(null);
    setShowModal(true);
  }

  function openEditModal(room: Room) {
    setEditingRoom(room);
    setRoomForm({
      room_type: room.room_type,
      price: String(room.price),
      description: room.description ?? "",
      capacity: String(room.capacity),
      size: room.size ?? "",
      bed_type: room.bed_type ?? "",
      status: room.status,
      amenities: room.amenities ?? [],
    });
    setRoomImageFile(null);
    setRoomImagePreview(null);
    setFormError(null);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingRoom(null);
  }

  function handleRoomImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRoomImageFile(file);
    setRoomImagePreview(URL.createObjectURL(file));
  }

  function toggleAmenity(amenity: string) {
    setRoomForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  }

  // --------------------------------------------------------------------
  // Sauvegarde (create / update)
  // --------------------------------------------------------------------
  async function handleSaveRoom() {
    if (!authUser || !hotelId) return;

    if (!roomForm.room_type.trim() || !roomForm.price) {
      setFormError("Le nom et le prix sont obligatoires.");
      return;
    }

    setIsSavingRoom(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("owner_id", authUser.id);
    if (!editingRoom) formData.append("hotel_id", hotelId);
    formData.append("room_type", roomForm.room_type);
    formData.append("price", roomForm.price);
    formData.append("capacity", roomForm.capacity);
    formData.append("description", roomForm.description);
    formData.append("size", roomForm.size);
    formData.append("bed_type", roomForm.bed_type);
    formData.append("status", roomForm.status);
    roomForm.amenities.forEach((a, i) => formData.append(`amenities[${i}]`, a));
    if (roomImageFile) formData.append("image", roomImageFile);

    try {
      const url = editingRoom
        ? `${process.env.NEXT_PUBLIC_API_URL}/rooms/${editingRoom.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/rooms`;

      const res = await fetch(url, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Échec de l'enregistrement");
      const json = await res.json();

      if (editingRoom) {
        setRooms((prev) =>
          prev.map((r) => (r.id === json.data.id ? json.data : r)),
        );
      } else {
        setRooms((prev) => [json.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setFormError("Une erreur est survenue, réessayez.");
    } finally {
      setIsSavingRoom(false);
    }
  }

  // --------------------------------------------------------------------
  // Suppression
  // --------------------------------------------------------------------
  async function handleDelete(room: Room) {
    if (!authUser) return;
    if (
      !confirm(
        `Supprimer la chambre "${room.room_type}" ? Cette action est irréversible.`,
      )
    )
      return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/rooms/${room.id}?owner_id=${authUser.id}`,
        { method: "DELETE" },
      );
      setRooms((prev) => prev.filter((r) => r.id !== room.id));
    } catch (err) {
      console.error(err);
    }
  }

  // --------------------------------------------------------------------
  // Statut affiché
  // --------------------------------------------------------------------
  function getStatusInfo(status: Room["status"]) {
    const statusMap: Record<
      string,
      { label: string; color: string; bg: string; text: string }
    > = {
      available: {
        label: "Disponible",
        color: "#22C55E",
        bg: "bg-green-100",
        text: "text-green-700",
      },
      occupied: {
        label: "Occupée",
        color: "#EAB308",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      },
      maintenance: {
        label: "Maintenance",
        color: "#EF4444",
        bg: "bg-red-100",
        text: "text-red-700",
      },
    };
    return statusMap[status] || statusMap.available;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      <Navbar userName={authUser?.name ?? "..."} />

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
          {/* En-tête */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1
                className="font-display text-2xl md:text-3xl"
                style={{ color: palette.dark }}
              >
                Gestion des chambres
              </h1>
              <p className="text-sm" style={{ color: palette.gray }}>
                Gérez vos chambres, leurs équipements et leurs disponibilités
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
                onClick={openAddModal}
                disabled={!hotelId}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus size={18} />
                Ajouter une chambre
              </button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
                {statsData.available}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Disponibles
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#EAB308" }}>
                {statsData.occupied}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Occupées
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#EF4444" }}>
                {statsData.maintenance}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Maintenance
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
                placeholder="Rechercher une chambre..."
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
              <option value="available">Disponible</option>
              <option value="occupied">Occupée</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-[#7F9BA9]/10 text-[#7F9BA9]" : "text-[#595B57] hover:bg-[#7F9BA9]/5"}`}
              >
                <LayoutDashboard size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-[#7F9BA9]/10 text-[#7F9BA9]" : "text-[#595B57] hover:bg-[#7F9BA9]/5"}`}
              >
                <FileText size={18} />
              </button>
            </div>
          </div>

          {/* Liste des chambres */}
          {isLoadingRooms ? (
            <div className="text-center py-16 bg-[#FDFDFD] rounded-2xl">
              <Loader2
                size={32}
                className="mx-auto mb-3 animate-spin"
                style={{ color: palette.primary }}
              />
              <p className="text-sm" style={{ color: palette.gray }}>
                Chargement des chambres...
              </p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {filteredRooms.map((room) => {
                const statusInfo = getStatusInfo(room.status);
                return (
                  <div
                    key={room.id}
                    className={`bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition ${
                      viewMode === "list" ? "flex flex-col md:flex-row" : ""
                    }`}
                  >
                    <div
                      className={`relative ${viewMode === "grid" ? "h-48" : "md:w-48 h-48"} bg-[#DED9D0]`}
                    >
                      <Image
                        src={room.image || "/images/rooms/placeholder.jpg"}
                        alt={room.room_type}
                        fill
                        className="object-cover"
                      />
                      {room.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9B883]">
                            ⭐ Populaire
                          </span>
                        </div>
                      )}
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </div>
                    </div>

                    <div
                      className={`flex-1 p-4 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className="font-display text-lg"
                              style={{ color: palette.dark }}
                            >
                              {room.room_type}
                            </h3>
                            <p
                              className="text-sm line-clamp-2"
                              style={{ color: palette.gray }}
                            >
                              {room.description || "Aucune description"}
                            </p>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <span
                              className="text-xl font-bold"
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
                              <Maximize size={14} /> {room.size}
                            </span>
                          )}
                          {room.bed_type && (
                            <span className="flex items-center gap-1">
                              <Bed size={14} /> {room.bed_type}
                            </span>
                          )}
                        </div>

                        {room.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
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

                      <div
                        className="flex items-center justify-end gap-2 mt-3 pt-3 border-t"
                        style={{ borderColor: palette.cream }}
                      >
                        <button
                          onClick={() => setViewingRoom(room)}
                          className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition"
                        >
                          <Eye size={16} style={{ color: palette.gray }} />
                        </button>
                        <button
                          onClick={() => openEditModal(room)}
                          className="p-1.5 rounded-lg hover:bg-[#DED9D0]/20 transition"
                        >
                          <Edit size={16} style={{ color: palette.primary }} />
                        </button>
                        <button
                          onClick={() => handleDelete(room)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 size={16} style={{ color: "#EF4444" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FDFDFD] rounded-2xl">
              <Bed
                size={48}
                className="mx-auto mb-3"
                style={{ color: palette.cream }}
              />
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Aucune chambre trouvée
              </h3>
              <p className="text-sm" style={{ color: palette.gray }}>
                {rooms.length === 0
                  ? "Commencez par ajouter votre première chambre."
                  : "Essayez de modifier vos filtres de recherche."}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                {editingRoom ? "Modifier la chambre" : "Ajouter une chambre"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-[#DED9D0]/20 rounded-lg transition"
              >
                <X size={20} style={{ color: palette.gray }} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Nom de la chambre *
                  </label>
                  <input
                    type="text"
                    value={roomForm.room_type}
                    onChange={(e) =>
                      setRoomForm((f) => ({ ...f, room_type: e.target.value }))
                    }
                    placeholder="Suite Royale"
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
                    Prix par nuit (MAD) *
                  </label>
                  <input
                    type="number"
                    value={roomForm.price}
                    onChange={(e) =>
                      setRoomForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="1200"
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
                  rows={2}
                  value={roomForm.description}
                  onChange={(e) =>
                    setRoomForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Description de la chambre..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none resize-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Capacité
                  </label>
                  <select
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm((f) => ({ ...f, capacity: e.target.value }))
                    }
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
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: palette.gray }}
                  >
                    Surface
                  </label>
                  <input
                    type="text"
                    value={roomForm.size}
                    onChange={(e) =>
                      setRoomForm((f) => ({ ...f, size: e.target.value }))
                    }
                    placeholder="35 m²"
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
                    Type de lit
                  </label>
                  <input
                    type="text"
                    value={roomForm.bed_type}
                    onChange={(e) =>
                      setRoomForm((f) => ({ ...f, bed_type: e.target.value }))
                    }
                    placeholder="Lit King Size"
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
                  Statut
                </label>
                <select
                  value={roomForm.status}
                  onChange={(e) =>
                    setRoomForm((f) => ({
                      ...f,
                      status: e.target.value as Room["status"],
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                    color: palette.dark,
                  }}
                >
                  <option value="available">Disponible</option>
                  <option value="occupied">Occupée</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Équipements
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-1.5 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={roomForm.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded"
                        style={{ accentColor: palette.primary }}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: palette.gray }}
                >
                  Photo
                </label>
                <div className="flex items-center gap-4">
                  {(roomImagePreview || editingRoom?.image) && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-[#DED9D0] shrink-0">
                      <Image
                        src={roomImagePreview || editingRoom?.image || ""}
                        alt="Aperçu"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label
                    className="flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition hover:bg-[#DED9D0]/10"
                    style={{ borderColor: palette.cream }}
                  >
                    <Upload
                      size={20}
                      className="mx-auto mb-1"
                      style={{ color: palette.gray }}
                    />
                    <p className="text-xs" style={{ color: palette.gray }}>
                      {roomImageFile
                        ? roomImageFile.name
                        : "Cliquez pour choisir une photo (JPG, PNG, max 4 Mo)"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleRoomImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div
                className="flex gap-3 pt-4 border-t"
                style={{ borderColor: palette.cream }}
              >
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-xl border font-medium text-sm transition hover:opacity-70"
                  style={{ borderColor: palette.cream, color: palette.gray }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveRoom}
                  disabled={isSavingRoom}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium text-sm transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: palette.primary }}
                >
                  {isSavingRoom && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {isSavingRoom
                    ? "Enregistrement..."
                    : editingRoom
                      ? "Modifier"
                      : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail (Eye) */}
      {viewingRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-56 bg-[#DED9D0]">
              <Image
                src={viewingRoom.image || "/images/rooms/placeholder.jpg"}
                alt={viewingRoom.room_type}
                fill
                className="object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setViewingRoom(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white transition"
              >
                <X size={18} style={{ color: palette.dark }} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3
                  className="font-display text-xl"
                  style={{ color: palette.dark }}
                >
                  {viewingRoom.room_type}
                </h3>
                <span
                  className="text-xl font-bold"
                  style={{ color: palette.primary }}
                >
                  {viewingRoom.price}{" "}
                  <span className="text-xs font-normal">MAD/nuit</span>
                </span>
              </div>
              <p className="text-sm" style={{ color: palette.gray }}>
                {viewingRoom.description || "Aucune description."}
              </p>
              <div
                className="flex flex-wrap gap-3 text-sm"
                style={{ color: palette.gray }}
              >
                <span className="flex items-center gap-1">
                  <Users size={16} /> {viewingRoom.capacity} pers.
                </span>
                {viewingRoom.size && (
                  <span className="flex items-center gap-1">
                    <Maximize size={16} /> {viewingRoom.size}
                  </span>
                )}
                {viewingRoom.bed_type && (
                  <span className="flex items-center gap-1">
                    <Bed size={16} /> {viewingRoom.bed_type}
                  </span>
                )}
              </div>
              {viewingRoom.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {viewingRoom.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: palette.cream,
                        color: palette.dark,
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Composant Navbar
function Navbar({ userName }: { userName: string }) {
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
              {userName.charAt(0).toUpperCase()}
            </div>
            <span
              className="text-sm font-medium hidden md:block"
              style={{ color: palette.dark }}
            >
              {userName}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
