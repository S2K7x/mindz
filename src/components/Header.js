import React, { useState, useCallback } from 'react';
import '../styles/Header.css';
import { useResearchBoard } from '../context/ResearchBoardContext';

const Header = ({ 
  currentTarget, 
  onTargetChange,
  onOpenSettings, 
  onAddMonitor,
  onSubmitTarget,
}) => {
  const [input, setInput] = useState(currentTarget || '');
  const { saveBoardToFile, loadBoardFromFile } = useResearchBoard();

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInput(value);
    onTargetChange(value); 
  }, [onTargetChange]);

  const handleInputKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && input.trim()) {
      onSubmitTarget(input.trim());
    }
  }, [input, onSubmitTarget]);

  const handleAddMonitorClick = useCallback(() => {
    if (currentTarget.trim()) {
      onAddMonitor(currentTarget.trim());
    }
  }, [currentTarget, onAddMonitor]);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <i className="fas fa-search-plus"></i>
          <span>Kyoz</span>
        </div>
      </div>

      <div className="header-center">
        <div className="target-input-container">
          <input
            type="text"
            className="target-input"
            placeholder="Enter Target Data (Email, IP, Domain, Phone, Hash, Geolocation...)"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
          <button 
            className="add-monitor-button"
            onClick={handleAddMonitorClick}
            title="Monitor target"
            disabled={!currentTarget}
          >
            <i className="fas fa-eye"></i>
          </button>
          <button 
            className="analyze-button"
            onClick={() => onSubmitTarget(input)}
            disabled={!input}
          >
            Analyze Target
          </button>
        </div>
      </div>

      <div className="header-right">
        <button className="header-button" title="Save Research Board to File" onClick={saveBoardToFile}>
          <i className="fas fa-file-export"></i>
        </button>
        <button className="header-button" title="Load Research Board from File" onClick={loadBoardFromFile}>
          <i className="fas fa-file-import"></i>
        </button>
        <button className="header-button" title="Settings" onClick={onOpenSettings}>
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
};

export default Header; 