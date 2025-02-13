// Authentication script for handling user sign-up, log-in, and log-out.

async function signUp() {
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();
    
    if (!email || !password) {
        alert("Please enter a valid email and password.");
        return;
    }

    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
        return;
    }

    // Auto log in after successful sign-up
    user = data.user;
    localStorage.setItem("user", JSON.stringify(user));
    updateUI();

    // Clear input fields
    emailInput.value = "";
    passwordInput.value = "";

    alert("Sign-up successful! You are now logged in.");
}

async function logIn() {
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();
    
    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error || !data.user) {
        alert("Invalid credentials. Please try again.");
        return;
    }

    // Save user session
    user = data.user;
    localStorage.setItem("user", JSON.stringify(user));
    updateUI();

    // Clear input fields
    emailInput.value = "";
    passwordInput.value = "";

    alert("Logged in successfully!");
}

async function logOut() {
    let { error } = await supabase.auth.signOut();
    
    if (error) {
        alert("Error logging out. Please try again.");
        return;
    }

    // Clear session and UI
    localStorage.removeItem("user");
    user = null;
    updateUI();

    alert("Logged out successfully!");
}

// Function to update the UI based on login status
function updateUI() {
    let loginForm = document.getElementById("login-form");
    let logoutButton = document.getElementById("logout-button");
    let welcomeMessage = document.getElementById("welcome-message");

    if (user) {
        loginForm.style.display = "none"; // Hide login form
        logoutButton.style.display = "block"; // Show logout button
        welcomeMessage.innerText = `Logged in as: ${user.email}`;
    } else {
        loginForm.style.display = "block"; // Show login form
        logoutButton.style.display = "none"; // Hide logout button
        welcomeMessage.innerText = ""; // Clear welcome message
    }
}

// Load user from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    user = JSON.parse(localStorage.getItem("user")) || null;
    updateUI();
});
