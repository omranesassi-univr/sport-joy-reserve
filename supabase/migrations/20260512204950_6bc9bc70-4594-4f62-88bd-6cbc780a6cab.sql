
CREATE TABLE public.car_wash_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  vehicle_model TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL,
  date TEXT NOT NULL,
  slot TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.car_wash_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "carwash own select" ON public.car_wash_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "carwash own insert" ON public.car_wash_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "carwash own delete" ON public.car_wash_bookings FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE public.academy_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  child_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  pack TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.academy_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "academy own select" ON public.academy_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "academy own insert" ON public.academy_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "academy own delete" ON public.academy_registrations FOR DELETE USING (auth.uid() = user_id);
