import React, { useState } from "react";

export default function CourseDetailView({ courseName = "Theory of Computation", onBack, onAskAgent }) {
  const [activeSection, setActiveSection] = useState("course-overview");
  const [isGeneralOpen, setIsGeneralOpen] = useState(true);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);

  // Dynamic syllabus details based on course
  const courseDetails = {
    "Theory of Computation": {
      code: "B24EF0301",
      credits: "4 Credits",
      type: "Hard Core (HC)",
      semester: "V Semester",
      overview:
        "This course introduces the theoretical foundations of computer science through finite automata, regular expressions, formal languages, grammars, pushdown automata and Turing machines. Students develop a strong understanding of computational models that form the basis of compiler construction, programming language design, and automated protocol and formal verification.",
      objectives: [
        "Develop a fertile abstract base concerning computing machines and formal languages.",
        "Apply regular expressions for developing finite automata.",
        "Develop Context-Free Grammars for language representation.",
        "Understand computational models including Pushdown Automata and Turing Machines.",
      ],
      clos: [
        { id: "CO1", desc: "Explain automotive theory, alphabets, strings, languages, DFA and NFA." },
        { id: "CO2", desc: "Construct, analyze and minimize deterministic and non-deterministic finite automata." },
        { id: "CO3", desc: "Develop regular expressions and analyze languages using Pumping Lemma." },
        { id: "CO4", desc: "Design simplified Context-Free Grammars and convert them into CNF and GNF." },
        { id: "CO5", desc: "Construct and analyze Pushdown Automata and Turing Machines." },
        { id: "CO6", desc: "Apply NP-Hard & Decidability techniques for computational problem complexity analysis." },
      ],
      units: [
        {
          num: "UNIT 1",
          title: "Introduction to Finite Automata",
          summary: "Automata theory, alphabets, strings, languages, deterministic and non-deterministic finite automata, regular transitions, equivalence and minimization of finite automata.",
          notes: "Lecture_01_DFA_NFA_Equivalence.pdf (34 pages)",
        },
        {
          num: "UNIT 2",
          title: "Regular Expressions & Regular Languages",
          summary: "Regular expressions, finite automata and regular expressions equivalence, regular properties and pumping lemma.",
          notes: "Lecture_02_Pumping_Lemma_Proofs.pdf (28 pages)",
        },
        {
          num: "UNIT 3",
          title: "Context Free Grammars",
          summary: "Context-free grammars, parse trees, ambiguity in grammars, derivation and left recursion, elimination of useless symbols, Chomsky Normal Form (CNF) and Greibach Normal Form (GNF).",
          notes: "Lecture_03_CFG_CNF_GNF_Design.pdf (42 pages)",
        },
        {
          num: "UNIT 4",
          title: "Pushdown Automata & Turing Machines",
          summary: "Pushdown automata, deterministic and non-deterministic PDA, Turing machine definitions, working principles, universal machines and computational models.",
          notes: "Lecture_04_Turing_Machines_Decidability.pdf (50 pages)",
        },
      ],
      textbooks: [
        "John E. Hopcroft, Rajeev Motwani, Jeffrey D. Ullman, 'Introduction to Automata Theory, Languages and Computation', 3rd Edition, Pearson Education.",
        "Peter Linz, 'An Introduction to Formal Languages and Automata', 6th Edition, Jones & Bartlett Publishers.",
      ],
    },
    "Cloud Based Data Administration": {
      code: "B24CS0304",
      credits: "3 Credits",
      type: "Professional Core (PC)",
      semester: "V Semester",
      overview:
        "Comprehensive architectural guide covering modern Cloud Data Infrastructure, Distributed Storage, AWS/Azure/GCP Database as a Service (DBaaS), Partitioning, High Availability and Disaster Recovery.",
      objectives: [
        "Understand cloud multi-region database deployment models.",
        "Deploy and monitor relational and NoSQL cloud data stores.",
        "Implement IAM security, automated replication, and cloud backup policies.",
      ],
      clos: [
        { id: "CO1", desc: "Analyze cloud virtualization and compute-storage decoupling." },
        { id: "CO2", desc: "Design high-throughput distributed database schemas." },
        { id: "CO3", desc: "Formulate automated failover, disaster recovery, and RPO/RTO strategies." },
      ],
      units: [
        { num: "UNIT 1", title: "Cloud Architecture & Storage Models", summary: "Blob storage, Block Storage, S3 buckets, distributed file systems and consistency models.", notes: "Cloud_Storage_Architecture.pdf" },
        { num: "UNIT 2", title: "Relational DBaaS & Sharding", summary: "Amazon RDS, Aurora global databases, Azure SQL, horizontal partitioning and read replicas.", notes: "DBaaS_Replication_Notes.pdf" },
        { num: "UNIT 3", title: "Distributed NoSQL & Caching", summary: "DynamoDB, Cassandra, Redis clusters, consistency levels and quorum reads/writes.", notes: "Distributed_NoSQL_Guide.pdf" },
        { num: "UNIT 4", title: "Cloud Security & Governance", summary: "KMS encryption, VPC peering, role-based access control (RBAC), SOC-2 compliance.", notes: "Cloud_Governance_Security.pdf" },
      ],
      textbooks: ["Anthony T. Velte, 'Cloud Computing: A Practical Approach', McGraw Hill.", "O'Reilly 'Designing Data-Intensive Applications' by Martin Kleppmann."],
    },
    "Computer Networks": {
      code: "B24CS0302",
      credits: "4 Credits",
      type: "Hard Core (HC)",
      semester: "V Semester",
      overview:
        "Deep exploration into the layered internet architecture: physical transmission, data link framing, IP routing algorithms, reliable transport protocols (TCP/UDP), socket programming and modern application layer protocols.",
      objectives: [
        "Master the OSI and TCP/IP protocol stacks.",
        "Analyze routing algorithms (OSPF, BGP, Distance Vector, Link State).",
        "Implement network client-server communications using socket APIs.",
      ],
      clos: [
        { id: "CO1", desc: "Explain network topologies, physical encoding, and framing protocols." },
        { id: "CO2", desc: "Compute shortest path routing and subnet CIDR masks." },
        { id: "CO3", desc: "Analyze TCP flow control, congestion window mechanisms, and 3-way handshake." },
      ],
      units: [
        { num: "UNIT 1", title: "Physical & Data Link Layers", summary: "Transmission media, packet switching vs circuit switching, CSMA/CD, sliding window protocols, CRC checksums.", notes: "CN_Unit1_Framing_FlowControl.pdf" },
        { num: "UNIT 2", title: "Network Layer & IP Addressing", summary: "IPv4/IPv6 headers, CIDR subnets, ARP/DHCP, Dijkstra's algorithm, Distance Vector and Link State routing.", notes: "CN_Unit2_Routing_Subnetting.pdf" },
        { num: "UNIT 3", title: "Transport Layer Protocols", summary: "UDP connectionless service, TCP segment structure, flow control, congestion control (Tahoe/Reno), SYN/ACK handshakes.", notes: "CN_Unit3_TCP_Congestion.pdf" },
        { num: "UNIT 4", title: "Application Layer & Security", summary: "DNS resolution, HTTP/1.1 vs HTTP/2 & 3, TLS encryption, firewalls and cryptographic handshakes.", notes: "CN_Unit4_DNS_HTTP_Security.pdf" },
      ],
      textbooks: ["Andrew S. Tanenbaum, 'Computer Networks', 5th Edition, Pearson.", "James F. Kurose, Keith W. Ross, 'Computer Networking: A Top-Down Approach'."],
    },
    "AI Applications with Agent framework": {
      code: "B24CS0305",
      credits: "4 Credits",
      type: "Professional Elective",
      semester: "V Semester",
      overview:
        "Advanced practical course covering Autonomous AI Agents, ReAct reasoning loops, Multi-Agent systems, Tool Use, LangChain/LangGraph, Memory hierarchies, Vector RAG pipelines, and Human-in-the-Loop workflows.",
      objectives: [
        "Design reasoning agents using Prompt Engineering and ReAct paradigms.",
        "Construct multi-agent teams with shared state and deterministic flow control.",
        "Implement production-grade RAG and tool integration pipelines.",
      ],
      clos: [
        { id: "CO1", desc: "Formulate prompt strategies, tool execution schemas, and JSON structured outputs." },
        { id: "CO2", desc: "Construct stateful LangGraph agent workflows with checkpointing." },
        { id: "CO3", desc: "Integrate vector search, semantic caching, and streaming LLM token pipelines." },
      ],
      units: [
        { num: "UNIT 1", title: "Foundations of AI Agents & LLM Function Calling", summary: "Prompt engineering, zero-shot/few-shot reasoning, structured tool invocation, OpenAI and Groq APIs.", notes: "Agents_Unit1_Function_Calling.pdf" },
        { num: "UNIT 2", title: "Retrieval-Augmented Generation (RAG) Architectures", summary: "Chunking strategies, embedding vectors, FAISS/Chroma, hybrid keyword-vector search, re-ranking.", notes: "Agents_Unit2_RAG_FAISS_Pipelines.pdf" },
        { num: "UNIT 3", title: "Multi-Agent Coordination & LangGraph", summary: "Hierarchical agent teams, supervisor patterns, graph state machines, cycle detection, memory buffers.", notes: "Agents_Unit3_LangGraph_Workflows.pdf" },
        { num: "UNIT 4", title: "Agent Evaluation, Guardrails & Production Deployment", summary: "Hallucination mitigation, latency profiling, agent guardrails, token streaming and UI integration.", notes: "Agents_Unit4_Production_Guardrails.pdf" },
      ],
      textbooks: ["Harrison Chase, 'Building LLM Powered Autonomous Agents'.", "Chip Huyen, 'Designing Machine Learning Systems', O'Reilly."],
    },
    "Machine Learning": {
      code: "B24CS0303",
      credits: "4 Credits",
      type: "Hard Core (HC)",
      semester: "V Semester",
      overview:
        "Theoretical rigor and hands-on algorithms: Supervised Learning (Linear Regression, Logistic Regression, SVM, Decision Trees, Random Forests), Unsupervised Learning (K-Means, PCA, GMM), and Neural Network fundamentals.",
      objectives: [
        "Formulate loss functions and gradient descent optimization.",
        "Evaluate classifiers using Confusion Matrix, ROC-AUC, and Cross-Validation.",
        "Implement dimensionality reduction and clustering models.",
      ],
      clos: [
        { id: "CO1", desc: "Derive mathematical formulations for regression and classification." },
        { id: "CO2", desc: "Apply regularization (L1 Lasso, L2 Ridge) to prevent overfitting." },
        { id: "CO3", desc: "Construct multi-layer perceptrons with backpropagation." },
      ],
      units: [
        { num: "UNIT 1", title: "Supervised Learning - Regression & Classification", summary: "Cost functions, Batch Gradient Descent, Logistic Regression, Softmax, Naive Bayes, Decision Trees.", notes: "ML_Unit1_Regression_Trees.pdf" },
        { num: "UNIT 2", title: "Ensemble Techniques & Support Vector Machines", summary: "Bagging, Boosting (AdaBoost, XGBoost), Random Forests, SVM maximal margin hyperplanes, Kernel tricks.", notes: "ML_Unit2_SVM_Ensemble.pdf" },
        { num: "UNIT 3", title: "Unsupervised Learning & Dimensionality Reduction", summary: "K-Means clustering, hierarchical clustering, Principal Component Analysis (PCA), Eigenvectors and SVD.", notes: "ML_Unit3_Clustering_PCA.pdf" },
        { num: "UNIT 4", title: "Introduction to Deep Learning & Neural Networks", summary: "Perceptron, Multi-Layer Perceptron (MLP), Activation functions (ReLU, Sigmoid), Backpropagation, Adam optimizer.", notes: "ML_Unit4_Neural_Networks_Backprop.pdf" },
      ],
      textbooks: ["Tom M. Mitchell, 'Machine Learning', McGraw Hill.", "Aurelien Geron, 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow'."],
    },
  };

  const curr = courseDetails[courseName] || courseDetails["Theory of Computation"];

  return (
    <div className="course-detail-page">
      {/* Top Breadcrumb & Back Bar */}
      <div className="course-detail-nav">
        <button type="button" className="back-to-dashboard-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="course-nav-crumbs">
          <span>Home</span>
          <span className="crumb-sep">/</span>
          <span>My Semester Courses</span>
          <span className="crumb-sep">/</span>
          <strong className="crumb-active">{courseName}</strong>
        </div>
      </div>

      {/* Accordion 1: General */}
      <div className="detail-accordion-card">
        <div
          className="accordion-header"
          onClick={() => setIsGeneralOpen((prev) => !prev)}
        >
          <div className="accordion-title-wrap">
            <span className={`accordion-arrow ${isGeneralOpen ? "open" : ""}`}>▼</span>
            <span className="accordion-title">General</span>
          </div>
          <span className="accordion-collapse-label">{isGeneralOpen ? "Collapse all" : "Expand all"}</span>
        </div>

        {isGeneralOpen && (
          <div className="accordion-body-content">
            <div className="announcement-row">
              <span className="row-icon">📢</span>
              <button
                type="button"
                className="link-btn-text"
                onClick={() =>
                  onAskAgent &&
                  onAskAgent(`What are the latest announcements for ${courseName}?`)
                }
              >
                Announcements
              </button>
            </div>
            <div className="announcement-row">
              <span className="row-icon">📋</span>
              <button
                type="button"
                className="link-btn-text"
                onClick={() =>
                  onAskAgent &&
                  onAskAgent(`What are the latest assignment updates and submission dates for ${courseName}?`)
                }
              >
                Assignments & Discussion Forum
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Accordion 2: Course Overview & Notes (Matches Screenshot 2) */}
      <div className="detail-accordion-card">
        <div
          className="accordion-header"
          onClick={() => setIsOverviewOpen((prev) => !prev)}
        >
          <div className="accordion-title-wrap">
            <span className={`accordion-arrow ${isOverviewOpen ? "open" : ""}`}>▼</span>
            <span className="accordion-title">Course overview</span>
          </div>
          <span className="accordion-collapse-label">{isOverviewOpen ? "Collapse all" : "Expand all"}</span>
        </div>

        {isOverviewOpen && (
          <div className="course-overview-canvas">
            {/* Header Banner */}
            <div className="course-blue-hero">
              <h1 className="hero-course-title">{courseName}</h1>
              <p className="hero-course-subtitle">
                Understanding the Mathematical Foundations of Computation, Automata, Formal Languages and Turing Machines
              </p>
            </div>

            {/* 4 Feature Badges */}
            <div className="course-meta-chips-row">
              <div className="meta-chip chip-code">
                <span className="chip-label">Course Code</span>
                <span className="chip-value">{curr.code}</span>
              </div>
              <div className="meta-chip chip-credits">
                <span className="chip-label">Credits</span>
                <span className="chip-value">{curr.credits}</span>
              </div>
              <div className="meta-chip chip-type">
                <span className="chip-label">Course Type</span>
                <span className="chip-value">{curr.type}</span>
              </div>
              <div className="meta-chip chip-sem">
                <span className="chip-label">Semester</span>
                <span className="chip-value">{curr.semester}</span>
              </div>
            </div>

            {/* Section: Course Overview */}
            <div className="detail-white-card">
              <div className="section-title-wrap">
                <span className="section-icon">📖</span>
                <h3 className="section-heading">Course Overview</h3>
              </div>
              <p className="section-body-text">{curr.overview}</p>
            </div>

            {/* Section: Course Objectives */}
            <div className="detail-white-card">
              <div className="section-title-wrap">
                <span className="section-icon">🎯</span>
                <h3 className="section-heading">Course Objectives</h3>
              </div>
              <ul className="bulleted-list">
                {curr.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Section: Course Learning Outcomes (CO Grid) */}
            <div className="detail-white-card">
              <div className="section-title-wrap">
                <span className="section-icon">🎓</span>
                <h3 className="section-heading">Course Learning Outcomes</h3>
              </div>
              <div className="clo-grid">
                {curr.clos.map((co) => (
                  <div key={co.id} className="clo-card">
                    <span className="clo-id">{co.id}</span>
                    <p className="clo-desc">{co.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Unit wise Course Contents & Lecture Notes */}
            <div className="detail-white-card">
              <div className="section-title-wrap">
                <span className="section-icon">📚</span>
                <h3 className="section-heading">Unit wise Course Contents & Lecture Notes</h3>
              </div>

              <div className="units-accordion-list">
                {curr.units.map((unit, idx) => (
                  <div key={idx} className="unit-item-box">
                    <div className="unit-header-line">
                      <div className="unit-title-group">
                        <span className="unit-tag">{unit.num}</span>
                        <h4 className="unit-name">{unit.title}</h4>
                      </div>
                      <button
                        type="button"
                        className="study-with-agent-btn"
                        onClick={() =>
                          onAskAgent &&
                          onAskAgent(`Please explain ${unit.num}: "${unit.title}" for ${courseName}. Give a clear summary, key theorems, and sample problems.`)
                        }
                      >
                        🤖 Explain with EduPilot
                      </button>
                    </div>

                    <p className="unit-summary-text">{unit.summary}</p>

                    {/* PDF Lecture Notes Attachment */}
                    <div className="unit-notes-attachment">
                      <span className="notes-icon">📄</span>
                      <span className="notes-title">{unit.notes}</span>
                      <button
                        type="button"
                        className="read-notes-btn"
                        onClick={() =>
                          onAskAgent &&
                          onAskAgent(`Summarize the lecture notes for ${unit.num}: ${unit.title} and highlight the highest-scoring exam topics.`)
                        }
                      >
                        Read & Summarize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Prescribed Text Books */}
            <div className="detail-white-card">
              <div className="section-title-wrap">
                <span className="section-icon">📗</span>
                <h3 className="section-heading">Prescribed Text Books</h3>
              </div>
              <ol className="textbook-list">
                {curr.textbooks.map((tb, i) => (
                  <li key={i}>{tb}</li>
                ))}
              </ol>
            </div>

            {/* Bottom Footer Banner */}
            <div className="course-blue-footer-banner">
              <h3>Welcome to {courseName}</h3>
              <p>Explore • Learn • Analyze • Innovate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
