const SUPABASE_URL = "https://pdtudwscpnptuhbhkcgo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdHVkd3NjcG5wdHVoYmhrY2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ0MDcsImV4cCI6MjA1NTAzMDQwN30.8GHhqN217OOUNUfBSB-TH7Kl9XIexkkRwxBoz_z_xB0";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const signInBtn = document.getElementById("signIn");
const signUpBtn = document.getElementById("signUp");
const logOutBtn = document.getElementById("logOut");
const sendMessageBtn = document.getElementById("sendMessage");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loggedInUserSpan = document.getElementById("loggedInUser");

const authSection = document.getElementById("auth-section");
const userInfoSection = document.getElementById("user-info");
const messageInput = document.getElementById("message");
const chatBox = document.getElementById("chat-box");

let user = JSON.parse(localStorage.getItem("user")) || null;

document.addEventListener("DOMContentLoaded", () => {
  if (user) {
    showUser(user.username);
    fetchMessages();
  }
});

// Sign Up
signUpBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) return alert("Enter both username and password");

  localStorage.setItem("user", JSON.stringify({ username, password }));
  user = { username, password };
  showUser(username);
});

// Sign In
signInBtn.addEventListener("click", () => {
  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (
    savedUser &&
    savedUser.username === usernameInput.value &&
    savedUser.password === passwordInput.value
  ) {
    user = savedUser;
    showUser(user.username);
  } else {
    alert("Invalid credentials");
  }
});

// Log Out
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  user = null;
  authSection.style.display = "block";
  userInfoSection.style.display = "none";
  chatBox.innerHTML = "";
});

// Show User Info
function showUser(username) {
  loggedInUserSpan.textContent = username;
  authSection.style.display = "none";
  userInfoSection.style.display = "block";
  fetchMessages();
}

// Fetch Messages
async function fetchMessages() {
  let { data, error } = await supabase
    .from("messages")
    .select("user_id, username, text, timestamp")
    .order("timestamp", { ascending: true });
  if (!error) {
    chatBox.innerHTML = "";
    data.forEach((msg) => {
      displayMessage(msg.username, msg.text);
    });
  }
}

// Send Message
sendMessageBtn.addEventListener("click", async () => {
  if (!messageInput.value.trim() || !user) return;

  let { data, error } = await supabase
    .from("messages")
    .insert([
      {
        user_id: user.username,
        username: user.username,
        text: messageInput.value,
        timestamp: new Date().toISOString()
      }
    ])
    .select();

  if (!error) {
    displayMessage(user.username, messageInput.value);
    messageInput.value = "";
  }
});

// Display Message
function displayMessage(username, text) {
  const msgElement = document.createElement("p");
  msgElement.innerHTML = `<strong>${username}:</strong> ${text}`;
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Real-time Updates
supabase
  .channel("chat-room")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: "user_id=neq.NULL"
    },
    (payload) => {
      displayMessage(payload.new.username, payload.new.text);
    }
  )
  .subscribe();
