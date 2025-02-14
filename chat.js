async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const text = messageInput.value.trim();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!text || !user) {
        console.error("Message is empty or user is not logged in.");
        return;
    }

    // Ensure the user has an ID
    if (!user.id) {
        console.error("User ID missing.");
        return;
    }

    const { error } = await supabase.from("messages").insert([
        { user_id: user.id, username: user.username, text: text, timestamp: new Date().toISOString() }
    ]);

    if (error) {
        console.error("Error sending message:", error);
    } else {
        messageInput.value = ""; // Clear text box after sending
        console.log("Message sent successfully!");
    }
}
