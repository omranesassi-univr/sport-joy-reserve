import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  loading: boolean;
  addBooking: (b: Omit<Booking, "id" | "createdAt">) => Promise<Booking | null>;
  removeBooking: (id: string) => Promise<void>;
  isBooked: (courtId: string, date: string, slot: string) => boolean;
};

const BookingContext = createContext<Ctx | null>(null);

const fromRow = (r: any): Booking => ({
  id: r.id,
  courtId: r.court_id,
  courtName: r.court_name,
  city: r.city,
  sport: r.sport,
  date: r.date,
  slot: r.slot,
  price: Number(r.price),
  createdAt: new Date(r.created_at).getTime(),
});

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const refresh = useCallback(async (uid: string | null) => {
    if (!uid) { setBookings([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data.map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      refresh(uid);
    });
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      refresh(uid);
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const addBooking: Ctx["addBooking"] = async (b) => {
    if (!userId) { toast.error("Connectez-vous pour réserver"); return null; }
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        court_id: b.courtId,
        court_name: b.courtName,
        city: b.city,
        sport: b.sport,
        date: b.date,
        slot: b.slot,
        price: b.price,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error(error?.message.includes("uniq_court_date_slot") ? "Créneau déjà réservé" : (error?.message ?? "Erreur"));
      return null;
    }
    const full = fromRow(data);
    setBookings((p) => [full, ...p]);
    return full;
  };

  const removeBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setBookings((p) => p.filter((x) => x.id !== id));
  };

  const isBooked = (courtId: string, date: string, slot: string) =>
    bookings.some((b) => b.courtId === courtId && b.date === date && b.slot === slot);

  return (
    <BookingContext.Provider value={{ bookings, loading, addBooking, removeBooking, isBooked }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be inside BookingProvider");
  return ctx;
};
