-- Create table for health check history
CREATE TABLE public.health_check_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  overall_status TEXT NOT NULL,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  email_sent BOOLEAN DEFAULT false,
  triggered_by TEXT DEFAULT 'cron',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for incidents (when status is not healthy)
CREATE TABLE public.health_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  latency INTEGER,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for MLS webhook logs
CREATE TABLE public.mls_webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB,
  property_id TEXT,
  sitemap_regenerated BOOLEAN DEFAULT false,
  source_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.health_check_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mls_webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for health_check_logs (admin only)
CREATE POLICY "Admins can manage health logs"
ON public.health_check_logs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for health_incidents (admin only)
CREATE POLICY "Admins can manage incidents"
ON public.health_incidents
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for mls_webhook_logs (admin only)
CREATE POLICY "Admins can manage webhook logs"
ON public.mls_webhook_logs
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_health_check_logs_created_at ON public.health_check_logs(created_at DESC);
CREATE INDEX idx_health_incidents_created_at ON public.health_incidents(created_at DESC);
CREATE INDEX idx_health_incidents_resolved ON public.health_incidents(resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX idx_mls_webhook_logs_created_at ON public.mls_webhook_logs(created_at DESC);