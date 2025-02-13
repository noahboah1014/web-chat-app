document.addEventListener("DOMContentLoaded", () => {
    updateUI();
});

async function signUp() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter a username and password.");
        return;
    }

    localStorage.setItem("user", JSON.stringify({ username, password }));
    alert("Signup successful! Please log in.");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

async function signIn() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.username === username && savedUser.password === password) {
        localStorage.setItem("loggedInUser", JSON.stringify(savedUser));
        updateUI();
    } else {
        alert("Invalid credentials.");
    }
}

function logOut() {
    localStorage.removeItem("loggedInUser");
    updateUI();
}

function updateUI() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const loginBox = document.getElementById("login-box");
    const userInfo = document.getElementById("user-info");
    const welcomeMessage = document.getElementById("welcome-message");

    if (user) {
        loginBox.style.display = "none";
        userInfo.style.display = "block";
        welcomeMessage.innerText = `Logged in as: ${user.username}`;
    } else {
        loginBox.style.display = "block";
        userInfo.style.display = "none";
    }
}
