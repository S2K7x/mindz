import React, { memo } from 'react';
import { tooltips } from '../data/tooltips';
import ToolTip from './ToolTip';
import '../styles/CategoryNav.css';

const CategoryNav = memo(({ categories, activeCategory, onCategorySelect }) => {
  return (
    <nav className="category-nav">
      <ul>
        <li>
          <button
            className={activeCategory === 'all' ? 'active' : ''}
            onClick={() => onCategorySelect('all')}
          >
            All Tools
          </button>
          <ToolTip
            title={tooltips.features['pivot-search'].title}
            content={tooltips.features['pivot-search'].content}
          />
        </li>
        {categories.map((category) => (
          <li key={category}>
            <button
              className={activeCategory === category ? 'active' : ''}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
            <ToolTip
              title={tooltips.categories[category]?.title || `${category} Tips`}
              content={tooltips.categories[category]?.content || `Tips for using ${category} tools`}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
});

export default CategoryNav; 