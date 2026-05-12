import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Sparkles, Wand2, Car, CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";

type Service = { id: string; icon: typeof Droplets; name: string; desc: string; price: number; duration: number };

const SERVICES: Service[] = [
  { id: "ext", icon: Droplets, name: "Lavage Extérieur", desc: "Prélavage, shampoing actif, séchage main et finition jantes.", price: 25, duration: 30 },
  { id: "full", icon: Sparkles, name: "Lavage Complet", desc: "Extérieur + aspiration profonde, plastiques et vitres intérieures.", price: 45, duration: 60 },
  { id: "polish", icon: Wand2, name: "Lustrage", desc: "Lavage complet + décontamination et cire de protection longue durée.", price: 85, duration: 120 },
];

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];
const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const CarWash = () => {
  const navigate = useNavigate();
  const [serviceId, setServiceId] = useState<string>("ext");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [dayOffset, setDayOffset] = useState(0);
  const [slot, setSlot] = useState("10:00");

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return { offset: i, label: DAYS_FR[d.getDay()], date: d.getDate(), full: d };
    });
  }, []);

  const service = SERVICES.find((s) => s.id === serviceId)!;
  const selectedDay = days[dayOffset];

  const confirm = async () => {
    if (!model || !plate) {
      toast.error("Renseignez les informations du véhicule");
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id;
    if (!uid) {
      toast.error("Connectez-vous pour réserver");
      navigate("/auth");
      return;
    }
    const dateStr = selectedDay.full.toISOString().slice(0, 10);
    const { error } = await supabase.from("car_wash_bookings").insert({
      user_id: uid,
      service_id: service.id,
      service_name: service.name,
      price: service.price,
      duration: service.duration,
      vehicle_model: model,
      vehicle_plate: plate,
      date: dateStr,
      slot,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Réservation confirmée : ${service.name} le ${selectedDay.label} ${selectedDay.date} à ${slot}`);
    setModel(""); setPlate("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Écosystème SportHub</span>
          <h1 className="text-display text-4xl mt-2">Lavage Auto Expert</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Offrez à votre véhicule le soin qu'il mérite avec nos techniques de nettoyage haute performance et écologiques.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Droplets className="size-5 text-primary" /> Type de service</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-3">
                {SERVICES.map(({ id, icon: Icon, name, desc, price, duration }) => {
                  const active = id === serviceId;
                  return (
                    <button
                      key={id}
                      onClick={() => setServiceId(id)}
                      className={`text-left rounded-xl border p-4 transition ${active ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-border hover:border-primary/50"}`}
                    >
                      <Icon className="size-6 text-primary mb-2" />
                      <div className="font-bold">{name}</div>
                      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-bold">{price} DT</span>
                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="size-3" />{duration} min</span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Car className="size-5 text-primary" /> Informations du véhicule</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Modèle du véhicule</Label>
                  <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex. Peugeot 208" />
                </div>
                <div>
                  <Label>Numéro d'immatriculation</Label>
                  <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="123 TUN 4567" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /> Date et Heure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {days.map((d) => {
                    const active = d.offset === dayOffset;
                    return (
                      <button
                        key={d.offset}
                        onClick={() => setDayOffset(d.offset)}
                        className={`rounded-lg p-2 text-center transition ${active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                      >
                        <div className="text-xs uppercase">{d.label}</div>
                        <div className="font-bold">{d.date}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SLOTS.map((s) => {
                    const active = s === slot;
                    return (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        className={`rounded-lg py-2 text-sm font-bold transition ${active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Résumé</CardTitle>
              <p className="text-sm text-muted-foreground">Vérifiez les détails de votre séance</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Service</div>
                  <div className="font-bold">{service.name}</div>
                </div>
                <div className="font-bold">{service.price} DT</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Rendez-vous</div>
                <div className="font-bold">{selectedDay.label} {selectedDay.date}, {slot}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Durée estimée</div>
                <div className="font-bold">{service.duration} minutes</div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-black">{service.price} DT</span>
              </div>
              <Button variant="hero" className="w-full" onClick={confirm}>Confirmer la réservation</Button>
              <p className="text-xs text-muted-foreground text-center">
                En confirmant, vous acceptez les conditions de service et de remboursement de SportHub Tunisie.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarWash;