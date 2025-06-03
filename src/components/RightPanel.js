import React, { useState, memo } from 'react';
import '../styles/RightPanel.css';

const RightPanel = memo(({ isCollapsed, onToggle, monitoredTargets, hasNewFindings }) => {
  const [selectedMonitor, setSelectedMonitor] = useState(null);

  const handleMonitorClick = (monitor) => {
    setSelectedMonitor(monitor);
  };

  const handleCloseFindings = () => {
    setSelectedMonitor(null);
  };

  return (
    <div className={`right-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={onToggle}>
        {isCollapsed ? '→' : '←'}
      </button>
      <div className="right-panel-content">
        <div className="right-panel-section">
          <h2>
            Monitored Targets
            {hasNewFindings && <span className="new-findings-indicator"> •</span>}
          </h2>
          {selectedMonitor ? (
            <div className="monitored-target-details">
              <div className="monitored-target-details-header">
                <h3>{selectedMonitor.target}</h3>
                <button className="close-findings-button" onClick={handleCloseFindings}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p>Added: {new Date(selectedMonitor.added).toLocaleString()}</p>
              <p>Last Checked: {selectedMonitor.lastChecked ? new Date(selectedMonitor.lastChecked).toLocaleString() : 'Never'}</p>

              <h4>Findings:</h4>
              {selectedMonitor.findings.length > 0 ? (
                <ul>
                  {selectedMonitor.findings.map(finding => (
                    <li key={finding.id}>
                      <strong>{new Date(finding.timestamp).toLocaleString()}:</strong> {finding.description}
                      {/* You can add more finding details here if available */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No findings yet.</p>
              )}
            </div>
          ) : (
            monitoredTargets.length > 0 ? (
              <ul>
                {monitoredTargets.map((monitor, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleMonitorClick(monitor)}
                    className="monitored-target-item"
                  >
                    {monitor.target}
                    {monitor.findings.length > 0 && <span className="target-findings-indicator"> ({monitor.findings.length})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No targets being monitored.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
});

export default RightPanel; 