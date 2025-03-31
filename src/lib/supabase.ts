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
  import.meta.env.VITE_SUPABASE_URL || 'https://bzidfiotgcwqyggeltei.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6aWRmaW90Z2N3cXlnZ2VsdGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2OTE4NjcsImV4cCI6MjA1NDI2Nzg2N30.Z4UsRkv1IY_dit6Xm5i2S-uXddwvl1OCJx6wxpkU3NE'
);

// Leetcode 
// codeforces
// codechef 
// midium 
// hackerrank



// take gender from user and if gender is 1 then it's male and gender is female it's one and if 1 then show that height requirements are 5.5 and if 0 then show that height requirements are 5.2
