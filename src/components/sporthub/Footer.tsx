import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-20">
      <div className="container py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <Link to="/" className="flex items-baseline gap-1">
            <span className="text-display text-2xl">SportHub</span>
            <span className="text-primary text-2xl font-black">.</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            La plateforme N°1 de réservation de terrains de football et padel en Tunisie.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Plateforme</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courts" className="hover:text-primary">Terrains</Link></li>
            <li><Link to="/owner" className="hover:text-primary">Propriétaires</Link></li>
            <li><a href="#ecosystem" className="hover:text-primary">Écosystème</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>contact@sporthub.tn</li>
            <li>+216 71 000 000</li>
            <li>Tunis, Tunisie</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-6 text-xs text-muted-foreground flex justify-between">
          <span>© 2026 SportHub Tunisie — Groupe 2LIMA</span>
          <span>v3.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;