import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Court } from "@/data/courts";

export const CourtCard = ({ court }: { court: Court }) => {
  return (
    <Link
      to={`/courts/${court.id}`}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={court.image}
          alt={court.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {court.sport === "football" ? "⚽ Football" : "🎾 Padel"}
        </div>
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
          <Star className="size-3 fill-current" /> {court.rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg leading-tight">{court.name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <MapPin className="size-3" /> {court.city}
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <div>
            <div className="text-display text-2xl text-primary">{court.pricePerHour} TND</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ heure</div>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
            Voir créneaux →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourtCard;