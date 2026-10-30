import React from "react";

function renderInline(text) {
  const parts = [];
  const pattern = /(\*\*[^*]+?\*\*|`[^`]+?`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
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

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function splitDualSections(text) {
  const docSplit = text.split(/^#{1,3}\s*📄[^\n]*\n?/m);
  const hasDoc = docSplit.length > 1;
  const afterDoc = hasDoc ? docSplit.slice(1).join("") : text;
  const ansSplit = afterDoc.split(/^#{1,3}\s*(?:🎯|💬)[^\n]*\n?/m);
  const hasAnswer = ansSplit.length > 1;

  if (!hasDoc && !hasAnswer) {
    return null;
  }

  const before = (hasDoc ? docSplit[0] : "").trim();
  const docBody = hasDoc ? ansSplit[0].trim() : "";
  const answerBody = hasAnswer ? ansSplit.slice(1).join("").trim() : afterDoc.trim();

  return { before, docBody, answerBody, hasDoc, hasAnswer };
}

function MarkdownBlock({ text }) {
  if (!text) return null;
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let list = null;
  let listType = null;

  const flushList = () => {
    if (!list) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    blocks.push(
      <Tag key={`list-${blocks.length}`} className="md-list">
        {list.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    list = null;
    listType = null;
  };

  lines.forEach((line) => {
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);

    if (heading) {
      flushList();
      const level = heading[1].length;
      const Tag = level === 1 ? "h3" : "h4";
      blocks.push(
        <Tag key={`h-${blocks.length}`} className="md-heading">
          {renderInline(heading[2])}
        </Tag>
      );
    } else if (ul) {
      if (listType !== "ul") {
        flushList();
        list = [];
        listType = "ul";
      }
      list.push(ul[1]);
    } else if (ol) {
      if (listType !== "ol") {
        flushList();
        list = [];
        listType = "ol";
      }
      list.push(ol[1]);
    } else if (!line.trim()) {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={`p-${blocks.length}`} className="md-paragraph">
          {renderInline(line)}
        </p>
      );
    }
  });
  flushList();
  return <div className="markdown-body">{blocks}</div>;
}

export default function MarkdownMessage({ text }) {
  const dual = splitDualSections(text || "");

  if (!dual) {
    return <MarkdownBlock text={text} />;
  }

  return (
    <div className="dual-response-stack">
      {dual.before ? <MarkdownBlock text={dual.before} /> : null}
      {dual.hasDoc && (
        <section className="dual-section doc-section">
          <div className="dual-section-label">Document explanation</div>
          <MarkdownBlock text={dual.docBody} />
        </section>
      )}
      {dual.hasAnswer && (
        <section className="dual-section answer-section">
          <div className="dual-section-label">Chat answer</div>
          <MarkdownBlock text={dual.answerBody} />
        </section>
      )}
    </div>
  );
}
