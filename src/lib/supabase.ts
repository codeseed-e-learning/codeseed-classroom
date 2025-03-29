import { createClient } from '@supabase/supabase-js';

if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.warn(
    'Supabase credentials are missing. Please connect to Supabase using the "Connect to Supabase" button in the top right corner.'
  );
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'
);