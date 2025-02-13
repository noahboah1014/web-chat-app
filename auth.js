// auth.js
async function signUp(username, password) {
    const { error } = await supabase.auth.signUp({ email: username, password });
    if (error) {
        alert("Signup failed: " + error.message);
    } else {
        alert("Signup successful!");
    }
}

async function signIn(username, password) {
    const { error } = await supabase.auth.signInWithPassword({ email: username, password });
    if (error) {
        alert("Login failed: " + error.message);
    } else {
        localStorage.setItem("user", JSON.stringify(username));
        window.location.reload();
    }
}

function logOut() {
    supabase.auth.signOut();
    localStorage.removeItem("user");
    window.location.reload();
}
