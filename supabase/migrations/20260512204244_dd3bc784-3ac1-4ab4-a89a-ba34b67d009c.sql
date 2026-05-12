ALTER TABLE public.partner_participants REPLICA IDENTITY FULL;
ALTER TABLE public.partners REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.partners;