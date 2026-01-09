-- Create client_documents table for storing document references
CREATE TABLE public.client_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'other',
  file_url TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

-- Clients can view their own documents
CREATE POLICY "Clients can view their own documents"
ON public.client_documents
FOR SELECT
USING (auth.uid() = client_id);

-- Admins can manage all documents
CREATE POLICY "Admins can manage all documents"
ON public.client_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create client_properties junction table to link clients to properties they're interested in
CREATE TABLE public.client_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'interested',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_properties ENABLE ROW LEVEL SECURITY;

-- Clients can view their own property relationships
CREATE POLICY "Clients can view their own properties"
ON public.client_properties
FOR SELECT
USING (auth.uid() = client_id);

-- Clients can add/remove their own saved properties
CREATE POLICY "Clients can manage their own properties"
ON public.client_properties
FOR ALL
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

-- Admins can manage all client properties
CREATE POLICY "Admins can manage all client properties"
ON public.client_properties
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add client_id to transactions for client portal access
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS client_id UUID;

-- Create policy for clients to view their own transactions
CREATE POLICY "Clients can view their own transactions"
ON public.transactions
FOR SELECT
USING (auth.uid() = client_id);

-- Update trigger for client_documents
CREATE TRIGGER update_client_documents_updated_at
  BEFORE UPDATE ON public.client_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();