CREATE TABLE public.max_delivery_receipts (
 id text PRIMARY KEY,
 session_id uuid NOT NULL,
 status text NOT NULL DEFAULT 'sending' CHECK (status IN ('sending', 'sent', 'unknown')),
 message_id text,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.max_delivery_receipts TO service_role;
ALTER TABLE public.max_delivery_receipts ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.max_delivery_receipts IS 'Private delivery deduplication receipts; no customer contact details or chat contents. No browser access.';
CREATE INDEX max_delivery_receipts_session_created_idx ON public.max_delivery_receipts (session_id, created_at);