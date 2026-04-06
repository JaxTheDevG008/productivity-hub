import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yxmtfngfdyueyrzwrkuq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bXRmbmdmZHl1ZXlyendya3VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTg0MjgsImV4cCI6MjA5MDczNDQyOH0.qC8el17WyZbKjHJgv3f-GMndwhn-O0-5tU7ZWDWy_OA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);