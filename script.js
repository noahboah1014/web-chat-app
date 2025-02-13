import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pdtudwscpnptuhbhkcgo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdHVkd3NjcG5wdHVoYmhrY2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NTQ0MDcsImV4cCI6MjA1NTAzMDQwN30.8GHhqN217OOUNUfBSB-TH7Kl9XIexkkRwxBoz_z_xB0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel("realtime messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    let { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error.message);
        return;
    }

    console.log("Fetched messages:", data); // Debugging line
    setMessages(data);
  };


  const sendMessage = async () => {
    if (newMessage.trim() === "" || !user) return;
    await supabase.from("messages").insert([{ username: user.username, text: newMessage }]);
    setNewMessage("");
  };

  const signUp = () => {
    localStorage.setItem("user", JSON.stringify({ username, password }));
    setUser({ username, password });
  };

  const signIn = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.username === username && savedUser.password === password) {
      setUser(savedUser);
    } else {
      alert("Invalid credentials");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Noah's Chat</h1>
        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="mb-2" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2" />
        <Button onClick={signIn} className="mb-2">Sign In</Button>
        <Button onClick={signUp}>Sign Up</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-4">Noah's Chat</h1>
      <div className="flex-1 overflow-y-auto border p-4 rounded-lg bg-white shadow-md" style={{ maxHeight: "70vh" }}>
        {messages.map((msg) => (
          <div key={msg.id} className="mb-3">
            <strong className="block text-sm text-gray-600">{msg.username}</strong>
            <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full shadow-md max-w-xs">
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1" />
        <Button onClick={sendMessage} className="ml-2 bg-blue-500 text-white">Send</Button>
      </div>
    </div>
  );
}
