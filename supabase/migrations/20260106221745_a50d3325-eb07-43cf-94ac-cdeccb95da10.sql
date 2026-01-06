-- Create enum for staff roles
CREATE TYPE public.staff_role AS ENUM ('realtor', 'admin', 'manager', 'assistant', 'marketing');

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('active', 'pending', 'sold', 'off_market', 'coming_soon');

-- Create enum for property type
CREATE TYPE public.property_type AS ENUM ('single_family', 'condo', 'townhouse', 'multi_family', 'land', 'commercial');

-- Staff/Realtors table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role staff_role NOT NULL DEFAULT 'realtor',
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  license_number TEXT,
  license_expiry DATE,
  hire_date DATE DEFAULT CURRENT_DATE,
  commission_rate DECIMAL(5,2) DEFAULT 3.00,
  is_active BOOLEAN DEFAULT true,
  specializations TEXT[],
  languages TEXT[],
  social_links JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Properties table for internal management
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mls_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL DEFAULT 'single_family',
  status property_status NOT NULL DEFAULT 'active',
  price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'TX',
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  sqft INTEGER,
  lot_size DECIMAL(10,2),
  year_built INTEGER,
  parking_spaces INTEGER,
  garage_spaces INTEGER,
  hoa_fee DECIMAL(10,2),
  tax_amount DECIMAL(10,2),
  tax_year INTEGER,
  features TEXT[],
  amenities TEXT[],
  images TEXT[],
  virtual_tour_url TEXT,
  video_url TEXT,
  listing_agent_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  co_listing_agent_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  listing_date DATE,
  expiration_date DATE,
  sold_date DATE,
  sold_price DECIMAL(12,2),
  buyer_agent_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  days_on_market INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  showings_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tasks/Activities table for CRM
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Showings/Appointments table
CREATE TABLE public.showings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'scheduled',
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Transactions table for deals
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  listing_agent_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  buyer_agent_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL DEFAULT 'sale',
  status TEXT NOT NULL DEFAULT 'pending',
  list_price DECIMAL(12,2),
  sale_price DECIMAL(12,2),
  commission_total DECIMAL(12,2),
  commission_listing_side DECIMAL(12,2),
  commission_buyer_side DECIMAL(12,2),
  contract_date DATE,
  closing_date DATE,
  escrow_company TEXT,
  title_company TEXT,
  lender TEXT,
  notes TEXT,
  documents JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- MLS Sync logs
CREATE TABLE public.mls_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  records_processed INTEGER DEFAULT 0,
  records_added INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mls_sync_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_staff_role ON public.staff(role);
CREATE INDEX idx_staff_active ON public.staff(is_active);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_mls ON public.properties(mls_number);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_listing_agent ON public.properties(listing_agent_id);
CREATE INDEX idx_tasks_assigned ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_showings_property ON public.showings(property_id);
CREATE INDEX idx_showings_agent ON public.showings(agent_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);

-- RLS Policies for staff table
CREATE POLICY "Admins can manage staff"
ON public.staff FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view all staff"
ON public.staff FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies for properties table
CREATE POLICY "Admins can manage properties"
ON public.properties FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active properties"
ON public.properties FOR SELECT
USING (status = 'active' OR auth.uid() IS NOT NULL);

-- RLS Policies for tasks table
CREATE POLICY "Admins can manage all tasks"
ON public.tasks FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view assigned tasks"
ON public.tasks FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies for showings table
CREATE POLICY "Admins can manage showings"
ON public.showings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view showings"
ON public.showings FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies for transactions table
CREATE POLICY "Admins can manage transactions"
ON public.transactions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Staff can view transactions"
ON public.transactions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- RLS Policies for mls_sync_logs
CREATE POLICY "Admins can manage mls logs"
ON public.mls_sync_logs FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_showings_updated_at
BEFORE UPDATE ON public.showings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();