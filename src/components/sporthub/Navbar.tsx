import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/courts", label: "Réserver" },
  { to: "/bookings", label: "Mes Résas" },
  { to: "/owner", label: "Espace Propriétaire" },
  { to: "/#ecosystem", label: "Écosystème" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-display text-2xl">SportHub</span>
          <span className="text-primary text-2xl font-black">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex font-bold uppercase tracking-wide text-xs">
            Connexion
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/courts">Réserver</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;