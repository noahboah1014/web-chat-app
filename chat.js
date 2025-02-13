// chat.js
async function fetchMessages() {
    let { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });
    if (!error) {
        updateChatUI(data);
    }
}

async function sendMessage(username, message) {
    if (message.trim() === "") return;
    
    let { error } = await supabase.from("messages").insert([
        { user_id: username, text: message, timestamp: new Date().toISOString() }
    ]);

    if (!error) {
        fetchMessages();
    }
}

// Listen for new messages
supabase.channel("messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, fetchMessages).subscribe();
