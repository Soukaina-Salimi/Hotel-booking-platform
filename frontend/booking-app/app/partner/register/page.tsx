// app/partner/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  AlertCircle,
  Upload,
  FileText,
  Calendar,
  Users,
  Star,
  Award,
  ChevronRight,
  Phone as PhoneIcon,
  Mail as MailIcon,
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

// Types d'hébergement
const propertyTypes = [
  "Hôtel",
  "Riad",
  "Guest House",
  "Appartements",
  "Villa",
  "Resort",
  "Camping",
  "Auberge",
];

// Équipements
const amenitiesList = [
  "Wi-Fi",
  "Piscine",
  "Restaurant",
  "Spa",
  "Parking",
  "Climatisation",
  "Petit-déjeuner",
  "Terrasse",
  "Jardin",
  "Pets allowed",
  "Accessible",
  "Room service",
];

export default function PartnerRegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "hotel",
    hotelName: "",
    hotelType: "",
    hotelDescription: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Maroc",
    roomsCount: "",
    stars: "",
    amenities: [] as string[],
    photos: [] as File[],
    logo: null as File | null,
    acceptTerms: false,
    acceptNewsletter: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (e.target.name === "logo") {
        setFormData((prev) => ({ ...prev, logo: files[0] }));
      } else {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...Array.from(files)],
        }));
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    setError("");

    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }
      if (formData.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }
    }

    if (step === 2) {
      if (
        !formData.hotelName ||
        !formData.hotelType ||
        !formData.city ||
        !formData.roomsCount
      ) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }

    if (step === 3) {
      if (formData.amenities.length === 0) {
        setError("Veuillez sélectionner au moins un équipement");
        return;
      }
    }

    if (step === 4) {
      if (!formData.acceptTerms) {
        setError("Veuillez accepter les conditions d'utilisation");
        return;
      }
    }

    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const authRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: "hotel",
          }),
        },
      );

      if (!authRes.ok) {
        const json = await authRes.json().catch(() => null);
        throw new Error(
          json?.message ||
            "Impossible de créer le compte (email déjà utilisé ?)",
        );
      }

      const { token, user } = await authRes.json();

      const hotelRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hotels`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner_id: user.id,
            name: formData.hotelName,
            city: formData.city,
            address: formData.address,
            description: formData.hotelDescription,
            amenities: formData.amenities,
          }),
        },
      );

      if (!hotelRes.ok) {
        throw new Error(
          "Compte créé, mais la fiche hôtel n'a pas pu être enregistrée. Contactez le support.",
        );
      }

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue, réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  // Étape 1 - Informations personnelles
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Prénom *
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: palette.gray }}
            />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ahmed"
              className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
              style={{
                backgroundColor: palette.white,
                borderColor: palette.cream,
                color: palette.dark,
              }}
            />
          </div>
        </div>
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Nom *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Benali"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Email professionnel *
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: palette.gray }}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@votrehotel.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Téléphone *
        </label>
        <div className="relative">
          <PhoneIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: palette.gray }}
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+212 6 12 34 56 78"
            className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Mot de passe *
        </label>
        <div className="relative">
          <KeyRound
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: palette.gray }}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition hover:opacity-70"
            style={{ color: palette.gray }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs mt-1" style={{ color: palette.gray }}>
          Minimum 6 caractères
        </p>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Confirmer le mot de passe *
        </label>
        <div className="relative">
          <KeyRound
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: palette.gray }}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>
    </div>
  );

  // Étape 2 - Informations de l'hôtel
  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Nom de l'hôtel *
        </label>
        <div className="relative">
          <Building2
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: palette.gray }}
          />
          <input
            type="text"
            name="hotelName"
            value={formData.hotelName}
            onChange={handleChange}
            placeholder="Royal Mansour"
            className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Type d'hébergement *
          </label>
          <select
            name="hotelType"
            value={formData.hotelType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          >
            <option value="">Sélectionnez</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Classification *
          </label>
          <select
            name="stars"
            value={formData.stars}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          >
            <option value="">Sélectionnez</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {"⭐".repeat(n)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Description *
        </label>
        <textarea
          name="hotelDescription"
          value={formData.hotelDescription}
          onChange={handleChange}
          placeholder="Décrivez votre établissement..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9] resize-none"
          style={{
            backgroundColor: palette.white,
            borderColor: palette.cream,
            color: palette.dark,
          }}
        />
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Adresse *
        </label>
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-3 top-3"
            style={{ color: palette.gray }}
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Rue de la Médina..."
            rows={2}
            className="w-full pl-10 pr-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9] resize-none"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Ville *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Marrakech"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Code postal
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="40000"
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
        <div>
          <label
            className="text-sm font-medium block mb-1.5"
            style={{ color: palette.dark }}
          >
            Pays *
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
            style={{
              backgroundColor: palette.white,
              borderColor: palette.cream,
              color: palette.dark,
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Nombre de chambres *
        </label>
        <input
          type="number"
          name="roomsCount"
          value={formData.roomsCount}
          onChange={handleChange}
          placeholder="25"
          className="w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-[#7F9BA9]"
          style={{
            backgroundColor: palette.white,
            borderColor: palette.cream,
            color: palette.dark,
          }}
        />
      </div>
    </div>
  );

  // Étape 3 - Équipements et photos (CORRIGÉE)
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label
          className="text-sm font-medium block mb-3"
          style={{ color: palette.dark }}
        >
          Équipements * (sélectionnez au moins un)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {amenitiesList.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => handleAmenityToggle(amenity)}
              className={`px-3 py-2 rounded-xl border text-sm transition ${
                formData.amenities.includes(amenity)
                  ? "border-[#7F9BA9] bg-[#7F9BA9]/10 text-[#7F9BA9] font-medium"
                  : "border-[#DED9D0] text-[#595B57] hover:border-[#7F9BA9]/30"
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
        {formData.amenities.length > 0 && (
          <p className="text-xs mt-2" style={{ color: palette.gray }}>
            {formData.amenities.length} équipement
            {formData.amenities.length > 1 ? "s" : ""} sélectionné
            {formData.amenities.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Logo de l'hôtel
        </label>
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center transition hover:border-[#7F9BA9]"
          style={{ borderColor: palette.cream }}
        >
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            <Upload
              size={32}
              className="mx-auto mb-2"
              style={{ color: palette.gray }}
            />
            <p className="text-sm" style={{ color: palette.dark }}>
              {formData.logo
                ? formData.logo.name
                : "Cliquez pour télécharger votre logo"}
            </p>
            <p className="text-xs" style={{ color: palette.gray }}>
              JPG, PNG, SVG (max 5MB)
            </p>
          </label>
        </div>
      </div>

      <div>
        <label
          className="text-sm font-medium block mb-1.5"
          style={{ color: palette.dark }}
        >
          Photos de l'hôtel
        </label>
        <div
          className="border-2 border-dashed rounded-xl p-6 text-center transition hover:border-[#7F9BA9]"
          style={{ borderColor: palette.cream }}
        >
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="photos-upload"
          />
          <label htmlFor="photos-upload" className="cursor-pointer">
            <FileText
              size={32}
              className="mx-auto mb-2"
              style={{ color: palette.gray }}
            />
            <p className="text-sm" style={{ color: palette.dark }}>
              {formData.photos.length > 0
                ? `${formData.photos.length} photo${formData.photos.length > 1 ? "s" : ""} téléchargée${formData.photos.length > 1 ? "s" : ""}`
                : "Cliquez pour télécharger vos photos"}
            </p>
            <p className="text-xs" style={{ color: palette.gray }}>
              JPG, PNG (max 10MB par photo)
            </p>
          </label>
        </div>
        {formData.photos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.photos.map((photo, index) => (
              <div
                key={index}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#DED9D0]"
              >
                <div
                  className="w-full h-full bg-[#DED9D0] flex items-center justify-center text-xs"
                  style={{ color: palette.gray }}
                >
                  📷
                </div>
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Étape 4 - Confirmation (CORRIGÉE)
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle size={24} className="text-green-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800">
              Vérifiez vos informations
            </h4>
            <p className="text-sm text-green-700">
              Avant de finaliser votre inscription
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#DED9D0]/20 rounded-xl p-4 border border-[#DED9D0]">
          <h4
            className="font-medium text-sm mb-2"
            style={{ color: palette.dark }}
          >
            👤 Informations personnelles
          </h4>
          <div className="space-y-1 text-sm" style={{ color: palette.gray }}>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Nom :
              </span>{" "}
              {formData.firstName} {formData.lastName}
            </p>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Email :
              </span>{" "}
              {formData.email}
            </p>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Téléphone :
              </span>{" "}
              {formData.phone || "Non renseigné"}
            </p>
          </div>
        </div>

        <div className="bg-[#DED9D0]/20 rounded-xl p-4 border border-[#DED9D0]">
          <h4
            className="font-medium text-sm mb-2"
            style={{ color: palette.dark }}
          >
            🏨 Informations de l'hôtel
          </h4>
          <div className="space-y-1 text-sm" style={{ color: palette.gray }}>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Nom :
              </span>{" "}
              {formData.hotelName}
            </p>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Type :
              </span>{" "}
              {formData.hotelType}
            </p>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Ville :
              </span>{" "}
              {formData.city}
            </p>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Chambres :
              </span>{" "}
              {formData.roomsCount}
            </p>
            <p>
              <span className="font-medium" style={{ color: palette.dark }}>
                Classification :
              </span>{" "}
              {formData.stars
                ? "⭐".repeat(Number(formData.stars))
                : "Non renseigné"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#DED9D0]/20 rounded-xl p-4 border border-[#DED9D0]">
        <h4
          className="font-medium text-sm mb-2"
          style={{ color: palette.dark }}
        >
          🛠️ Équipements
        </h4>
        <div className="flex flex-wrap gap-1">
          {formData.amenities.map((amenity) => (
            <span
              key={amenity}
              className="text-xs px-2 py-0.5 rounded-full bg-[#7F9BA9]/10 text-[#7F9BA9]"
            >
              {amenity}
            </span>
          ))}
          {formData.amenities.length === 0 && (
            <span className="text-sm" style={{ color: palette.gray }}>
              Aucun équipement sélectionné
            </span>
          )}
        </div>
        <p className="text-xs mt-2" style={{ color: palette.gray }}>
          📷 {formData.photos.length} photo
          {formData.photos.length > 1 ? "s" : ""} téléchargée
          {formData.photos.length > 1 ? "s" : ""}
          {formData.logo && ` · Logo téléchargé`}
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded"
            style={{ accentColor: palette.primary }}
          />
          <span className="text-sm" style={{ color: palette.gray }}>
            J'accepte les{" "}
            <a href="#" className="text-[#7F9BA9] hover:underline">
              conditions générales d'utilisation
            </a>{" "}
            et la{" "}
            <a href="#" className="text-[#7F9BA9] hover:underline">
              politique de confidentialité
            </a>{" "}
            *
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptNewsletter"
            checked={formData.acceptNewsletter}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded"
            style={{ accentColor: palette.primary }}
          />
          <span className="text-sm" style={{ color: palette.gray }}>
            Je souhaite recevoir les actualités et offres de Dariwane
          </span>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={18} className="text-red-500" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}
    </div>
  );

  // Affichage du succès
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: palette.primaryDark }}
      >
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2
            className="font-display text-3xl"
            style={{ color: palette.white }}
          >
            Inscription réussie ! 🎉
          </h2>
          <p className="text-sm mt-3" style={{ color: palette.white + "CC" }}>
            Votre demande d'inscription a été envoyée avec succès. Notre équipe
            va examiner votre dossier et vous contacter dans les plus brefs
            délais.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/"
              className="block w-full py-3 rounded-xl font-medium transition hover:opacity-90"
              style={{
                backgroundColor: palette.sand,
                color: palette.primaryDark,
              }}
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/partner"
              className="block w-full py-3 rounded-xl border-2 font-medium transition hover:opacity-70"
              style={{
                borderColor: palette.white + "40",
                color: palette.white,
              }}
            >
              En savoir plus sur Dariwane
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: palette.primaryDark }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap");
        .font-display {
          font-family: "Fraunces", serif;
        }
      `}</style>

      {/* Navbar */}
      <Navbar isAuthenticated={false} userRole="guest" userName="" />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* En-tête */}
          <div className="mb-8">
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 text-sm transition hover:opacity-70 mb-4"
              style={{ color: palette.sand }}
            >
              <ArrowLeft size={16} />
              Retour à Devenir partenaire
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: palette.primary }}
              >
                <span className="text-white font-display text-2xl">د</span>
              </div>
              <span
                className="font-display text-2xl"
                style={{ color: palette.white }}
              >
                Dar<span style={{ color: palette.sand }}>iwane</span>
              </span>
            </div>

            <h1
              className="font-display text-3xl"
              style={{ color: palette.white }}
            >
              Devenir partenaire hôtelier
            </h1>
            <p className="text-sm mt-1" style={{ color: palette.white + "CC" }}>
              Créez votre espace et commencez à recevoir des réservations
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition ${
                  s <= step ? "bg-[#E9B883]" : "bg-[#FDFDFD]/30"
                }`}
              />
            ))}
          </div>
          <div
            className="flex justify-between text-xs mb-6"
            style={{ color: palette.white + "CC" }}
          >
            <span className={step >= 1 ? "text-[#E9B883] font-medium" : ""}>
              1. Compte
            </span>
            <span className={step >= 2 ? "text-[#E9B883] font-medium" : ""}>
              2. Hôtel
            </span>
            <span className={step >= 3 ? "text-[#E9B883] font-medium" : ""}>
              3. Équipements
            </span>
            <span className={step >= 4 ? "text-[#E9B883] font-medium" : ""}>
              4. Confirmation
            </span>
          </div>

          {/* Formulaire avec fond blanc */}
          <div className="bg-[#FDFDFD] rounded-2xl shadow-sm p-6 md:p-8">
            {renderStep()}

            {/* Boutons de navigation */}
            <div
              className="flex gap-3 mt-8 pt-6 border-t"
              style={{ borderColor: palette.cream }}
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border font-medium transition hover:opacity-70"
                  style={{
                    borderColor: palette.cream,
                    color: palette.gray,
                  }}
                >
                  Retour
                </button>
              )}
              <button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-xl text-white font-medium transition hover:opacity-90 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                style={{ backgroundColor: palette.primary }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    En cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {step === 4 ? "Finaliser l'inscription" : "Continuer"}
                    <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>

            {/* Indicateur de sécurité */}
            <div
              className="flex items-center justify-center gap-3 mt-6 text-xs"
              style={{ color: palette.gray }}
            >
              <span className="flex items-center gap-1">
                <Shield size={14} style={{ color: palette.primary }} />
                Données sécurisées
              </span>
              <span
                className="w-px h-3"
                style={{ backgroundColor: palette.cream }}
              ></span>
              <span className="flex items-center gap-1">
                <CheckCircle size={14} style={{ color: "#22C55E" }} />
                Chiffré SSL
              </span>
            </div>
          </div>
        </div>
      </div>

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
                  <PhoneIcon size={16} color={palette.sand} />
                  {footerLinks.contact.phone}
                </li>
                <li className="flex items-center gap-2">
                  <MailIcon size={16} color={palette.sand} />
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
