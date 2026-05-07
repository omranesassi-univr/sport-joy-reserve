import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const links = [
  { to: "/courts", label: "Réserver" },
  { to: "/bookings", label: "Mes Résas" },
  { to: "/academy", label: "Académie" },
  { to: "/padel-coaching", label: "Coaching Padel" },
  { to: "/owner", label: "Espace Propriétaire" },
  { to: "/#ecosystem", label: "Écosystème" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
          {session ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="hidden sm:inline-flex font-bold uppercase tracking-wide text-xs"
            >
              Déconnexion
            </Button>
          ) : (
            <Button variant="ghost" asChild className="hidden sm:inline-flex font-bold uppercase tracking-wide text-xs">
              <Link to="/auth">Connexion</Link>
            </Button>
          )}
          <Button variant="hero" size="sm" asChild>
            <Link to="/courts">Réserver</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;