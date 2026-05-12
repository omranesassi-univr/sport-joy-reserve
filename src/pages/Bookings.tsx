import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { useBookings } from "@/context/BookingContext";
import { Calendar, Clock, MapPin, Trash2, Users, SignalHigh, PlusCircle, Send, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Partner = {
  id: string;
  user_id: string;
  sport: "football" | "padel";
  venue: string;
  date: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  joined: number;
  total: number;
  note?: string | null;
  joinedByMe?: boolean;
};

const Bookings = () => {
  const { bookings, removeBooking } = useBookings();
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
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

  const loadPartners = async (uid: string | null) => {
    const { data: parts } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });
    if (!parts) return;
    const ids = parts.map((p) => p.id);
    const { data: pp } = ids.length
      ? await supabase.from("partner_participants").select("partner_id, user_id").in("partner_id", ids)
      : { data: [] as any[] };
    const counts = new Map<string, number>();
    const mine = new Set<string>();
    (pp ?? []).forEach((r: any) => {
      counts.set(r.partner_id, (counts.get(r.partner_id) ?? 0) + 1);
      if (uid && r.user_id === uid) mine.add(r.partner_id);
    });
    setPartners(
      parts.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        sport: p.sport,
        venue: p.venue,
        date: p.date,
        level: p.level,
        total: p.total,
        note: p.note,
        joined: counts.get(p.id) ?? 0,
        joinedByMe: mine.has(p.id),
      })),
    );
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      loadPartners(uid);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      loadPartners(uid);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Realtime: refresh partners when participants or partners change
  useEffect(() => {
    const channel = supabase
      .channel("partners-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partner_participants" },
        () => {
          supabase.auth.getSession().then(({ data }) =>
            loadPartners(data.session?.user?.id ?? null),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "partners" },
        () => {
          supabase.auth.getSession().then(({ data }) =>
            loadPartners(data.session?.user?.id ?? null),
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (filterSport !== "all" && p.sport !== filterSport) return false;
      if (filterLevel !== "all" && p.level !== filterLevel) return false;
      if (filterDate && !p.date.toLowerCase().includes(filterDate.toLowerCase())) return false;
      return true;
    });
  }, [partners, filterSport, filterLevel, filterDate]);

  const join = async (id: string) => {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id ?? userId;
    if (!uid) {
      toast.error("Session expirée", {
        description: "Veuillez vous reconnecter pour rejoindre cette partie.",
        action: { label: "Se reconnecter", onClick: () => navigate("/auth") },
      });
      return;
    }
    const { error } = await supabase.from("partner_participants").insert({ partner_id: id, user_id: uid });
    if (error) {
      if (error.code === "23505" || error.message.includes("uniq_partner_user")) {
        toast.error("Vous êtes déjà inscrit à cette annonce");
      } else if (
        error.code === "42501" ||
        error.message.toLowerCase().includes("row-level security") ||
        error.message.toLowerCase().includes("rls")
      ) {
        await supabase.auth.signOut();
        setUserId(null);
        toast.error("Permissions insuffisantes", {
          description: "Votre session n'est plus valide. Reconnectez-vous pour rejoindre l'annonce.",
          action: { label: "Se reconnecter", onClick: () => navigate("/auth") },
        });
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Vous avez rejoint la partie ✅");
    loadPartners(uid);
  };

  const leave = async (id: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("partner_participants")
      .delete()
      .eq("partner_id", id)
      .eq("user_id", userId);
    if (error) { toast.error(error.message); return; }
    toast.success("Vous avez quitté la partie");
    loadPartners(userId);
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { toast.error("Connectez-vous pour publier"); return; }
    if (!form.venue || !form.date || !form.time) {
      toast.error("Renseignez le terrain, la date et l'heure");
      return;
    }
    const { error } = await supabase.from("partners").insert({
      user_id: userId,
      sport: form.sport,
      venue: form.venue,
      date: `${form.date} • ${form.time}`,
      level: form.level,
      total: 1 + Number(form.missing || 1),
      note: form.note || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Annonce publiée ✅");
    setForm({ ...form, venue: "", date: "", time: "", note: "", missing: 1 });
    loadPartners(userId);
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
                          {p.joinedByMe && (
                            <span className="text-[10px] font-semibold text-primary">✓ Inscrit</span>
                          )}
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
                      {p.joinedByMe ? (
                        <Button variant="outline" onClick={() => leave(p.id)}>
                          Se désinscrire
                        </Button>
                      ) : (
                        <Button variant="hero" disabled={full} onClick={() => join(p.id)}>
                          {full ? "Complet" : "Rejoindre"}
                        </Button>
                      )}
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