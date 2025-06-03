import React, { memo } from 'react';
import { detectInputType } from '../utils/inputTypeDetection';

const SuggestedPivots = memo(({ currentTool, target, tools, onPivotSelect }) => {
  if (!currentTool || !target) return null;

  const inputType = detectInputType(target);
  const pivotTools = tools
    .filter(tool => 
      tool.name !== currentTool.name && // Don't suggest the current tool
      tool.inputTypes.includes(inputType) && // Must support the current input type
      tool.category !== currentTool.category // Suggest tools from different categories
    )
    .slice(0, 3); // Limit to 3 suggestions

  if (pivotTools.length === 0) return null;

  return (
    <div className="suggested-pivots">
      <h3>Suggested Pivot Tools</h3>
      <div className="pivot-tools-grid">
        {pivotTools.map((tool, index) => (
          <div
            key={index}
            className="pivot-tool-card"
            onClick={() => onPivotSelect(tool)}
          >
            <h4>{tool.name}</h4>
            <p>{tool.description}</p>
            <div className="pivot-tool-meta">
              <span className="category">{tool.category}</span>
              <span className="input-type">{inputType}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SuggestedPivots; 