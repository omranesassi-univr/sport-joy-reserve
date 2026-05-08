import { Link } from "react-router-dom";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/context/BookingContext";
import { Calendar, Clock, MapPin, Trash2, Users, SignalHigh, PlusCircle, Send, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Partner = {
  id: string;
  sport: "football" | "padel";
  venue: string;
  distanceKm: number;
  date: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  joined: number;
  total: number;
  note?: string;
};

const SEED: Partner[] = [
  { id: "p1", sport: "football", venue: "Five Ariana - Terrain A", distanceKm: 7.2, date: "Samedi, 24 Octobre • 18:00", level: "Intermédiaire", joined: 3, total: 10 },
  { id: "p2", sport: "padel", venue: "Padel House La Marsa", distanceKm: 2.4, date: "Demain • 10:30", level: "Avancé", joined: 3, total: 4, note: "1 place dispo!" },
  { id: "p3", sport: "football", venue: "Sport City Ennasr", distanceKm: 5.8, date: "Lundi, 26 Octobre • 20:00", level: "Débutant", joined: 6, total: 12, note: "Besoin de monde!" },
  { id: "p4", sport: "padel", venue: "The Padel Club Tunis", distanceKm: 1.2, date: "Mercredi • 19:00", level: "Intermédiaire", joined: 2, total: 4 },
];

const Bookings = () => {
  const { bookings, removeBooking } = useBookings();
  const [partners, setPartners] = useState<Partner[]>(SEED);
  const [filterSport, setFilterSport] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterDate, setFilterDate] = useState("");

  const [form, setForm] = useState({
    sport: "football" as "football" | "padel",
    venue: "",
    date: "",
    time: "",
    level: "Intermédiaire" as Partner["level"],
    missing: 1,
    note: "",
  });

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (filterSport !== "all" && p.sport !== filterSport) return false;
      if (filterLevel !== "all" && p.level !== filterLevel) return false;
      if (filterDate && !p.date.toLowerCase().includes(filterDate.toLowerCase())) return false;
      return true;
    });
  }, [partners, filterSport, filterLevel, filterDate]);

  const join = (id: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id && p.joined < p.total ? { ...p, joined: p.joined + 1 } : p)),
    );
    toast.success("Vous avez rejoint la partie ✅");
  };

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.venue || !form.date || !form.time) {
      toast.error("Renseignez le terrain, la date et l'heure");
      return;
    }
    const newP: Partner = {
      id: crypto.randomUUID(),
      sport: form.sport,
      venue: form.venue,
      distanceKm: 0,
      date: `${form.date} • ${form.time}`,
      level: form.level,
      joined: 1,
      total: 1 + Number(form.missing || 1),
      note: form.note || undefined,
    };
    setPartners((prev) => [newP, ...prev]);
    toast.success("Annonce publiée ✅");
    setForm({ ...form, venue: "", date: "", time: "", note: "", missing: 1 });
  };

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

        {/* === Trouver des Partenaires === */}
        <section className="mt-20">
          <header className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Matchmaking</span>
            <h2 className="text-display text-4xl mt-2">Trouver des <span className="text-primary">Partenaires</span></h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Rejoignez des parties locales ou créez la vôtre pour compléter votre équipe.
            </p>
          </header>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            <div>
              {/* Filters */}
              <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sport</Label>
                  <Select value={filterSport} onValueChange={setFilterSport}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les sports</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="padel">Padel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
                  <Input className="mt-2" placeholder="ex: Samedi" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Niveau</Label>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous niveaux</SelectItem>
                      <SelectItem value="Débutant">Débutant</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Avancé">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={() => { setFilterSport("all"); setFilterLevel("all"); setFilterDate(""); }}>
                    <Filter className="size-4" /> Réinitialiser
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Parties disponibles</h3>
                <span className="text-sm text-muted-foreground">{filtered.length}</span>
              </div>

              <div className="grid gap-4">
                {filtered.map((p) => {
                  const full = p.joined >= p.total;
                  return (
                    <div key={p.id} className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center gap-6">
                      <div className="flex-1 min-w-[220px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            {p.sport === "football" ? "⚽ Football" : "🎾 Padel"}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground">{p.distanceKm > 0 ? `${p.distanceKm} km` : "—"}</span>
                        </div>
                        <div className="font-bold text-lg">{p.venue}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="size-3" /> {p.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm"><SignalHigh className="size-4 text-primary" /> {p.level}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="size-4 text-primary" /> {p.joined}/{p.total} {p.note ? `· ${p.note}` : "joueurs inscrits"}
                      </div>
                      <Button variant="hero" disabled={full} onClick={() => join(p.id)}>
                        {full ? "Complet" : "Rejoindre"}
                      </Button>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
                    Aucune partie ne correspond à vos filtres.
                  </div>
                )}
              </div>
            </div>

            {/* Create form */}
            <aside className="bg-card border border-border rounded-2xl p-6 self-start lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-4">
                <PlusCircle className="size-5 text-primary" />
                <h3 className="font-bold text-lg">Créer une annonce</h3>
              </div>
              <form onSubmit={publish} className="space-y-4">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type de sport</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(["football", "padel"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, sport: s })}
                        className={[
                          "h-11 rounded-md border text-sm font-bold capitalize",
                          form.sport === s ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary",
                        ].join(" ")}
                      >
                        {s === "football" ? "⚽ Football" : "🎾 Padel"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Terrain</Label>
                  <Select value={form.venue} onValueChange={(v) => setForm({ ...form, venue: v })}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder="Sélectionnez un terrain..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Five Ariana">Five Ariana</SelectItem>
                      <SelectItem value="Padel House La Marsa">Padel House La Marsa</SelectItem>
                      <SelectItem value="Sport City Ennasr">Sport City Ennasr</SelectItem>
                      <SelectItem value="The Padel Club Tunis">The Padel Club Tunis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</Label>
                    <Input type="date" className="mt-2" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Heure</Label>
                    <Input type="time" className="mt-2" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Niveau requis</Label>
                  <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v as Partner["level"] })}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Débutant">Débutant</SelectItem>
                      <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                      <SelectItem value="Avancé">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Joueurs manquants</Label>
                  <Input type="number" min={1} max={20} className="mt-2" value={form.missing} onChange={(e) => setForm({ ...form, missing: Number(e.target.value) })} />
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description (Optionnel)</Label>
                  <Textarea className="mt-2" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
                <Button type="submit" variant="hero" className="w-full h-12">
                  Publier l'annonce <Send className="size-4" />
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  En publiant, vous acceptez les conditions de fair-play de SportHub.
                </p>
              </form>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Bookings;