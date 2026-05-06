import { useMemo } from "react";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { useBookings } from "@/context/BookingContext";
import { courts } from "@/data/courts";
import { Activity, CalendarCheck, Wallet, TrendingUp } from "lucide-react";

const Owner = () => {
  const { bookings } = useBookings();

  const stats = useMemo(() => {
    const revenue = bookings.reduce((s, b) => s + b.price, 0);
    const occ = courts.length ? Math.min(100, Math.round((bookings.length / (courts.length * 10)) * 100)) : 0;
    return { revenue, occ, count: bookings.length };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <header className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Dashboard</span>
          <h1 className="text-display text-5xl mt-2">Espace <span className="text-primary">Propriétaire</span></h1>
          <p className="text-muted-foreground mt-2">Vue d'ensemble de vos terrains et de l'activité.</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Wallet, label: "Revenus", value: `${stats.revenue} TND` },
            { icon: CalendarCheck, label: "Réservations", value: stats.count },
            { icon: Activity, label: "Taux occupation", value: `${stats.occ}%` },
            { icon: TrendingUp, label: "Terrains actifs", value: courts.length },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <s.icon className="size-6 text-primary mb-3" />
              <div className="text-display text-3xl">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold uppercase tracking-widest text-sm">Réservations récentes</h2>
          </div>
          {bookings.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">Aucune réservation pour le moment.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Terrain</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Créneau</th>
                  <th className="text-right p-4">Montant</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 20).map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="p-4 font-semibold">{b.courtName}</td>
                    <td className="p-4">{b.date}</td>
                    <td className="p-4">{b.slot}</td>
                    <td className="p-4 text-right text-primary font-bold">{b.price} TND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Owner;