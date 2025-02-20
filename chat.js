document.addEventListener("DOMContentLoaded", async () => {
    const messageInput = document.getElementById("new-message");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages-container");

    async function fetchMessages() {
        const { data, error } = await supabase
            .from("messages")
            .select("user_id, username, text, timestamp")
            .order("timestamp", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error.message);
            return;
        }

        messagesContainer.innerHTML = "";
        data.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${msg.username || msg.user_id}: ${msg.text}`;
            messagesContainer.appendChild(messageElement);
        });
    }

    sendButton.addEventListener("click", async () => {
        const message = messageInput.value.trim();
        if (!message) return;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            alert("You must be logged in to send messages.");
            return;
        }

        const { error } = await supabase
            .from("messages")
            .insert([{ user_id: user.id, username: user.user_metadata?.username || user.email, text: message }]);

        if (error) {
            console.error("Error sending message:", error.message);
        } else {
            messageInput.value = "";
            fetchMessages();
        }
    });

    // Fetch messages on load and listen for new ones
    fetchMessages();
    supabase
        .channel("public:messages")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, fetchMessages)
        .subscribe();
});
