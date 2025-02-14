const { createClient } = supabase;

const SUPABASE_URL = "https://pdtudwscpnptuhbhkcgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdHVkd3NjcG5wdHVoYmhrY2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ0MDcsImV4cCI6MjA1NTAzMDQwN30.8GHhqN217OOUNUfBSB-TH7Kl9XIexkkRwxBoz_z_xB0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Ensure session persistence
supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);
    if (session) {
        console.log("Session found:", session);
    } else {
        console.log("No session found.");
    }
});
