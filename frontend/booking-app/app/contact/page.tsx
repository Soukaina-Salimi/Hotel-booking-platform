// app/contact/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageCircle,
  Bot,
  ChevronRight,
  Headphones,
  Loader2,
  Sparkles,
  Heart,
  Clock,
  CheckCircle,
  ArrowRight,
  User,
  FileText,
  Calendar,
  Shield,
  Zap,
  Globe,
  Award,
  Users,
  Star,
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  MoreVertical,
  Compass,
  Building2,
  Coffee,
  Sun,
  Moon,
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

// ---- Config du chatbot ----

const QUICK_TOPICS = [
  { label: "📅 Réservation", icon: "📅" },
  { label: "❌ Annulation", icon: "❌" },
  { label: "💳 Paiement", icon: "💳" },
  { label: "🤝 Partenaire", icon: "🤝" },
  { label: "🏨 Hôtels", icon: "🏨" },
];

const TOPIC_REPLIES: {
  match: string[];
  reply: string;
  link?: { label: string; href: string };
}[] = [
  {
    match: ["reserv", "chambre", "hotel"],
    reply:
      "Pour réserver, utilisez la barre de recherche sur la page d'accueil : choisissez votre destination et vos dates, puis sélectionnez l'hôtel qui vous convient.",
    link: { label: "Aller à la recherche", href: "/" },
  },
  {
    match: ["annul", "rembours"],
    reply:
      "Chaque hôtel définit sa propre politique d'annulation, visible sur la fiche de l'hôtel et dans le récapitulatif de votre réservation. Le remboursement, s'il est applicable, est traité sous quelques jours ouvrés.",
    link: { label: "Voir mes réservations", href: "/compte/reservations" },
  },
  {
    match: ["paiement", "carte", "cib", "virement"],
    reply:
      "Nous acceptons le paiement par CIB, carte bancaire et virement. Toutes les transactions sont sécurisées. Si un paiement échoue, réessayez ou contactez-nous en précisant l'heure de la tentative.",
  },
  {
    match: ["partenaire", "hotelier", "inscri"],
    reply:
      "Pour référencer votre hôtel sur Dariwane, direction la page dédiée aux partenaires : vous pourrez créer votre espace en quelques minutes.",
    link: { label: "Devenir partenaire", href: "/partenaires" },
  },
];

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
  link?: { label: string; href: string };
};

type Message = { role: "assistant" | "user"; content: string };

function findReply(userText: string) {
  const lower = userText.toLowerCase();
  return TOPIC_REPLIES.find((t) => t.match.some((kw) => lower.includes(kw)));
}

function isOutsideBusinessHours() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return day === 0 || day === 6 || hour < 9 || hour >= 18;
}

