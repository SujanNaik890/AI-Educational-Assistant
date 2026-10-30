import React, { useState } from "react";
import MCQPractice from "./MCQPractice.jsx";
import { AgentsIcon, DocumentIcon } from "./Icons.jsx";

export default function AgentsView({ currentDoc, onStartChatWithPrompt }) {
  const [selectedAgent, setSelectedAgent] = useState("mcq");

  const agents = [
    {
      id: "mcq",
      name: "MCQ Quiz Master",
      role: "Exam Preparation & Instant Evaluation",
      description:
        "Generates 5 exam-style multiple choice questions grounded strictly in your uploaded textbook with detailed explanations and instant grading.",
      badge: "Active",
      color: "purple",
    },
    {
      id: "tutor",
      name: "Socratic Concept Tutor",
      role: "Guided Interactive Learning",
      description:
        "Teaches step-by-step without giving away answers immediately, asking guiding questions to deepen your conceptual understanding.",
      badge: "Available",
      color: "blue",
      prompt: "Act as a patient Socratic tutor. Guide me through the fundamental laws and concepts of the uploaded textbook topic.",
    },
    {
      id: "summary",
      name: "Revision & Summary Agent",
      role: "High-Yield Notes Generator",
      description:
        "Extracts core formulas, definitions, key theorems, and high-yield examination takeaways from each chapter.",
      badge: "Available",
      color: "orange",
      prompt: "Extract all key definitions, formulas, and high-yield examination points from the current textbook chapter in structured bullet points.",
    },
  ];

  return (
    <div className="agents-view-container">
      <div className="view-header-row">
        <div>
          <h2 className="view-title">Specialized AI Agents</h2>
          <p className="view-subtitle">
            Deploy specialized agentic workflows for targeted educational mastery
          </p>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="agents-grid">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`agent-card ${selectedAgent === agent.id ? "selected" : ""} agent-${agent.color}`}
            onClick={() => {
              setSelectedAgent(agent.id);
              if (agent.prompt && onStartChatWithPrompt) {
                onStartChatWithPrompt(agent.prompt);
              }
            }}
          >
            <div className="agent-card-top">
              <span className="agent-badge">{agent.badge}</span>
              <span className="agent-role">{agent.role}</span>
            </div>
            <h3 className="agent-name">{agent.name}</h3>
            <p className="agent-desc">{agent.description}</p>
            <button
              type="button"
              className="agent-launch-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAgent(agent.id);
                if (agent.prompt && onStartChatWithPrompt) {
                  onStartChatWithPrompt(agent.prompt);
                }
              }}
            >
              {agent.id === "mcq" ? "Open Quiz Mode" : "Launch in Chat"}
            </button>
          </div>
        ))}
      </div>

      {/* Active Agent Panel */}
      <div className="agent-workspace">
        {selectedAgent === "mcq" && (
          <div className="mcq-agent-wrapper">
            <MCQPractice currentDoc={currentDoc} />
          </div>
        )}
      </div>
    </div>
  );
}
