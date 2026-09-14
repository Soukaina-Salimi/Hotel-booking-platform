// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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

export const navItems = [
  { label: "Destinations", href: "/destinations" },
  { label: "Hôtels", href: "/hotels" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: string;
  userName?: string;
}

// Utiliser export default au lieu de export function
export default function Navbar({
  isAuthenticated = false,
  userRole = "guest",
  userName = "",
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#FDFDFD]/95 backdrop-blur-md shadow-lg border-b border-[#DED9D0]/30"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: palette.primary }}
            >
              <span className="text-white font-display text-lg">د</span>
            </div>
            <span
              className="font-display text-xl transition-colors"
              style={{
                color: scrolled ? palette.dark : palette.white,
              }}
            >
              Dar<span style={{ color: palette.brown }}>iwane</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative group ${
                  isActive(item.href)
                    ? "text-[#7F9BA9] bg-[#7F9BA9]/10"
                    : scrolled
                      ? "text-[#595B57] hover:text-[#7F9BA9] hover:bg-[#7F9BA9]/5"
                      : "text-[#DED9D0] hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ backgroundColor: palette.primary }}
                  />
                )}
              </Link>
            ))}

            <div className="h-6 w-px bg-[#DED9D0]/30 mx-2"></div>

            <Link
              href="/partner"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scrolled
                  ? "text-[#595B57] hover:text-[#7F9BA9] hover:bg-[#7F9BA9]/5"
                  : "text-[#DED9D0] hover:text-white hover:bg-white/10"
              }`}
            >
              Devenir partenaire
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7F9BA9] flex items-center justify-center text-white font-semibold text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : "?"}
                </div>
                <span
                  className={`text-sm font-medium hidden md:block ${
                    scrolled ? "text-[#3B2E22]" : "text-white"
                  }`}
                >
                  {userName}
                </span>
                <button
                  className="px-3 py-1.5 rounded-lg text-white text-sm font-medium transition hover:opacity-90"
                  style={{ backgroundColor: palette.brown }}
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all hidden md:block ${
                    scrolled
                      ? "text-[#595B57] hover:text-[#7F9BA9] hover:bg-[#7F9BA9]/5"
                      : "text-[#DED9D0] hover:text-white hover:bg-white/10"
                  }`}
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className={`px-5 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 ${
                    scrolled
                      ? "bg-[#7F9BA9] hover:bg-[#647C87] shadow-md hover:shadow-lg"
                      : "bg-[#FDFDFD] text-[#7F9BA9] hover:shadow-xl"
                  }`}
                >
                  S'inscrire
                </Link>
              </>
            )}

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#7F9BA9]/10 transition"
            >
              {isMenuOpen ? (
                <X
                  size={24}
                  style={{ color: scrolled ? palette.dark : palette.white }}
                />
              ) : (
                <Menu
                  size={24}
                  style={{ color: scrolled ? palette.dark : palette.white }}
                />
              )}
            </button>
          </div>
        </nav>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#FDFDFD] border-t border-[#DED9D0] py-4 px-4 shadow-lg">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                    isActive(item.href)
                      ? "bg-[#7F9BA9]/10 text-[#7F9BA9]"
                      : "text-[#3B2E22] hover:bg-[#7F9BA9]/5"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="ml-auto text-[#7F9BA9]">✓</span>
                  )}
                </Link>
              ))}

              <div className="h-px bg-[#DED9D0] my-2"></div>

              <Link
                href="/partner/register"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#3B2E22] hover:bg-[#7F9BA9]/5 transition"
              >
                Devenir partenaire
              </Link>

              {!isAuthenticated && (
                <>
                  <div className="h-px bg-[#DED9D0] my-2"></div>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#3B2E22] hover:bg-[#7F9BA9]/5 transition"
                  >
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>
    </>
  );
}
