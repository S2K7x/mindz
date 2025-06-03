import React from 'react';

function Modal({ isOpen, onClose, url, toolName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{toolName} Preview</h3>
          <div className="modal-actions">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-button"
            >
              Open in New Tab
            </a>
            <button onClick={onClose} className="modal-button">
              Close
            </button>
          </div>
        </div>
        <div className="modal-body">
          <iframe
            src={url}
            title={`${toolName} Preview`}
            className="modal-iframe"
          />
        </div>
      </div>
    </div>
  );
}

export default Modal; 