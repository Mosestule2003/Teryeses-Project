-- 1. Create admin_users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON public.admin_users(email);

-- 2. Create site_content table
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL,
  page_key TEXT NOT NULL DEFAULT 'home',
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  styles_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_content_section_key ON public.site_content(section_key);
CREATE INDEX idx_site_content_page_key ON public.site_content(page_key);
CREATE INDEX idx_site_content_is_visible ON public.site_content(is_visible);

-- 3. Create site_settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_settings_setting_key ON public.site_settings(setting_key);

-- 4. Create media_library table
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create ai_instructions table (Google Antigravity Engine)
CREATE TABLE public.ai_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_title TEXT NOT NULL,
  instruction_body TEXT NOT NULL,
  context_scope TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_instructions_context_scope ON public.ai_instructions(context_scope);

-- 6. Trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ai_instructions_updated_at
    BEFORE UPDATE ON public.ai_instructions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Add Row Level Security (RLS) policies
-- Note: Since we are using a custom auth approach (bypassing Supabase Auth), 
-- you will likely access the database using the Service Role Key or custom edge functions, 
-- but we will enable RLS to be secure by default and allow anonymous read for public tables.

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_instructions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to visible content
CREATE POLICY "Public can view visible site content" 
ON public.site_content FOR SELECT 
USING (is_visible = true);

-- Allow public read access to site settings
CREATE POLICY "Public can view site settings" 
ON public.site_settings FOR SELECT 
USING (true);

-- Allow public read access to media library
CREATE POLICY "Public can view media library" 
ON public.media_library FOR SELECT 
USING (true);

-- Note: admin_users and ai_instructions DO NOT have public read access.
