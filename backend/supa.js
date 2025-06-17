import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdzieklhomvlakbvlsod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkemlla2xob212bGFrYnZsc29kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDEyMzAwNCwiZXhwIjoyMDY1Njk5MDA0fQ.FPwfC3ZbDz8wqHoCGRB4_EngxJO5g6LesRXaxdm0ir8'; // Use service_role key here, keep it secret!

export const supabase = createClient(supabaseUrl, supabaseKey);
