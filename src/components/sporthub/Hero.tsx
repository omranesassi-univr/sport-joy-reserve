import heroImg from "@/assets/hero-football.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <img
        src={heroImg}
        alt="Terrain de football SportHub illuminé la nuit"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      <div className="container relative z-10 py-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full mb-6">
            <Zap className="size-3" /> Nouvelle saison 2026
          </span>
          <h1 className="text-display text-6xl sm:text-7xl md:text-8xl leading-[0.9] mb-6">
            Dominez le<br />
            <span className="text-primary">terrain.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10">
            Réservez les meilleurs terrains de <span className="text-foreground font-semibold">Football</span> et{" "}
            <span className="text-foreground font-semibold">Padel</span> en Tunisie. Disponibilité en temps réel,
            confirmation instantanée.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/courts">
                Réserver un terrain <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outlineBrand" size="lg" asChild>
              <Link to="/owner">Je suis propriétaire</Link>
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap gap-10">
            {[
              { n: "120+", l: "Terrains partenaires" },
              { n: "15K+", l: "Joueurs actifs" },
              { n: "60s", l: "Pour réserver" },
              { n: "4.9★", l: "Note moyenne" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-display text-3xl text-primary">{s.n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;