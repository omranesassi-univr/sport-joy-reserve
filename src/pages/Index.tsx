import Navbar from "@/components/sporthub/Navbar";
import Hero from "@/components/sporthub/Hero";
import SearchBar from "@/components/sporthub/SearchBar";
import CourtCard from "@/components/sporthub/CourtCard";
import Ecosystem from "@/components/sporthub/Ecosystem";
import Footer from "@/components/sporthub/Footer";
import { courts } from "@/data/courts";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const featured = courts.slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SearchBar />

        <section className="container py-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">À la une</span>
              <h2 className="text-display text-4xl md:text-5xl mt-2">Terrains populaires</h2>
            </div>
            <Link
              to="/courts"
              className="text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary inline-flex items-center gap-2"
            >
              Voir tout <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (
              <CourtCard key={c.id} court={c} />
            ))}
          </div>
        </section>

        <Ecosystem />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
