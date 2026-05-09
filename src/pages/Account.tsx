import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Download, Mail, Trash2, ShieldCheck } from "lucide-react";
import { useBookings } from "@/context/BookingContext";
import { toast } from "sonner";

type Tier = "BRONZE" | "ARGENT" | "OR";
const TIERS: { name: Tier; min: number; max: number | null; perks: { label: string; locked?: boolean }[] }[] = [
  {
    name: "BRONZE",
    min: 0,
    max: 500,
    perks: [
      { label: "Accès standard aux terrains" },
      { label: "Système de réservation classique" },
    ],
  },
  {
    name: "ARGENT",
    min: 501,
    max: 1500,
    perks: [
      { label: "5% de réduction sur toutes les réservations" },
      { label: "Support client prioritaire" },
      { label: "Accès aux événements privés", locked: true },
    ],
  },
  {
    name: "OR",
    min: 1501,
    max: null,
    perks: [
      { label: "10% de réduction permanente" },
      { label: "Réservation prioritaire (24h avant)" },
      { label: "Bons de carburant partenaires" },
      { label: "Accès anticipé aux nouveaux terrains" },
    ],
  },
];

type Profile = { full_name: string | null; phone: string | null };

const Account = () => {
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [marketing, setMarketing] = useState(true);

  const exportData = () => {
    const payload = {
      profile,
      email: session?.user.email,
      bookings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mes-donnees-sporthub.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Vos données ont été exportées");
  };

  const deleteAccount = async () => {
    await supabase.auth.signOut();
    toast.success("Compte supprimé");
    navigate("/");
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", session.user.id)
        .maybeSingle();
      setProfile(data ?? { full_name: null, phone: null });
      setLoading(false);
    })();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const stats = useMemo(() => {
    const total = bookings.length;
    const courts = new Set(bookings.map((b) => b.courtId)).size;
    const spent = bookings.reduce((s, b) => s + (b.price || 0), 0);
    return { total, courts, spent };
  }, [bookings]);

  const next = useMemo(() => {
    const now = Date.now();
    return [...bookings]
      .filter((b) => {
        const t = new Date(`${b.date}T${(b.slot || "00:00").slice(0, 5)}`).getTime();
        return !isNaN(t) && t >= now;
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.slot.slice(0, 5)}`).getTime() -
          new Date(`${b.date}T${b.slot.slice(0, 5)}`).getTime(),
      )[0];
  }, [bookings]);

  const points = stats.total * 50 + Math.floor(stats.spent / 2);
  const goal = 1500;
  const progress = Math.min(100, Math.round((points / goal) * 100));

  const currentTier: Tier = points >= 1501 ? "OR" : points >= 501 ? "ARGENT" : "BRONZE";
  const nextTier: Tier | null = currentTier === "BRONZE" ? "ARGENT" : currentTier === "ARGENT" ? "OR" : null;
  const nextThreshold = nextTier === "ARGENT" ? 501 : nextTier === "OR" ? 1500 : null;
  const pointsToNext = nextThreshold ? Math.max(0, nextThreshold - points) : 0;

  const pointsHistory = bookings.slice(0, 8).map((b) => ({
    date: b.date,
    action: `Réservation ${b.courtName}`,
    delta: 50 + Math.floor((b.price || 0) / 2),
  }));
  let running = points;
  const historyWithBalance = pointsHistory.map((h) => {
    const row = { ...h, balance: running };
    running -= h.delta;
    return row;
  });

  const initials = (profile?.full_name || session?.user.email || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 container py-20 text-center text-muted-foreground">Chargement…</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Espace Joueur</span>
          <h1 className="text-display text-4xl mt-2">Mon Compte</h1>
          <p className="text-muted-foreground mt-2">Gérez vos informations personnelles et suivez vos performances.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="size-24 rounded-full bg-primary/15 text-primary flex items-center justify-center text-2xl font-black">
                {initials}
              </div>
              <h2 className="text-display text-2xl mt-4">{profile?.full_name || "Joueur"}</h2>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                Joueur
              </span>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground w-full">
                <li>📞 {profile?.phone || "—"}</li>
                <li>✉️ {session.user.email}</li>
                <li>📍 Tunisie</li>
              </ul>
              <Button variant="hero" size="sm" className="mt-6 w-full" onClick={() => toast.info("Bientôt disponible")}>
                Modifier le profil
              </Button>
            </CardContent>
          </Card>

          {/* Right: tabs */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="info">Infos</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="subscription">Abonnement</TabsTrigger>
                <TabsTrigger value="logout">Quitter</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div><div className="text-muted-foreground">Nom</div><div className="font-bold">{profile?.full_name || "—"}</div></div>
                    <div><div className="text-muted-foreground">Téléphone</div><div className="font-bold">{profile?.phone || "—"}</div></div>
                    <div><div className="text-muted-foreground">Email</div><div className="font-bold">{session.user.email}</div></div>
                    <div><div className="text-muted-foreground">Membre depuis</div><div className="font-bold">{new Date(session.user.created_at).toLocaleDateString("fr-FR")}</div></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader><CardTitle>Historique des matchs</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {bookings.length === 0 && (
                      <p className="text-sm text-muted-foreground">Aucune réservation pour le moment.</p>
                    )}
                    {bookings.slice(0, 10).map((b) => (
                      <div key={b.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                        <div>
                          <div className="font-bold">{b.courtName}</div>
                          <div className="text-xs text-muted-foreground">{b.city} • {b.sport}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div>{b.date}</div>
                          <div className="text-muted-foreground">{b.slot}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription" className="mt-4 space-y-6">
                {/* Current level summary */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-primary">Niveau Actuel</div>
                        <div className="text-display text-3xl mt-1">{currentTier}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black">{points} pts</div>
                        {nextTier && (
                          <div className="text-xs text-muted-foreground">Prochain palier : {nextTier} ({nextThreshold} pts)</div>
                        )}
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                    {nextTier ? (
                      <p className="text-sm text-muted-foreground">
                        Plus que <span className="font-bold text-foreground">{pointsToNext} points</span> pour débloquer les avantages exclusifs {nextTier} !
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Vous avez atteint le niveau maximum 🎉</p>
                    )}
                  </CardContent>
                </Card>

                {/* Tier cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  {TIERS.map((tier) => {
                    const completed = points > (tier.max ?? Infinity);
                    const active = tier.name === currentTier;
                    const range = tier.max ? `${tier.min} - ${tier.max} pts` : `${tier.min}+ pts`;
                    return (
                      <Card
                        key={tier.name}
                        className={active ? "border-primary ring-2 ring-primary/30" : ""}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{tier.name}</CardTitle>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {completed ? "Complété" : active ? "Actif" : "À débloquer"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{range}</p>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {tier.perks.map((p) => (
                              <li key={p.label} className={`flex items-start gap-2 ${p.locked ? "opacity-60" : ""}`}>
                                <span>{p.locked ? "🔒" : active || completed ? "✓" : "★"}</span>
                                <span>{p.label}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Points history */}
                <Card>
                  <CardHeader><CardTitle>Historique des Points</CardTitle></CardHeader>
                  <CardContent>
                    {historyWithBalance.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucun point gagné pour le moment.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
                              <th className="py-2">Date</th>
                              <th className="py-2">Action</th>
                              <th className="py-2 text-right">Points</th>
                              <th className="py-2 text-right">Solde</th>
                            </tr>
                          </thead>
                          <tbody>
                            {historyWithBalance.map((h, i) => (
                              <tr key={i} className="border-b border-border/50">
                                <td className="py-2">{h.date}</td>
                                <td className="py-2">{h.action}</td>
                                <td className="py-2 text-right text-primary font-bold">+{h.delta} pts</td>
                                <td className="py-2 text-right">{h.balance} pts</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="mt-4 text-sm text-muted-foreground">
                      Total dépensé : <span className="font-bold text-foreground">{stats.spent} TND</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logout" className="mt-4">
                <Card>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Vous serez redirigé vers l'accueil.</p>
                    <Button variant="destructive" onClick={handleLogout}>Déconnexion</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Loyalty */}
            <Card>
              <CardHeader><CardTitle>Programme de Fidélité</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Argent</span>
                  <span className="text-2xl font-black">{points} pts</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">Objectif : {goal} pts pour OR</p>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>✓ Réduction 5% sur toutes les réservations</li>
                  <li>✓ Priorité support client 24/7</li>
                  <li>✓ Invitation aux tournois trimestriels</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6"><div className="text-xs uppercase text-muted-foreground">Réservations</div><div className="text-3xl font-black mt-1">{stats.total}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs uppercase text-muted-foreground">Terrains visités</div><div className="text-3xl font-black mt-1">{stats.courts}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-xs uppercase text-muted-foreground">Total dépensé</div><div className="text-3xl font-black mt-1">{stats.spent} TND</div></CardContent></Card>
        </div>

        {/* Next match */}
        <Card>
          <CardHeader><CardTitle>Prochain Match</CardTitle></CardHeader>
          <CardContent>
            {next ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{next.courtName}</div>
                  <div className="text-sm text-muted-foreground">{next.city} • {next.sport}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{next.date}</div>
                  <div className="text-sm text-muted-foreground">{next.slot}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Aucun match à venir.</p>
                <Button variant="hero" asChild><Link to="/courts">Réserver maintenant</Link></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Account;