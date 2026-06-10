import React, { useState, useEffect } from "react";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("session_id") ||
      crypto.randomUUID()
  );

  useEffect(() => {
    if (!localStorage.getItem("session_id")) {
      localStorage.setItem(
        "session_id",
        sessionId
      );
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}

        <div className="mb-4">

          <h1 className="text-3xl font-bold">
            Resume Chat
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400 text-md">
            Ask questions about your resume,
            career growth, skill gaps, ATS score,
            interview preparation, and job readiness.
          </p>

        </div>

        {/* Chat Container */}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

          {/* Top Bar */}

          <div className="border-b border-slate-800 bg-slate-950/50 px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-green-500" />

              <span className="font-medium text-slate-300">
                AI Career Assistant
              </span>

            </div>

          </div>

          {/* Chat */}

          <div
            className="h-[75vh]"
          >
            <ChatWindow
              sessionId={sessionId}
            />
          </div>

        </div>

      </div>

    </div>
  );
}