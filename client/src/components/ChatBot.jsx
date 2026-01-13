import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am your Village Assistant. Ask me anything in any language! 🌍", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // --- REAL AI INTELLIGENCE ---
    const generateResponse = async (userText) => {
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText }),
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, { id: Date.now(), text: "⚠️ Note: To use the Real AI, you must add a GEMINI_API_KEY to the server/.env file.", sender: "bot" }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now(), text: data.reply, sender: "bot" }]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, I am having trouble connecting to the server.", sender: "bot" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        generateResponse(input);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    color: "white",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
                    cursor: "pointer",
                    zIndex: 1000,
                    display: isOpen ? "none" : "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <MessageCircle size={28} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        style={{
                            position: "fixed",
                            bottom: "30px",
                            right: "30px",
                            width: "350px",
                            height: "500px",
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "24px",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                            zIndex: 1001,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.5)"
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: "20px", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ background: "rgba(255,255,255,0.2)", padding: "8px", borderRadius: "10px" }}>
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: "1rem" }}>Village AI</h3>
                                    <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Online • Multilingual</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding: "5px" }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                        maxWidth: "80%",
                                        padding: "12px 16px",
                                        borderRadius: "18px",
                                        background: msg.sender === "user" ? "#6366f1" : "#f1f5f9",
                                        color: msg.sender === "user" ? "white" : "#1e293b",
                                        fontSize: "0.95rem",
                                        borderBottomRightRadius: msg.sender === "user" ? "4px" : "18px",
                                        borderBottomLeftRadius: msg.sender === "bot" ? "4px" : "18px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ alignSelf: "flex-start", background: "#f1f5f9", padding: "10px 16px", borderRadius: "18px", borderBottomLeftRadius: "4px" }}>
                                    <Loader2 className="animate-spin" size={16} color="#6366f1" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div style={{ padding: "15px", borderTop: "1px solid rgba(0,0,0,0.05)", background: "white", display: "flex", gap: "10px", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    borderRadius: "20px",
                                    border: "1px solid #e2e8f0",
                                    outline: "none",
                                    fontSize: "0.95rem",
                                    background: "#f8fafc"
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                style={{
                                    background: "#6366f1",
                                    color: "white",
                                    border: "none",
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: input.trim() ? 1 : 0.5
                                }}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
