import React, { useState, useRef, useEffect } from "react";
import {
  ChatIcon,
  CodeIcon,
  TaskIcon,
  LightningIcon,
  SpeakerIcon,
  SpeakerMuteIcon,
  CopyIcon,
  CheckIcon,
  DocumentIcon,
  ChevronDownIcon,
} from "./Icons.jsx";
import MarkdownMessage from "./MarkdownMessage.jsx";

export default function ChatArea({
  messages,
  isStreaming,
  streamingAnswer,
  currentDoc,
  onPromptClick,
  onSpeak,
  onStopSpeak,
  isSpeaking,
  userInitials = "SG",
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(null);
  const [expandedSourceIndex, setExpandedSourceIndex] = useState(null);
  const viewportRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll screen down as we chat and as output streams
  useEffect(() => {
    const scrollToBottom = () => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    };
    requestAnimationFrame(scrollToBottom);
  }, [messages, streamingAnswer]);

  const promptCards = [
    {
      id: "ask",
      title: "Ask Anything",
      icon: ChatIcon,
      colorClass: "card-purple",
      prompt: "Explain the main concept introduced in this textbook and its real-world applications.",
    },
    {
      id: "code",
      title: "Write Code",
      icon: CodeIcon,
      colorClass: "card-blue",
      prompt: "Write a clean Python simulation with comments explaining the key equations or formulas from the document.",
    },
    {
      id: "task",
      title: "Run a Task",
      icon: TaskIcon,
      colorClass: "card-indigo",
      action: "mcq",
      prompt: "Generate an exam quiz of 5 multiple-choice questions with answer explanations.",
    },
    {
      id: "automate",
      title: "Automate Work",
      icon: LightningIcon,
      colorClass: "card-orange",
      prompt: "Summarize this entire educational material into a high-yield study sheet with key formulas and exam takeaways.",
    },
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleToggleSpeak = (text, index) => {
    if (isSpeaking && activeSpeechIndex === index) {
      onStopSpeak();
      setActiveSpeechIndex(null);
    } else {
      setActiveSpeechIndex(index);
      onSpeak(text);
    }
  };

  const hasMessages = messages.length > 0 || isStreaming;

  return (
    <div className="chat-messages-viewport" ref={viewportRef}>
      {/* If empty conversation: Show Reference UI Hero */}
      {!hasMessages && (
        <div className="chat-hero-container">
          {/* 3D Robot Avatar Illustration */}
          <div className="hero-mascot-wrapper">
            <img
              src="/robot_avatar.png"
              alt="AI Agent Mascot"
              className="hero-robot-img"
            />
          </div>

          {/* Headline and Subtitle */}
          <h1 className="hero-headline">AI Agent</h1>
          <p className="hero-subtitle">
            Your personal AI assistant to help you think, build and automate.
          </p>

          {/* 4 Quick Action Cards */}
          <div className="hero-prompt-cards">
            {promptCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  className={`prompt-card ${card.colorClass}`}
                  onClick={() => onPromptClick(card.prompt, card.action)}
                >
                  <div className="card-icon-bubble">
                    <Icon size={24} />
                  </div>
                  <span className="card-label">{card.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* When messages exist: Render Message Stream */}
      {hasMessages && (
        <div className="messages-stream-list">
          {messages.map((msg, index) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={index}
                className={`message-row ${isUser ? "user-row" : "agent-row"}`}
              >
                {/* Avatar */}
                <div className="message-avatar">
                  {isUser ? (
                    <div className="user-avatar-circle">{userInitials}</div>
                  ) : (
                    <div className="agent-avatar-circle">
                      <img
                        src="/robot_avatar.png"
                        alt="Agent"
                        className="agent-mini-img"
                      />
                    </div>
                  )}
                </div>

                {/* Message Bubble Content */}
                <div className="message-content-wrapper">
                  <div className="message-header">
                    <span className="message-sender-name">
                      {isUser ? "You" : "AI Agent"}
                    </span>
                    {msg.timestamp && (
                      <span className="message-time">{msg.timestamp}</span>
                    )}
                  </div>

                  <div className="message-bubble-body">
                    <div className="message-text-content">
                      {isUser ? msg.text : <MarkdownMessage text={msg.text} />}
                    </div>

                    {/* Sources Citations / RAG Meta */}
                    {msg.meta && (msg.meta.primary_page != null || msg.meta.sources?.length > 0) && (
                      <div className="sources-citation-card">
                        <div
                          className="sources-header-bar"
                          onClick={() =>
                            setExpandedSourceIndex(
                              expandedSourceIndex === index ? null : index
                            )
                          }
                        >
                          <div className="sources-title-group">
                            <DocumentIcon size={14} />
                            <span className="sources-title">
                              Textbook Source: Page {msg.meta.primary_page ?? "1"}
                            </span>
                            {msg.meta.confidence_pct != null && (
                              <span className="confidence-pill">
                                {msg.meta.confidence_pct}% Match
                              </span>
                            )}
                          </div>
                          <span
                            className={`chevron-toggle ${
                              expandedSourceIndex === index ? "rotated" : ""
                            }`}
                          >
                            <ChevronDownIcon size={14} />
                          </span>
                        </div>

                        {expandedSourceIndex === index && msg.meta.sources && (
                          <div className="sources-details-list">
                            {msg.meta.sources.map((src, sIdx) => (
                              <div key={sIdx} className="source-snippet-item">
                                <div className="source-snippet-header">
                                  <span>Chunk #{src.chunk_index + 1} (Page {src.page_num})</span>
                                  <span>Score: {Math.round((src.similarity_score || 0) * 100)}%</span>
                                </div>
                                <p className="source-snippet-text">{src.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions Bar (Speak, Copy) */}
                    {!isUser && (
                      <div className="message-actions-toolbar">
                        <button
                          type="button"
                          className="msg-action-btn"
                          onClick={() => handleToggleSpeak(msg.text, index)}
                          title="Read aloud"
                        >
                          {isSpeaking && activeSpeechIndex === index ? (
                            <>
                              <SpeakerMuteIcon size={15} />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <SpeakerIcon size={15} />
                              <span>Listen</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="msg-action-btn"
                          onClick={() => handleCopy(msg.text, index)}
                          title="Copy response"
                        >
                          {copiedIndex === index ? (
                            <>
                              <CheckIcon size={15} />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <CopyIcon size={15} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Active Streaming Response */}
          {isStreaming && (
            <div className="message-row agent-row streaming-row">
              <div className="message-avatar">
                <div className="agent-avatar-circle">
                  <img
                    src="/robot_avatar.png"
                    alt="Agent"
                    className="agent-mini-img"
                  />
                </div>
              </div>
              <div className="message-content-wrapper">
                <div className="message-header">
                  <span className="message-sender-name">AI Agent</span>
                  <span className="thinking-indicator">Generating response...</span>
                </div>
                <div className="message-bubble-body">
                  <div className="message-text-content">
                    {streamingAnswer ? (
                      <MarkdownMessage text={streamingAnswer} />
                    ) : (
                      <span className="cursor-blink">
                        Reading the document and preparing your answer...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Scroll anchor to keep output in view */}
          <div ref={messagesEndRef} style={{ height: "1px", width: "100%" }} />
        </div>
      )}
    </div>
  );
}
