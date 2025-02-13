// ui.js
function updateChatUI(messages) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    
    messages.forEach(msg => {
        const msgElement = document.createElement("p");
        msgElement.innerHTML = `<strong>${msg.user_id}:</strong> ${msg.text}`;
        chatBox.appendChild(msgElement);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("send-button").addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const username = localStorage.getItem("user");

    if (username) {
        sendMessage(username, messageInput.value);
        messageInput.value = "";
    } else {
        alert("You must be logged in to send messages.");
    }
});
