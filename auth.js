document.addEventListener("DOMContentLoaded", async () => {
    const loginBox = document.getElementById("login-box");
    const logoutButton = document.getElementById("logout-button");

    // Create a debug log container in the UI
    let debugContainer = document.createElement("div");
    debugContainer.id = "debug-log";
    debugContainer.style = "border: 1px solid red; padding: 10px; margin-top: 20px; max-height: 200px; overflow-y: auto;";
    document.body.appendChild(debugContainer);

    function logToScreen(message) {
        let logMessage = document.createElement("p");
        logMessage.textContent = message;
        debugContainer.appendChild(logMessage);
        debugContainer.scrollTop = debugContainer.scrollHeight;
    }

    // Check session on page load
    const { data: session } = await supabase.auth.getSession();
    updateUI(session?.session?.user || null);

    const signUpButton = document.querySelector("#login-box button:nth-child(4)");
    const signInButton = document.querySelector("#login-box button:nth-child(3)");

    if (!signUpButton || !signInButton) {
        logToScreen("❌ ERROR: Sign Up or Sign In button not found.");
        return;
    }

    signInButton.addEventListener("click", async () => {
        logToScreen("🔄 Signing in...");
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            logToScreen("⚠️ Please enter a username and password.");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email: username, password });

        if (error) {
            logToScreen(`❌ Login failed: ${error.message}`);
        } else {
            logToScreen("✅ Login successful.");
            updateUI(await supabase.auth.getUser());
            loginBox.style.display = "none";
        }
    });

    signUpButton.addEventListener("click", async () => {
        logToScreen("🔄 Signing up...");
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            logToScreen("⚠️ Please enter a username and password.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: username,
            password: password,
            options: {
                data: { username: username }
            }
        });

        if (error) {
            logToScreen(`❌ Sign-up failed: ${error.message}`);
        } else {
            logToScreen("✅ Sign-up successful. Please check your email to confirm.");
            updateUI(data.user);
            loginBox.style.display = "none";
        }
    });

    logoutButton.addEventListener("click", async () => {
        logToScreen("🔄 Logging out...");
        await supabase.auth.signOut();
        updateUI(null);
    });
});

function updateUI(user) {
    const loginBox = document.getElementById("login-box");
    const logoutButton = document.getElementById("logout-button");

    if (user) {
        logToScreen(`✅ User logged in: ${user.email}`);
        loginBox.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        logToScreen("❌ No user logged in.");
        loginBox.style.display = "block";
        logoutButton.style.display = "none";
    }
}
