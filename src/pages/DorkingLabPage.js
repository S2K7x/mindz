import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import dorksData from '../frontend/data/dorks.json';
import osintToolsData from '../data/osintTools.json';
import '../styles/DorkingLabPage.css';

const LOCAL_STORAGE_CUSTOM_DORKS_KEY = 'kyozCustomDorks';

const DorkingLabPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(dorksData.categories[0]?.category || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [dorkQuery, setDorkQuery] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [selectedEngines, setSelectedEngines] = useState({});
  const [savedDorks, setSavedDorks] = useState({});
  const [newDorkName, setNewDorkName] = useState('');

  const dorkQueryRef = useRef(null);

  const categories = useMemo(() => dorksData.categories.map(cat => cat.category), []);
  const commonDorks = useMemo(() => dorksData.commonDorks || [], []);

  const browserSearchEngines = useMemo(() => {
    const browserCategory = osintToolsData.find(cat => cat.category === 'Browser Search');
    return browserCategory ? browserCategory.tools : [];
  }, []);

  // Load custom dorks from localStorage on component mount
  useEffect(() => {
    const savedCustomDorks = localStorage.getItem(LOCAL_STORAGE_CUSTOM_DORKS_KEY);
    if (savedCustomDorks) {
      try {
        setSavedDorks(JSON.parse(savedCustomDorks));
      } catch (error) {
        console.error("Failed to load custom dorks from localStorage:", error);
        setSavedDorks({});
      }
    } else {
      setSavedDorks({});
    }
  }, []);

  // Save custom dorks to localStorage whenever savedDorks state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_DORKS_KEY, JSON.stringify(savedDorks));
  }, [savedDorks]);

  // Initialize selectedEngines state with all browser search engines checked by default
  useEffect(() => {
    const initialSelectedEngines = {};
    browserSearchEngines.forEach(engine => {
      initialSelectedEngines[engine.name] = true;
    });
    setSelectedEngines(initialSelectedEngines);
  }, [browserSearchEngines]);

  const filteredOperators = useMemo(() => {
    const categoryData = dorksData.categories.find(cat => cat.category === selectedCategory);
    if (!categoryData) return [];

    return categoryData.operators.filter(operator =>
      operator.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      operator.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedOperator(null); // Clear selected operator when changing category
    setSearchQuery(''); // Clear search when changing category
  };

  const handleOperatorClick = (operator) => {
    setSelectedOperator(operator);
  };

  const handleOperatorInsert = useCallback((operator) => {
    if (dorkQueryRef.current) {
      const textarea = dorkQueryRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const operatorWithSpace = operator.operator.endsWith(':') || operator.operator.endsWith('"') ? operator.operator + '' : operator.operator + ' ';
      const newText = dorkQuery.substring(0, start) + operatorWithSpace + dorkQuery.substring(end);
      setDorkQuery(newText);

      // Attempt to place cursor or select placeholder if applicable
      const cursorPosition = start + operatorWithSpace.length; // Position after the operator and space

      // More advanced: select placeholder if example suggests one (e.g., site:example.com)
      if (operator.example && operator.example.includes(operator.operator)) {
        const exampleValue = operator.example.substring(operator.operator.length).trim();
        if (exampleValue) {
          const placeholderStart = start + operator.operator.length;
          const placeholderEnd = placeholderStart + exampleValue.length + (operatorWithSpace.length - operator.operator.length); // Adjust end based on whether space was added
          const fullNewText = dorkQuery.substring(0, start) + operator.operator + exampleValue + (operatorWithSpace.length - operator.operator.length === 1 ? ' ' : '') + dorkQuery.substring(end);
          setDorkQuery(fullNewText);
          requestAnimationFrame(() => {
            textarea.selectionStart = placeholderStart;
            textarea.selectionEnd = placeholderStart + exampleValue.length;
            textarea.focus();
          });
        } else {
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            textarea.focus();
          });
        }
      } else {
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPosition;
          textarea.focus();
        });
      }
    }
  }, [dorkQuery]);

  const handleEngineToggle = (engineName) => {
    setSelectedEngines(prev => ({
      ...prev,
      [engineName]: !prev[engineName]
    }));
  };

  const handleLaunchDork = () => {
    const fullDork = `${dorkQuery.trim()} ${targetKeyword.trim()}`.trim();
    if (!fullDork) {
      alert('Please build a dork query and/or enter a target keyword.');
      return;
    }

    const enginesToLaunch = browserSearchEngines.filter(engine => selectedEngines[engine.name]);

    if (enginesToLaunch.length === 0) {
      alert('Please select at least one search engine.');
      return;
    }

    enginesToLaunch.forEach(engine => {
      // Assuming templateUrl uses {target} as a placeholder for the full dork
      const launchUrl = engine.templateUrl.replace('{target}', encodeURIComponent(fullDork));
      window.open(launchUrl, '_blank');
    });
  };

  const handleSaveDork = () => {
    if (!newDorkName.trim()) {
      alert("Please enter a name for your dork.");
      return;
    }
    if (!dorkQuery.trim() && !targetKeyword.trim()) {
      alert("Cannot save an empty dork.");
      return;
    }

    const fullDork = `${dorkQuery.trim()} ${targetKeyword.trim()}`.trim();

    setSavedDorks(prev => ({
      ...prev,
      [newDorkName.trim()]: fullDork
    }));
    setNewDorkName(''); // Clear the input after saving
    alert(`Dork "${newDorkName.trim()}" saved!`);
  };

  const handleLoadDork = (name) => {
    if (savedDorks[name]) {
      const fullDork = savedDorks[name];
      // Simple load: put the whole saved dork into the query field
      setDorkQuery(fullDork);
      setTargetKeyword(''); // Clear target keyword as it's included in the loaded dork
      alert(`Dork "${name}" loaded!`);
    } else {
      alert(`Dork "${name}" not found.`);
    }
  };

  const handleDeleteDork = useCallback((name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setSavedDorks(prev => {
        const newState = { ...prev };
        delete newState[name];
        return newState;
      });
      alert(`Dork "${name}" deleted.`);
    }
  }, []);

  const handleLoadCommonDork = useCallback((commonDork) => {
    // Replace placeholder like {domain} or {keyword} with a prompt or leave it for user to fill
    let loadedDork = commonDork.dork;
    let suggestedTarget = commonDork.exampleTarget || '';

    // Simple placeholder replacement (can be enhanced later)
    loadedDork = loadedDork.replace('{domain}', suggestedTarget ? suggestedTarget : '{domain}');
    loadedDork = loadedDork.replace('{keyword}', suggestedTarget ? suggestedTarget : '{keyword}');

    setDorkQuery(loadedDork);
    setTargetKeyword(''); // Clear target keyword as it's often part of the common dork itself
  }, []);

  return (
    <div className="dorking-lab-page">
      <div className="dork-categories">
        {categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="dork-content">
        <div className="dork-list-section">
          <div className="dork-search-bar">
            <input
              type="text"
              placeholder="Search operators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <ul className="dork-list">
            {filteredOperators.map(operator => (
              <li
                key={operator.operator}
                className={selectedOperator?.operator === operator.operator ? 'active' : ''}
                onClick={() => handleOperatorClick(operator)}
              >
                <code>{operator.operator}</code>
                <p>{operator.description}</p>
                {/* Add button to insert operator */}
                <button
                    className="insert-operator-button"
                    onClick={(e) => {
                         e.stopPropagation(); // Prevent triggering li onClick
                         handleOperatorInsert(operator);
                    }}>
                    <i className="fas fa-plus"></i> Insert
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="dork-builder-section">
            <h2>Build Your Dork</h2>

            <div className="form-group">
                <label htmlFor="dorkQuery">Your Dork Query:</label>
                <textarea
                    id="dorkQuery"
                    ref={dorkQueryRef}
                    value={dorkQuery}
                    onChange={(e) => setDorkQuery(e.target.value)}
                    placeholder="Build your dork here... (Click operators on the left)"
                    rows="4"
                />
            </div>

             <div className="form-group">
                <label htmlFor="targetKeyword">Target Keyword/Phrase:</label>
                <input
                    id="targetKeyword"
                    type="text"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Enter your target keyword or phrase..."
                />
            </div>

            <div className="form-group">
                <label>Select Search Engines:</label>
                <div className="engine-checkboxes">
                    {browserSearchEngines.map(engine => (
                        <label key={engine.name} className="engine-checkbox-label">
                            <input
                                type="checkbox"
                                checked={selectedEngines[engine.name] || false}
                                onChange={() => handleEngineToggle(engine.name)}
                            />
                            {engine.name}
                        </label>
                    ))}
                </div>
            </div>

            <button className="launch-button" onClick={handleLaunchDork}>
                <i className="fas fa-external-link-alt"></i> Launch Dork
            </button>

            {/* Saved Dorks Section */}
            <div className="saved-dorks-section">
                <h3>Saved Dorks</h3>
                 <div className="save-dork-form">
                    <input
                        type="text"
                        placeholder="Name to save as"
                        value={newDorkName}
                        onChange={(e) => setNewDorkName(e.target.value)}
                    />
                     <button onClick={handleSaveDork}><i className="fas fa-save"></i> Save Current Dork</button>
                 </div>
                {Object.keys(savedDorks).length > 0 ? (
                    <ul className="saved-dorks-list">
                        {Object.entries(savedDorks).map(([name, dork]) => (
                            <li key={name}>
                                <span>{name}</span>
                                <div className="saved-dork-actions">
                                    <button onClick={() => handleLoadDork(name)} title="Load Dork"><i className="fas fa-upload"></i></button>
                                    <button onClick={() => handleDeleteDork(name)} title="Delete Dork"><i className="fas fa-trash"></i></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No dorks saved yet.</p>
                )}
            </div>

             {/* Common OSINT Dorks Section */}
            {commonDorks.length > 0 && (
                <div className="common-dorks-section">
                    <h3>Common OSINT Dorks</h3>
                    <ul className="common-dorks-list">
                        {commonDorks.map((dork, index) => (
                            <li key={index}>
                                <strong>{dork.name}:</strong> {dork.description}
                                <button onClick={() => handleLoadCommonDork(dork)} title="Load Common Dork"><i className="fas fa-upload"></i> Load</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedOperator && (
              <div className="dork-detail-section detail-pane">
                <h3><code>{selectedOperator.operator}</code></h3>
                <p><strong>Description:</strong> {selectedOperator.description}</p>
                <p><strong>Example:</strong> <code>{selectedOperator.example}</code></p>
                <p><strong>Compatible Engines:</strong> {selectedOperator.searchEngines.join(', ')}</p>
                {selectedOperator.appliesTo && (
                  <p><strong>Applies To:</strong> {selectedOperator.appliesTo}</p>
                )}
                 {/* Add a button to copy the example dork */}
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(selectedOperator.example)}
                >
                  <i className="fas fa-copy"></i> Copy Example
                </button>
              </div>
            )}

        </div>


      </div>
    </div>
  );
};

export default DorkingLabPage; 