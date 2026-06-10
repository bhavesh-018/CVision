import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/chat/ChatWindow';

export default function ChatPage() {
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("session_id") || crypto.randomUUID()
  );

  useEffect(() => {
    if (!localStorage.getItem("session_id")) {
      localStorage.setItem("session_id", sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col pt-20">
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Resume Chat
          </h1>
          <p className="text-slate-400 mt-2">
            Ask questions about your resume, skills, and career path.
          </p>
        </div>
        
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl flex flex-col mb-4">
          <ChatWindow sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
}
