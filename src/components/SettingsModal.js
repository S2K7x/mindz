import React from 'react';
import '../styles/SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleThemeChange = (e) => {
    onSettingsChange({ theme: e.target.value });
  };

  const handleSidebarPositionChange = (e) => {
    onSettingsChange({ sidebarPosition: e.target.value });
  };

  const handleToolCardDensityChange = (e) => {
    onSettingsChange({ toolCardDensity: e.target.value });
  };

  const handleBaseFontSizeChange = (e) => {
    onSettingsChange({ baseFontSize: `${e.target.value}%` });
  };

  const handleSpacingChange = (e) => {
    onSettingsChange({ spacing: `${e.target.value}px` });
  };

  const handleBorderRadiusChange = (e) => {
    onSettingsChange({ borderRadius: `${e.target.value}px` });
  };

  const handleShadowIntensityChange = (e) => {
    onSettingsChange({ shadowIntensity: e.target.value }); // Assuming value is 0-100
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {/* Theme Selection */}
          <div className="setting-section">
            <h3>Theme</h3>
            <div className="theme-options">
              <label>
                <input 
                  type="radio" 
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={handleThemeChange}
                /> Dark Mode
              </label>
              <label>
                <input 
                  type="radio" 
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={handleThemeChange}
                /> Light Mode
              </label>
               <label>
                <input 
                  type="radio" 
                  name="theme"
                  value="high-contrast"
                  checked={settings.theme === 'high-contrast'}
                  onChange={handleThemeChange}
                /> High Contrast
              </label>
            </div>
          </div>

          {/* Layout Preferences */}
          <div className="setting-section">
            <h3>Layout</h3>
            <div className="layout-options">
              <label>
                <input 
                  type="radio" 
                  name="sidebarPosition"
                  value="left"
                  checked={settings.sidebarPosition === 'left'}
                  onChange={handleSidebarPositionChange}
                /> Left Sidebar
              </label>
              <label>
                <input 
                  type="radio" 
                  name="sidebarPosition"
                  value="right"
                  checked={settings.sidebarPosition === 'right'}
                  onChange={handleSidebarPositionChange}
                /> Right Sidebar
              </label>
            </div>
            <div className="density-options">
              <h4>Tool Card Density</h4>
               <label>
                <input 
                  type="radio" 
                  name="toolCardDensity"
                  value="default"
                  checked={settings.toolCardDensity === 'default'}
                  onChange={handleToolCardDensityChange}
                /> Default
              </label>
              <label>
                <input 
                  type="radio" 
                  name="toolCardDensity"
                  value="compact"
                  checked={settings.toolCardDensity === 'compact'}
                  onChange={handleToolCardDensityChange}
                /> Compact
              </label>
            </div>
          </div>

          {/* Typography */}
          <div className="setting-section">
            <h3>Typography</h3>
             <div className="font-size-options">
              <label htmlFor="base-font-size">Base Font Size:</label>
              <input
                type="range"
                id="base-font-size"
                min="90"
                max="120"
                step="5"
                value={parseInt(settings.baseFontSize.replace('%', ''), 10)}
                onChange={handleBaseFontSizeChange}
              />
              <span>{settings.baseFontSize}</span>
            </div>
          </div>

           {/* Visual Appearance */}
           <div className="setting-section">
             <h3>Visual Appearance</h3>
             <div className="spacing-option">
               <label htmlFor="spacing">Spacing:</label>
               <input
                 type="range"
                 id="spacing"
                 min="4"
                 max="24"
                 step="4"
                 value={parseInt(settings.spacing.replace('px', ''), 10) || 12} /* Default to 12px if undefined */
                 onChange={handleSpacingChange}
               />
               <span>{settings.spacing}</span>
             </div>
             <div className="border-radius-option">
               <label htmlFor="border-radius">Border Radius:</label>
               <input
                 type="range"
                 id="border-radius"
                 min="0"
                 max="12"
                 step="2"
                 value={parseInt(settings.borderRadius.replace('px', ''), 10) || 4} /* Default to 4px */
                 onChange={handleBorderRadiusChange}
               />
               <span>{settings.borderRadius}</span>
             </div>
              <div className="shadow-intensity-option">
               <label htmlFor="shadow-intensity">Shadow Intensity:</label>
               <input
                 type="range"
                 id="shadow-intensity"
                 min="0"
                 max="100"
                 step="10"
                 value={settings.shadowIntensity || 50} /* Default to 50 */
                 onChange={handleShadowIntensityChange}
               />
               <span>{settings.shadowIntensity}%</span>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;