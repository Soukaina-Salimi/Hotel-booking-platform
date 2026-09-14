// app/partner/dashboard/reviews/page.tsx
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
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  StarHalf,
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
    label: "Disponibilités",
    href: "/espace-partner/calendar",
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
    active: true,
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

// Données des avis
const reviewsData = [
  {
    id: 1,
    client: "Sophie Martin",
    avatar: "SM",
    email: "sophie.martin@email.com",
    room: "Suite Royale",
    rating: 5,
    comment:
      "Séjour absolument parfait ! Le service est exceptionnel, le personnel est aux petits soins. Le spa est incroyable et la nourriture est délicieuse. Je recommande vivement cet hôtel !",
    date: "2024-03-18",
    reply:
      "Merci beaucoup Sophie pour votre merveilleux retour ! Nous sommes ravis que vous ayez apprécié votre séjour. Au plaisir de vous revoir bientôt.",
    status: "replied",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    client: "Ahmed Benali",
    avatar: "AB",
    email: "ahmed.benali@email.com",
    room: "Chambre Deluxe",
    rating: 4,
    comment:
      "Très bel hôtel, bien situé. La chambre était confortable et propre. Le petit-déjeuner était bon. Petit bémol sur le bruit de la rue.",
    date: "2024-03-16",
    reply: "",
    status: "pending",
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    client: "Maria Garcia",
    avatar: "MG",
    email: "maria.garcia@email.com",
    room: "Suite Prestige",
    rating: 5,
    comment:
      "Une expérience inoubliable ! La suite est magnifique, la vue est à couper le souffle. Le personnel est très professionnel et attentif.",
    date: "2024-03-14",
    reply:
      "Merci Maria ! Nous sommes ravis que vous ayez passé un excellent séjour. À très bientôt !",
    status: "replied",
    verified: true,
    helpful: 15,
  },
  {
    id: 4,
    client: "John Smith",
    avatar: "JS",
    email: "john.smith@email.com",
    room: "Chambre Standard",
    rating: 3,
    comment:
      "Hôtel correct, mais un peu déçu par le rapport qualité-prix. La chambre était petite et la salle de bain mériterait d'être rénovée.",
    date: "2024-03-12",
    reply: "",
    status: "pending",
    verified: true,
    helpful: 5,
  },
  {
    id: 5,
    client: "Fatima Zahra",
    avatar: "FZ",
    email: "fatima.zahra@email.com",
    room: "Chambre Deluxe",
    rating: 5,
    comment:
      "Excellent séjour ! Le personnel est très accueillant et professionnel. La chambre est spacieuse et bien équipée. Je reviendrai sans hésitation.",
    date: "2024-03-10",
    reply:
      "Merci Fatima pour ce retour positif ! Nous sommes ravis que vous ayez apprécié votre séjour. Au plaisir de vous accueillir à nouveau.",
    status: "replied",
    verified: true,
    helpful: 9,
  },
  {
    id: 6,
    client: "Pierre Dubois",
    avatar: "PD",
    email: "pierre.dubois@email.com",
    room: "Suite Royale",
    rating: 2,
    comment:
      "Déçu par le service. La chambre n'était pas prête à l'arrivée et le personnel n'était pas très réactif. Dommage pour un hôtel de ce standing.",
    date: "2024-03-08",
    reply: "",
    status: "pending",
    verified: true,
    helpful: 3,
  },
  {
    id: 7,
    client: "Yasmine El Fassi",
    avatar: "YE",
    email: "yasmine.elfassi@email.com",
    room: "Suite Prestige",
    rating: 4,
    comment:
      "Très bon séjour dans l'ensemble. La suite est magnifique et bien équipée. Le restaurant est excellent. Seul petit bémol : le spa était complet.",
    date: "2024-03-06",
    reply:
      "Merci Yasmine pour votre retour. Nous sommes désolés que le spa était complet, n'hésitez pas à réserver à l'avance pour votre prochaine visite !",
    status: "replied",
    verified: true,
    helpful: 7,
  },
  {
    id: 8,
    client: "Karim Benjelloun",
    avatar: "KB",
    email: "karim.benjelloun@email.com",
    room: "Chambre Standard",
    rating: 4,
    comment:
      "Bon rapport qualité-prix. La chambre était propre et confortable. Le personnel est sympathique. Je recommande.",
    date: "2024-03-04",
    reply: "",
    status: "pending",
    verified: true,
    helpful: 4,
  },
];

