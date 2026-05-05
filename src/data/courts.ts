import padel from "@/assets/sport-padel.jpg";
import football from "@/assets/sport-football.jpg";

export type Sport = "football" | "padel";

export type Court = {
  id: string;
  name: string;
  complex: string;
  city: string;
  sport: Sport;
  pricePerHour: number; // TND
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  description: string;
};

export const courts: Court[] = [
  {
    id: "fb-arena-01",
    name: "Arena Centrale — Terrain 1",
    complex: "SportHub Lac Arena",
    city: "Tunis — Les Berges du Lac",
    sport: "football",
    pricePerHour: 80,
    rating: 4.8,
    reviews: 142,
    image: football,
    features: ["Pelouse synthétique", "Éclairage LED", "Vestiaires", "Parking"],
    description: "Terrain 5v5 indoor avec gazon synthétique nouvelle génération.",
  },
  {
    id: "pd-glass-02",
    name: "Padel Panoramic Court A",
    complex: "SportHub Lac Arena",
    city: "Tunis — Les Berges du Lac",
    sport: "padel",
    pricePerHour: 60,
    rating: 4.9,
    reviews: 98,
    image: padel,
    features: ["Vitré panoramic", "Raquettes incluses", "Climatisé"],
    description: "Court de padel panoramique aux normes WPT.",
  },
  {
    id: "fb-soussex-03",
    name: "Stade Five — Sousse Sud",
    complex: "SportHub Sousse",
    city: "Sousse",
    sport: "football",
    pricePerHour: 70,
    rating: 4.6,
    reviews: 211,
    image: football,
    features: ["Outdoor", "Tribunes", "Café"],
    description: "Terrain 7v7 en plein air avec vue sur la mer.",
  },
  {
    id: "pd-sfax-04",
    name: "Padel Club Sfax",
    complex: "SportHub Sfax",
    city: "Sfax",
    sport: "padel",
    pricePerHour: 50,
    rating: 4.7,
    reviews: 67,
    image: padel,
    features: ["Indoor", "Pro shop", "Coach disponible"],
    description: "4 courts de padel indoor avec coachs certifiés.",
  },
  {
    id: "fb-mar-05",
    name: "Mini-Stade Marsa",
    complex: "SportHub Marsa",
    city: "La Marsa",
    sport: "football",
    pricePerHour: 90,
    rating: 4.9,
    reviews: 320,
    image: football,
    features: ["Premium turf", "Caméra HD", "Replay", "Café"],
    description: "Terrain 5v5 premium avec captation vidéo automatique.",
  },
  {
    id: "pd-ham-06",
    name: "Padel Hammamet Bay",
    complex: "SportHub Hammamet",
    city: "Hammamet",
    sport: "padel",
    pricePerHour: 55,
    rating: 4.5,
    reviews: 44,
    image: padel,
    features: ["Outdoor", "Vue mer", "Bar"],
    description: "Padel en bord de mer, ambiance unique.",
  },
];

export const getCourt = (id: string) => courts.find((c) => c.id === id);

export const timeSlots = [
  "09:00", "10:30", "12:00", "13:30", "15:00",
  "16:30", "18:00", "19:30", "21:00", "22:30",
];

// Deterministic "booked" status based on slot index
export const isSlotBooked = (courtId: string, slot: string) => {
  const seed = courtId.length + slot.charCodeAt(0) + slot.charCodeAt(1);
  return seed % 5 === 0;
};