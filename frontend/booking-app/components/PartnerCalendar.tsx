"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Phone, Loader2 } from "lucide-react";

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

export type Appointment = {
  id: string;
  title: string;
  start: string;
  end: string;
  source: "moha" | "google";
  lead_phone?: string | null;
  summary?: string | null;
};

type Props = {
  hotelId: string;
  apiUrl: string;
};

export default function PartnerCalendar({ hotelId, apiUrl }: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const monthKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    if (!hotelId) return;
    setIsLoading(true);
    fetch(`${apiUrl}/chat/appointments?hotel_id=${hotelId}&month=${monthKey}`)
      .then((r) => r.json())
      .then((json) => setAppointments(json.appointments ?? []))
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [hotelId, apiUrl, monthKey]);

  // Grille du mois (lundi en 1er)
  const firstDay = new Date(cursor);
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = (firstDay.getDay() + 6) % 7; // 0 = lundi

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const dayKey = (d: number) =>
    `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const appointmentsFor = (d: number) =>
    appointments.filter((a) => a.start.startsWith(dayKey(d)));

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() &&
    cursor.getMonth() === today.getMonth() &&
    cursor.getFullYear() === today.getFullYear();

  const monthLabel = cursor.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const selectedAppointments = selectedDay
    ? appointments.filter((a) => a.start.startsWith(selectedDay))
    : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="font-display text-2xl capitalize"
          style={{ color: palette.dark }}
        >
          {monthLabel}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1),
              )
            }
            className="p-2 rounded-xl border hover:bg-[#DED9D0]/20 transition"
            style={{ borderColor: palette.cream, color: palette.gray }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-[#DED9D0]/20 transition"
            style={{ borderColor: palette.cream, color: palette.gray }}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1),
              )
            }
            className="p-2 rounded-xl border hover:bg-[#DED9D0]/20 transition"
            style={{ borderColor: palette.cream, color: palette.gray }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Grille */}
      <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
        {isLoading ? (
          <div
            className="flex items-center justify-center py-20"
            style={{ color: palette.gray }}
          >
            <Loader2 size={20} className="animate-spin mr-2" />
            Chargement...
          </div>
        ) : (
          <>
            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((j) => (
                <div
                  key={j}
                  className="text-center text-xs font-semibold py-2"
                  style={{ color: palette.gray }}
                >
                  {j}
                </div>
              ))}
            </div>

            {/* Cases */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null)
                  return <div key={i} className="aspect-square" />;
                const rdvs = appointmentsFor(day);
                const isSelected = selectedDay === dayKey(day);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(dayKey(day))}
                    className={`aspect-square rounded-xl p-1.5 text-left transition relative flex flex-col ${
                      isSelected ? "ring-2 ring-[#7F9BA9]" : ""
                    } hover:bg-[#DED9D0]/30`}
                    style={{
                      backgroundColor: isToday(day)
                        ? palette.primary + "15"
                        : "transparent",
                      border: `1px solid ${palette.cream}`,
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: isToday(day) ? palette.primary : palette.dark,
                        fontWeight: isToday(day) ? 700 : 500,
                      }}
                    >
                      {day}
                    </span>
                    <div className="flex flex-wrap gap-0.5 mt-auto">
                      {rdvs.slice(0, 3).map((r) => (
                        <span
                          key={r.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              r.source === "moha"
                                ? palette.primary
                                : palette.sand,
                          }}
                        />
                      ))}
                      {rdvs.length > 3 && (
                        <span
                          className="text-[9px]"
                          style={{ color: palette.gray }}
                        >
                          +{rdvs.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Légende */}
            <div
              className="flex items-center gap-4 mt-4 pt-4 border-t"
              style={{ borderColor: palette.cream }}
            >
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: palette.gray }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: palette.primary }}
                />
                RDV pris via Moha
              </div>
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: palette.gray }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: palette.sand }}
                />
                Événement Google
              </div>
            </div>
          </>
        )}
      </div>

      {/* Détail du jour sélectionné */}
      {selectedDay && (
        <div className="bg-[#FDFDFD] rounded-2xl p-5 shadow-sm">
          <h3
            className="font-display text-lg mb-3"
            style={{ color: palette.dark }}
          >
            {new Date(selectedDay).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          {selectedAppointments.length === 0 ? (
            <p className="text-sm" style={{ color: palette.gray }}>
              Aucun rendez-vous ce jour-là.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ borderColor: palette.cream }}
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        a.source === "moha" ? palette.primary : palette.sand,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="font-medium text-sm"
                        style={{ color: palette.dark }}
                      >
                        {new Date(a.start).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <span className="text-xs" style={{ color: palette.gray }}>
                        {a.title}
                      </span>
                    </div>
                    {a.summary && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: palette.gray }}
                      >
                        {a.summary}
                      </p>
                    )}
                    {a.lead_phone && (
                      <div
                        className="flex items-center gap-1.5 text-xs mt-1"
                        style={{ color: palette.primary }}
                      >
                        <Phone size={12} />
                        <span>{a.lead_phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
