import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  Home,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Dumbbell,
  Droplets,
  Building2,
  Sparkles,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: LucideIcon };
const links: NavItem[] = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/courts", label: "Réserver", icon: CalendarCheck },
  { to: "/bookings", label: "Mes Résas", icon: ClipboardList },
  { to: "/academy", label: "Académie", icon: GraduationCap },
  { to: "/padel-coaching", label: "Coaching", icon: Dumbbell },
  { to: "/carwash", label: "Lavage", icon: Droplets },
  { to: "/owner", label: "Propriétaire", icon: Building2 },
  { to: "/#ecosystem", label: "Écosystème", icon: Sparkles },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/");
  };

  const itemClass = (isActive: boolean) =>
    `group flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-1 shrink-0">
          <span className="text-display text-2xl">SportHub</span>
          <span className="text-primary text-2xl font-black">.</span>
        </Link>
        <div className="hidden lg:flex items-center gap-1 xl:gap-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => itemClass(isActive)}>
              <Icon className="size-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {session ? (
            <>
              <NavLink to="/account" className={({ isActive }) => `hidden sm:flex ${itemClass(isActive)}`}>
                <User className="size-5" />
                <span>Compte</span>
              </NavLink>
              <button onClick={handleLogout} className={`hidden sm:flex ${itemClass(false)}`}>
                <LogOut className="size-5" />
                <span>Sortir</span>
              </button>
            </>
          ) : (
            <NavLink to="/auth" className={({ isActive }) => `hidden sm:flex ${itemClass(isActive)}`}>
              <LogIn className="size-5" />
              <span>Connexion</span>
            </NavLink>
          )}
          <Button variant="hero" size="sm" asChild className="hidden md:inline-flex">
            <Link to="/courts">Réserver</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden inline-flex items-center justify-center size-10 rounded-md border border-border text-foreground"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="container py-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-lg p-3 text-[11px] font-bold uppercase tracking-wider transition ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </NavLink>
            ))}
            {session ? (
              <>
                <NavLink
                  to="/account"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 rounded-lg p-3 text-[11px] font-bold uppercase tracking-wider transition ${
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    }`
                  }
                >
                  <User className="size-5" />
                  <span>Compte</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-1 rounded-lg p-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted"
                >
                  <LogOut className="size-5" />
                  <span>Sortir</span>
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-lg p-3 text-[11px] font-bold uppercase tracking-wider transition ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`
                }
              >
                <LogIn className="size-5" />
                <span>Connexion</span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;