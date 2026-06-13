CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  domain TEXT,
  plan TEXT DEFAULT 'basic',
  status TEXT DEFAULT 'active'
);

CREATE TABLE settings (
  client_id TEXT PRIMARY KEY REFERENCES clients(id),
  ai_personality TEXT,
  widget_color TEXT,
  booking_enabled BOOLEAN DEFAULT false
);

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  client_id TEXT REFERENCES clients(id),
  lead_id INTEGER REFERENCES leads(id),
  transcript JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO clients (id, business_name, domain)
VALUES ('demo-client', 'Demo Business', 'example.com');
