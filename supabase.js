const { createClient } = supabase;

const SUPABASE_URL = "https://pdtudwscpnptuhbhkcgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdHVkd3NjcG5wdHVoYmhrY2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ0MDcsImV4cCI6MjA1NTAzMDQwN30.8GHhqN217OOUNUfBSB-TH7Kl9XIexkkRwxBoz_z_xB0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);
    if (event === "SIGNED_IN") {
        console.log("User signed in:", session.user);
        updateUI(session.user);
    } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        updateUI(null);
    }
});
