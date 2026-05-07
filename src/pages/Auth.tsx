import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/sporthub/Navbar";
import Footer from "@/components/sporthub/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Nom trop court").max(100),
  phone: z.string().trim().min(6, "Téléphone invalide").max(20),
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(8, "Min 8 caractères").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  password: z.string().min(1, "Mot de passe requis").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { email, password, full_name, phone } = parsed.data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name, phone },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Compte déjà existant" : error.message);
      return;
    }
    toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("Invalid") ? "Identifiants incorrects" : error.message);
      return;
    }
    toast.success("Bienvenue !");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Accès Membre</span>
            <h1 className="text-display text-4xl mt-2">
              Rejoignez <span className="text-primary">SportHub</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Connectez-vous pour réserver vos terrains et suivre vos séances.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" name="email" type="email" required maxLength={255} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input id="login-password" name="password" type="password" required maxLength={72} />
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Connexion…" : "Se connecter"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Nom complet</Label>
                    <Input id="su-name" name="full_name" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-phone">Téléphone</Label>
                    <Input id="su-phone" name="phone" type="tel" required maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" name="email" type="email" required maxLength={255} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-password">Mot de passe</Label>
                    <Input id="su-password" name="password" type="password" required minLength={8} maxLength={72} />
                    <p className="text-xs text-muted-foreground">Minimum 8 caractères.</p>
                  </div>
                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Création…" : "Créer mon compte"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-foreground">← Retour à l'accueil</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;