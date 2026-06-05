-- =======================================================
-- AwjaTech Supabase Database Schema
-- Run this entire script in your Supabase SQL Editor
-- =======================================================

-- 1. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role text DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  full_name text,
  company_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Trigger to create a profile automatically when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Tickets Table (for Support and Maintenance)
CREATE TABLE public.tickets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'مفتوحة' CHECK (status IN ('مفتوحة', 'قيد المعالجة', 'مغلقة')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Clients can read and insert their own tickets
CREATE POLICY "Clients can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Clients can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Admins can read and update all tickets
CREATE POLICY "Admins can view all tickets" ON public.tickets FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Admins can update tickets" ON public.tickets FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);


-- 3. Quotes Table (for "Request a Quote" form)
CREATE TABLE public.quotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  company text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  message text,
  status text DEFAULT 'جديد',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Anyone (even anonymous) can insert a quote
CREATE POLICY "Anyone can submit a quote" ON public.quotes FOR INSERT WITH CHECK (true);
-- Only Admins can view and manage quotes
CREATE POLICY "Admins can view quotes" ON public.quotes FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "Admins can update quotes" ON public.quotes FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
