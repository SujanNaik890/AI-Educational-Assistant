import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import RevaTopNav from "./components/RevaTopNav.jsx";
import RevaSidebar from "./components/RevaSidebar.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";
import CourseDetailView from "./components/CourseDetailView.jsx";
import GenericSectionView from "./components/GenericSectionView.jsx";
import EduPilotDrawer from "./components/EduPilotDrawer.jsx";
import FileUploadModal from "./components/FileUploadModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import { useVoice } from "./hooks/useVoice.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8008";

export default function App() {
  const [activeSidebarItem, setActiveSidebarItem] = useState("home");
  const [selectedCourse, setSelectedCourse] = useState(null); // When user clicks a course
  const [isEduPilotOpen, setIsEduPilotOpen] = useState(true);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [health, setHealth] = useState(null);

  // Student Profile
  const [userName, setUserName] = useState("Sujan Gajanan Naik");
  const [userRole, setUserRole] = useState("III Semester, CSE");

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Chat State inside EduPilot AI
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingAnswer, setStreamingAnswer] = useState("");
  const [isReadingScreen, setIsReadingScreen] = useState(false);

  // Voice
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoReadAloud, setAutoReadAloud] = useState(false);

  const abortControllerRef = useRef(null);

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
      if (isFinal) {
        handleSendMessage(text);
      }
    },
  });

  // Fetch initial health and current active doc
  const fetchStatus = async () => {
    try {
      const [docRes, healthRes] = await Promise.all([
        axios.get(`${API_BASE}/current-document`),
        axios.get(`${API_BASE}/health`),
      ]);
      setCurrentDoc(docRes.data);
      setHealth(healthRes.data);
    } catch (err) {
      console.error("Status fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Send message to FastAPI Backend (Groq with Ollama fallback)
  const handleSendMessage = async (text) => {
    if (!text || !text.trim() || isStreaming) return;
    const query = text.trim();

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { sender: "user", text: query, timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingAnswer("");

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch(`${API_BASE}/ask/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          rag_enabled: !!(currentDoc && currentDoc.status === "ready"),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullBotAnswer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const rawData = line.slice(6).trim();
            if (!rawData) continue;

            try {
              const parsed = JSON.parse(rawData);
              if (parsed.type === "token" && parsed.token) {
                fullBotAnswer += parsed.token;
                setStreamingAnswer(fullBotAnswer);
              } else if (parsed.type === "done") {
                // Completed
              }
            } catch (jsonErr) {
              // Ignore non-json SSE frames
            }
          }
        }
      }

      const botMsg = {
        sender: "bot",
        text: fullBotAnswer || "I've reviewed your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setStreamingAnswer("");

      if (autoReadAloud && fullBotAnswer) {
        speakText(fullBotAnswer, speechRate);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Ask error:", err);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `⚠️ Error generating response: ${err.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Screen Reading Feature: Extracts visible text and asks EduPilot AI
  const handleReadScreen = () => {
    setIsReadingScreen(true);
    try {
      let screenText = "";
      const courseElem = document.querySelector(".course-detail-page");
      const portalElem = document.getElementById("screen-portal-content");
      const genericElem = document.querySelector(".portal-generic-view");

      if (courseElem) {
        screenText = courseElem.innerText;
      } else if (portalElem) {
        screenText = portalElem.innerText;
      } else if (genericElem) {
        screenText = genericElem.innerText;
      } else {
        screenText = document.body.innerText;
      }

      const cleanText = screenText.replace(/\s+/g, " ").trim().slice(0, 3500);

      const prompt = `[READ SCREEN CONTEXT]
Here is the visible content currently displayed on my university screen:
"""
${cleanText}
"""
Please explain what is on this screen in simple, clear terms:
1. Identify the main subject or portal section being viewed.
2. Summarize the key topics, syllabus units, or deadlines shown.
3. Highlight high-scoring exam points or urgent actions for a student.`;

      handleSendMessage(prompt);
    } catch (e) {
      console.error("Read screen error:", e);
    } finally {
      setTimeout(() => setIsReadingScreen(false), 800);
    }
  };

  const handleDocUpdated = (newDoc) => {
    setCurrentDoc(newDoc);
    fetchStatus();
  };

  const handleCourseClick = (courseName) => {
    setSelectedCourse(courseName);
    setIsEduPilotOpen(true);
    handleSendMessage(`I've opened the course page for "${courseName}". Give me a clear summary of its syllabus, units, and tips to score well in exams.`);
  };

  return (
    <div className="reva-app-container">
      {/* Top University Navigation Header */}
      <RevaTopNav
        userName={userName}
        userRole={userRole}
        isEduPilotOpen={isEduPilotOpen}
        onToggleEduPilot={() => setIsEduPilotOpen((prev) => !prev)}
      />

      {/* Main Workspace: Sidebar + Dashboard/Course View + EduPilot AI Drawer */}
      <div className="reva-workspace-body">
        {/* Left Sidebar */}
        <RevaSidebar
          activeItem={activeSidebarItem}
          onSelectItem={(item) => {
            setActiveSidebarItem(item);
            setSelectedCourse(null); // Reset detail view when moving between tabs
            if (item === "profile" || item === "help") {
              setIsSettingsOpen(true);
            }
          }}
        />

        {/* Center Canvas */}
        <main className={`reva-content-canvas ${isEduPilotOpen ? "drawer-active" : "full-width"}`}>
          {selectedCourse ? (
            <CourseDetailView
              courseName={selectedCourse}
              onBack={() => setSelectedCourse(null)}
              onAskAgent={(prompt) => {
                setIsEduPilotOpen(true);
                handleSendMessage(prompt);
              }}
            />
          ) : activeSidebarItem === "home" ? (
            <StudentDashboard
              onSelectCourse={handleCourseClick}
              onQuickPrompt={(prompt) => {
                setIsEduPilotOpen(true);
                handleSendMessage(prompt);
              }}
            />
          ) : (
            <GenericSectionView
              activeTab={activeSidebarItem}
              onSelectCourse={handleCourseClick}
              onAskAgent={(prompt) => {
                setIsEduPilotOpen(true);
                handleSendMessage(prompt);
              }}
            />
          )}
        </main>

        {/* Right Side Drawer: EduPilot AI Assistant */}
        <EduPilotDrawer
          isOpen={isEduPilotOpen}
          onClose={() => setIsEduPilotOpen(false)}
          messages={messages}
          isStreaming={isStreaming}
          streamingAnswer={streamingAnswer}
          onSendMessage={handleSendMessage}
          onReadScreen={handleReadScreen}
          isReadingScreen={isReadingScreen}
          onOpenFileUpload={() => setIsUploadOpen(true)}
          currentDoc={currentDoc}
          onReadAloud={(text) => speakText(text, speechRate)}
          isSpeaking={isSpeaking}
          onToggleVoice={toggleListening}
          isListening={isListening}
          voiceSupported={speechSupported}
        />
      </div>

      {/* Educational File Upload Modal (PDF, TXT, CSV) */}
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
        onUpdateUserName={setUserName}
        speechRate={speechRate}
        onUpdateSpeechRate={setSpeechRate}
        autoReadAloud={autoReadAloud}
        onUpdateAutoReadAloud={setAutoReadAloud}
        health={health}
      />
    </div>
  );
}
