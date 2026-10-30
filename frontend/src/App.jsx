import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar.jsx";
import TopNav from "./components/TopNav.jsx";
import ChatArea from "./components/ChatArea.jsx";
import ChatInput from "./components/ChatInput.jsx";
import AgentsView from "./components/AgentsView.jsx";
import WorkflowsView from "./components/WorkflowsView.jsx";
import HistoryView from "./components/HistoryView.jsx";
import FileUploadModal from "./components/FileUploadModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import { useVoice } from "./hooks/useVoice.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8008";

export default function App() {
  const [activeNav, setActiveNav] = useState("chat"); // "chat" | "agents" | "workflows" | "history"
  const [agentMode, setAgentMode] = useState(true);
  const [ragEnabled, setRagEnabled] = useState(true);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [health, setHealth] = useState(null);

  // User Profile
  const [userName, setUserName] = useState("Sujan Naik");
  const [userInitials, setUserInitials] = useState("SG");

  // Voice & Audio
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoReadAloud, setAutoReadAloud] = useState(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [historyList, setHistoryList] = useState([]);

  const abortControllerRef = useRef(null);

  // Voice Hook
  const {
    isListening,
    isSpeaking,
    speechSupported,
    volumeLevel,
    toggleListening,
    speakText,
    stopSpeaking,
  } = useVoice({
    onTranscript: (text, isFinal) => {
      // If final, send or let user review
      if (isFinal) {
        handleSendMessage(text);
      }
    },
  });

  const fetchStatus = async () => {
    try {
      const [docRes, healthRes] = await Promise.all([
        axios.get(`${API_BASE}/current-document`),
        axios.get(`${API_BASE}/health`),
      ]);
      setCurrentDoc(docRes.data);
      setHealth(healthRes.data);
    } catch (err) {
      console.error("Error fetching system status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleUpdateUserName = (newName) => {
    setUserName(newName);
    const parts = newName.trim().split(" ");
    if (parts.length >= 2) {
      setUserInitials((parts[0][0] + parts[1][0]).toUpperCase());
    } else if (newName.length > 0) {
      setUserInitials(newName.slice(0, 2).toUpperCase());
    }
  };

  // Chat Stream Handler
  const handleSendMessage = async (text, options = {}) => {
    const q = text.trim();
    if (!q) return;
    const useDocument =
      options.forceRag || ragEnabled || currentDoc?.status === "ready";

    // No longer block chat when no document is uploaded.
    // The backend handles both modes: RAG (with document) and direct chat (without).

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingAnswer("");

    let currentMeta = {
      primary_page: null,
      confidence_pct: null,
      source_match_pct: null,
      sources: [],
    };
    let accumulatedText = "";

    try {
      const response = await fetch(`${API_BASE}/ask/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          rag_enabled: useDocument,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No readable response stream received from backend.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const processEvent = (eventText) => {
        const lines = eventText.split("\n");
        const dataLines = lines
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).replace(/^ /, ""))
          .join("\n");

        if (!dataLines) return;

        try {
          const payload = JSON.parse(dataLines);
          if (payload.type === "meta") {
            currentMeta = {
              primary_page: payload.primary_page,
              confidence_pct: payload.confidence_pct,
              source_match_pct: payload.source_match_pct,
              sources: payload.sources || [],
            };
          } else if (payload.type === "token") {
            accumulatedText += payload.token;
            setStreamingAnswer(accumulatedText);
          } else if (payload.type === "error") {
            accumulatedText += `\n[Note: ${payload.message}]`;
            setStreamingAnswer(accumulatedText);
          }
        } catch (_) {}
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const ev of events) {
          processEvent(ev);
        }
      }

      if (buffer.trim()) {
        processEvent(buffer);
      }

      const finalText = accumulatedText.trim() || "No response generated.";

      const aiMsg = {
        id: Date.now() + 1,
        sender: "agent",
        text: finalText,
        meta: currentMeta,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Add to History
      setHistoryList((prev) => [
        {
          query: q,
          snippet: finalText.slice(0, 100) + "...",
          timestamp: new Date().toLocaleDateString() + " " + userMsg.timestamp,
        },
        ...prev,
      ]);

      // Auto Read Aloud if enabled
      if (autoReadAloud) {
        speakText(finalText, { rate: speechRate });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        const errorAiMsg = {
          id: Date.now() + 2,
          sender: "agent",
          text: `⚠️ Could not complete generation: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorAiMsg]);
      }
    } finally {
      setIsStreaming(false);
      setStreamingAnswer("");
    }
  };

  const handleDocUpdated = (newDocInfo) => {
    setCurrentDoc(newDocInfo);
    setRagEnabled(true);
    setActiveNav("chat");
    if (newDocInfo?.status === "ready" && newDocInfo?.filename) {
      handleSendMessage(
        `Read the uploaded file "${newDocInfo.filename}" thoroughly and give a detailed explanation of the whole document. Cover its purpose, structure, main topics, key concepts, and how a student should study it. Then keep answering questions in this same chat.`,
        { forceRag: true }
      );
    }
  };

  const handlePromptClick = (prompt, action) => {
    if (action === "mcq") {
      setActiveNav("agents");
      return;
    }
    handleSendMessage(prompt);
  };

  const handleQuickAction = (action) => {
    if (action === "mcq") {
      setActiveNav("agents");
    } else if (action === "summarize") {
      handleSendMessage(
        "Summarize the key principles and concepts from this textbook in concise bullet points."
      );
    }
  };

  return (
    <div className="agent-app-shell">
      {/* Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userName={userName}
        userInitials={userInitials}
      />

      {/* Main Workspace Area */}
      <div className="agent-workspace-container">
        {/* Top Bar with Agent Mode & Document Status */}
        <TopNav
          agentMode={agentMode}
          onToggleAgentMode={setAgentMode}
          currentDoc={currentDoc}
          health={health}
          onOpenFileUpload={() => setIsUploadOpen(true)}
        />

        {/* Dynamic View Body */}
        <main className="agent-main-content">
          {activeNav === "chat" && (
            <div className="chat-layout-wrapper">
              {/* Messages / Welcome View */}
              <ChatArea
                messages={messages}
                isStreaming={isStreaming}
                streamingAnswer={streamingAnswer}
                currentDoc={currentDoc}
                onPromptClick={handlePromptClick}
                onSpeak={(text) => speakText(text, { rate: speechRate })}
                onStopSpeak={stopSpeaking}
                isSpeaking={isSpeaking}
                userInitials={userInitials}
              />

              {/* Bottom Floating Input Bar */}
              <ChatInput
                onSendMessage={handleSendMessage}
                onOpenFileUpload={() => setIsUploadOpen(true)}
                onQuickAction={handleQuickAction}
                currentDoc={currentDoc}
                ragEnabled={ragEnabled}
                onToggleRag={() => setRagEnabled((prev) => !prev)}
                isListening={isListening}
                onToggleVoice={toggleListening}
                voiceSupported={speechSupported}
                volumeLevel={volumeLevel}
                disabled={isStreaming}
              />
            </div>
          )}

          {activeNav === "agents" && (
            <AgentsView
              currentDoc={currentDoc}
              onStartChatWithPrompt={(prompt) => {
                setActiveNav("chat");
                handleSendMessage(prompt);
              }}
            />
          )}

          {activeNav === "workflows" && (
            <WorkflowsView
              currentDoc={currentDoc}
              onExecuteWorkflow={(prompt, action) => {
                if (action === "mcq") {
                  setActiveNav("agents");
                } else {
                  setActiveNav("chat");
                  handleSendMessage(prompt);
                }
              }}
            />
          )}

          {activeNav === "history" && (
            <HistoryView
              history={historyList}
              onSelectSession={(item) => {
                setActiveNav("chat");
                handleSendMessage(item.query);
              }}
              onClearHistory={() => setHistoryList([])}
            />
          )}
        </main>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentDoc={currentDoc}
        onDocUpdated={handleDocUpdated}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        onUpdateUserName={handleUpdateUserName}
        speechRate={speechRate}
        onUpdateSpeechRate={setSpeechRate}
        autoReadAloud={autoReadAloud}
        onUpdateAutoReadAloud={setAutoReadAloud}
        health={health}
      />
    </div>
  );
}
