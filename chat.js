document.addEventListener("DOMContentLoaded", () => {
    fetchMessages();
});

async function fetchMessages() {
    let { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });
    if (!error) {
        const messagesDiv = document.getElementById("messages");
        messagesDiv.innerHTML = "";
        data.forEach(msg => {
            const messageElement = document.createElement("p");
            messageElement.innerHTML = `<strong>${msg.username}:</strong> ${msg.text}`;
            messagesDiv.appendChild(messageElement);
        });
    }
}

async function sendMessage() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const messageInput = document.getElementById("new-message");

    if (!user) {
        alert("You must be logged in to send messages.");
        return;
    }
    if (messageInput.value.trim() === "") return;

    let { error } = await supabase.from("messages").insert([
        { username: user.username, text: messageInput.value, timestamp: new Date().toISOString() }
    ]);

    if (!error) {
        messageInput.value = "";
        fetchMessages();
    }
}
