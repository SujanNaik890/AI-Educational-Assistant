import React, { useState } from "react";

export default function StudentDashboard({ onAskAgentAboutScreen, onSelectCourse, onQuickPrompt }) {
  const [tab, setTab] = useState("current"); // "current" | "completed"

  const courses = [
    {
      code: "B24EF0301",
      name: "Theory of Computation",
      topics: "10 Topics",
      tests: "3 Tests",
      assignments: "22 Assignments",
      grade: "A-",
      progress: 80,
      color: "#2563eb",
    },
    {
      code: "B24CS0304",
      name: "Cloud Based Data Administration",
      topics: "8 Topics",
      tests: "2 Tests",
      assignments: "8 Assignments",
      grade: "B+",
      progress: 50,
      color: "#0284c7",
    },
    {
      code: "B24CS0302",
      name: "Computer Networks",
      topics: "11 Topics",
      tests: "3 Tests",
      assignments: "8 Assignments",
      grade: "B",
      progress: 0,
      color: "#94a3b8",
    },
    {
      code: "B24CS0305",
      name: "AI Applications with Agent framework",
      topics: "4 Topics",
      tests: "0 Tests",
      assignments: "6 Assignments",
      grade: "A",
      progress: "In progress",
      color: "#3b82f6",
    },
    {
      code: "B24CS0303",
      name: "Machine Learning",
      topics: "10 Topics",
      tests: "3 Tests",
      assignments: "10 Assignments",
      grade: "A-",
      progress: 75,
      color: "#3b82f6",
    },
  ];

  const todaySessions = [
    { time: "09:00 AM", course: "Computer Networks", type: "Lecture", teacher: "Dr. R. Sharma" },
    { time: "11:00 AM", course: "Machine Learning", type: "Lab", teacher: "Prof. A. Kumar" },
    { time: "02:00 PM", course: "Theory of Computation", type: "Tutorial", teacher: "Dr. S. Mehta" },
  ];

  const announcements = [
    {
      id: 1,
      title: "NPTEL Exam Schedule Released",
      desc: "Check your exam center and timing.",
      time: "2 hours ago",
      icon: "📢",
      color: "#ef4444",
      bg: "#fef2f2",
    },
    {
      id: 2,
      title: "Assignment 3 - Machine Learning",
      desc: "Last date: 28 Oct 2026",
      time: "1 day ago",
      icon: "📝",
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      id: 3,
      title: "Workshop on AI Agents",
      desc: "Register now for the hands-on session.",
      time: "2 days ago",
      icon: "🎓",
      color: "#10b981",
      bg: "#ecfdf5",
    },
  ];

  const openCourses = [
    { name: "Placement Readiness Assessment Test (PSA)", topics: "5 Topics", tests: "0 Tests", assignments: "0 Assignments", progress: 0 },
    { name: "Generative AI Fundamentals", topics: "12 Topics", tests: "2 Tests", assignments: "5 Assignments", progress: 20 },
    { name: "Data Structures with Java", topics: "15 Topics", tests: "3 Tests", assignments: "8 Assignments", progress: 40 },
    { name: "Web Development Bootcamp", topics: "10 Topics", tests: "2 Tests", assignments: "6 Assignments", progress: 10 },
  ];

  return (
    <div className="portal-dashboard" id="screen-portal-content">
      {/* Top Banner */}
      <div className="portal-banner">
        <div className="banner-left">
          <div className="campus-thumb">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
              alt="Campus"
              className="banner-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="banner-welcome">
            <span className="banner-sub">Welcome back,</span>
            <h1 className="banner-name">
              Sujan Gajanan Naik <span className="hand-wave">👋</span>
            </h1>
            <p className="banner-tagline">Keep learning, keep growing!</p>
          </div>
        </div>

        <div className="banner-quote-box">
          <span className="quote-mark">“</span>
          <p className="quote-text">Small steps every day lead to big results.</p>
          <span className="quote-mark right">”</span>
        </div>
      </div>

      {/* Main Grid: Left Courses Table + Right Sessions & Announcements */}
      <div className="portal-grid">
        {/* Left Column: Semester Courses */}
        <section className="portal-card courses-card">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="title-bar" />
              <h2 className="card-title">My Semester Courses</h2>
            </div>
            <div className="semester-dates">
              <span>Start Date: <strong>25-Aug-2026</strong></span>
              <span className="date-sep">|</span>
              <span>End Date: <strong>15-Jan-2027</strong></span>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-pills">
            <button
              type="button"
              className={`pill-btn ${tab === "current" ? "active" : ""}`}
              onClick={() => setTab("current")}
            >
              Current Semester
            </button>
            <button
              type="button"
              className={`pill-btn ${tab === "completed" ? "active" : ""}`}
              onClick={() => setTab("completed")}
            >
              Completed Semester
            </button>
          </div>

          {/* Courses Table */}
          <div className="table-responsive">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Total Topics</th>
                  <th>Tests</th>
                  <th>Assignments</th>
                  <th>Grade</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <div className="course-name-cell">
                        <button
                          type="button"
                          className="course-link-btn"
                          onClick={() => onSelectCourse && onSelectCourse(c.name)}
                        >
                          {c.name}
                        </button>
                        <span className="course-code-badge">{c.code}</span>
                      </div>
                    </td>
                    <td>{c.topics}</td>
                    <td><strong>{c.tests}</strong></td>
                    <td>{c.assignments}</td>
                    <td>
                      <span className={`grade-pill grade-${c.grade.replace(/[^a-zA-Z]/g, "").toLowerCase()}`}>
                        {c.grade}
                      </span>
                    </td>
                    <td>
                      {typeof c.progress === "number" ? (
                        <div className="progress-radial-badge" style={{ borderColor: c.color }}>
                          <span>{c.progress}%</span>
                        </div>
                      ) : (
                        <span className="in-progress-tag">{c.progress}</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="circle-action-btn"
                        title={`View ${c.name}`}
                        onClick={() =>
                          onQuickPrompt &&
                          onQuickPrompt(`Can you explain the syllabus and important concepts of ${c.name}?`)
                        }
                      >
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-footer-row">
            <button
              type="button"
              className="view-more-link"
              onClick={() =>
                onQuickPrompt &&
                onQuickPrompt("Summarize all my 5 enrolled semester courses and tell me what needs urgent attention.")
              }
            >
              View more →
            </button>
          </div>
        </section>

        {/* Right Column: Sessions & Announcements */}
        <div className="portal-side-col">
          {/* Today's Sessions */}
          <section className="portal-card sessions-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <span className="title-icon">📅</span>
                <h3 className="card-title">Student Today's Sessions</h3>
              </div>
              <button
                type="button"
                className="view-more-link"
                onClick={() =>
                  onQuickPrompt &&
                  onQuickPrompt("What are my scheduled sessions for today and how should I prepare for them?")
                }
              >
                View Timetable →
              </button>
            </div>

            <div className="table-responsive">
              <table className="portal-table mini-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Course Name</th>
                    <th>Type</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySessions.map((s, idx) => (
                    <tr key={idx}>
                      <td className="time-cell">{s.time}</td>
                      <td className="bold-cell">{s.course}</td>
                      <td>
                        <span className="session-type-pill">{s.type}</span>
                      </td>
                      <td className="teacher-cell">
                        <span className="online-dot" /> {s.teacher}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Announcements */}
          <section className="portal-card announcements-card">
            <div className="card-header-row">
              <div className="card-title-group">
                <span className="title-icon">🔔</span>
                <h3 className="card-title">Announcements</h3>
              </div>
              <button
                type="button"
                className="view-more-link"
                onClick={() =>
                  onQuickPrompt &&
                  onQuickPrompt("Explain all current campus announcements and upcoming deadlines.")
                }
              >
                View All →
              </button>
            </div>

            <div className="announcements-list">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="announcement-item"
                  onClick={() =>
                    onQuickPrompt &&
                    onQuickPrompt(`Tell me more details about the announcement: "${a.title}" - ${a.desc}`)
                  }
                >
                  <div className="announcement-icon-bubble" style={{ background: a.bg, color: a.color }}>
                    {a.icon}
                  </div>
                  <div className="announcement-info">
                    <h4 className="announcement-title">{a.title}</h4>
                    <p className="announcement-desc">{a.desc}</p>
                  </div>
                  <span className="announcement-time">{a.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Section: Open Courses */}
      <section className="portal-card open-courses-card">
        <div className="card-title-group">
          <span className="title-bar" />
          <h2 className="card-title">Open Courses</h2>
        </div>

        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Topics</th>
                <th>Tests</th>
                <th>Assignments</th>
                <th>Course Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {openCourses.map((oc, i) => (
                <tr key={i}>
                  <td className="open-course-title">{oc.name}</td>
                  <td>{oc.topics}</td>
                  <td>{oc.tests}</td>
                  <td>{oc.assignments}</td>
                  <td>
                    <div className="progress-radial-badge small">
                      <span>{oc.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="enroll-btn"
                      onClick={() =>
                        onQuickPrompt &&
                        onQuickPrompt(`Give me an introduction to '${oc.name}', its curriculum, and key benefits.`)
                      }
                    >
                      Enroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
