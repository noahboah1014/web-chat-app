function updateChatUI(messages) {
    const chatBox = document.getElementById("messages-container");
    chatBox.innerHTML = "";
    
    messages.forEach(msg => {
        const msgElement = document.createElement("p");
        msgElement.innerHTML = `<strong>${msg.username || msg.user_id}:</strong> ${msg.text}`; // Fixed column name
        chatBox.appendChild(msgElement);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("send-button").addEventListener("click", () => {
    const messageInput = document.getElementById("new-message");
    const username = supabase.auth.getUser()?.data?.user?.email || "Unknown User"; 

    if (username) {
        sendMessage(username, messageInput.value);
        messageInput.value = "";
    } else {
        alert("You must be logged in to send messages.");
    }
});
