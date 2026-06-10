import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatWindow({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Load history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/chat/history/${sessionId}`);
        if (response.data.messages) {
            setMessages(response.data.messages);
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  const handleSendMessage = async (text) => {
    const userMsg = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setError(null);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/resume/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          conversation_history: messages.slice(-6)
        })
      });

      if (!response.ok) throw new Error("Network response was not ok");

      setIsTyping(false); // Stop typing indicator once we start receiving data

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let aiContent = "";
      
      // Add empty assistant message that will be filled
      setMessages(prev => [...prev, { role: "assistant", content: "", timestamp: new Date().toISOString() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
        
        // Update the last message (the assistant one we just added)
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], content: aiContent };
          return newMessages;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setError("Failed to get response. Please try again.");
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
      try {
          await axios.delete(`http://127.0.0.1:8000/chat/history/${sessionId}`);
          setMessages([]);
      } catch (err) {
          console.error("Failed to clear history", err);
      }
  };

  return (
    <div className="flex flex-col h-[600px] sm:h-full bg-slate-900 relative">
      {/* Header bar for chat actions */}
      <div className="flex justify-end p-2 border-b border-slate-800 bg-slate-900/80">
        {messages.length > 0 ? (
          <button 
            onClick={handleClearHistory}
            className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded transition shadow-sm flex items-center gap-1"
          >
            Clear History
          </button>
        ) : (
          <div className="h-[26px]"></div> /* Placeholder to keep height consistent */
        )}
      </div>

      <MessageList messages={messages} isTyping={isTyping} error={error} onQuickAction={handleSendMessage} />
      <ChatInput onSend={handleSendMessage} disabled={isTyping} showSuggestions={messages.length === 0} />
    </div>
  );
}
