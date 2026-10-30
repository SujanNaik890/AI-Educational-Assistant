import React from "react";

export default function RevaSidebar({ activeItem = "home", onSelectItem }) {
  const navItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "courses", label: "My Courses", icon: "📚" },
    { id: "assignments", label: "Assignments", icon: "📝" },
    { id: "exams", label: "Exams", icon: "📋" },
    { id: "timetable", label: "Timetable", icon: "📅" },
    { id: "results", label: "Results", icon: "📊" },
    { id: "library", label: "Library", icon: "📖" },
    { id: "announcements", label: "Announcements", icon: "📢" },
  ];

  const bottomItems = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "help", label: "Help", icon: "❓" },
  ];

  return (
    <aside className="reva-sidebar" aria-label="University Navigation">
      <div className="reva-nav-list">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`reva-nav-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectItem && onSelectItem(item.id)}
            >
              <span className="reva-item-icon">{item.icon}</span>
              <span className="reva-item-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="reva-nav-bottom">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="reva-nav-item bottom"
            onClick={() => onSelectItem && onSelectItem(item.id)}
          >
            <span className="reva-item-icon">{item.icon}</span>
            <span className="reva-item-label">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
