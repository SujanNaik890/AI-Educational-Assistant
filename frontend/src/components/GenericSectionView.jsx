import React from "react";

export default function GenericSectionView({ activeTab, onSelectCourse, onAskAgent }) {
  const sections = {
    courses: {
      title: "My Courses & Enrolled Subjects",
      subtitle: "Explore registered semester courses, syllabi, study materials, and faculty notes.",
      items: [
        { name: "Theory of Computation", code: "B24EF0301", credits: "4", progress: "80%", teacher: "Dr. S. Mehta" },
        { name: "Cloud Based Data Administration", code: "B24CS0304", credits: "3", progress: "50%", teacher: "Dr. R. Sharma" },
        { name: "Computer Networks", code: "B24CS0302", credits: "4", progress: "0%", teacher: "Prof. P. Desai" },
        { name: "AI Applications with Agent framework", code: "B24CS0305", credits: "4", progress: "In Progress", teacher: "Prof. A. Kumar" },
        { name: "Machine Learning", code: "B24CS0303", credits: "4", progress: "75%", teacher: "Dr. K. Verma" },
      ],
    },
    assignments: {
      title: "Course Assignments & Project Submissions",
      subtitle: "Track your active, pending, and evaluated submissions.",
      items: [
        { name: "Assignment 3 - Machine Learning", course: "Machine Learning", dueDate: "28 Oct 2026", status: "Submitted (Pending Grading)", grade: "Pending" },
        { name: "TOC Lab Assignment: DFA Minimization", course: "Theory of Computation", dueDate: "05 Nov 2026", status: "In Progress", grade: "Not Submitted" },
        { name: "Cloud DB Migration Project", course: "Cloud Based Data Admin", dueDate: "12 Nov 2026", status: "Open", grade: "-" },
        { name: "Socket Programming in C/Python", course: "Computer Networks", dueDate: "18 Nov 2026", status: "Upcoming", grade: "-" },
      ],
    },
    exams: {
      title: "Examination Schedule & Hall Tickets",
      subtitle: "Upcoming Mid-Term and Semester End Examinations (SEE).",
      items: [
        { name: "Mid-Term Examination 1", date: "15-Nov-2026", time: "10:00 AM - 12:30 PM", hall: "Block 4, Hall 302", status: "Hall Ticket Available" },
        { name: "NPTEL National Certification Exam", date: "22-Nov-2026", time: "09:00 AM - 12:00 PM", hall: "TCS iON Center Bangalore", status: "Admit Card Ready" },
        { name: "Semester End Lab Exams", date: "02-Jan-2027", time: "02:00 PM - 05:00 PM", hall: "CSE Advanced AI Lab", status: "Scheduled" },
      ],
    },
    timetable: {
      title: "Weekly Academic Timetable (Semester V - Section A)",
      subtitle: "Lectures, hands-on lab sessions, and tutorial hours.",
      items: [
        { day: "Monday", time: "09:00 AM - 11:00 AM", subject: "Theory of Computation", room: "CR-402", faculty: "Dr. S. Mehta" },
        { day: "Monday", time: "11:30 AM - 01:30 PM", subject: "Machine Learning Lab", room: "Lab 3", faculty: "Prof. A. Kumar" },
        { day: "Tuesday", time: "10:00 AM - 12:00 PM", subject: "Computer Networks", room: "CR-405", faculty: "Dr. R. Sharma" },
        { day: "Wednesday", time: "02:00 PM - 04:00 PM", subject: "AI Applications with Agents", room: "CR-201", faculty: "Prof. A. Kumar" },
        { day: "Thursday", time: "09:00 AM - 11:00 AM", subject: "Cloud Based Data Admin", room: "CR-308", faculty: "Dr. R. Sharma" },
      ],
    },
    results: {
      title: "Semester Grade Cards & Cumulative Performance",
      subtitle: "SGPA, CGPA, and course credit breakdown.",
      stats: { cgpa: "8.84", sgpaPrev: "9.10", totalCredits: "88 Earned", attendance: "91%" },
      items: [
        { sem: "Semester IV (Even Sem 2026)", sgpa: "9.10", credits: "22", status: "Passed (First Class with Distinction)" },
        { sem: "Semester III (Odd Sem 2025)", sgpa: "8.75", credits: "22", status: "Passed (First Class with Distinction)" },
        { sem: "Semester II (Even Sem 2025)", sgpa: "8.80", credits: "22", status: "Passed (First Class)" },
        { sem: "Semester I (Odd Sem 2024)", sgpa: "8.70", credits: "22", status: "Passed (First Class)" },
      ],
    },
    library: {
      title: "Digital University Library & Research Repositories",
      subtitle: "Access e-textbooks, IEEE journals, and course reserve notes.",
      items: [
        { title: "Introduction to Automata Theory, Languages and Computation", author: "Hopcroft, Motwani, Ullman", type: "E-Book (Available)", callNo: "QA267 .H56" },
        { title: "Computer Networks - A Top-Down Approach", author: "Kurose & Ross (7th Ed)", type: "Reserved (PDF Download)", callNo: "TK5105.5 .K87" },
        { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", type: "High Demand", callNo: "QA76.9.D3 K54" },
        { title: "Pattern Recognition and Machine Learning", author: "Christopher Bishop", type: "Available in Library", callNo: "Q327 .B57" },
      ],
    },
    announcements: {
      title: "Campus Notice Board & Official Circulars",
      subtitle: "Stay updated with college events, hackathons, and placement drives.",
      items: [
        { title: "NPTEL Semester End Examination Centers Released", date: "Today", tag: "Exams", priority: "High", body: "Students registered for NPTEL courses must download the hall ticket and verify center allocation." },
        { title: "Workshop on AI Agents & ReAct Frameworks", date: "Yesterday", tag: "Workshop", priority: "Medium", body: "Department of CSE is hosting a 2-day hands-on bootcamp on LangGraph and Groq APIs on Saturday." },
        { title: "Campus Placement Registration: Batch 2027", date: "2 days ago", tag: "Placements", priority: "Urgent", body: "All students eligible for placement drives must update their resume on the portal before Friday 5:00 PM." },
      ],
    },
  };

  const curr = sections[activeTab] || sections.courses;

  return (
    <div className="portal-generic-view">
      {/* Section Header */}
      <div className="section-top-card">
        <h2 className="section-view-title">{curr.title}</h2>
        <p className="section-view-subtitle">{curr.subtitle}</p>
      </div>

      {/* Results Stats if on results tab */}
      {curr.stats && (
        <div className="results-stat-bar">
          <div className="stat-pill"><span className="stat-num">{curr.stats.cgpa}</span><span className="stat-label">Cumulative CGPA</span></div>
          <div className="stat-pill"><span className="stat-num">{curr.stats.sgpaPrev}</span><span className="stat-label">Last SGPA</span></div>
          <div className="stat-pill"><span className="stat-num">{curr.stats.attendance}</span><span className="stat-label">Total Attendance</span></div>
          <div className="stat-pill"><span className="stat-num">{curr.stats.totalCredits}</span><span className="stat-label">Completed Credits</span></div>
        </div>
      )}

      {/* Content Table / Cards */}
      <div className="portal-card">
        <div className="table-responsive">
          <table className="portal-table">
            <thead>
              <tr>
                {activeTab === "courses" && (
                  <><th>Course Name</th><th>Code</th><th>Credits</th><th>Progress</th><th>Faculty</th><th>Action</th></>
                )}
                {activeTab === "assignments" && (
                  <><th>Assignment Title</th><th>Course</th><th>Deadline</th><th>Status</th><th>Action</th></>
                )}
                {activeTab === "exams" && (
                  <><th>Examination</th><th>Date & Time</th><th>Hall Location</th><th>Status</th><th>Action</th></>
                )}
                {activeTab === "timetable" && (
                  <><th>Day</th><th>Time Slot</th><th>Subject</th><th>Room</th><th>Faculty</th><th>Action</th></>
                )}
                {activeTab === "results" && (
                  <><th>Semester</th><th>SGPA</th><th>Credits</th><th>Academic Status</th><th>Action</th></>
                )}
                {activeTab === "library" && (
                  <><th>Title</th><th>Author</th><th>Type / Status</th><th>Call No.</th><th>Action</th></>
                )}
                {activeTab === "announcements" && (
                  <><th>Notice</th><th>Category</th><th>Date</th><th>Action</th></>
                )}
              </tr>
            </thead>
            <tbody>
              {curr.items.map((item, idx) => (
                <tr key={idx}>
                  {activeTab === "courses" && (
                    <>
                      <td>
                        <button
                          type="button"
                          className="course-link-btn"
                          onClick={() => onSelectCourse && onSelectCourse(item.name)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td><code>{item.code}</code></td>
                      <td>{item.credits}</td>
                      <td><span className="grade-pill grade-a">{item.progress}</span></td>
                      <td>{item.teacher}</td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() => onSelectCourse && onSelectCourse(item.name)}
                        >
                          Open Course →
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "assignments" && (
                    <>
                      <td className="bold-cell">{item.name}</td>
                      <td>{item.course}</td>
                      <td className="time-cell">{item.dueDate}</td>
                      <td><span className="session-type-pill">{item.status}</span></td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() =>
                            onAskAgent &&
                            onAskAgent(`Help me solve and guide me through "${item.name}" for course ${item.course}.`)
                          }
                        >
                          🤖 Get Help
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "exams" && (
                    <>
                      <td className="bold-cell">{item.name}</td>
                      <td>{item.date} • {item.time}</td>
                      <td>{item.hall}</td>
                      <td><span className="in-progress-tag">{item.status}</span></td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() =>
                            onAskAgent &&
                            onAskAgent(`Generate a personalized 2-week revision plan for "${item.name}".`)
                          }
                        >
                          Revise with AI
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "timetable" && (
                    <>
                      <td className="bold-cell">{item.day}</td>
                      <td className="time-cell">{item.time}</td>
                      <td>
                        <button
                          type="button"
                          className="course-link-btn"
                          onClick={() => onSelectCourse && onSelectCourse(item.subject)}
                        >
                          {item.subject}
                        </button>
                      </td>
                      <td>{item.room}</td>
                      <td>{item.faculty}</td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() =>
                            onAskAgent &&
                            onAskAgent(`What are the key concepts I should review before the ${item.subject} lecture with ${item.faculty}?`)
                          }
                        >
                          Prepare Notes
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "results" && (
                    <>
                      <td className="bold-cell">{item.sem}</td>
                      <td><strong>{item.sgpa}</strong></td>
                      <td>{item.credits}</td>
                      <td><span className="session-type-pill">{item.status}</span></td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() =>
                            onAskAgent &&
                            onAskAgent(`Analyze my academic performance in ${item.sem} with SGPA ${item.sgpa} and give improvement tips.`)
                          }
                        >
                          Analyze
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "library" && (
                    <>
                      <td className="bold-cell">{item.title}</td>
                      <td>{item.author}</td>
                      <td><span className="session-type-pill">{item.type}</span></td>
                      <td><code>{item.callNo}</code></td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() =>
                            onAskAgent &&
                            onAskAgent(`Summarize the core concepts covered in the book "${item.title}" by ${item.author}.`)
                          }
                        >
                          Summarize Book
                        </button>
                      </td>
                    </>
                  )}

                  {activeTab === "announcements" && (
                    <>
                      <td>
                        <div className="course-name-cell">
                          <span className="bold-cell">{item.title}</span>
                          <span className="course-code-badge">{item.body}</span>
                        </div>
                      </td>
                      <td><span className="session-type-pill">{item.tag}</span></td>
                      <td className="time-cell">{item.date}</td>
                      <td>
                        <button
                          type="button"
                          className="enroll-btn"
                          onClick={() =>
                            onAskAgent &&
                            onAskAgent(`Explain more details about this notice: "${item.title}". What action do I need to take?`)
                          }
                        >
                          Explain
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
