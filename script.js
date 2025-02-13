import { useState, useEffect } from "react";
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
    const channels = supabase.channel("custom-insert-channel")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channels);
    };
  }, []);

  const fetchMessages = async () => {
    let { data, error } = await supabase.from("messages").select("*").order("timestamp", { ascending: true });
    if (!error) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !user) return;
    let { data, error } = await supabase.from("messages").insert([
      { username: user.username, text: newMessage, timestamp: new Date().toISOString() }
    ]).select();
    if (!error) {
      setMessages((prev) => [...prev, ...data]);
      setNewMessage("");
    }
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

  const logOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="p-4">
      <h1>Noah's Chat</h1>
      {!user ? (
        <div>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={signIn}>Sign In</button>
          <button onClick={signUp}>Sign Up</button>
        </div>
      ) : (
        <div>
          <p>Logged in as: {user.username}</p>
          <button onClick={logOut}>Log Out</button>
        </div>
      )}
      <div className="chat-box" style={{ border: "1px solid black", padding: "10px", marginTop: "10px", height: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
        ))}
      </div>
      <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
