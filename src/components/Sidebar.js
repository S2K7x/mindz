import React, { useState, memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tooltips } from '../data/tooltips';
import ToolTip from './ToolTip';
import toolsData from '../data/osintTools.json'; // Import tools data
import '../styles/Sidebar.css';

const Sidebar = memo(({ 
  isCollapsed, 
  onToggle, 
  setIsSidebarCollapsed // Accept setIsSidebarCollapsed prop
}) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categoryToolSearch, setCategoryToolSearch] = useState({}); // State for tool search within categories
  const [mainSearchQuery, setMainSearchQuery] = useState(''); // State for main sidebar search query
  const navigate = useNavigate();
  const location = useLocation();

  // Note: categories array should ideally come from toolsData or a central config
  const categories = [
    "Email OSINT",
    "Social Media",
    "IP/Domain",
    "Phone Number OSINT",
    "Image & Video OSINT",
    "Geolocation & Mapping OSINT",
    "Document & File Metadata OSINT",
    "Dark Web / Leaks / Breaches",
    "Cryptocurrency OSINT",
    "Browser Search",
    "Social Media Search",
    "Dorking Lab",
    "Web Archives"
  ];

  // Filter categories based on main search query
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(mainSearchQuery.toLowerCase())
  );

  // Filter tools within a category based on its specific search query
  const filterTools = (category, tools) => {
    const query = categoryToolSearch[category] || '';
    if (!query) return tools;
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) || 
      (tool.description && tool.description.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleCategoryClick = (category) => {
    if (category === 'All Tools') {
      navigate('/');
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
    setIsSidebarCollapsed(true);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    // Clear category-specific search when collapsing
    if (expandedCategories.includes(category)) {
      setCategoryToolSearch(prev => {
        const newState = { ...prev };
        delete newState[category];
        return newState;
      });
    }
    // When expanding a category, navigate to its page unless it's the Research Board or Dorking Lab
    if (!expandedCategories.includes(category) && category !== 'Research Board' && category !== 'Dorking Lab') {
       handleCategoryClick(category);
    }
  };

  const handleCategoryToolSearchChange = useCallback((category, query) => {
    setCategoryToolSearch(prev => ({ ...prev, [category]: query }));
  }, []);

  const handleResearchBoardClick = useCallback(() => {
    navigate('/research-board');
    setIsSidebarCollapsed(true);
  }, [navigate, setIsSidebarCollapsed]);

  const handleDorkingLabClick = useCallback(() => {
    navigate('/dorking-lab');
    setIsSidebarCollapsed(true);
  }, [navigate, setIsSidebarCollapsed]);

  // Determine if a category is currently active based on URL
  const isCategoryActive = (category) => {
    if (category === 'All Tools') {
      return location.pathname === '/';
    } else {
      return location.pathname === `/category/${encodeURIComponent(category)}`;
    }
  };


  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="collapse-button"
          onClick={onToggle}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>

      <div className="sidebar-content">

        {!isCollapsed && ( // Only show search when not collapsed
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search categories..."
              value={mainSearchQuery}
              onChange={(e) => setMainSearchQuery(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
        )}

        <div className="sidebar-section">
          <h3 className="section-title">
            {!isCollapsed && "General"}
          </h3>
           <ul className="category-list">
             <li key="Research Board">
                 <button
                   className={`category-button ${location.pathname === '/research-board' ? 'active' : ''}`}
                   onClick={handleResearchBoardClick}
                 >
                   <i className="fas fa-clipboard"></i> {/* Example icon */}
                   {!isCollapsed && <span>Research Board</span>}
                 </button>
             </li>
              <li key="Dorking Lab Link">
                 <button
                   className={`category-button ${location.pathname === '/dorking-lab' ? 'active' : ''}`}
                   onClick={handleDorkingLabClick}
                 >
                   <i className="fas fa-code"></i> {/* Example icon */} 
                   {!isCollapsed && <span>Dorking Lab</span>}
                 </button>
            </li>
           </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">
            {!isCollapsed && "Tool Categories"}
          </h3>
          <ul className="category-list">
            <li key="All Tools">
                 <button
                   className={`category-button ${isCategoryActive('All Tools') ? 'active' : ''}`}
                   onClick={() => handleCategoryClick('All Tools')}
                 >
                    <i className="fas fa-tools"></i> {/* Example icon */}
                   {!isCollapsed && <span>All Tools</span>}
                 </button>
            </li>
            {filteredCategories.map(category => {
              // Find the category data including its tools
              const categoryData = toolsData.find(cat => cat.category === category);
              if (!categoryData) return null; // Should not happen with correct categories array
              
              const isExpanded = expandedCategories.includes(category);
              // Get the tools for the category, filtered by search query
              const tools = categoryData.tools;
              const filteredCategoryTools = filterTools(category, tools);

              return (
                <li key={categoryData.category}>
                  <button
                    className={`category-button ${isExpanded ? 'expanded' : ''} ${isCategoryActive(categoryData.category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(categoryData.category)}
                  >
                    <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i> {/* Chevron icon */} 
                    {!isCollapsed && <span>{categoryData.category}</span>}
                  </button>
                  {!isCollapsed && isExpanded && ( // Only show expanded content when not collapsed
                    <div className="category-tools-section">
                      {/* Tool Search Bar */}
                      <div className="tool-search-bar">
                        <input
                          type="text"
                          placeholder="Search tools in category..."
                          value={categoryToolSearch[category] || ''}
                          onChange={(e) => handleCategoryToolSearchChange(category, e.target.value)}
                        />
                         <i className="fas fa-search"></i> {/* Search icon */} 
                      </div>

                      {filteredCategoryTools.length > 0 ? ( // Show tools if found
                        <ul className="tool-list">
                          {filteredCategoryTools.map(tool => (
                            <li key={tool.name}>
                              <button
                                className="tool-button"
                                onClick={() => handleCategoryClick(categoryData.category, tool.name)} // Pass tool name too if needed
                              >
                                {tool.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : ( // Show message if no tools found
                        <p className="no-tools-found">No tools found.</p>
                      )}
                      
                      {/* Tooltip (optional, can be per tool if needed) */}
                      {/*
                      <ToolTip
                        title={tooltips.categories[category]?.title || `${category} Tips`}
                        content={tooltips.categories[category]?.content || `Tips for using ${category} tools`}
                      />
                      */}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </aside>
  );
});

export default Sidebar; 