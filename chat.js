document.addEventListener("DOMContentLoaded", async () => {
    await fetchMessages(); // Load existing messages when the page loads

    document.getElementById("sendMessage").addEventListener("click", async () => {
        const messageInput = document.getElementById("messageInput");
        const text = messageInput.value.trim();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!text || !user) return; // Prevent empty messages or sending when not logged in

        const { data, error } = await supabase.from("messages").insert([
            { user_id: user.id, username: user.username, text: text, timestamp: new Date().toISOString() }
        ]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            messageInput.value = ""; // Clear text box after sending
        }
    });

    // Listen for new messages in real-time
    supabase
        .channel("custom-insert-channel")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
            displayMessage(payload.new);
        })
        .subscribe();
});

async function fetchMessages() {
    const { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error);
    } else {
        const chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = ""; // Clear existing messages before appending
        data.forEach(displayMessage);
    }
}

function displayMessage(message) {
    const chatBox = document.getElementById("chatBox");
    const msgElement = document.createElement("p");
    msgElement.innerHTML = `<strong>${message.username}:</strong> ${message.text}`;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
}
