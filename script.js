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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    fetchMessages();
    const subscription = supabase
      .channel("realtime messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    let { data, error } = await supabase.from("Messages").select("*").order("timestamp", { ascending: true });
    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !user) return;
    const { data, error } = await supabase.from("Messages").insert([{ 
      user_id: user.id, 
      username: user.user_metadata.username, 
      text: newMessage 
    }]);
    if (error) console.error("Error sending message:", error);
    setNewMessage("");
  };

  const signUp = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert("Sign-up failed: " + error.message);
    } else {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mb-2" />
        <Button onClick={signIn} className="mb-2">Sign In</Button>
        <Button onClick={signUp}>Sign Up</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between mb-2">
        <span>Logged in as: {user.user_metadata?.username || user.email}</span>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
      <div className="flex-1 overflow-y-auto border p-2 rounded-lg">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 border-b">
            <strong>{msg.username}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
        <Button onClick={sendMessage} className="ml-2">Send</Button>
      </div>
    </div>
  );
}

