import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import OllamaChat from './OllamaChat';
import '../styles/Layout.css';
import SettingsModal from './SettingsModal';

const MONITORED_TARGETS_KEY = 'osintLabMonitoredTargets';
const SETTINGS_STORAGE_KEY = 'kyozSettings';
const CHECK_INTERVAL = 60000; // 60 seconds for periodic checks simulation

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [currentTarget, setCurrentTarget] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [monitoredTargets, setMonitoredTargets] = useState([]);
  const [hasNewFindings, setHasNewFindings] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Ensure default values for new settings if loading from old storage
        return {
          theme: 'dark',
          sidebarPosition: 'left',
          toolCardDensity: 'default',
          baseFontSize: '100%',
          spacing: '12px', // Default value
          borderRadius: '4px', // Default value
          shadowIntensity: 50, // Default value
          ...parsedSettings,
        };
      } catch (error) {
        console.error("Failed to parse settings from localStorage:", error);
      }
    }
    return {
      theme: 'dark',
      sidebarPosition: 'left',
      toolCardDensity: 'default',
      baseFontSize: '100%',
      spacing: '12px', // Default value
      borderRadius: '4px', // Default value
      shadowIntensity: 50, // Default value
    };
  });

  useEffect(() => {
    document.body.className = `theme-${settings.theme}`;
    document.documentElement.style.setProperty('--base-font-size', settings.baseFontSize);
    document.documentElement.style.setProperty('--spacing', settings.spacing);
    document.documentElement.style.setProperty('--border-radius', settings.borderRadius);
    document.documentElement.style.setProperty('--shadow-intensity', settings.shadowIntensity);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const savedMonitors = localStorage.getItem(MONITORED_TARGETS_KEY);
    if (savedMonitors) {
      try {
        setMonitoredTargets(JSON.parse(savedMonitors));
      } catch (error) {
        console.error("Failed to parse monitored targets from localStorage:", error);
        setMonitoredTargets([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MONITORED_TARGETS_KEY, JSON.stringify(monitoredTargets));
  }, [monitoredTargets]);

  const performPeriodicChecks = useCallback(() => {
    console.log('Performing periodic checks...');
    let newFindingsDetected = false;

    setMonitoredTargets(prevMonitoredTargets => {
      const updatedMonitoredTargets = prevMonitoredTargets.map(monitor => {
        const hasSimulatedFinding = Math.random() < 0.1;

        if (hasSimulatedFinding) {
          newFindingsDetected = true;
          const newFinding = {
            id: Date.now(),
            timestamp: Date.now(),
            description: `Simulated new finding for ${monitor.target}`,
            details: `Details for a simulated finding related to ${monitor.target}`
          };
          return { 
            ...monitor,
            lastChecked: Date.now(),
            findings: [...monitor.findings, newFinding]
          };
        } else {
          return { ...monitor, lastChecked: Date.now() };
        }
      });

      return updatedMonitoredTargets;
    });

    setHasNewFindings(newFindingsDetected);
  }, [setMonitoredTargets]);

  useEffect(() => {
    const intervalId = setInterval(performPeriodicChecks, CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [performPeriodicChecks]);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSettingsModalOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  const handleSaveState = useCallback(() => {
    console.log('Save State clicked');
    // TODO: Implement state saving logic
  }, []);

  const handleLoadState = useCallback(() => {
    console.log('Load State clicked');
    // TODO: Implement state loading logic
  }, []);

  const handleTargetChange = useCallback((target) => {
    setCurrentTarget(target);
  }, [setCurrentTarget]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, [setIsSidebarCollapsed]);

  const toggleRightPanel = useCallback(() => {
    setIsRightPanelCollapsed(prev => !prev);
  }, [setIsRightPanelCollapsed]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    if (window.innerWidth <= 992) {
      setIsSidebarCollapsed(true);
    }
  }, [setSelectedCategory, setIsSidebarCollapsed]);

  const handleAddMonitor = useCallback((targetToAdd) => {
    if (targetToAdd && !monitoredTargets.some(monitor => monitor.target === targetToAdd)) {
      setMonitoredTargets(prev => [...prev, { target: targetToAdd, added: Date.now(), lastChecked: null, findings: [] }]);
    }
  }, [monitoredTargets, setMonitoredTargets]);

  const handleSubmitTarget = useCallback((targetToSubmit) => {
    if (targetToSubmit.trim()) {
      setCurrentTarget(targetToSubmit);
    }
  }, [setCurrentTarget]);

  return (
    <div className={`layout sidebar-${settings.sidebarPosition}`}>
      <Header 
        currentTarget={currentTarget}
        onTargetChange={handleTargetChange}
        onSaveState={handleSaveState}
        onLoadState={handleLoadState}
        onOpenSettings={handleOpenSettings}
        onAddMonitor={handleAddMonitor}
        onSubmitTarget={handleSubmitTarget}
      />
      <div className="layout-content">
        {settings.sidebarPosition === 'left' && (
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            onCategoryChange={handleCategoryChange}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
        )}
        <main className="main-content">
          <Outlet context={{ 
            currentTarget,
            onTargetChange: handleTargetChange,
            selectedCategory,
            toolCardDensity: settings.toolCardDensity
          }} />
        </main>
        {settings.sidebarPosition === 'right' && (
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            onCategoryChange={handleCategoryChange}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />
        )}
        <RightPanel 
          isCollapsed={isRightPanelCollapsed}
          onToggle={toggleRightPanel}
          monitoredTargets={monitoredTargets}
          onAddMonitor={handleAddMonitor}
          hasNewFindings={hasNewFindings}
        />
      </div>
      <OllamaChat selectedCategory={selectedCategory} />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default Layout; 