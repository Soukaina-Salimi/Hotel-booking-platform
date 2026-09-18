// components/ChatWidget.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  Loader2,
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

type Slot = {
  start: string;
  end: string;
  label: string;
};

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  link?: { label: string; href: string } | null;
  slots?: Slot[] | null; // ✅ AJOUT
  conversationId?: string | null; // ✅ AJOUT
  slotResolved?: boolean; // ✅ AJOUT — pour griser les boutons après clic
};

function RobotFace({ size = 40 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <style>{`
        @keyframes dariwane-glow { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }
        @keyframes dariwane-blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.15); } }
        .dariwane-eyes { transform-origin: center; animation: dariwane-blink 5s ease-in-out infinite; }
        .dariwane-glow { animation: dariwane-glow 2.4s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="dariwane-head" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.white} />
            <stop offset="100%" stopColor={palette.cream} />
          </linearGradient>
        </defs>
        <rect
          x="20"
          y="78"
          width="60"
          height="20"
          rx="10"
          fill={palette.cream}
        />
        <rect x="44" y="68" width="12" height="12" fill={palette.cream} />
        <circle
          cx="16"
          cy="52"
          r="10"
          fill={palette.cream}
          stroke={palette.wood}
          strokeWidth="1.5"
        />
        <circle
          cx="84"
          cy="52"
          r="10"
          fill={palette.cream}
          stroke={palette.wood}
          strokeWidth="1.5"
        />
        <rect
          x="22"
          y="14"
          width="56"
          height="58"
          rx="24"
          fill="url(#dariwane-head)"
          stroke={palette.wood}
          strokeWidth="1.5"
        />
        <rect
          x="32"
          y="34"
          width="36"
          height="22"
          rx="11"
          fill={palette.dark}
        />
        <g className="dariwane-eyes dariwane-glow">
          <path
            d="M40 47 Q44 41 48 47"
            stroke={palette.sand}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M52 47 Q56 41 60 47"
            stroke={palette.sand}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default function ChatWidget({ hotelId }: { hotelId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Bonjour, vous êtes à la conciergerie de l'hôtel, je m'appelle Moha. En quoi puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isBooking, setIsBooking] = useState(false); // ✅ AJOUT
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen && !isMinimized)
      setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen, isMinimized]);

  function pushMessage(msg: Omit<ChatMessage, "id">) {
    setMessages((prev) => [...prev, { id: prev.length + 1, ...msg }]);
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending || !hotelId) return;

    pushMessage({ role: "user", content: text });
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotelId,
          conversation_id: conversationId,
          message: text,
        }),
      });
      const json = await res.json();
      setConversationId(json.conversation_id);
      pushMessage({
        role: "assistant",
        content: json.reply,
        link: json.link ?? null,
        slots: json.slots ?? null, // ✅ AJOUT
        conversationId: json.conversation_id ?? null, // ✅ AJOUT
      });
    } catch (err) {
      pushMessage({
        role: "assistant",
        content:
          "Désolé, un souci technique est survenu. Réessayez dans un instant.",
      });
    } finally {
      setIsSending(false);
    }
  }

  // ✅ NOUVEAU — Sélection d'un créneau
  async function handleSlotSelect(messageId: number, slotIndex: number) {
    if (isBooking) return;

    const message = messages.find((m) => m.id === messageId);
    const slot = message?.slots?.[slotIndex];
    const convId = message?.conversationId || conversationId;

    if (!slot || !convId) return;

    setIsBooking(true);

    try {
      const res = await fetch(`/api/chat/select-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: convId,
          slot_index: slotIndex,
        }),
      });
      const json = await res.json();

      // Marque la carte de créneaux comme résolue (les boutons deviennent inactifs)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, slotResolved: true } : m,
        ),
      );

      if (json.success) {
        pushMessage({
          role: "assistant",
          content: `✅ Parfait ! Votre rendez-vous est confirmé pour le ${json.label}. Un conseiller vous appellera à ce moment-là. À très vite !`,
        });
      } else {
        pushMessage({
          role: "assistant",
          content: `❌ ${json.error || "Impossible de réserver ce créneau. Réessayez ou choisissez-en un autre."}`,
        });
      }
    } catch (err) {
      console.error("select-slot error:", err);
      pushMessage({
        role: "assistant",
        content: "❌ Erreur de connexion. Vérifiez votre réseau et réessayez.",
      });
    } finally {
      setIsBooking(false);
    }
  }

  if (!hotelId) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full shadow-xl px-3 py-2.5 transition hover:scale-105"
        style={{ backgroundColor: palette.primaryDark }}
        aria-label="Ouvrir la conciergerie Moha"
      >
        <RobotFace size={40} />
        <span className="pr-1 text-sm font-medium text-white hidden sm:inline">
          Besoin d'aide ?
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]">
      <div
        className={`rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? "h-16" : "h-[540px]"}`}
        style={{ backgroundColor: palette.white }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ backgroundColor: palette.primary }}
        >
          <div className="flex items-center gap-2.5">
            <RobotFace size={38} />
            <div>
              <p className="text-sm font-semibold text-white leading-tight">
                Moha — Conciergerie
              </p>
              <p className="text-[11px] flex items-center gap-1.5 text-white/80">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#7ED9A0" }}
                />
                En ligne
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
              aria-label={isMinimized ? "Agrandir" : "Reduire"}
            >
              {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
              aria-label="Fermer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5"
              style={{ backgroundColor: palette.cream + "40" }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed"
                    style={
                      m.role === "user"
                        ? {
                            backgroundColor: palette.brown,
                            color: palette.white,
                            borderBottomRightRadius: 4,
                          }
                        : {
                            backgroundColor: palette.white,
                            color: palette.dark,
                            borderBottomLeftRadius: 4,
                            boxShadow: "0 1px 3px rgba(59,46,34,0.08)",
                          }
                    }
                  >
                    {m.content}

                    {/* ✅ NOUVEAU — Boutons de créneaux cliquables */}
                    {m.slots && m.slots.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {m.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSlotSelect(m.id, idx)}
                            disabled={m.slotResolved || isBooking}
                            className="w-full text-left px-3 py-2.5 rounded-xl border-2 transition flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#7F9BA9]/10"
                            style={{
                              borderColor: palette.primary + "50",
                              backgroundColor: palette.white,
                              color: palette.dark,
                            }}
                          >
                            {isBooking && !m.slotResolved ? (
                              <Loader2
                                size={15}
                                className="animate-spin shrink-0"
                                style={{ color: palette.primary }}
                              />
                            ) : (
                              <CalendarIcon
                                size={15}
                                className="shrink-0"
                                style={{ color: palette.primary }}
                              />
                            )}
                            <span className="text-sm font-medium flex-1">
                              {slot.label}
                            </span>
                            {m.slotResolved && (
                              <Check size={14} style={{ color: "#22C55E" }} />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {m.link && (
                      <Link
                        href={m.link.href}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-semibold underline underline-offset-2"
                        style={{
                          color:
                            m.role === "user" ? palette.cream : palette.primary,
                        }}
                      >
                        {m.link.label} <ChevronRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-center gap-2">
                  <RobotFace size={22} />
                  <div
                    className="rounded-2xl px-3.5 py-2 text-xs"
                    style={{
                      backgroundColor: palette.white,
                      color: palette.gray,
                      boxShadow: "0 1px 3px rgba(59,46,34,0.08)",
                    }}
                  >
                    Moha écrit...
                  </div>
                </div>
              )}
            </div>

            {/* Saisie */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-1.5 px-3 py-2.5 border-t"
              style={{ borderColor: palette.cream }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none"
                style={{
                  backgroundColor: palette.white,
                  borderColor: palette.cream,
                  color: palette.dark,
                }}
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 transition disabled:opacity-40"
                style={{ backgroundColor: palette.primary }}
                aria-label="Envoyer"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
