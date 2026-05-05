import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [sport, setSport] = useState("all");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (sport !== "all") params.set("sport", sport);
    if (city) params.set("city", city);
    if (date) params.set("date", date);
    navigate(`/courts?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="container -mt-12 relative z-20"
    >
      <div className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-card grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            Sport
          </label>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="bg-background border-border h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sports</SelectItem>
              <SelectItem value="football">⚽ Football</SelectItem>
              <SelectItem value="padel">🎾 Padel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            Ville
          </label>
          <Input
            placeholder="Tunis, Sousse, Sfax..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-12 bg-background"
          />
        </div>
        <div className="md:col-span-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 bg-background"
          />
        </div>
        <div className="md:col-span-2 flex items-end">
          <Button type="submit" variant="hero" className="w-full h-12">
            <Search className="size-4" /> Chercher
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;