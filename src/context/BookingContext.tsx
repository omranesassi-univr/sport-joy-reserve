import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Booking = {
  id: string;
  courtId: string;
  courtName: string;
  city: string;
  sport: "football" | "padel";
  date: string;
  slot: string;
  price: number;
  createdAt: number;
};

type Ctx = {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Booking;
  removeBooking: (id: string) => void;
  isBooked: (courtId: string, date: string, slot: string) => boolean;
};

const BookingContext = createContext<Ctx | null>(null);
const KEY = "sporthub.bookings.v1";

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setBookings(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookings));
  }, [bookings]);

  const addBooking: Ctx["addBooking"] = (b) => {
    const full: Booking = { ...b, id: crypto.randomUUID(), createdAt: Date.now() };
    setBookings((p) => [full, ...p]);
    return full;
  };

  const removeBooking = (id: string) => setBookings((p) => p.filter((x) => x.id !== id));

  const isBooked = (courtId: string, date: string, slot: string) =>
    bookings.some((b) => b.courtId === courtId && b.date === date && b.slot === slot);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, removeBooking, isBooked }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be inside BookingProvider");
  return ctx;
};