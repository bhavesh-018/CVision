import sqlite3
import os

CREATE_TABLES = [
    """
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        context TEXT DEFAULT 'chat',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS user_profiles (
        session_id TEXT PRIMARY KEY,
        target_role TEXT DEFAULT '',
        career_goals TEXT DEFAULT '',
        experience_years INTEGER DEFAULT 0,
        resume_skills TEXT DEFAULT '[]',
        github_username TEXT DEFAULT '',
        linkedin_username TEXT DEFAULT '',
        github_score INTEGER DEFAULT 0,
        linkedin_score INTEGER DEFAULT 0,
        ats_score INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(session_id)
    )
    """
]

class SQLiteManager:
    DB_PATH = "./career_data.db"
    
    def __init__(self):
        self.conn = sqlite3.connect(self.DB_PATH, check_same_thread=False)
        self._create_tables()
    
    def _create_tables(self):
        for query in CREATE_TABLES:
            self.conn.execute(query)
        self.conn.commit()

    def _ensure_session(self, session_id: str):
        self.conn.execute(
            "INSERT OR IGNORE INTO sessions (session_id) VALUES (?)",
            (session_id,)
        )
        self.conn.execute(
            "UPDATE sessions SET last_active = CURRENT_TIMESTAMP WHERE session_id = ?",
            (session_id,)
        )
        self.conn.commit()
    
    def save_message(self, session_id: str, role: str, content: str, context: str = "chat"):
        self._ensure_session(session_id)
        self.conn.execute(
            "INSERT INTO messages (session_id, role, content, context) VALUES (?, ?, ?, ?)",
            (session_id, role, content, context)
        )
        self.conn.commit()
    
    def get_messages(self, session_id: str, limit: int = 20, context: str = None) -> list[dict]:
        query = "SELECT role, content, timestamp FROM messages WHERE session_id = ?"
        params = [session_id]
        if context:
            query += " AND context = ?"
            params.append(context)
        query += " ORDER BY timestamp DESC, id DESC LIMIT ?"
        params.append(limit)
        
        rows = self.conn.execute(query, params).fetchall()
        return [{"role": r[0], "content": r[1], "timestamp": r[2]} for r in reversed(rows)]
        
    def clear_messages(self, session_id: str):
        self.conn.execute("DELETE FROM messages WHERE session_id = ?", (session_id,))
        self.conn.commit()
        
    def get_message_count(self, session_id: str) -> int:
        row = self.conn.execute("SELECT COUNT(*) FROM messages WHERE session_id = ?", (session_id,)).fetchone()
        return row[0] if row else 0
    
    def update_profile(self, session_id: str, **kwargs):
        self._ensure_session(session_id)
        set_clause = ", ".join([f"{k} = ?" for k in kwargs.keys()])
        values = list(kwargs.values()) + [session_id]
        self.conn.execute(
            f"INSERT OR IGNORE INTO user_profiles (session_id) VALUES (?)",
            (session_id,)
        )
        if set_clause:
            self.conn.execute(
                f"UPDATE user_profiles SET {set_clause}, last_updated = CURRENT_TIMESTAMP WHERE session_id = ?",
                values
            )
        self.conn.commit()
    
    def get_profile(self, session_id: str) -> dict:
        row = self.conn.execute(
            "SELECT * FROM user_profiles WHERE session_id = ?",
            (session_id,)
        ).fetchone()
        if not row:
            return {}
        columns = ["session_id", "target_role", "career_goals", "experience_years",
                   "resume_skills", "github_username", "linkedin_username",
                   "github_score", "linkedin_score", "ats_score", "last_updated"]
        return dict(zip(columns, row))
