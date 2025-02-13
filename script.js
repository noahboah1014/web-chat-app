import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

const SUPABASE_URL = "https://pdtudwscpnptuhbhkcgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdHVkd3NjcG5wdHVoYmhrY2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ0MDcsImV4cCI6MjA1NTAzMDQwN30.8GHhqN217OOUNUfBSB-TH7Kl9XIexkkRwxBoz_z_xB0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const root = document.getElementById("root");

// State variables
let user = JSON.parse(localStorage.getItem("user")) || null;
let messages = [];

// Fetch messages from Supabase
async function fetchMessages() {
    let { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });
    if (!error) {
        messages = data;
        render();
    }
}

// Send a message
async function sendMessage(text) {
    if (!user || text.trim() === "") return;
    await supabase.from("messages").insert([{ username: user.username, text }]);
}

// Handle sign-in
function signIn(username, password) {
    localStorage.setItem("user", JSON.stringify({ username, password }));
    user = { username, password };
    render();
}

// Render UI
function render() {
    root.innerHTML = user ? chatUI() : loginUI();
    if (user) document.getElementById("sendBtn").onclick = () => sendMessage(document.getElementById("msgInput").value);
    if (!user) document.getElementById("signInBtn").onclick = () => signIn(document.getElementById("username").value, document.getElementById("password").value);
}

// Login UI
function loginUI() {
    return `
        <div class="login-container">
            <input id="username" placeholder="Username">
            <input id="password" type="password" placeholder="Password">
            <button id="signInBtn">Sign In</button>
        </div>
    `;
}

// Chat UI
function chatUI() {
    return `
        <div class="chat-container">
            <div class="messages">
                ${messages.map(msg => `<div><strong>${msg.username}:</strong> ${msg.text}</div>`).join("")}
            </div>
            <input id="msgInput" placeholder="Type a message...">
            <button id="sendBtn">Send</button>
        </div>
    `;
}

// Real-time updates
supabase.channel("realtime messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, fetchMessages).subscribe();

// Initial Load
fetchMessages();
render();
