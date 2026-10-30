import React, { useState } from "react";
import { SettingsIcon, CloseIcon, CheckIcon } from "./Icons.jsx";

export default function SettingsModal({
  isOpen,
  onClose,
  userName,
  onUpdateUserName,
  speechRate,
  onUpdateSpeechRate,
  autoReadAloud,
  onUpdateAutoReadAloud,
  health,
}) {
  const [name, setName] = useState(userName);
  const [rate, setRate] = useState(speechRate);
  const [autoRead, setAutoRead] = useState(autoReadAloud);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUserName(name);
    onUpdateSpeechRate(Number(rate));
    onUpdateAutoReadAloud(autoRead);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card settings-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon-badge">
              <SettingsIcon size={20} />
            </span>
            <div>
              <h2 className="modal-title">Settings &amp; Preferences</h2>
              <p className="modal-subtitle">Customize your AI Assistant and Voice</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="settings-body">
          {/* User Profile */}
          <div className="settings-section">
            <h3 className="section-heading">User Profile</h3>
            <div className="form-group">
              <label htmlFor="user-name-input">Display Name</label>
              <input
                id="user-name-input"
                type="text"
                className="text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sujan Naik"
              />
            </div>
          </div>

          {/* Voice Chat Settings */}
          <div className="settings-section">
            <h3 className="section-heading">Voice Chat &amp; Audio</h3>
            <div className="setting-toggle-row">
              <div>
                <span className="setting-toggle-label">Auto Read Answers Aloud</span>
                <p className="setting-toggle-desc">
                  Automatically speak AI responses using browser text-to-speech
                </p>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={autoRead}
                  onChange={(e) => setAutoRead(e.target.checked)}
                />
                <span className="switch-slider" />
              </label>
            </div>

            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Speech Speed: {rate}x</label>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="range-slider"
              />
            </div>
          </div>

          {/* Provider Status & Setup */}
          <div className="settings-section">
            <h3 className="section-heading">AI Provider Information</h3>
            <div className="provider-info-box">
              <div className="info-row">
                <span className="info-label">Current Provider:</span>
                <span className="info-value font-mono">
                  {health?.ai_provider?.provider || "ollama"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Active Model:</span>
                <span className="info-value font-mono">
                  {health?.ai_provider?.model || "llama3.2:3b"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status:</span>
                <span
                  className={`status-pill ${
                    health?.ai_provider?.healthy ? "ok" : "warn"
                  }`}
                >
                  {health?.ai_provider?.healthy ? "Connected" : "Provider Offline"}
                </span>
              </div>
            </div>

            <div className="provider-help-callout">
              <p>
                <strong>To use Ollama locally:</strong> Install from{" "}
                <a
                  href="https://ollama.com/download"
                  target="_blank"
                  rel="noreferrer"
                >
                  ollama.com
                </a>{" "}
                and run <code>ollama pull llama3.2:3b</code> in your terminal.
              </p>
              <p style={{ marginTop: "6px" }}>
                <strong>Or use Groq (Fast Cloud):</strong> Set{" "}
                <code>$env:LLM_PROVIDER="groq"</code> and{" "}
                <code>$env:GROQ_API_KEY="your_key"</code> before starting the backend.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            {saved ? (
              <>
                <CheckIcon size={16} /> Saved!
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
