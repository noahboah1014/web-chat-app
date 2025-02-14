document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");

    // Check session on page load
    const { data: session } = await supabase.auth.getSession();
    updateUI(session?.session?.user || null);

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                alert("Login failed: " + error.message);
            } else {
                updateUI(await supabase.auth.getUser());
                loginForm.reset();
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            await supabase.auth.signOut();
            updateUI(null);
        });
    }
});

function updateUI(user) {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");

    if (user) {
        console.log("User logged in:", user);
        if (loginForm) loginForm.style.display = "none";
        if (logoutButton) logoutButton.style.display = "block";
    } else {
        console.log("No user logged in.");
        if (loginForm) loginForm.style.display = "block";
        if (logoutButton) logoutButton.style.display = "none";
    }
}
