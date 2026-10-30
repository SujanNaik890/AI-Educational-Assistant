import React from "react";
import { HistoryIcon, ChatIcon } from "./Icons.jsx";

export default function HistoryView({
  history,
  onSelectSession,
  onClearHistory,
}) {
  return (
    <div className="history-view-container">
      <div className="view-header-row">
        <div>
          <h2 className="view-title">Interaction History</h2>
          <p className="view-subtitle">
            Review your past questions, conversations, and AI study sessions
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary danger-text"
            onClick={onClearHistory}
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty-state">
          <HistoryIcon size={48} className="empty-icon" />
          <h3>No Conversation History Yet</h3>
          <p>Questions and agent sessions will appear here as you chat.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="history-item-card"
              onClick={() => onSelectSession(item)}
            >
              <div className="history-item-icon">
                <ChatIcon size={18} />
              </div>
              <div className="history-item-body">
                <h4 className="history-item-query">{item.query}</h4>
                <p className="history-item-snippet">{item.snippet}</p>
                <span className="history-item-date">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
