import React, { useState, useEffect, useRef } from "react";
import CoachOnboarding from "../components/coach/CoachOnboarding";
import CoachSidebar from "../components/coach/CoachSidebar";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function CoachPage() {
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("session_id") || crypto.randomUUID()
  );
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("session_id")) {
      localStorage.setItem("session_id", sessionId);
    }
    
    // Fetch profile and history
    const loadData = async () => {
      try {
        const [profileRes, historyRes] = await Promise.all([
          fetch(`http://localhost:8000/coach/profile/${sessionId}`),
          fetch(`http://localhost:8000/coach/history/${sessionId}`)
        ]);
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          // If no target role, they haven't onboarded
          setProfile(profileData.target_role ? profileData : null);
        }
        
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setMessages(historyData);
        }
      } catch (error) {
        console.error("Failed to load coach data", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [sessionId]);

  // Refresh profile scores (e.g. after uploading resume)
  const refreshProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8000/coach/profile/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.target_role) {
          setProfile(data);
          toast.success(data.ats_score > 0
            ? `Resume connected! ATS score: ${data.ats_score}`
            : "No resume found. Upload one from the Dashboard."
          );
        }
      }
    } catch {
      toast.error("Could not refresh profile.");
    }
  };

  const handleOnboardingComplete = async (targetRole, goals, experience) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/coach/set-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          target_role: targetRole,
          career_goals: goals,
          experience_years: experience
        })
      });
      
      const data = await res.json();
      
      setProfile({
        target_role: targetRole,
        career_goals: goals,
        experience_years: experience,
        ats_score: 0,
        github_score: 0,
        linkedin_score: 0
      });
      
      // Also reload history to get the initial message
      const historyRes = await fetch(`http://localhost:8000/coach/history/${sessionId}`);
      if (historyRes.ok) {
        setMessages(await historyRes.json());
      }
      
    } catch (error) {
      console.error("Onboarding failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    const userMsg = { role: "user", content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    try {
      const res = await fetch("http://localhost:8000/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text
        })
      });
      
      const data = await res.json();
      const assistantMsg = { role: "assistant", content: data.response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);
      toast.success("Coach response ready!");
      
    } catch (error) {
      console.error("Chat failed", error);
      toast.error("Something went wrong. Please retry.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleGoalChange = async (newRole, newGoals, experience) => {
    try {
      await fetch("http://localhost:8000/coach/set-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          target_role: newRole,
          career_goals: newGoals,
          experience_years: experience
        })
      });
      // Update profile in place without clearing messages
      setProfile(prev => ({ ...prev, target_role: newRole, career_goals: newGoals }));
      // Reload history so the new goal message + AI response appear in chat
      const historyRes = await fetch(`http://localhost:8000/coach/history/${sessionId}`);
      if (historyRes.ok) {
        setMessages(await historyRes.json());
      }
      toast.success(`Target updated to ${newRole}!`);
    } catch (error) {
      toast.error("Failed to update goal.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center w-full min-h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 w-full py-12">
        <CoachOnboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="flex-1 w-full max-w-[100rem] mx-auto px-6 py-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
      <div className="hidden md:flex flex-col w-72 shrink-0">
        <CoachSidebar
          profile={profile}
          onActionClick={handleSendMessage}
          onGoalChange={handleGoalChange}
          onRefresh={refreshProfile}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="border-b border-slate-800 bg-slate-950/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="font-medium text-slate-300">
              AI Career Coach
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Target: {profile.target_role}
          </span>
        </div>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>

        <div className="border-t border-slate-800 bg-slate-900">
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
            showSuggestions={messages.length === 0}
          />
        </div>
      </div>
      
    </div>
    </>
  );
}
