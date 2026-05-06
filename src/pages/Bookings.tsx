import { Link } from "react-router-dom";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/context/BookingContext";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";

const Bookings = () => {
  const { bookings, removeBooking } = useBookings();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <header className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Mon compte</span>
          <h1 className="text-display text-5xl mt-2">Mes <span className="text-primary">réservations</span></h1>
        </header>

        {bookings.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <p className="text-muted-foreground mb-6">Vous n'avez encore aucune réservation.</p>
            <Button variant="hero" asChild><Link to="/courts">Réserver un terrain</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b.id} className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center gap-6">
                <div className="flex-1 min-w-[220px]">
                  <div className="text-xs font-bold uppercase tracking-widest text-primary">
                    {b.sport === "football" ? "⚽ Football" : "🎾 Padel"}
                  </div>
                  <Link to={`/courts/${b.courtId}`} className="font-bold text-lg hover:text-primary">{b.courtName}</Link>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3" /> {b.city}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm"><Calendar className="size-4 text-primary" /> {b.date}</div>
                <div className="flex items-center gap-2 text-sm"><Clock className="size-4 text-primary" /> {b.slot}</div>
                <div className="text-display text-xl text-primary">{b.price} TND</div>
                <Button variant="ghost" size="icon" onClick={() => removeBooking(b.id)} aria-label="Annuler">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;