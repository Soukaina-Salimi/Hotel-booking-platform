// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  Eye,
  X,
  CheckCircle,
  Sparkles,
  Mail,
  PhoneCall,
  LogOut,
} from "lucide-react";

const palette = {
  primary: "#7F9BA9",
  primaryDark: "#647C87",
  white: "#FDFDFD",
  cream: "#DED9D0",
  sand: "#E9B883",
  brown: "#7A5237",
  dark: "#3B2E22",
  gray: "#595B57",
};

type Todo = {
  id: string;
  lead_name: string | null;
  lead_phone: string | null; // peut contenir un email ou un numero, selon ce que l'utilisateur a donne
  summary: string | null;
  messages: { role: "user" | "assistant"; content: string }[];
  created_at: string;
};

function isEmail(contact: string | null) {
  return !!contact && contact.includes("@");
}

function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<Todo | null>(null);

  // Authentification + garde d'acces : seul un compte role=admin peut voir cette page.
  // Meme limite de securite que le reste du projet : verification cote frontend
  // uniquement pour l'instant, pas de middleware serveur qui verifie le role.
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
      .then((data) => {
        if (data.user.role !== "admin") {
          router.push("/");
          return;
        }
        setAuthUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    if (authUser?.role !== "admin") return;
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin-todos`)
      .then((res) => res.json())
      .then((json) => setTodos(json.data ?? []))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [authUser]);

  async function markHandled(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/todos/${id}/handled`, {
      method: "POST",
    });
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setSelected(null);
  }

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: palette.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="font-display text-2xl"
              style={{ color: palette.dark }}
            >
              Support plateforme
            </h1>
            <p className="text-sm" style={{ color: palette.gray }}>
              {authUser?.name
                ? `Connecté en tant que ${authUser.name}`
                : "Chargement..."}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-red-50"
            style={{ color: "#EF4444" }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>

        <div
          className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm border-l-4"
          style={{ borderLeftColor: palette.sand }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`,
              }}
            >
              <Bot size={22} color="white" />
            </div>
            <div>
              <h2
                className="font-display text-lg"
                style={{ color: palette.dark }}
              >
                Demandes du chatbot plateforme
              </h2>
              <p className="text-xs" style={{ color: palette.gray }}>
                {todos.length > 0
                  ? `${todos.length} demande${todos.length > 1 ? "s" : ""} à traiter`
                  : "Aucune demande en attente"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <p
              className="text-sm text-center py-8"
              style={{ color: palette.gray }}
            >
              Chargement...
            </p>
          ) : todos.length > 0 ? (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => setSelected(todo)}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border cursor-pointer hover:shadow-md transition"
                  style={{
                    borderColor: palette.cream,
                    backgroundColor: palette.white,
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                      style={{ backgroundColor: palette.primary }}
                    >
                      {getInitials(todo.lead_name)}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium"
                        style={{ color: palette.dark }}
                      >
                        {todo.lead_name ?? "Utilisateur"}
                      </p>
                      <p
                        className="text-xs flex items-center gap-1"
                        style={{ color: palette.primary }}
                      >
                        {isEmail(todo.lead_phone) ? (
                          <Mail size={12} />
                        ) : (
                          <PhoneCall size={12} />
                        )}
                        {todo.lead_phone}
                      </p>
                      <p
                        className="text-xs line-clamp-1"
                        style={{ color: palette.gray }}
                      >
                        {todo.summary}
                      </p>
                    </div>
                  </div>
                  <Eye
                    size={16}
                    style={{ color: palette.gray }}
                    className="shrink-0"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: palette.gray }}>
              <Sparkles
                size={36}
                className="mx-auto mb-2"
                style={{ color: palette.cream }}
              />
              <p className="text-sm">Rien à traiter pour l'instant</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FDFDFD] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: palette.cream }}
            >
              <div>
                <p className="font-semibold" style={{ color: palette.dark }}>
                  {selected.lead_name ?? "Utilisateur"}
                </p>
                <p
                  className="text-xs flex items-center gap-1.5"
                  style={{ color: palette.primary }}
                >
                  {isEmail(selected.lead_phone) ? (
                    <Mail size={13} />
                  ) : (
                    <PhoneCall size={13} />
                  )}
                  {selected.lead_phone}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-[#DED9D0]/20 rounded-lg"
              >
                <X size={18} style={{ color: palette.gray }} />
              </button>
            </div>

            <div
              className="px-5 py-3"
              style={{ backgroundColor: palette.sand + "15" }}
            >
              <p
                className="text-xs font-semibold"
                style={{ color: palette.dark }}
              >
                Résumé
              </p>
              <p className="text-sm" style={{ color: palette.gray }}>
                {selected.summary}
              </p>
            </div>

            <div
              className="flex-1 overflow-y-auto px-5 py-4 space-y-2"
              style={{ backgroundColor: "#F8F6F3" }}
            >
              {selected.messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.role === "user" ? "bg-white border border-[#DED9D0]/40" : "text-white"}`}
                    style={
                      m.role === "assistant"
                        ? { backgroundColor: palette.primary }
                        : {}
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex gap-2 px-5 py-4 border-t"
              style={{ borderColor: palette.cream }}
            >
              <a
                href={
                  isEmail(selected.lead_phone)
                    ? `mailto:${selected.lead_phone}`
                    : `https://wa.me/${selected.lead_phone?.replace(/\D/g, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium"
                style={{
                  backgroundColor: isEmail(selected.lead_phone)
                    ? "#3B82F6"
                    : "#22C55E",
                }}
              >
                {isEmail(selected.lead_phone) ? (
                  <Mail size={16} />
                ) : (
                  <PhoneCall size={16} />
                )}
                Contacter
              </a>
              <button
                onClick={() => markHandled(selected.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium"
                style={{ borderColor: palette.cream, color: palette.gray }}
              >
                <CheckCircle size={16} /> Marquer comme traité
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
