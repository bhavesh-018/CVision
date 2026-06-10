import React, { useState } from "react";
import { Send, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  {
    title: "Skill Gap Analysis",
    question:
      "What skills am I missing for AI Engineer roles?",
  },
  {
    title: "Project Review",
    question:
      "Which of my projects is strongest?",
  },
  {
    title: "Career Growth",
    question:
      "Am I ready for Senior roles?",
  },
  {
    title: "ATS Optimization",
    question:
      "How can I improve my ATS score?",
  },
];

export default function ChatInput({
  onSend,
  disabled,
  showSuggestions,
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim() || disabled) return;

    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900">

      {/* Suggestions */}

      {showSuggestions && (
        <div className="px-5 pt-5">

          <div className="flex items-center gap-2 mb-4">

            <Sparkles
              size={16}
              className="text-blue-400"
            />

            <p className="text-sm text-slate-400">
              Suggested Questions
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {SUGGESTIONS.map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    onSend(
                      item.question
                    )
                  }
                  className="
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-800/50
                    p-4
                    text-left
                    transition
                    hover:border-blue-500
                    hover:bg-slate-800
                  "
                >

                  <h4 className="font-medium text-white">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm text-slate-400">
                    {item.question}
                  </p>

                </button>
              )
            )}

          </div>

        </div>
      )}

      {/* Input */}

      <form
        onSubmit={handleSubmit}
        className="p-5"
      >

        <div className="relative max-w-5xl mx-auto">

          <textarea
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            disabled={disabled}
            rows={1}
            placeholder="Ask about your resume, skills, ATS score, interview preparation, or career roadmap..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-4
              pr-16
              text-slate-200
              placeholder:text-slate-500
              focus:outline-none
              focus:border-blue-500
              resize-none
            "
          />

          <button
            type="submit"
            disabled={
              !text.trim() ||
              disabled
            }
            className="
              absolute
              bottom-3
              right-3
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              text-white
              transition
              hover:bg-blue-500
              disabled:bg-slate-700
              disabled:text-slate-500
            "
          >

            <Send size={18} />

          </button>

        </div>

      </form>

    </div>
  );
}