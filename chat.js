document.addEventListener("DOMContentLoaded", async () => {
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages");

    async function getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    async function fetchMessages() {
        const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error.message);
            return;
        }

        messagesContainer.innerHTML = "";
        data.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${msg.user_email}: ${msg.text}`;
            messagesContainer.appendChild(messageElement);
        });
    }

    async function sendMessage() {
        const user = await getCurrentUser();
        if (!user) {
            alert("You must be logged in to send messages.");
            return;
        }

        const text = messageInput.value.trim();
        if (text === "") return;

        const { error } = await supabase.from("messages").insert([
            { user_id: user.id, user_email: user.email, text: text }
        ]);

        if (error) {
            console.error("Error sending message:", error.message);
            return;
        }

        messageInput.value = "";
        fetchMessages();
    }

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });

    await fetchMessages();
});
