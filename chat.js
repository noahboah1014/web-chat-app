document.addEventListener("DOMContentLoaded", async () => {
    const messageInput = document.getElementById("new-message");
    const sendButton = document.getElementById("send-button");
    const messagesContainer = document.getElementById("messages-container");

    // Create a debug log container in the UI
    let debugContainer = document.createElement("div");
    debugContainer.id = "debug-log";
    debugContainer.style = "border: 1px solid red; padding: 10px; margin-top: 20px; max-height: 200px; overflow-y: auto;";
    document.body.appendChild(debugContainer);

    function logToScreen(message) {
        let logMessage = document.createElement("p");
        logMessage.textContent = message;
        debugContainer.appendChild(logMessage);
        debugContainer.scrollTop = debugContainer.scrollHeight;
    }

    if (!messageInput || !sendButton || !messagesContainer) {
        logToScreen("❌ ERROR: Missing HTML elements. Check IDs: `new-message`, `send-button`, `messages-container`.");
        return;
    }

    async function fetchMessages() {
        logToScreen("🔄 Fetching messages...");
        const { data, error } = await supabase
            .from("messages")
            .select("user_id, username, text, timestamp")
            .order("timestamp", { ascending: true });

        if (error) {
            logToScreen(`❌ Error fetching messages: ${error.message}`);
            return;
        }

        logToScreen(`✅ Received ${data.length} messages.`);
        messagesContainer.innerHTML = "";
        data.forEach((msg) => {
            const messageElement = document.createElement("div");
            messageElement.textContent = `${msg.username || msg.user_id}: ${msg.text}`;
            messagesContainer.appendChild(messageElement);
        });
    }

    sendButton.addEventListener("click", async () => {
        logToScreen("🟢 Send button clicked.");
        const message = messageInput.value.trim();
        if (!message) {
            logToScreen("⚠️ Message input is empty.");
            return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData || !userData.user) {
            logToScreen("❌ You must be logged in to send messages.");
            return;
        }

        logToScreen(`👤 User: ${userData.user.email}`);

        const { error } = await supabase
            .from("messages")
            .insert([{ 
                user_id: userData.user.id, 
                username: userData.user.user_metadata?.username || userData.user.email, 
                text: message 
            }]);

        if (error) {
            logToScreen(`❌ Error sending message: ${error.message}`);
        } else {
            logToScreen("✅ Message sent successfully.");
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
