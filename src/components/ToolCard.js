import React, { useState, memo } from 'react';
import Modal from './Modal';
import { useResearchBoard } from '../context/ResearchBoardContext';
import '../styles/ToolCard.css';

const ToolCard = memo(({ tool, target }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { addNodeToBoard } = useResearchBoard();

  const getToolUrl = () => {
    if (tool.templateUrl && target) {
      return tool.templateUrl.replace('{target}', encodeURIComponent(target));
    }
    return tool.url;
  };

  const handleAddToBoard = () => {
    if (!target) return;
    
    // Infer node type based on tool category and input type
    let nodeType = 'unknown';
    if (tool.inputType) {
      nodeType = tool.inputType.toLowerCase();
    } else if (tool.category) {
      // Map category to node type if no specific input type
      const categoryMap = {
        'Social Media': 'social_profile',
        'Email': 'email',
        'Domain': 'domain',
        'IP': 'ip_address',
        'Username': 'username',
        'Phone': 'phone_number',
        'Document': 'document'
      };
      nodeType = categoryMap[tool.category] || 'unknown';
    }

    // Add node with inferred type and tool details
    addNodeToBoard(target, nodeType, {
      toolName: tool.name,
      toolCategory: tool.category,
      addedFrom: tool.name
    });
  };

  const toolUrl = getToolUrl();
  const showPreview = tool.embeddable && target;
  const canAddToBoard = target && tool.inputType; // Only show if we have a target and know the input type

  return (
    <div className="tool-card">
      <h3 className="tool-name">{tool.name}</h3>
      <p className="tool-description">{tool.description}</p>
      <div className="tool-actions">
        <a 
          href={toolUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="tool-link"
        >
          {target ? `Search ${tool.name} for '${target}'` : 'Visit Tool'}
        </a>
        {showPreview && (
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="preview-button"
          >
            Preview
          </button>
        )}
        {canAddToBoard && (
          <button
            onClick={handleAddToBoard}
            className="add-to-board-button"
            title="Add to Research Board"
          >
            Add to Board
          </button>
        )}
      </div>
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        url={toolUrl}
        toolName={tool.name}
      />
    </div>
  );
});

export default ToolCard; 