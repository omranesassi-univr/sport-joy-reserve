
-- BOOKINGS
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_id TEXT NOT NULL,
  court_name TEXT NOT NULL,
  city TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('football','padel')),
  date TEXT NOT NULL,
  slot TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);
CREATE UNIQUE INDEX uniq_court_date_slot ON public.bookings(court_id, date, slot);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookings select" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own bookings insert" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own bookings update" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own bookings delete" ON public.bookings FOR DELETE USING (auth.uid() = user_id);

-- PARTNERS
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sport TEXT NOT NULL CHECK (sport IN ('football','padel')),
  venue TEXT NOT NULL,
  date TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Débutant','Intermédiaire','Avancé')),
  total INT NOT NULL CHECK (total > 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_partners_created ON public.partners(created_at DESC);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partners public read" ON public.partners FOR SELECT USING (true);
CREATE POLICY "partners auth insert" ON public.partners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "partners owner update" ON public.partners FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "partners owner delete" ON public.partners FOR DELETE USING (auth.uid() = user_id);

-- PARTICIPANTS
CREATE TABLE public.partner_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(partner_id, user_id)
);
CREATE INDEX idx_participants_partner ON public.partner_participants(partner_id);

ALTER TABLE public.partner_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants public read" ON public.partner_participants FOR SELECT USING (true);
CREATE POLICY "participants self insert" ON public.partner_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "participants self delete" ON public.partner_participants FOR DELETE USING (auth.uid() = user_id);
