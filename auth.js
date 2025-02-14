document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const authContainer = document.getElementById("auth-container");
    const chatContainer = document.getElementById("chat-container");

    async function getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

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

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error("Login failed:", error.message);
            alert("Invalid login credentials");
        } else {
            console.log("Login successful:", data);
            updateUI(data.user);
        }
    });

    logoutButton.addEventListener("click", async () => {
        await supabase.auth.signOut();
        updateUI(null);
    });

    const user = await getCurrentUser();
    updateUI(user);
});
