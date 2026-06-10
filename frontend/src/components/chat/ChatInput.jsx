import React, { useState } from 'react';
import { Send } from 'lucide-react';

const SUGGESTIONS = [
  "What skills am I missing for AI Engineer?",
  "Which of my projects is strongest?",
  "Am I ready for Senior roles?",
  "How can I improve my ATS score?"
];

export default function ChatInput({ onSend, disabled, showSuggestions }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-slate-800 bg-slate-900/50">
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
          {SUGGESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSend(q)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm text-left transition shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your resume..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-[52px] min-h-[52px] max-h-[150px] overflow-y-auto text-slate-200"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
