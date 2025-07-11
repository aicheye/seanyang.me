// Supabase configuration
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cnfnddafeddcqqlnlynd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZm5kZGFmZWRkY3FxbG5seW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNzU4MDYsImV4cCI6MjA2Nzg1MTgwNn0.2htblM0MtCsAXmLmE6rxYprIaQU4tSUoOEKalvhav88";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
