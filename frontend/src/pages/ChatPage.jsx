import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        {/* Header */}

        <div className="mb-2 flex items-center justify-between">

          <div>
            <h1 className="text-xl font-bold">Resume Chat</h1>
            <p className="text-slate-400 text-sm">
              Ask about your resume, skill gaps, ATS score, or interview prep.
            </p>
          </div>

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

          <div className="flex-1 overflow-hidden relative flex flex-col">
            <ChatWindow
              sessionId={sessionId}
            />
          </div>

        </div>

      </div>

    </div>
  );
}