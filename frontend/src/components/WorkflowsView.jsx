import React from "react";
import { WorkflowsIcon, LightningIcon, CodeIcon, DocumentIcon } from "./Icons.jsx";

export default function WorkflowsView({ onExecuteWorkflow, currentDoc }) {
  const workflows = [
    {
      id: "exam-mcq",
      title: "5 Exam Questions Diagnostic",
      desc: "Retrieve topic context from textbook and test yourself with 5 high-yield MCQs.",
      icon: "📝",
      action: "mcq",
    },
    {
      id: "chapter-summary",
      title: "Chapter Synthesis & Summary",
      desc: "Produce a structured chapter summary with learning objectives, core laws, and takeaways.",
      icon: "📚",
      prompt: "Synthesize the main ideas of the current document into a structured overview with key sections and takeaways.",
    },
    {
      id: "formula-sheet",
      title: "Formula & Equation Cheat Sheet",
      desc: "Extract every formula, variable definition, and unit from the active PDF.",
      icon: "⚡",
      prompt: "Extract all mathematical and scientific formulas from this textbook, defining each variable, standard unit, and condition of validity.",
    },
    {
      id: "code-simulation",
      title: "Interactive Code Simulator",
      desc: "Generate Python / JavaScript simulation models for the textbook's scientific processes.",
      icon: "💻",
      prompt: "Write a complete, runnable Python script that simulates the physical or mathematical phenomenon discussed in this textbook.",
    },
  ];

  return (
    <div className="workflows-view-container">
      <div className="view-header-row">
        <div>
          <h2 className="view-title">Automated Workflows</h2>
          <p className="view-subtitle">
            One-click automated pipelines for high-efficiency study and exam preparation
          </p>
        </div>
      </div>

      <div className="workflows-grid">
        {workflows.map((wf) => (
          <div key={wf.id} className="workflow-card">
            <div className="workflow-icon">{wf.icon}</div>
            <h3 className="workflow-card-title">{wf.title}</h3>
            <p className="workflow-card-desc">{wf.desc}</p>
            <button
              type="button"
              className="btn btn-secondary workflow-run-btn"
              onClick={() => onExecuteWorkflow(wf.prompt, wf.action)}
            >
              Run Workflow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
