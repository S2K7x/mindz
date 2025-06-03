import React, { useState, useMemo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import toolsData from '../data/osintTools.json';
import '../styles/HomePage.css';

const HomePage = () => {
  const { currentTarget, onTargetChange, toolCardDensity } = useOutletContext();
  const { categoryName } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    let tools = [];
    
    // If a specific category is selected from URL, filter tools by that category
    if (categoryName) {
      const categoryData = toolsData.find(cat => cat.category === decodeURIComponent(categoryName));
      if (categoryData) {
        tools = categoryData.tools;
      }
    } else {
      // If no category in URL, get all tools from all categories
      tools = toolsData.flatMap(cat => cat.tools);
    }

    // Apply search filter if there's a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    return tools;
  }, [categoryName, searchQuery]);

  return (
    <div className="home-page main-content">
      <div className="main-content-wrapper">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className={`tools-grid ${toolCardDensity === 'compact' ? 'compact' : ''}`}>
          {filteredTools.map(tool => (
            <ToolCard
              key={tool.name}
              tool={tool}
              target={currentTarget}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 