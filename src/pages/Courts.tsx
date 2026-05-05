import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import CourtCard from "@/components/sporthub/CourtCard";
import { courts, Sport } from "@/data/courts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Courts = () => {
  const [params] = useSearchParams();
  const [sport, setSport] = useState<Sport | "all">((params.get("sport") as Sport) || "all");
  const [city, setCity] = useState(params.get("city") || "");
  const [maxPrice, setMaxPrice] = useState<number>(150);

  const filtered = useMemo(
    () =>
      courts.filter(
        (c) =>
          (sport === "all" || c.sport === sport) &&
          (!city || c.city.toLowerCase().includes(city.toLowerCase())) &&
          c.pricePerHour <= maxPrice,
      ),
    [sport, city, maxPrice],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12">
        <header className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Catalogue</span>
          <h1 className="text-display text-5xl md:text-6xl mt-2">
            {filtered.length} terrains <span className="text-primary">disponibles</span>
          </h1>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="space-y-6 lg:sticky lg:top-24 self-start bg-card border border-border rounded-2xl p-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">
                Sport
              </label>
              <div className="flex flex-wrap gap-2">
                {(["all", "football", "padel"] as const).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={sport === s ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setSport(s)}
                    className="capitalize"
                  >
                    {s === "all" ? "Tous" : s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Ville
              </label>
              <Input
                placeholder="Filtrer par ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-background"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                Prix max : <span className="text-primary">{maxPrice} TND</span>
              </label>
              <input
                type="range"
                min={30}
                max={150}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </aside>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <CourtCard key={c.id} court={c} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full text-muted-foreground text-center py-20">
                Aucun terrain ne correspond à vos critères.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courts;