export default function ContactPage() {
  const outsideHours = isOutsideBusinessHours();
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour, je suis l'assistant Dariwane. Posez-moi votre question sur la plateforme, un paiement ou votre compte.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isMinimized]);

  async function handleSend(e?: React.FormEvent, overrideText?: string) {
    e?.preventDefault();
    const text = (overrideText ?? input).trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);

    // Utilisateur connecte ou non - le chatbot n'aura acces qu'a SES propres
    // reservations si un user_id est fourni, jamais a celles des autres.
    const cachedUser = localStorage.getItem("auth_user");
    const userId = cachedUser ? JSON.parse(cachedUser).id : null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: text,
            user_id: userId, // pas de hotel_id : mode plateforme
          }),
        },
      );
      const json = await res.json();
      setConversationId(json.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Désolé, un souci technique est survenu. Réessayez dans un instant.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleTopicClick(topicLabel: string) {
    const cleanTopic = topicLabel.replace(/[📅❌💳🤝🏨]\s/, "");
    setInput(cleanTopic);
    // On envoie directement au lieu d'attendre un submit de formulaire
    handleSend({ preventDefault: () => {} } as React.FormEvent);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const faqs = [
    {
      question: "Comment réserver un hôtel ?",
      answer:
        "Utilisez notre barre de recherche sur la page d'accueil, sélectionnez vos dates et choisissez parmi les hôtels disponibles.",
      icon: <Calendar size={18} />,
    },
    {
      question: "Les paiements sont-ils sécurisés ?",
      answer:
        "Oui, tous les paiements sont sécurisés via notre partenaire bancaire CMI. Vos données sont chiffrées.",
      icon: <Shield size={18} />,
    },
    {
      question: "Puis-je annuler ma réservation ?",
      answer:
        "Oui, selon la politique d'annulation de chaque hôtel. Consultez les conditions lors de la réservation.",
      icon: <FileText size={18} />,
    },
    {
      question: "Comment devenir partenaire hôtelier ?",
      answer:
        "Rendez-vous sur notre page 'Devenir partenaire' et remplissez le formulaire d'inscription.",
      icon: <User size={18} />,
    },
  ];

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      title: "Téléphone",
      details: "+212 5 22 123 456",
      sub: "Lun-Ven, 9h-18h",
      color: palette.primary,
    },
    {
      icon: <Mail size={18} />,
      title: "Email",
      details: "contact@dariwane.ma",
      sub: "Réponse sous 24h",
      color: palette.sand,
    },
    {
      icon: <MapPin size={18} />,
      title: "Adresse",
      details: "Casablanca, Maroc",
      sub: "Venez nous rencontrer",
      color: palette.brown,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: palette.cream }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes typing {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-typing {
          animation: typing 1.2s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .bubble-user {
          background: linear-gradient(135deg, #7f9ba9, #647c87);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .bubble-bot {
          background: white;
          color: #3b2e22;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .hero-gradient {
          background: linear-gradient(
            135deg,
            #7f9ba9 0%,
            #647c87 50%,
            #3b2e22 100%
          );
        }
        .shimmer-text {
          background: linear-gradient(90deg, #e9b883, #fdfdfd, #e9b883);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <Navbar isAuthenticated={false} userRole="guest" userName="" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E9B883] rounded-full blur-3xl opacity-10 animate-pulse-glow"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FDFDFD] rounded-full blur-3xl opacity-5 animate-pulse-glow delay-200"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-slideUp">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-[#E9B883]" />
              <span className="text-white/90 text-xs font-medium tracking-wide">
                ✨ Assistance 24/7
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight mb-3">
              Une question ?
              <span className="block mt-1 shimmer-text">On vous répond</span>
            </h1>

            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Notre assistant intelligent est là pour vous guider en quelques
              secondes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-4 text-white/70 text-sm">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#E9B883]" />
                Réponse{" "}
                <span className="text-white font-medium">instantanée</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-[#E9B883]" />
                <span className="text-white font-medium">12k+</span> clients
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={14} className="text-[#E9B883]" />
                Note <span className="text-white font-medium">4.9/5</span>
              </span>
            </div>
          </div>
        </div>

        {/* Séparateur courbe */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 30 C360 0 1080 60 1440 30 L1440 60 L0 60 Z"
              fill="#DED9D0"
            />
          </svg>
        </div>
      </section>

      {/* Section principale : Chat + Coordonnées côte à côte */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat - prend 2/3 de l'espace */}
            <div className="lg:col-span-2">
              <div
                className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                style={{
                  height: "540px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                }}
              >
                {/* Header du chat */}
                <div
                  className="flex items-center justify-between px-5 py-3 shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm border-2 border-white/30">
                        <Bot size={18} color={palette.white} />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Assistant Dariwane
                      </p>
                      <p className="text-xs flex items-center gap-1.5 text-white/80">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full ${
                            outsideHours ? "bg-[#E9B883]" : "bg-green-400"
                          }`}
                        />
                        {outsideHours ? "Hors horaires" : "En ligne"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
                    >
                      {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/70 hover:text-white"
                    >
                      {isMinimized ? (
                        <Maximize2 size={15} />
                      ) : (
                        <Minimize2 size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Messages */}

                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-5 py-5 space-y-3"
                >
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                        style={
                          m.role === "user"
                            ? {
                                backgroundColor: palette.brown,
                                color: palette.white,
                                borderBottomRightRadius: 4,
                              }
                            : {
                                backgroundColor: palette.cream,
                                color: palette.dark,
                                borderBottomLeftRadius: 4,
                              }
                        }
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div
                        className="rounded-2xl px-4 py-2.5 text-xs"
                        style={{
                          backgroundColor: palette.cream,
                          color: palette.gray,
                        }}
                      >
                        en train d'écrire...
                      </div>
                    </div>
                  )}
                </div>
                {/* Thèmes rapides */}
                <div className="px-4 py-1.5 flex flex-wrap gap-1.5 border-t border-[#DED9D0]/30">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => handleTopicClick(topic.label)}
                      className="text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105 hover:shadow-sm"
                      style={{
                        borderColor: palette.primary + "25",
                        color: palette.primaryDark,
                        backgroundColor: palette.primary + "06",
                      }}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>

                {/* Zone de saisie */}
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 px-5 py-4 border-t"
                  style={{ borderColor: palette.cream }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none"
                    style={{
                      backgroundColor: palette.white,
                      borderColor: palette.cream,
                      color: palette.dark,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSending || !input.trim()}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-40"
                    style={{ backgroundColor: palette.primary }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Coordonnées - prend 1/3 de l'espace */}
            <div className="lg:col-span-1 space-y-4">
              <div
                className="bg-white rounded-3xl p-5 shadow-lg"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
              >
                <h3
                  className="font-display text-lg mb-4"
                  style={{ color: palette.dark }}
                >
                  📬 Nos coordonnées
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#DED9D0]/10 transition group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition"
                        style={{
                          backgroundColor: info.color + "15",
                          color: info.color,
                        }}
                      >
                        {info.icon}
                      </div>
                      <div>
                        <p
                          className="font-medium text-sm"
                          style={{ color: palette.dark }}
                        >
                          {info.title}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: palette.primary }}
                        >
                          {info.details}
                        </p>
                        <p className="text-xs" style={{ color: palette.gray }}>
                          {info.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 pt-4 border-t"
                  style={{ borderColor: palette.cream }}
                >
                  <div
                    className="flex items-center gap-3 text-sm"
                    style={{ color: palette.gray }}
                  >
                    <Shield size={16} className="text-[#E9B883]" />
                    <span>Données sécurisées</span>
                  </div>
                </div>
              </div>

              {/* Horaires d'ouverture */}
              <div
                className="bg-white rounded-3xl p-5 shadow-lg"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
              >
                <h4
                  className="font-medium text-sm mb-3"
                  style={{ color: palette.dark }}
                >
                  🕐 Horaires d'ouverture
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: palette.gray }}>
                      Lundi - Vendredi
                    </span>
                    <span style={{ color: palette.dark }}>9h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: palette.gray }}>Samedi</span>
                    <span style={{ color: palette.dark }}>10h - 16h</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: palette.gray }}>Dimanche</span>
                    <span style={{ color: palette.dark }}>Fermé</span>
                  </div>
                </div>
                <div
                  className="mt-3 pt-3 border-t"
                  style={{ borderColor: palette.cream }}
                >
                  <span
                    className="text-xs flex items-center gap-1.5"
                    style={{ color: palette.gray }}
                  >
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${outsideHours ? "bg-[#E9B883]" : "bg-green-400"}`}
                    />
                    {outsideHours
                      ? "Actuellement fermé"
                      : "Actuellement ouvert"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - en bas */}
      <section className="py-10 bg-[#FDFDFD]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-6">
            <span className="text-[#7F9BA9] font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-[#E9B883]" />
              FAQ
            </span>
            <h2
              className="font-display text-2xl mt-1"
              style={{ color: palette.dark }}
            >
              Questions <span className="text-[#E9B883]">fréquentes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#DED9D0] hover:border-[#7F9BA9]/30"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: palette.primary + "12",
                      color: palette.primary,
                    }}
                  >
                    {faq.icon}
                  </div>
                  <div>
                    <h3
                      className="font-display text-sm hover:text-[#7F9BA9] transition"
                      style={{ color: palette.dark }}
                    >
                      {faq.question}
                    </h3>
                    <p
                      className="text-sm mt-1.5 font-light leading-relaxed"
                      style={{ color: palette.gray }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
