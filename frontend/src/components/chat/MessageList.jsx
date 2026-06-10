import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import TypingIndicator from './TypingIndicator';
import { User, Bot } from 'lucide-react';

export default function MessageList({ messages, isTyping, error, onQuickAction }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-24">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <Bot size={32} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-slate-400 max-w-md mb-8">
                  I'm your AI career assistant. Ask me anything about your resume, missing skills, or career path.
              </p>
          </div>
      );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
      {messages.map((msg, idx) => {
        const isUser = msg.role === 'user';
        return (
          <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm sm:text-base ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none shadow-sm'}`}>
                {isUser ? (
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                ) : (
                  <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex flex-row items-end gap-2 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800 rounded-bl-none shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="text-center text-red-400 text-sm p-2">
          {error}
        </div>
      )}
    </div>
  );
}
