import React, { useState, memo } from 'react';
import '../styles/ToolTip.css';

const ToolTip = memo(({ content, title }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <button 
        className="tooltip-icon"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Show tooltip"
      >
        <i className="fas fa-info-circle"></i>
      </button>
      {isVisible && (
        <div className="tooltip-content">
          <div className="tooltip-header">
            <h4>{title}</h4>
            <button 
              className="tooltip-close"
              onClick={() => setIsVisible(false)}
              aria-label="Close tooltip"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="tooltip-body">
            {content}
          </div>
        </div>
      )}
    </div>
  );
});

export default ToolTip; 