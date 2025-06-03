import React, { memo } from 'react';

const SearchBar = memo(({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search tools..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
});

export default SearchBar; 