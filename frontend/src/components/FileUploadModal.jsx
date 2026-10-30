import React, { useState, useRef } from "react";
import axios from "axios";
import { CloseIcon, DocumentIcon, PaperclipIcon, CheckIcon } from "./Icons.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8008";

export default function FileUploadModal({
  isOpen,
  onClose,
  currentDoc,
  onDocUpdated,
}) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  const fileInputRef = useRef(null);

  const stages = [
    "Uploading PDF...",
    "Extracting text...",
    "Cleaning text...",
    "Creating chunks...",
    "Generating embeddings...",
    "Building vector knowledge base...",
    "PDF Ready!"
  ];

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith(".pdf")) {
        setFile(droppedFile);
        setErrorMsg("");
        setSuccessInfo(null);
      } else {
        setErrorMsg("Please select a valid PDF educational document.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.name.toLowerCase().endsWith(".pdf")) {
        setFile(selected);
        setErrorMsg("");
        setSuccessInfo(null);
      } else {
        setErrorMsg("Please select a valid PDF educational document.");
      }
    }
  };

  const processPDF = async () => {
    if (!file) {
      setErrorMsg("Please select a PDF file first.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setSuccessInfo(null);
    setStageIndex(0);

    // Progress increments based on realistic pipeline stages:
    // Stage 0: Uploading -> Stage 1: Extracting -> Stage 2: Cleaning -> Stage 3: Chunking -> Stage 4: Embedding -> Stage 5: Indexing
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < 5 ? prev + 1 : prev));
    }, 800);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_BASE}/upload-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      setStageIndex(6);
      setSuccessInfo(response.data);

      if (onDocUpdated) {
        onDocUpdated({
          filename: response.data.filename,
          pages: response.data.pages,
          chunks: response.data.chunks,
          status: "ready",
        });
      }

      setTimeout(() => {
        setUploading(false);
        onClose();
      }, 1200);
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      const detail =
        err.response?.data?.detail || err.message || "Failed to process PDF.";
      setErrorMsg(detail);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card file-upload-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon-badge">
              <PaperclipIcon size={20} />
            </span>
            <div>
              <h2 className="modal-title">Attach Learning Material</h2>
              <p className="modal-subtitle">
                Upload educational PDFs to enable grounded AI Q&amp;A and MCQ practice
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Current Document Summary */}
        {currentDoc && currentDoc.status === "ready" && (
          <div className="current-doc-banner">
            <DocumentIcon size={20} />
            <div className="current-doc-details">
              <span className="current-doc-title">Active Knowledge Source:</span>
              <span className="current-doc-name">{currentDoc.filename}</span>
              <span className="current-doc-meta">
                {currentDoc.pages} pages · {currentDoc.chunks} indexed chunks
              </span>
            </div>
            <span className="doc-ready-tag">
              <CheckIcon size={14} /> Ready
            </span>
          </div>
        )}

        {/* Dropzone */}
        <div
          className={`dropzone ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            style={{ display: "none" }}
          />

          <div className="dropzone-content">
            <div className="dropzone-icon-circle">
              <DocumentIcon size={32} />
            </div>

            {file ? (
              <div className="selected-file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="file-change-hint">Click or drag another to replace</span>
              </div>
            ) : (
              <div className="dropzone-text">
                <p className="dropzone-primary">
                  <span>Click to browse</span> or drag and drop your PDF here
                </p>
                <p className="dropzone-secondary">
                  Supports educational textbooks, lecture slides, papers (Max 50MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload & Indexing Progress */}
        {uploading && (
          <div className="upload-progress-box">
            <div className="progress-info-row">
              <span className="progress-stage-text">{stages[stageIndex]}</span>
              <span className="progress-pct">
                {Math.round(((stageIndex + 1) / stages.length) * 100)}%
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((stageIndex + 1) / stages.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="modal-error-box" role="alert">
            <span>{errorMsg}</span>
          </div>
        )}

        {successInfo && (
          <div className="modal-success-box">
            <CheckIcon size={16} />
            <span>Document processed successfully! Ready for AI chat.</span>
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={processPDF}
            disabled={!file || uploading}
          >
            {uploading ? "Processing..." : "Upload & Index Knowledge"}
          </button>
        </div>
      </div>
    </div>
  );
}
