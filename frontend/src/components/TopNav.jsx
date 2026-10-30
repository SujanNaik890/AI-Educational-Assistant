import React from "react";
import { LightningIcon, DocumentIcon, PaperclipIcon } from "./Icons.jsx";

export default function TopNav({
  agentMode,
  onToggleAgentMode,
  currentDoc,
  health,
  onOpenFileUpload,
}) {
  const isDocReady = currentDoc && currentDoc.status === "ready";
  const isHealthy = health?.ai_provider?.healthy || health?.status === "healthy";

  return (
    <header className="top-nav-bar">
      <div className="top-nav-left">
        {/* Active Document Indicator Chip */}
        <div
          className={`doc-pill ${isDocReady ? "ready" : "empty"}`}
          onClick={onOpenFileUpload}
          title={isDocReady ? "Click to view or change PDF" : "Click to upload educational PDF"}
        >
          <span className="doc-icon">
            <DocumentIcon size={16} />
          </span>
          <span className="doc-name">
            {isDocReady ? currentDoc.filename : "No PDF attached"}
          </span>
          {isDocReady && currentDoc.pages && (
            <span className="doc-pages">{currentDoc.pages} pages</span>
          )}
          <button
            type="button"
            className="doc-attach-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFileUpload();
            }}
          >
            <PaperclipIcon size={14} />
            <span>{isDocReady ? "Change" : "Attach PDF"}</span>
          </button>
        </div>
      </div>

      <div className="top-nav-right">
        {/* Provider Status Indicator */}
        <div className="provider-status-badge">
          <span className={`status-dot ${isHealthy ? "online" : "offline"}`} />
          <span className="status-text">
            {health?.ai_provider?.provider
              ? `${health.ai_provider.provider.toUpperCase()} (${health.ai_provider.model || "ready"})`
              : "AI System"}
          </span>
        </div>

        {/* Agent Mode Toggle (From Screenshot) */}
        <div className="agent-mode-control">
          <span className="agent-mode-icon">
            <LightningIcon size={16} />
          </span>
          <span className="agent-mode-text">Agent Mode</span>
          <label className="switch-toggle" aria-label="Toggle Agent Mode">
            <input
              type="checkbox"
              checked={agentMode}
              onChange={(e) => onToggleAgentMode(e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </header>
  );
}
