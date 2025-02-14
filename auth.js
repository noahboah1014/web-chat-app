document.addEventListener("DOMContentLoaded", async () => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Error fetching user:", error.message);
    } else if (user) {
        console.log("User is logged in:", user);
        updateUI(user);
    } else {
        console.log("No user session found");
    }
});

// Signup Function
async function signUp() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Signup Error:", error.message);
        alert("Signup failed: " + error.message);
    } else {
        console.log("Signup successful:", data);
        alert("Signup successful! Check your email to confirm.");
    }
}

// Login Function
async function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login Error:", error.message);
        alert("Login failed: " + error.message);
    } else {
        console.log("Login successful:", data);
        alert("Login successful!");
        updateUI(data.user);
    }
}

// Logout Function
async function logout() {
    let { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error("Logout Error:", error.message);
    } else {
        console.log("Logged out successfully");
        updateUI(null);
    }
}

// Update UI Based on Auth Status
function updateUI(user) {
    const loginBox = document.getElementById("loginBox");
    const logoutButton = document.getElementById("logoutButton");

    if (user) {
        loginBox.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        loginBox.style.display = "block";
        logoutButton.style.display = "none";
    }
}
