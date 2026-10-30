import React from "react";

export default function RevaTopNav({
  onToggleEduPilot,
  isEduPilotOpen,
  userName = "Sujan Gajanan Naik",
  userRole = "III Semester, CSE",
  userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  onSearch,
}) {
  return (
    <header className="reva-top-header">
      {/* Left: University Logo */}
      <div className="reva-brand-section">
        <div className="reva-logo-wrap">
          <svg className="reva-spark-icon" viewBox="0 0 24 24" width="28" height="28" fill="none">
            <path
              d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
              fill="#f97316"
            />
          </svg>
          <div className="reva-text-logo">
            <span className="reva-title">REVA</span>
            <span className="reva-subtitle">UNIVERSITY</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="reva-search-wrap">
        <span className="reva-search-icon">🔍</span>
        <input
          type="text"
          className="reva-search-input"
          placeholder="Search for courses, assignments, or resources..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      {/* Right: EduPilot AI button, Notification Bell, User Profile */}
      <div className="reva-header-right">
        {/* EduPilot AI Pill Button */}
        <button
          type="button"
          className={`edupilot-nav-pill ${isEduPilotOpen ? "active" : ""}`}
          onClick={onToggleEduPilot}
          title="Toggle EduPilot AI Assistant"
        >
          <span className="pill-robot-icon">🤖</span>
          <span className="pill-label">EduPilot AI</span>
        </button>

        {/* Notification Bell */}
        <div className="reva-notification-wrap" title="Notifications">
          <span className="bell-icon">🔔</span>
          <span className="bell-badge">3</span>
        </div>

        {/* User Profile */}
        <div className="reva-user-profile">
          <img
            src={userAvatar}
            alt={userName}
            className="user-avatar-img"
            onError={(e) => {
              e.target.src = "https://ui-avatars.com/api/?name=Sujan+Naik&background=0D8ABC&color=fff";
            }}
          />
          <div className="user-details">
            <span className="user-full-name">{userName}</span>
            <span className="user-semester">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
