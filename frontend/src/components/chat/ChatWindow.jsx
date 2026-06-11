import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import toast from "react-hot-toast";

export default function ChatWindow({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/chat/history/${sessionId}`
        );

        if (response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.error(
          "Failed to fetch chat history",
          err
        );
      }
    };

    fetchHistory();
  }, [sessionId]);

  const handleSendMessage = async (text) => {
    const userMsg = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat/resume/stream",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            message: text,
            conversation_history:
              messages.slice(-6),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Network response was not ok"
        );
      }

      setIsTyping(false);

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder("utf-8");

      let aiContent = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp:
            new Date().toISOString(),
        },
      ]);

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) {
          toast.success("✅ Response ready!");
          break;
        }

        const chunk =
          decoder.decode(value, {
            stream: true,
          });

        aiContent += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[
            updated.length - 1
          ] = {
            ...updated[
              updated.length - 1
            ],
            content: aiContent,
          };

          return updated;
        });
      }
    } catch (err) {
      console.error(
        "Chat error:",
        err
      );

      setError(
        "Failed to get response. Please try again."
      );
      toast.error("Something went wrong. Please try again.");

      setIsTyping(false);
    }
  };

  const handleClearHistory =
    async () => {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/chat/history/${sessionId}`
        );

        setMessages([]);
      } catch (err) {
        console.error(
          "Failed to clear history",
          err
        );
      }
    };

  return (
    <div className="flex h-full flex-col bg-[#1a1f35]">

      {/* Header */}

      <div className="flex items-center justify-end border-b border-slate-800 bg-slate-900 px-3 py-3">
        {messages.length > 0 && (
          <button
            onClick={
              handleClearHistory
            }
            className="
              rounded-lg
              border
              border-slate-700
              bg-slate-800
              px-4
              py-2
              text-sm
              text-slate-300
              transition
              hover:bg-slate-700
            "
          >
            Clear Chat
          </button>
        )}

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-hidden relative flex flex-col">

        <MessageList
          messages={messages}
          isTyping={isTyping}
          error={error}
          onQuickAction={
            handleSendMessage
          }
        />

      </div>

      {/* Input */}

      <div className="border-t border-slate-800 bg-slate-900">

        <ChatInput
          onSend={
            handleSendMessage
          }
          disabled={isTyping}
          showSuggestions={
            messages.length === 0
          }
        />

      </div>

    </div>
  );
}