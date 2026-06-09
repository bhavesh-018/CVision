import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Code,
  FolderGit2,
  Users,
} from "lucide-react";

function QuestionSection({
  title,
  icon,
  questions,
  color,
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`rounded-3xl border ${color.border} ${color.bg} p-8`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">

          {icon}

          <h3 className="text-2xl font-bold">
            {title}
          </h3>

        </div>

        {open ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </button>

      {open && (
        <div className="mt-8 space-y-4">

          {questions.length > 0 ? (

            questions.map((question, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-5 hover:border-slate-700 transition"
              >

                <div className="flex gap-4">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-bold">
                    {index + 1}
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {question}
                  </p>

                </div>

              </div>
            ))

          ) : (

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

              <p className="text-slate-400">
                No questions available.
              </p>

            </div>

          )}

        </div>
      )}
    </div>
  );
}

function InterviewTab({ analysis }) {
  const interview =
    analysis.interview || {};

  const technicalQuestions =
    interview.technical_questions || [];

  const projectQuestions =
    interview.project_questions || [];

  const behavioralQuestions =
    interview.behavioral_questions || [];

  const totalQuestions =
    technicalQuestions.length +
    projectQuestions.length +
    behavioralQuestions.length;

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 p-8">

        <div className="flex items-center justify-between flex-wrap gap-6">

          <div>

            <h2 className="text-3xl font-bold">
              Interview Preparation Center
            </h2>

            <p className="mt-3 text-slate-400">
              Personalized interview questions generated
              from your resume and experience.
            </p>

          </div>

          <div className="rounded-2xl bg-slate-900 px-6 py-4 border border-slate-800">

            <p className="text-sm text-slate-500">
              Total Questions
            </p>

            <h3 className="text-4xl font-bold text-blue-400">
              {totalQuestions}
            </h3>

          </div>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6">

          <h4 className="text-slate-400">
            Technical
          </h4>

          <h3 className="text-5xl font-bold text-blue-400 mt-3">
            {technicalQuestions.length}
          </h3>

        </div>

        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6">

          <h4 className="text-slate-400">
            Project
          </h4>

          <h3 className="text-5xl font-bold text-purple-400 mt-3">
            {projectQuestions.length}
          </h3>

        </div>

        <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6">

          <h4 className="text-slate-400">
            Behavioral
          </h4>

          <h3 className="text-5xl font-bold text-green-400 mt-3">
            {behavioralQuestions.length}
          </h3>

        </div>

      </div>

      {/* Questions */}

      <QuestionSection
        title="Technical Questions"
        questions={technicalQuestions}
        icon={
          <Code
            size={24}
            className="text-blue-400"
          />
        }
        color={{
          border: "border-blue-500/20",
          bg: "bg-blue-500/5",
        }}
      />

      <QuestionSection
        title="Project Questions"
        questions={projectQuestions}
        icon={
          <FolderGit2
            size={24}
            className="text-purple-400"
          />
        }
        color={{
          border: "border-purple-500/20",
          bg: "bg-purple-500/5",
        }}
      />

      <QuestionSection
        title="Behavioral Questions"
        questions={behavioralQuestions}
        icon={
          <Users
            size={24}
            className="text-green-400"
          />
        }
        color={{
          border: "border-green-500/20",
          bg: "bg-green-500/5",
        }}
      />

    </div>
  );
}

export default InterviewTab;