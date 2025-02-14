document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const authContainer = document.getElementById("auth-container");
    const chatContainer = document.getElementById("chat-container");

    // Function to update UI based on login status
    function updateUI(user) {
        if (user) {
            authContainer.style.display = "none";
            chatContainer.style.display = "block";
            logoutButton.style.display = "block";
        } else {
            authContainer.style.display = "block";
            chatContainer.style.display = "none";
            logoutButton.style.display = "none";
        }
    }

    // Check for an existing session
    const { data: { user } } = await supabase.auth.getUser();
    updateUI(user);

    // Login form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error("Login failed:", error.message);
            alert("Invalid credentials. Please try again.");
        } else {
            console.log("Login successful:", data);
            updateUI(data.user);
        }
    });

    // Logout button click event
    logoutButton.addEventListener("click", async () => {
        await supabase.auth.signOut();
        updateUI(null);
    });
});