// Statistiques des avis
const statsData = {
  total: reviewsData.length,
  averageRating:
    reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length,
  fiveStar: reviewsData.filter((r) => r.rating === 5).length,
  fourStar: reviewsData.filter((r) => r.rating === 4).length,
  threeStar: reviewsData.filter((r) => r.rating === 3).length,
  twoStar: reviewsData.filter((r) => r.rating === 2).length,
  oneStar: reviewsData.filter((r) => r.rating === 1).length,
  replied: reviewsData.filter((r) => r.status === "replied").length,
  pending: reviewsData.filter((r) => r.status === "pending").length,
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

export default function ReviewsManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtrer les avis
  const filteredReviews = reviewsData.filter((review) => {
    const matchSearch =
      review.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.room.toLowerCase().includes(searchQuery.toLowerCase());

    const matchRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    const matchStatus =
      statusFilter === "all" || review.status === statusFilter;

    return matchSearch && matchRating && matchStatus;
  });

  // Obtenir le texte de la note
  const getRatingText = (rating: number) => {
    const texts = {
      5: "Excellent",
      4: "Très bien",
      3: "Bien",
      2: "Moyen",
      1: "Médiocre",
    };
    return texts[rating as keyof typeof texts] || "";
  };

  // Rendu des étoiles
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? palette.sand : "none"}
            color={i < rating ? palette.sand : palette.cream}
          />
        ))}
      </div>
    );
  };

  // Ouvrir le détail d'un avis
  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setReplyText(review.reply || "");
    setShowDetailModal(true);
  };

  // Répondre à un avis
  const handleReply = () => {
    if (!selectedReview || !replyText.trim()) return;
    console.log("Réponse envoyée", {
      reviewId: selectedReview.id,
      reply: replyText,
    });
    // Logique de réponse
    setShowDetailModal(false);
    setReplyText("");
  };

  // Marquer comme utile
  const handleHelpful = (id: number) => {
    console.log("Avis marqué comme utile", id);
    // Logique de marquage
  };

  // Signaler un avis
  const handleFlag = (id: number) => {
    console.log("Avis signalé", id);
    // Logique de signalement
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
                Gestion des avis
              </h1>
              <p className="text-sm" style={{ color: palette.gray }}>
                Consultez et répondez aux avis de vos clients
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
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
              <div
                className="text-xl font-bold"
                style={{ color: palette.primary }}
              >
                {statsData.averageRating.toFixed(1)}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                Note moyenne
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#22C55E" }}>
                {statsData.fiveStar}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                ⭐ 5 étoiles
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#3B82F6" }}>
                {statsData.fourStar}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                ⭐ 4 étoiles
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#EAB308" }}>
                {statsData.threeStar}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                ⭐ 3 étoiles
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#F97316" }}>
                {statsData.twoStar}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                ⭐ 2 étoiles
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl font-bold" style={{ color: "#EF4444" }}>
                {statsData.oneStar}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                ⭐ 1 étoile
              </div>
            </div>
            <div className="bg-[#FDFDFD] rounded-xl p-3 text-center shadow-sm">
              <div
                className="text-xl font-bold"
                style={{ color: palette.sand }}
              >
                {statsData.pending}
              </div>
              <div className="text-xs" style={{ color: palette.gray }}>
                En attente de réponse
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
                placeholder="Rechercher un avis..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{
                  borderColor: palette.cream,
                  backgroundColor: palette.white,
                  color: palette.dark,
                }}
              />
            </div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none"
              style={{
                borderColor: palette.cream,
                backgroundColor: palette.white,
                color: palette.dark,
              }}
            >
              <option value="all">Toutes les notes</option>
              <option value="5">⭐ 5 étoiles</option>
              <option value="4">⭐ 4 étoiles</option>
              <option value="3">⭐ 3 étoiles</option>
              <option value="2">⭐ 2 étoiles</option>
              <option value="1">⭐ 1 étoile</option>
            </select>
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
              <option value="replied">Répondu</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          {/* Liste des avis */}
          {filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#FDFDFD] rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Avatar et infos */}
                    <div className="flex items-start gap-3 md:w-48 shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
                        style={{ backgroundColor: palette.primary }}
                      >
                        {review.avatar}
                      </div>
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: palette.dark }}
                        >
                          {review.client}
                        </p>
                        <p className="text-sm" style={{ color: palette.gray }}>
                          {review.room}
                        </p>
                        <p className="text-xs" style={{ color: palette.gray }}>
                          {review.date}
                        </p>
                      </div>
                    </div>

                    {/* Commentaire */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < review.rating ? palette.sand : "none"}
                              color={
                                i < review.rating ? palette.sand : palette.cream
                              }
                            />
                          ))}
                        </div>
                        <span
                          className="text-xs font-medium"
                          style={{ color: palette.gray }}
                        >
                          {getRatingText(review.rating)}
                        </span>
                        {review.verified && (
                          <span className="text-xs flex items-center gap-0.5 text-[#22C55E]">
                            <CheckCircle size={12} />
                            Vérifié
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            review.status === "replied"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.status === "replied"
                            ? "Répondu"
                            : "En attente"}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: palette.gray }}>
                        {review.comment}
                      </p>
                      {review.reply && (
                        <div
                          className="mt-3 p-3 rounded-xl bg-[#DED9D0]/20 border-l-4"
                          style={{ borderColor: palette.primary }}
                        >
                          <p
                            className="text-xs font-medium"
                            style={{ color: palette.gray }}
                          >
                            <span style={{ color: palette.primary }}>
                              💬 Réponse :
                            </span>
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: palette.dark }}
                          >
                            {review.reply}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:shrink-0">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-[#DED9D0]/20"
                        style={{ color: palette.gray }}
                      >
                        <ThumbsUp size={14} />
                        {review.helpful}
                      </button>
                      <button
                        onClick={() => handleViewDetails(review)}
                        className="p-2 rounded-lg hover:bg-[#DED9D0]/20 transition"
                        title="Voir les détails"
                      >
                        <Eye size={18} style={{ color: palette.gray }} />
                      </button>
                      {review.status === "pending" && (
                        <button
                          onClick={() => handleViewDetails(review)}
                          className="p-2 rounded-lg hover:bg-[#DED9D0]/20 transition"
                          title="Répondre"
                        >
                          <Reply size={18} style={{ color: palette.primary }} />
                        </button>
                      )}
                      <button
                        onClick={() => handleFlag(review.id)}
                        className="p-2 rounded-lg hover:bg-[#DED9D0]/20 transition"
                        title="Signaler"
                      >
                        <Flag size={18} style={{ color: palette.gray }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FDFDFD] rounded-2xl">
              <Star
                size={48}
                className="mx-auto mb-3"
                style={{ color: palette.cream }}
              />
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Aucun avis trouvé
              </h3>
              <p className="text-sm" style={{ color: palette.gray }}>
                Essayez de modifier vos filtres de recherche
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal de détail et réponse */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-display text-xl"
                style={{ color: palette.dark }}
              >
                Détails de l'avis
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
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#DED9D0]/20">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-xl"
                  style={{ backgroundColor: palette.primary }}
                >
                  {selectedReview.avatar}
                </div>
                <div>
                  <p
                    className="font-medium text-lg"
                    style={{ color: palette.dark }}
                  >
                    {selectedReview.client}
                  </p>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    {selectedReview.email}
                  </p>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Chambre : {selectedReview.room}
                  </p>
                </div>
              </div>

              {/* Note et commentaire */}
              <div className="p-4 rounded-xl bg-[#DED9D0]/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={i < selectedReview.rating ? palette.sand : "none"}
                        color={
                          i < selectedReview.rating
                            ? palette.sand
                            : palette.cream
                        }
                      />
                    ))}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: palette.gray }}
                  >
                    {getRatingText(selectedReview.rating)}
                  </span>
                  <span className="text-xs" style={{ color: palette.gray }}>
                    {selectedReview.date}
                  </span>
                </div>
                <p className="text-sm" style={{ color: palette.dark }}>
                  {selectedReview.comment}
                </p>
              </div>

              {/* Réponse existante */}
              {selectedReview.reply && (
                <div
                  className="p-4 rounded-xl bg-[#DED9D0]/20 border-l-4"
                  style={{ borderColor: palette.primary }}
                >
                  <p
                    className="text-xs font-medium"
                    style={{ color: palette.gray }}
                  >
                    <span style={{ color: palette.primary }}>💬 Réponse :</span>
                  </p>
                  <p className="text-sm" style={{ color: palette.dark }}>
                    {selectedReview.reply}
                  </p>
                </div>
              )}

              {/* Zone de réponse */}
              <div>
                <label
                  className="text-sm font-medium block mb-1.5"
                  style={{ color: palette.dark }}
                >
                  {selectedReview.reply
                    ? "Modifier votre réponse"
                    : "Répondre à l'avis"}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Rédigez votre réponse..."
                  className="w-full px-4 py-3 rounded-xl border transition focus:outline-none resize-none"
                  style={{
                    backgroundColor: palette.white,
                    borderColor: palette.cream,
                    color: palette.dark,
                  }}
                />
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
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className={`flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition ${
                    replyText.trim()
                      ? "hover:opacity-90"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: palette.primary }}
                >
                  {selectedReview.reply
                    ? "Modifier la réponse"
                    : "Envoyer la réponse"}
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
