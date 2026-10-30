import React from "react";

function renderInline(text) {
  if (!text) return [];
  // Clean unusual non-standard symbols and non-breaking spaces
  const sanitized = text
    .replace(/\u202f/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/Ø/g, "•")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");

  const parts = [];
  const pattern = /(\*\*[^*]+?\*\*|`[^`]+?`|\[[^\]]+\]\([^)]+\)|\[Source\s+\d+[^\]]*\])/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(sanitized)) !== null) {
    if (match.index > lastIndex) {
      parts.push(sanitized.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      parts.push(
        <code key={key++} className="inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[Source")) {
      parts.push(
        <span key={key++} className="source-citation-badge">
          {token}
        </span>
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      parts.push(
        <span key={key++} className="source-ref">
          {linkMatch ? linkMatch[1] : token}
        </span>
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < sanitized.length) {
    parts.push(sanitized.slice(lastIndex));
  }
  return parts;
}

function parseMarkdownTable(tableLines, keyOffset) {
  if (tableLines.length < 2) return null;

  const parseRow = (line) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

  const headerCells = parseRow(tableLines[0]);
  // Check if second line is markdown separator: |---|---|
  const isSeparator = /^\|?(\s*:?-+:?\s*\|?)+$/.test(tableLines[1].trim());
  const bodyRows = (isSeparator ? tableLines.slice(2) : tableLines.slice(1)).map(parseRow);

  return (
    <div key={`table-wrap-${keyOffset}`} className="table-responsive md-table-wrapper">
      <table className="gpt-styled-table">
        <thead>
          <tr>
            {headerCells.map((h, i) => (
              <th key={i}>{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MarkdownBlock({ text }) {
  if (!text) return null;
  const clean = text
    .replace(/\r\n/g, "\n")
    .replace(/\u202f/g, " ")
    .replace(/\u00a0/g, " ");

  const lines = clean.split("\n");
  const blocks = [];

  let currentList = null;
  let currentListType = null;
  let currentTable = null;

  const flushList = () => {
    if (!currentList) return;
    const Tag = currentListType === "ol" ? "ol" : "ul";
    blocks.push(
      <Tag key={`list-${blocks.length}`} className="md-list gpt-list">
        {currentList.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    currentList = null;
    currentListType = null;
  };

  const flushTable = () => {
    if (!currentTable) return;
    const tableElem = parseMarkdownTable(currentTable, blocks.length);
    if (tableElem) {
      blocks.push(tableElem);
    }
    currentTable = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check if line is part of a markdown table (starts and contains |)
    if (line.startsWith("|") && line.endsWith("|") && line.includes("|")) {
      flushList();
      if (!currentTable) currentTable = [];
      currentTable.push(line);
      continue;
    } else {
      flushTable();
    }

    // Headings: #, ##, ###, ####
    const heading = rawLine.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const Tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      blocks.push(
        <Tag key={`h-${blocks.length}`} className={`md-heading gpt-heading h${level}`}>
          {renderInline(heading[2])}
        </Tag>
      );
      continue;
    }

    // Unordered List item: - or * or •
    const ul = rawLine.match(/^(\s*)[-*•]\s+(.*)$/);
    if (ul) {
      if (currentListType !== "ul") {
        flushList();
        currentList = [];
        currentListType = "ul";
      }
      currentList.push(ul[2]);
      continue;
    }

    // Ordered List item: 1. or 2)
    const ol = rawLine.match(/^(\s*)\d+[.)]\s+(.*)$/);
    if (ol) {
      if (currentListType !== "ol") {
        flushList();
        currentList = [];
        currentListType = "ol";
      }
      currentList.push(ol[2]);
      continue;
    }

    // Empty blank line
    if (!line) {
      flushList();
      continue;
    }

    // Regular text paragraph
    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="md-paragraph gpt-paragraph">
        {renderInline(rawLine)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className="gpt-clean-markdown-body">{blocks}</div>;
}

export default function MarkdownMessage({ text, content }) {
  const rawText = (text || content || "").trim();
  if (!rawText) return null;

  return (
    <div className="gpt-official-message-card">
      <MarkdownBlock text={rawText} />
    </div>
  );
}
