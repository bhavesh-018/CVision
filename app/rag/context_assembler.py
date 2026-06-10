class ContextAssembler:
    
    def assemble_resume_chat_context(
        self,
        resume_chunks: list[str],
        user_message: str,
        conversation_history: list[dict]
    ) -> str:
        """Assemble context for Resume Chat"""
        
        context_parts = [
            "=== RESUME CONTEXT (Retrieved) ===",
            "\n".join(resume_chunks) if resume_chunks else "No resume context found.",
            "",
            "=== CONVERSATION HISTORY ===",
            self._format_history(conversation_history[-6:]) if conversation_history else "No prior history.",
        ]
        
        return "\n".join(context_parts)
    
    def assemble_career_coach_context(
        self,
        multi_source_context: dict,
        career_goals: str,
        conversation_history: list[dict]
    ) -> str:
        """Assemble rich context for Career Coach"""
        
        parts = ["=== CANDIDATE PROFILE ==="]
        
        if multi_source_context.get("resumes"):
            parts.append("Resume Highlights:")
            parts.extend(multi_source_context["resumes"][:2])
        
        if multi_source_context.get("github_projects"):
            parts.append("\nGitHub Portfolio:")
            parts.extend(multi_source_context["github_projects"][:2])
        
        if multi_source_context.get("linkedin_profiles"):
            parts.append("\nLinkedIn Profile:")
            parts.extend(multi_source_context["linkedin_profiles"][:1])
        
        if multi_source_context.get("career_knowledge"):
            parts.append("\n=== RELEVANT CAREER KNOWLEDGE ===")
            parts.extend(multi_source_context["career_knowledge"][:3])
        
        if career_goals:
            parts.append(f"\n=== USER'S CAREER GOALS ===\n{career_goals}")
        
        parts.append("\n=== CONVERSATION HISTORY ===")
        parts.append(self._format_history(conversation_history[-6:]) if conversation_history else "No prior history.")
        
        return "\n".join(parts)
    
    def _format_history(self, history: list[dict]) -> str:
        formatted = []
        for msg in history:
            role = "User" if msg["role"] == "user" else "Assistant"
            formatted.append(f"{role}: {msg['content'][:500]}")
        return "\n".join(formatted)
