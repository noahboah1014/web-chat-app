document.addEventListener("DOMContentLoaded", async () => {
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages-container");

    async function fetchMessages() {
        const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error.message);
            return;
        }

        messagesContainer.innerHTML = "";
        data.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${msg.username}: ${msg.content}`;
            messagesContainer.appendChild(messageElement);
        });
    }

    sendButton.addEventListener("click", async () => {
        const message = messageInput.value.trim();
        if (!message) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("You must be logged in to send messages.");
            return;
        }

        const { error } = await supabase.from("messages").insert([{ username: user.email, content: message }]);

        if (error) {
            console.error("Error sending message:", error.message);
        } else {
            messageInput.value = "";
            fetchMessages();
        }
    });

    // Fetch messages on load and listen for new ones
    fetchMessages();
    supabase.channel("messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, fetchMessages).subscribe();
});
