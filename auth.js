document.addEventListener("DOMContentLoaded", async () => {
    const loginBox = document.getElementById("login-box");
    const logoutButton = document.getElementById("logout-button");

    // Check session on page load
    const { data: session } = await supabase.auth.getSession();
    updateUI(session?.session?.user || null);

    document.querySelector("#login-box button:nth-child(3)").addEventListener("click", async () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const { error } = await supabase.auth.signInWithPassword({ email: username, password });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            updateUI(await supabase.auth.getUser());
            loginBox.style.display = "none";
        }
    });

    logoutButton.addEventListener("click", async () => {
        await supabase.auth.signOut();
        updateUI(null);
    });
});

function updateUI(user) {
    const loginBox = document.getElementById("login-box");
    const logoutButton = document.getElementById("logout-button");

    if (user) {
        console.log("User logged in:", user);
        loginBox.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        console.log("No user logged in.");
        loginBox.style.display = "block";
        logoutButton.style.display = "none";
    }
}
