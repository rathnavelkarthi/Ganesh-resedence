-- Channel connections: stores OTA integration config per tenant
CREATE TABLE IF NOT EXISTS channel_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  api_key TEXT,
  property_id TEXT,
  sync_inventory BOOLEAN DEFAULT false,
  sync_rates BOOLEAN DEFAULT false,
  commission TEXT DEFAULT '15%',
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, channel_id)
);

ALTER TABLE channel_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants manage own channels" ON channel_connections
  FOR ALL USING (tenant_id = auth.uid()::uuid);

-- Sync logs: audit trail for channel operations
CREATE TABLE IF NOT EXISTS channel_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  status TEXT CHECK (status IN ('success', 'error', 'warning')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE channel_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants view own sync logs" ON channel_sync_logs
  FOR ALL USING (tenant_id = auth.uid()::uuid);

CREATE INDEX idx_channel_connections_tenant ON channel_connections(tenant_id);
CREATE INDEX idx_channel_sync_logs_tenant ON channel_sync_logs(tenant_id, created_at DESC);
