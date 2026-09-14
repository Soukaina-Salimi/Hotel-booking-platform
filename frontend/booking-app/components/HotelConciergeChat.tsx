// components/HotelConciergeChat.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const palette = {
  primary: "#7F9BA9",
  brown: "#7A5237",
  cream: "#DED9D0",
  dark: "#3B2E22",
  white: "#FDFDFD",
};

type Message = { role: "assistant" | "user"; content: string };

export default function HotelConciergeChat({ hotelId }: { hotelId: string }) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour, vous êtes à la conciergerie de l'hôtel, je m'appelle Moha. En quoi puis-je vous aider ?",
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

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hotel_id: hotelId,
            conversation_id: conversationId,
            message: text,
          }),
        },
      );
      const json = await res.json();
      setConversationId(json.conversation_id);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.reply },
      ]);
    } catch (err) {
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

  return (
    <div
      className="rounded-2xl shadow-sm overflow-hidden flex flex-col"
      style={{ backgroundColor: palette.white, height: "480px" }}
    >
      <div className="px-4 py-3" style={{ backgroundColor: palette.primary }}>
        <p className="text-sm font-semibold text-white">Moha — Conciergerie</p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed"
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
              className="rounded-2xl px-3.5 py-2 text-xs"
              style={{ backgroundColor: palette.cream, color: palette.dark }}
            >
              Moha écrit...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-3 py-3 border-t"
        style={{ borderColor: palette.cream }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none"
          style={{ borderColor: palette.cream, color: palette.dark }}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-40"
          style={{ backgroundColor: palette.primary }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
