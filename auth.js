alert("auth.js loaded successfully");

async function handleSignup() {
    alert("Signup function started");  // Debug message

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    alert("Collected email: " + email);  // Debug message

    let { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert("Signup failed: " + error.message);  // Show error
    } else {
        alert("Signup successful!");  // Success message
        updateUI(user);
    }
}

async function handleLogin() {
    alert("Login function started");  // Debug message

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    alert("Collected email: " + email);  // Debug message

    let { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("Login failed: " + error.message);  // Show error
    } else {
        alert("Login successful!");  // Success message
        updateUI(user);
    }
}

async function handleLogout() {
    alert("Logout function started");  // Debug message

    let { error } = await supabase.auth.signOut();

    if (error) {
        alert("Logout failed: " + error.message);
    } else {
        alert("Logout successful!");
        updateUI(null);
    }
}

async function checkUser() {
    alert("Checking user authentication status");  // Debug message

    const { data, error } = await supabase.auth.getUser();

    if (error) {
        alert("Error fetching user: " + error.message);
    } else if (data?.user) {
        alert("User is logged in: " + data.user.email);
        updateUI(data.user);
    } else {
        alert("No user logged in");
        updateUI(null);
    }
}

function updateUI(user) {
    alert("Updating UI");  // Debug message

    const authSection = document.getElementById("auth-section");
    const chatSection = document.getElementById("chat-section");
    const logoutButton = document.getElementById("logout-button");

    if (user) {
        authSection.style.display = "none";
        chatSection.style.display = "block";
        logoutButton.style.display = "block";
    } else {
        authSection.style.display = "block";
        chatSection.style.display = "none";
        logoutButton.style.display = "none";
    }
}

// Run checkUser when the page loads
document.addEventListener("DOMContentLoaded", checkUser);
