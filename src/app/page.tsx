'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  "What plans do you offer?",
  "How does lead scoring work?",
  "Do you integrate with HubSpot?",
  "Is there a free trial?",
  "How is GrowthStack different from HubSpot?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.reply || 'Sorry, I could not get a response.' }]);
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">G</div>
          <span className="logo-text">GrowthStack</span>
        </div>
        <p className="sidebar-tagline">AI Support Assistant</p>

        <div className="divider" />

        <p className="sidebar-label">Try asking</p>
        <div className="suggestions-list">
          {SUGGESTED.map((s) => (
            <button key={s} className="suggestion-pill" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="status-dot" />
          <span>Connected to GrowthStack docs</span>
        </div>
      </aside>

      {/* Chat area */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="avatar">AI</div>
            <div>
              <div className="chat-header-name">GrowthStack Assistant</div>
              <div className="chat-header-sub">Answers from our knowledge base · always accurate</div>
            </div>
          </div>
          <div className="powered-badge">Powered by RAG + LLM</div>
        </div>

        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>How can I help you today?</h2>
              <p>Ask me anything about GrowthStack — pricing, features, integrations, or how to get started.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`message-row ${m.role}`}>
              {m.role === 'assistant' && <div className="msg-avatar">AI</div>}
              <div className={`bubble ${m.role}`}>{m.content}</div>
              {m.role === 'user' && <div className="msg-avatar user-av">U</div>}
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="msg-avatar">AI</div>
              <div className="bubble assistant typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-wrap">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask anything about GrowthStack..."
            />
            <button className="send-btn" onClick={() => send(input)} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="input-note">Answers are generated from GrowthStack's official documentation.</p>
        </div>
      </div>
    </main>
  );
}
