import { useMemo, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Brain, Trophy, Video, CalendarCheck } from "lucide-react";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import padelImg from "@/assets/padel-coaching.jpg";

const coaches = [
  { name: "Ahmed Mansour", level: "COMPÉTITION", rating: 4.9, desc: "Expert en tactique de jeu et smashs puissants. 10 ans d'expérience." },
  { name: "Sarra Ben Ali", level: "DÉBUTANT", rating: 4.8, desc: "Spécialisée dans l'initiation et les bases techniques pour adultes et enfants." },
  { name: "Yassine Trabelsi", level: "COMPÉTITION", rating: 5.0, desc: "Ancien joueur pro, focalisé sur la préparation physique et mentale." },
  { name: "Ines Khemiri", level: "DÉBUTANT", rating: 4.7, desc: "Pédagogie douce, idéale pour une progression sereine et ludique." },
];

const packs = [
  { id: "individual", title: "Pack Individuel", desc: "Coaching 1-sur-1 pour un maximum de résultats.", price: 60 },
  { id: "group", title: "Pack Groupe (2-4 pers)", desc: "Apprenez ensemble et partagez les frais.", price: 100 },
];

const slots = ["09:00", "10:30", "14:00", "15:30", "17:00"];
const benefits = [
  { icon: Brain, title: "Méthodologie Espagnole", desc: "Nos programmes sont calqués sur les meilleurs centres de formation au monde." },
  { icon: Trophy, title: "Matériel Professionnel Fourni", desc: "Raquettes haut de gamme (Bullpadel, Nox) et balles neuves à chaque séance." },
  { icon: Video, title: "Analyse Vidéo", desc: "Inclus dans le pack compétition pour corriger vos placements en temps réel." },
];

const monthLabel = (d: Date) =>
  d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }).replace(/^\w/, (c) => c.toUpperCase());

const buildCalendar = (cursor: Date) => {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  // Monday-first index
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: { day: number; current: boolean; date: Date }[] = [];
  for (let i = 0; i < startDay; i++) {
    const d = new Date(first);
    d.setDate(d.getDate() - (startDay - i));
    cells.push({ day: d.getDate(), current: false, date: d });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, date: new Date(cursor.getFullYear(), cursor.getMonth(), d) });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    const d = new Date(last);
    d.setDate(d.getDate() + 1);
    cells.push({ day: d.getDate(), current: false, date: d });
  }
  return cells;
};

const PadelCoaching = () => {
  const [coach, setCoach] = useState(coaches[0].name);
  const [pack, setPack] = useState(packs[0].id);
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const cells = useMemo(() => buildCalendar(cursor), [cursor]);

  const reserve = () => {
    if (!selectedDate || !slot) {
      toast.error("Choisissez une date et un créneau.");
      return;
    }
    toast.success(
      `Séance réservée avec ${coach} le ${selectedDate.toLocaleDateString("fr-FR")} à ${slot}.`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-center"
        style={{ backgroundImage: `url(${padelImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="container relative py-24">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Masterclass Padel</span>
          <h1 className="text-display text-5xl md:text-7xl mt-3 max-w-3xl">
            Élevez votre jeu<br />avec nos coachs experts.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg">
            Que vous débutiez ou que vous visiez la compétition, bénéficiez d'un accompagnement
            personnalisé dans les meilleures installations de Tunisie.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#booking">Réserver ma séance</a>
            </Button>
            <Button variant="outlineBrand" size="lg" asChild>
              <a href="#methods">Nos méthodes</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Coachs */}
      <section className="container py-24">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Notre équipe</span>
          <h2 className="text-display text-4xl md:text-5xl mt-2">Nos coachs certifiés</h2>
          <p className="mt-3 text-muted-foreground">Sélectionnez l'expert qui correspond à vos objectifs.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coaches.map((c) => {
            const active = coach === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setCoach(c.name)}
                className={`text-left bg-card border rounded-2xl p-6 transition ${
                  active ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-1 text-primary text-sm font-bold mb-3">
                  <Star className="size-4 fill-primary" /> {c.rating}
                </div>
                <h3 className="text-display text-xl">{c.name}</h3>
                <span
                  className={`inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                    c.level === "COMPÉTITION"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {c.level}
                </span>
                <p className="text-sm text-muted-foreground mt-4 min-h-[60px]">{c.desc}</p>
                <div className={`mt-3 text-xs font-bold uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {active ? "✓ Coach sélectionné" : "Choisir ce coach"}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="container pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pack */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-display text-2xl mb-6">Type de séance</h2>
            <div className="space-y-4">
              {packs.map((p) => {
                const active = pack === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPack(p.id)}
                    className={`w-full text-left p-5 rounded-xl border flex items-center justify-between transition ${
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div>
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                    </div>
                    <div className="text-display text-2xl text-primary">{p.price} <span className="text-sm">DT</span></div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendrier */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-display text-2xl">Disponibilités</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                  className="p-2 rounded-md hover:bg-secondary"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-bold uppercase tracking-widest min-w-[140px] text-center">
                  {monthLabel(cursor)}
                </span>
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  className="p-2 rounded-md hover:bg-secondary"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((c, i) => {
                const isSelected =
                  selectedDate &&
                  c.date.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => c.current && setSelectedDate(c.date)}
                    disabled={!c.current}
                    className={`aspect-square rounded-md text-sm transition ${
                      !c.current
                        ? "text-muted-foreground/30"
                        : isSelected
                        ? "bg-primary text-primary-foreground font-black"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {c.day}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Créneaux horaires — {selectedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`px-4 py-2 rounded-md border text-sm font-bold transition ${
                        slot === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <Button onClick={reserve} variant="hero" size="lg" className="w-full mt-6">
                  <CalendarCheck className="size-4" /> Confirmer la réservation
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Méthodes */}
      <section id="methods" className="container pb-24">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Avantages</span>
          <h2 className="text-display text-4xl md:text-5xl mt-2">Pourquoi s'entraîner avec SportHub ?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-7 hover:border-primary/50 transition">
              <Icon className="size-8 text-primary mb-4" />
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="rounded-3xl gradient-brand text-primary-foreground p-12 md:p-16 text-center">
          <h2 className="text-display text-4xl md:text-5xl">Prêt à dominer le court ?</h2>
          <p className="mt-4 max-w-xl mx-auto opacity-80">
            Réservez votre première séance aujourd'hui et bénéficiez de -10% sur votre pack découverte.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-background text-foreground hover:bg-background/90 rounded-full font-black uppercase tracking-tight"
          >
            <a href="#booking">Réserver ma séance maintenant</a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PadelCoaching;