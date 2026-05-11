import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { getCourt, timeSlots, isSlotBooked } from "@/data/courts";
import { useBookings } from "@/context/BookingContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Star, CheckCircle2 } from "lucide-react";

const todayISO = () => new Date().toISOString().slice(0, 10);

const CourtDetail = () => {
  const { id = "" } = useParams();
  const court = getCourt(id);
  const navigate = useNavigate();
  const { addBooking, isBooked } = useBookings();
  const { toast } = useToast();

  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState<string | null>(null);

  const slotState = useMemo(() => {
    if (!court) return {} as Record<string, "free" | "booked" | "mine">;
    const map: Record<string, "free" | "booked" | "mine"> = {};
    for (const s of timeSlots) {
      if (isBooked(court.id, date, s)) map[s] = "mine";
      else if (isSlotBooked(court.id, s)) map[s] = "booked";
      else map[s] = "free";
    }
    return map;
  }, [court, date, isBooked]);

  if (!court) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-32 text-center">
          <h1 className="text-display text-4xl mb-4">Terrain introuvable</h1>
          <Button asChild variant="hero"><Link to="/courts">Retour au catalogue</Link></Button>
        </main>
      </div>
    );
  }

  const confirm = async () => {
    if (!slot) return;
    const b = await addBooking({
      courtId: court.id,
      courtName: court.name,
      city: court.city,
      sport: court.sport,
      date,
      slot,
      price: court.pricePerHour,
    });
    if (!b) return;
    toast({ title: "Réservation confirmée ✅", description: `${court.name} — ${date} à ${slot}` });
    navigate(`/bookings?new=${b.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Link to="/courts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="size-4" /> Retour aux terrains
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
          <div>
            <div className="rounded-2xl overflow-hidden border border-border">
              <img src={court.image} alt={court.name} className="w-full aspect-[16/10] object-cover" />
            </div>
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {court.sport === "football" ? "⚽ Football" : "🎾 Padel"}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {court.city}
              </span>
              <span className="inline-flex items-center gap-1 text-sm">
                <Star className="size-4 fill-primary text-primary" /> {court.rating} ({court.reviews})
              </span>
            </div>
            <h1 className="text-display text-4xl md:text-5xl mt-4">{court.name}</h1>
            <p className="text-muted-foreground mt-3 max-w-xl">{court.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {court.features.map((f) => (
                <div key={f} className="bg-card border border-border rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {f}
                </div>
              ))}
            </div>
          </div>

          <aside className="bg-card border border-border rounded-2xl p-6 lg:sticky lg:top-24 self-start">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-display text-4xl text-primary">{court.pricePerHour} TND</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ heure</div>
              </div>
            </div>

            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-6 mb-2 block">
              Date
            </label>
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => { setDate(e.target.value); setSlot(null); }}
              className="w-full h-11 rounded-md border border-input bg-background px-3"
            />

            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-6 mb-2 block">
              Créneaux
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((s) => {
                const state = slotState[s];
                const disabled = state === "booked" || state === "mine";
                const selected = slot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => !disabled && setSlot(s)}
                    disabled={disabled}
                    className={[
                      "h-11 rounded-md text-sm font-bold border transition-colors",
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : disabled
                        ? "bg-muted/40 text-muted-foreground border-border line-through cursor-not-allowed"
                        : "bg-background border-border hover:border-primary",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border my-6" />
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Date</span>
              <span className="font-semibold">{date || "—"}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Créneau</span>
              <span className="font-semibold">{slot || "—"}</span>
            </div>
            <div className="flex justify-between text-base mt-4">
              <span>Total</span>
              <span className="text-display text-2xl text-primary">{court.pricePerHour} TND</span>
            </div>

            <Button variant="hero" className="w-full mt-6 h-12" disabled={!slot} onClick={confirm}>
              Confirmer la réservation
            </Button>
            <p className="text-[11px] text-muted-foreground mt-3 text-center">
              Paiement sur place. Annulation gratuite jusqu'à 2h avant.
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourtDetail;