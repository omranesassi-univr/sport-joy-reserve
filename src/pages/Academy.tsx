import { useState } from "react";
import { Calendar, Clock, Info, Phone, GraduationCap } from "lucide-react";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import academyImg from "@/assets/academy.jpg";

const programs = [
  {
    title: "Éveil Football",
    age: "6 - 8 ans",
    desc: "Développement de la motricité et initiation ludique aux bases du football.",
    days: "Mercredi & Samedi",
    hours: "14:00 - 15:30",
    monthly: 85,
    quarterly: 230,
    popular: false,
  },
  {
    title: "Perfectionnement",
    age: "9 - 11 ans",
    desc: "Approfondissement technique, tactique individuelle et esprit d'équipe.",
    days: "Mardi & Vendredi",
    hours: "17:00 - 18:30",
    monthly: 95,
    quarterly: 260,
    popular: true,
  },
  {
    title: "Compétition",
    age: "12 - 14 ans",
    desc: "Préparation physique, tactique collective et matchs de championnat.",
    days: "Lundi, Mercredi & Samedi",
    hours: "18:00 - 19:30",
    monthly: 110,
    quarterly: 300,
    popular: false,
  },
];

const packOptions = [
  "Éveil (6-8 ans) - Mensuel",
  "Éveil (6-8 ans) - Trimestriel",
  "Perfectionnement (9-11 ans) - Mensuel",
  "Perfectionnement (9-11 ans) - Trimestriel",
  "Compétition (12-14 ans) - Mensuel",
  "Compétition (12-14 ans) - Trimestriel",
];

const Academy = () => {
  const [form, setForm] = useState({
    childName: "",
    birthDate: "",
    parentName: "",
    phone: "",
    pack: "",
    accept: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.childName || !form.birthDate || !form.parentName || !form.phone || !form.pack) {
      toast.error("Merci de remplir tous les champs.");
      return;
    }
    if (!form.accept) {
      toast.error("Vous devez accepter les conditions.");
      return;
    }
    toast.success(`Inscription confirmée pour ${form.childName} 🎉`);
    setForm({ childName: "", birthDate: "", parentName: "", phone: "", pack: "", accept: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section
        className="relative min-h-[60vh] flex items-center"
        style={{ backgroundImage: `url(${academyImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="container relative py-24">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Académie Junior</span>
          <h1 className="text-display text-5xl md:text-7xl mt-3 max-w-3xl">
            Formez les<br />champions de demain.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg">
            L'Académie SportHub Tunisie offre une formation d'élite combinant discipline, technique
            et plaisir du jeu pour vos futurs athlètes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" asChild>
              <a href="#inscription">S'inscrire maintenant</a>
            </Button>
            <Button variant="outlineBrand" size="lg" asChild>
              <a href="#programmes">Nos programmes</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section id="programmes" className="container py-24">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Programmes</span>
          <h2 className="text-display text-4xl md:text-5xl mt-2">Nos programmes par âge</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div
              key={p.title}
              className={`relative bg-card border rounded-2xl p-7 transition-colors ${
                p.popular ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Populaire
                </span>
              )}
              <GraduationCap className="size-8 text-primary mb-4" />
              <h3 className="text-display text-2xl">{p.title}</h3>
              <p className="text-sm text-primary font-bold mt-1">{p.age}</p>
              <p className="text-sm text-muted-foreground mt-3 min-h-[60px]">{p.desc}</p>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 text-primary" /> {p.days}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-primary" /> {p.hours}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 pt-5 border-t border-border">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Mensuel</div>
                  <div className="text-display text-xl">{p.monthly} <span className="text-sm">DT</span></div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Trimestriel</div>
                  <div className="text-display text-xl text-primary">{p.quarterly} <span className="text-sm">DT</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inscription */}
      <section id="inscription" className="container pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8">
            <h2 className="text-display text-3xl">Inscription à l'académie</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Remplissez le formulaire ci-dessous pour réserver une place pour votre enfant.
            </p>

            <form onSubmit={submit} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Nom de l'enfant</Label>
                <Input
                  value={form.childName}
                  onChange={(e) => setForm({ ...form, childName: e.target.value })}
                  maxLength={80}
                />
              </div>
              <div className="space-y-2">
                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nom du parent</Label>
                <Input
                  value={form.parentName}
                  onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                  maxLength={80}
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Sélection du pack</Label>
                <select
                  value={form.pack}
                  onChange={(e) => setForm({ ...form, pack: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Choisissez un programme</option>
                  {packOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <Checkbox
                  id="accept"
                  checked={form.accept}
                  onCheckedChange={(v) => setForm({ ...form, accept: !!v })}
                />
                <Label htmlFor="accept" className="text-sm text-muted-foreground leading-relaxed">
                  J'accepte les conditions d'utilisation et le règlement intérieur de l'académie.
                </Label>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto">
                  Confirmer l'inscription
                </Button>
              </div>
            </form>
          </div>

          {/* FAQ */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <Info className="size-5 text-primary" />
              <h3 className="text-display text-2xl">FAQ Équipement</h3>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger className="text-left">Que doit porter l'enfant ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Un kit officiel SportHub (short, maillot, chaussettes) est fourni lors de l'inscription
                  annuelle. Des protège-tibias sont obligatoires.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="text-left">Quelles chaussures ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Chaussures de football pour terrain synthétique (stabilisés ou crampons moulés). Les
                  crampons vissés sont interdits.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="text-left">Autres accessoires ?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Une gourde d'eau marquée au nom de l'enfant est indispensable à chaque séance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-primary" />
              Des questions ? Appelez-nous au <span className="text-foreground font-bold">+216 71 000 000</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Academy;