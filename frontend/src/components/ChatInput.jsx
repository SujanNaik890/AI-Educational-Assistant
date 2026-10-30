import React, { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  PaperclipIcon,
  GlobeIcon,
  MicIcon,
  SendIcon,
  CloseIcon,
  DocumentIcon,
} from "./Icons.jsx";

export default function ChatInput({
  onSendMessage,
  onOpenFileUpload,
  onQuickAction,
  currentDoc,
  ragEnabled,
  onToggleRag,
  isListening,
  onToggleVoice,
  voiceSupported,
  volumeLevel,
  disabled,
}) {
  const [text, setText] = useState("");
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const textareaRef = useRef(null);
  const plusMenuRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [text]);

  // Close plus menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-wrapper">
      {/* Attached Document Pill (if active) */}
      {currentDoc && currentDoc.status === "ready" && (
        <div className="input-attached-doc-badge">
          <DocumentIcon size={14} />
          <span className="badge-text">{currentDoc.filename}</span>
          <span className="badge-tag">Reading file + chat</span>
        </div>
      )}

      {/* Listening Wave Overlay when Voice Recording is active */}
      {isListening && (
        <div className="voice-recording-banner">
          <div className="pulse-indicator" />
          <div className="audio-waveforms">
            <span style={{ height: `${12 + volumeLevel * 20}px` }} />
            <span style={{ height: `${8 + volumeLevel * 30}px` }} />
            <span style={{ height: `${16 + volumeLevel * 25}px` }} />
            <span style={{ height: `${10 + volumeLevel * 32}px` }} />
            <span style={{ height: `${14 + volumeLevel * 18}px` }} />
          </div>
          <span className="voice-text">Listening... Speak now</span>
          <button
            type="button"
            className="voice-cancel-btn"
            onClick={onToggleVoice}
            title="Stop listening"
          >
            Done
          </button>
        </div>
      )}

      {/* Main Floating Rounded Card */}
      <div className={`chat-input-card ${isListening ? "listening-mode" : ""}`}>
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          rows={1}
          placeholder={
            currentDoc?.status === "ready"
              ? "Ask about this document or anything else..."
              : "Message your AI agent..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {/* Bottom Action Bar (Icons Left and Right) */}
        <div className="chat-input-actions-row">
          {/* Left Actions */}
          <div className="left-input-tools" ref={plusMenuRef}>
            {/* Plus / Add Menu */}
            <div className="plus-btn-wrapper">
              <button
                type="button"
                className={`icon-tool-btn ${showPlusMenu ? "active" : ""}`}
                onClick={() => setShowPlusMenu((prev) => !prev)}
                title="Add options"
                aria-label="Add options"
              >
                <PlusIcon size={20} />
              </button>

              {showPlusMenu && (
                <div className="plus-dropdown-menu">
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setShowPlusMenu(false);
                      onOpenFileUpload();
                    }}
                  >
                    <PaperclipIcon size={16} />
                    <span>Upload PDF Document</span>
                  </button>
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setShowPlusMenu(false);
                      onQuickAction("mcq");
                    }}
                  >
                    <span className="menu-icon-tag">📝</span>
                    <span>Practice 5 MCQs</span>
                  </button>
                  <button
                    type="button"
                    className="dropdown-menu-item"
                    onClick={() => {
                      setShowPlusMenu(false);
                      onQuickAction("summarize");
                    }}
                  >
                    <span className="menu-icon-tag">⚡</span>
                    <span>Summarize Knowledge</span>
                  </button>
                </div>
              )}
            </div>

            {/* Paperclip: Attach File */}
            <button
              type="button"
              className="icon-tool-btn"
              onClick={onOpenFileUpload}
              title="Add PDF or learning material"
              aria-label="Add files"
            >
              <PaperclipIcon size={20} />
            </button>

            {/* Globe: Knowledge RAG / Search */}
            <button
              type="button"
              className={`icon-tool-btn ${ragEnabled ? "highlight" : ""}`}
              onClick={onToggleRag}
              title={
                ragEnabled
                  ? "Textbook RAG Search is Active"
                  : "General Knowledge Mode"
              }
              aria-label="Toggle document knowledge"
            >
              <GlobeIcon size={20} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="right-input-tools">
            {/* Microphone Voice Button */}
            <button
              type="button"
              className={`icon-tool-btn mic-btn ${isListening ? "active-mic" : ""}`}
              onClick={onToggleVoice}
              title={
                !voiceSupported
                  ? "Speech recognition not supported in this browser"
                  : isListening
                  ? "Listening... Click to stop"
                  : "Start Voice Chat"
              }
              aria-label="Voice input"
            >
              <MicIcon size={20} />
            </button>

            {/* Purple Send Button */}
            <button
              type="button"
              className="send-message-btn"
              onClick={handleSubmit}
              disabled={!text.trim() || disabled}
              title="Send message"
              aria-label="Send message"
            >
              <SendIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
