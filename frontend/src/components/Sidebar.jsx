import React from "react";
import {
  RobotLogo,
  ChatIcon,
  AgentsIcon,
  WorkflowsIcon,
  HistoryIcon,
  SettingsIcon,
  ChevronDownIcon,
} from "./Icons.jsx";

export default function Sidebar({
  activeNav,
  onSelectNav,
  onOpenSettings,
  userName = "Sujan Naik",
  userInitials = "SG",
}) {
  const navItems = [
    { id: "chat", label: "Chat", icon: ChatIcon },
    { id: "agents", label: "Agents", icon: AgentsIcon },
    { id: "workflows", label: "Workflows", icon: WorkflowsIcon },
    { id: "history", label: "History", icon: HistoryIcon },
  ];

  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-container">
          <RobotLogo size={32} />
        </div>
        <span className="brand-title">My AI Agent</span>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectNav(item.id)}
            >
              <span className="nav-icon">
                <Icon size={20} />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="nav-item settings-item"
          onClick={onOpenSettings}
        >
          <span className="nav-icon">
            <SettingsIcon size={20} />
          </span>
          <span className="nav-label">Settings</span>
        </button>

        <div className="user-profile-badge" onClick={onOpenSettings}>
          <div className="user-avatar">{userInitials}</div>
          <span className="user-name">{userName}</span>
          <span className="user-chevron">
            <ChevronDownIcon size={16} />
          </span>
        </div>
      </div>
    </aside>
  );
}
