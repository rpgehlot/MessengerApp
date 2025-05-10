import { createBrowserClient } from '@supabase/ssr'
import { supabaseKey, supabaseUrl } from "@/utils/config";
import { Database } from '@/app/lib/database-types';

export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey
  )
}