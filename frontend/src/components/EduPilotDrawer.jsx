import React, { useRef, useEffect } from "react";
import MarkdownMessage from "./MarkdownMessage.jsx";

export default function EduPilotDrawer({
  isOpen,
  onClose,
  messages,
  isStreaming,
  streamingAnswer,
  onSendMessage,
  onReadScreen,
  isReadingScreen,
  onOpenFileUpload,
  currentDoc,
  onReadAloud,
  isSpeaking,
  onToggleVoice,
  isListening,
  voiceSupported,
}) {
  const [inputVal, setInputVal] = React.useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingAnswer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isStreaming) return;
    onSendMessage(inputVal.trim());
    setInputVal("");
  };

  const starterChips = [
    { label: "Explain my dashboard", prompt: "Can you explain my current semester courses, today's schedule, and my progress on this dashboard?", icon: "📖" },
    { label: "Summarize my notes", prompt: "Can you summarize the uploaded lecture notes and document?", icon: "📄" },
    { label: "Help me prepare for exams", prompt: "Help me prepare for upcoming semester exams based on my courses and syllabus. Give key tips and high-priority study topics.", icon: "🎓" },
  ];

  return (
    <aside className={`edupilot-drawer ${isOpen ? "open" : "collapsed"}`}>
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="drawer-bot-info">
          <div className="drawer-avatar">
            <span className="bot-robot-emoji">🤖</span>
            <span className="sparkle-badge">✨</span>
          </div>
          <div className="drawer-bot-title">
            <h3 className="edupilot-title">EduPilot AI</h3>
            <span className="edupilot-subtitle">Your learning assistant</span>
          </div>
        </div>

        <div className="drawer-header-actions">
          <button
            type="button"
            className={`read-screen-pill-btn ${isReadingScreen ? "loading" : ""}`}
            onClick={onReadScreen}
            title="Read current screen and explain it with AI"
          >
            <span className="screen-icon">🖥️</span>
            <span>{isReadingScreen ? "Reading..." : "Read screen"}</span>
          </button>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Close Assistant"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="drawer-body">
        {/* Default Welcome Card */}
        <div className="drawer-welcome-bubble">
          <div className="bubble-icon">🤖</div>
          <div className="bubble-content">
            <p>
              Hi! I can explain this page, summarize your notes, and guide you through your courses. 😊
            </p>
            <span className="bubble-timestamp">Just now</span>
          </div>
        </div>

        {/* Starter Suggestion Chips */}
        {messages.length === 0 && !streamingAnswer && (
          <div className="drawer-suggestions">
            <span className="suggestions-label">Try asking me:</span>
            <div className="chips-col">
              {starterChips.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  className="starter-chip-btn"
                  onClick={() => onSendMessage(chip.prompt)}
                >
                  <span className="chip-icon">{chip.icon}</span>
                  <span className="chip-text">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="drawer-messages-list">
          {messages.map((m, idx) => (
            <div key={idx} className={`drawer-msg-wrapper ${m.sender === "user" ? "user-row" : "bot-row"}`}>
              {m.sender === "bot" && (
                <div className="msg-avatar-bot">🤖</div>
              )}
              <div className={`drawer-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
                {m.sender === "user" ? (
                  <p className="user-msg-text">{m.text}</p>
                ) : (
                  <div className="bot-markdown-wrapper">
                    <MarkdownMessage text={m.text} />
                    {onReadAloud && (
                      <button
                        type="button"
                        className="read-aloud-action-btn"
                        onClick={() => onReadAloud(m.text)}
                        title="Read aloud"
                      >
                        🔊 {isSpeaking ? "Speaking..." : "Read aloud"}
                      </button>
                    )}
                  </div>
                )}
                {m.timestamp && <span className="drawer-msg-time">{m.timestamp}</span>}
              </div>
            </div>
          ))}

          {/* Real-time Streaming Response */}
          {isStreaming && (
            <div className="drawer-msg-wrapper bot-row">
              <div className="msg-avatar-bot">🤖</div>
              <div className="drawer-bubble bot-bubble streaming">
                <MarkdownMessage text={streamingAnswer || "Thinking..."} />
                <span className="streaming-cursor">▋</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Drawer Footer Input Bar */}
      <div className="drawer-footer">
        {/* Document Context Chip if uploaded */}
        {currentDoc && currentDoc.status === "ready" && (
          <div className="drawer-doc-context-chip">
            <span className="doc-icon">📎</span>
            <span className="doc-name">{currentDoc.filename} ({currentDoc.pages}p)</span>
            <span className="doc-badge">RAG Active</span>
          </div>
        )}

        <form className="drawer-input-form" onSubmit={handleSubmit}>
          {/* File Attachment Button */}
          <button
            type="button"
            className="drawer-icon-btn"
            onClick={onOpenFileUpload}
            title="Attach educational PDF/notes"
          >
            📎
          </button>

          {/* Text Input */}
          <input
            type="text"
            className="drawer-text-input"
            placeholder="Ask me anything or speak..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isStreaming}
          />

          {/* Voice Input Button */}
          {voiceSupported && (
            <button
              type="button"
              className={`drawer-icon-btn voice ${isListening ? "listening active" : ""}`}
              onClick={onToggleVoice}
              title={isListening ? "Listening... click to stop" : "Speak question"}
            >
              🎤
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            className="drawer-send-btn"
            disabled={!inputVal.trim() || isStreaming}
            title="Send"
          >
            ➤
          </button>
        </form>

        <div className="drawer-disclaimer">
          EduPilot AI can read this page and also help with your uploaded notes.
        </div>
      </div>
    </aside>
  );
}
