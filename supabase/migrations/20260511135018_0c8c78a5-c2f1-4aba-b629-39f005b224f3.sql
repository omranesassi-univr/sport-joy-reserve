ALTER TABLE public.partner_participants
ADD CONSTRAINT uniq_partner_user UNIQUE (partner_id, user_id);