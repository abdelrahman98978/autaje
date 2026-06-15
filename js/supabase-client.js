// ==========================================
// Supabase Client Initialization
// ==========================================
// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client (CDN exposes window.supabase as the module)
if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase client initialized.');
} else {
  window.supabaseClient = null;
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.info('ℹ️ Supabase: Integration pending. Add your credentials in js/supabase-client.js to enable database features.');
  }
}
