import cafeImg from "@/assets/cafe.jpg";
import academyImg from "@/assets/academy.jpg";
import { Coffee, Fuel, Droplets, Wrench, GraduationCap, Users } from "lucide-react";

const services = [
  { icon: Coffee, title: "Café & Restauration", desc: "Commandez avant le match, retrait sur place." },
  { icon: Fuel, title: "Station Carburant", desc: "Prix en temps réel, bons fidélité." },
  { icon: Droplets, title: "Lavage Auto", desc: "Pendant que vous jouez, on lave votre voiture." },
  { icon: Wrench, title: "Vidange & Réparation", desc: "Centre auto partenaire en un clic." },
  { icon: GraduationCap, title: "Académie Enfants", desc: "Inscriptions weekend, suivi de progression." },
  { icon: Users, title: "Matchmaking", desc: "Trouvez vos partenaires de niveau équivalent." },
];

export const Ecosystem = () => {
  return (
    <section id="ecosystem" className="container py-24">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Écosystème SportHub</span>
          <h2 className="text-display text-4xl md:text-5xl mt-2">Bien plus<br />qu'une réservation.</h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          SportHub regroupe tous les services d'un complexe sportif moderne en une seule application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="md:row-span-2 rounded-2xl overflow-hidden relative min-h-[400px] group"
          style={{ backgroundImage: `url(${cafeImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 p-8">
            <Coffee className="size-8 text-primary mb-4" />
            <h3 className="text-display text-3xl mb-2">Club House</h3>
            <p className="text-muted-foreground max-w-xs">
              Café, snacks et boissons dans une ambiance conviviale après votre match.
            </p>
          </div>
        </div>

        {services.slice(1, 5).map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
          >
            <Icon className="size-7 text-primary mb-4" />
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </div>
        ))}

        <div
          className="md:col-span-2 rounded-2xl overflow-hidden relative min-h-[280px] group"
          style={{ backgroundImage: `url(${academyImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-center max-w-md">
            <GraduationCap className="size-8 text-primary mb-4" />
            <h3 className="text-display text-3xl mb-2">Académie Junior</h3>
            <p className="text-muted-foreground">
              Inscrivez vos enfants à nos sessions d'entraînement encadrées par des coachs diplômés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;