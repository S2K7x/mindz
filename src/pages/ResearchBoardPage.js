import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useResearchBoard } from '../context/ResearchBoardContext';
import '../styles/ResearchBoardPage.css';

const LOCAL_STORAGE_KEY = 'kyozResearchBoardData';

const NODE_TYPES = {
  PERSON: { 
    label: 'Person', 
    color: '#ff7675',
    icon: '👤',
    shape: 'dot'
  },
  ORGANIZATION: { 
    label: 'Organization', 
    color: '#74b9ff',
    icon: '🏢',
    shape: 'diamond'
  },
  LOCATION: { 
    label: 'Location', 
    color: '#55efc4',
    icon: '📍',
    shape: 'square'
  },
  EMAIL: { 
    label: 'Email', 
    color: '#a29bfe',
    icon: '📧',
    shape: 'dot'
  },
  PHONE: { 
    label: 'Phone', 
    color: '#ffeaa7',
    icon: '📱',
    shape: 'dot'
  },
  DOMAIN: { 
    label: 'Domain', 
    color: '#fab1a0',
    icon: '🌐',
    shape: 'dot'
  },
  IP: { 
    label: 'IP Address', 
    color: '#81ecec',
    icon: '🔢',
    shape: 'dot'
  },
  SOCIAL: { 
    label: 'Social Media', 
    color: '#fd79a8',
    icon: '💬',
    shape: 'dot'
  },
  DOCUMENT: { 
    label: 'Document', 
    color: '#dfe6e9',
    icon: '📄',
    shape: 'square'
  },
  OTHER: { 
    label: 'Other', 
    color: '#b2bec3',
    icon: '📌',
    shape: 'dot'
  }
};

const RELATIONSHIP_TYPES = [
  'related to',
  'works at',
  'located in',
  'owns',
  'contacted',
  'belongs to',
  'manages',
  'reports to',
  'partners with',
  'custom'
];

const ResearchBoardPage = () => {
  const networkContainerRef = useRef(null);
  const networkRef = useRef(null);
  const navigate = useNavigate();
  const { boardData, setBoardData, addNodeToBoard, addEdgeToBoard, clearBoard } = useResearchBoard();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);
  const [showAddEdgeForm, setShowAddEdgeForm] = useState(false);
  const [newNode, setNewNode] = useState({ label: '', type: 'PERSON' });
  const [newEdge, setNewEdge] = useState({ from: '', to: '', label: 'related to' });
  const [customRelationship, setCustomRelationship] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Array.isArray(parsedData.nodes) && Array.isArray(parsedData.edges)) {
          setBoardData({
            nodes: new DataSet(parsedData.nodes),
            edges: new DataSet(parsedData.edges)
          });
        } else {
          setBoardData({ nodes: new DataSet(), edges: new DataSet() });
        }
      } catch (error) {
        console.error("Failed to load board data:", error);
        setBoardData({ nodes: new DataSet(), edges: new DataSet() });
      }
    } else {
      setBoardData({ nodes: new DataSet(), edges: new DataSet() });
    }
  }, [setBoardData]);

  // Initialize Vis.js Network
  useEffect(() => {
    if (!networkContainerRef.current || networkRef.current) return;

    const options = {
      nodes: {
        shape: 'dot',
        size: 25,
        font: { 
          size: 14, 
          color: '#ffffff',
          strokeWidth: 2,
          strokeColor: '#000000'
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.3)',
          size: 10,
          x: 5,
          y: 5
        },
        color: {
          border: '#ffffff',
          background: '#4a90e2',
          highlight: {
            border: '#ffffff',
            background: '#ff7675'
          },
          hover: {
            border: '#ffffff',
            background: '#74b9ff'
          }
        }
      },
      edges: {
        width: 3,
        color: { 
          color: '#666666',
          opacity: 0.8,
          highlight: '#ff7675',
          hover: '#74b9ff'
        },
        font: { 
          size: 12, 
          align: 'middle',
          color: '#666666',
          strokeWidth: 2,
          strokeColor: '#ffffff'
        },
        arrows: { 
          to: { 
            enabled: true, 
            scaleFactor: 0.8,
            type: 'arrow'
          }
        },
        smooth: { 
          type: 'curvedCW',
          roundness: 0.2
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 5,
          x: 3,
          y: 3
        },
        hoverWidth: 4,
        selectionWidth: 4
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 1
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          fit: true
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        navigationButtons: true,
        keyboard: {
          enabled: true,
          speed: { x: 10, y: 10, zoom: 0.1 }
        }
      },
      layout: {
        improvedLayout: true,
        randomSeed: 42
      }
    };

    // Create a new Network instance with the current data
    networkRef.current = new Network(
      networkContainerRef.current,
      { nodes: boardData.nodes, edges: boardData.edges },
      options
    );

    // Event handlers
    networkRef.current.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = boardData.nodes.get(nodeId);
        setSelectedNode(node);
        
        // Highlight connected nodes
        const connectedNodes = networkRef.current.getConnectedNodes(nodeId);
        networkRef.current.selectNodes([nodeId, ...connectedNodes]);
      } else {
        setSelectedNode(null);
        networkRef.current.unselectAll();
      }
    });

    // Add hover effects
    networkRef.current.on('hoverNode', (params) => {
      networkRef.current.canvas.body.container.style.cursor = 'pointer';
    });

    networkRef.current.on('blurNode', () => {
      networkRef.current.canvas.body.container.style.cursor = 'default';
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, []); // Empty dependency array since we'll update data separately

  // Update network data when boardData changes
  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setData({
        nodes: boardData.nodes,
        edges: boardData.edges
      });
    }
  }, [boardData]);

  // Save data to localStorage
  useEffect(() => {
    if (boardData.nodes.length > 0 || boardData.edges.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        nodes: boardData.nodes.get(),
        edges: boardData.edges.get()
      }));
    }
  }, [boardData]);

  const handleAddNode = useCallback((e) => {
    e.preventDefault();
    if (!newNode.label) return;

    const nodeType = NODE_TYPES[newNode.type];
    const node = {
      id: uuidv4(),
      label: `${nodeType.icon} ${newNode.label}`,
      group: newNode.type,
      color: nodeType.color,
      shape: nodeType.shape,
      title: `${nodeType.label}: ${newNode.label}`,
      font: {
        multi: true,
        size: 14
      }
    };

    addNodeToBoard(node);
    setNewNode({ label: '', type: 'PERSON' });
    setShowAddNodeForm(false);
  }, [newNode, addNodeToBoard]);

  const handleAddEdge = useCallback((e) => {
    e.preventDefault();
    if (!newEdge.from || !newEdge.to) return;

    const edge = {
      id: uuidv4(),
      from: newEdge.from,
      to: newEdge.to,
      label: newEdge.label === 'custom' ? customRelationship : newEdge.label,
      arrows: 'to',
      smooth: {
        type: 'curvedCW',
        roundness: 0.2
      }
    };

    addEdgeToBoard(edge);
    setNewEdge({ from: '', to: '', label: 'related to' });
    setCustomRelationship('');
    setShowAddEdgeForm(false);
  }, [newEdge, customRelationship, addEdgeToBoard]);

  const handleClearBoard = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire board?')) {
      clearBoard();
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [clearBoard]);

  const nodeOptions = boardData.nodes.get().map(node => ({
    value: node.id,
    label: node.label
  }));

  const handleZoom = useCallback((e) => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      setZoomLevel(scale);
    }
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (networkRef.current) {
      const nodes = boardData.nodes.get();
      const matchingNodes = nodes.filter(node => 
        node.label.toLowerCase().includes(query.toLowerCase())
      );
      if (matchingNodes.length > 0) {
        networkRef.current.selectNodes(matchingNodes.map(node => node.id));
        networkRef.current.focus(matchingNodes[0].id, {
          scale: 1,
          animation: true
        });
      }
    }
  }, [boardData.nodes]);

  return (
    <div className="research-board-page">
      <div className="board-header">
        <div className="header-left">
          <h2>Research Board</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
        </div>
        <div className="board-controls">
          <button onClick={() => setShowAddNodeForm(true)} className="control-button">
            <i className="fas fa-plus"></i> Add Node
          </button>
          <button onClick={() => setShowAddEdgeForm(true)} className="control-button">
            <i className="fas fa-link"></i> Add Connection
          </button>
          <button onClick={handleClearBoard} className="control-button danger">
            <i className="fas fa-trash"></i> Clear Board
          </button>
        </div>
      </div>

      <div className="board-container">
        <div className="graph-canvas" ref={networkContainerRef}></div>
        <div className="zoom-controls">
          <button onClick={() => networkRef.current?.moveTo({ scale: 1 })}>
            <i className="fas fa-search-plus"></i>
          </button>
          <span>{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => networkRef.current?.moveTo({ scale: 0.5 })}>
            <i className="fas fa-search-minus"></i>
          </button>
        </div>
      </div>

      {showAddNodeForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Node</h3>
            <form onSubmit={handleAddNode}>
              <div className="form-group">
                <label>Label:</label>
                <input
                  type="text"
                  value={newNode.label}
                  onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                  placeholder="Enter node label"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <div className="node-type-grid">
                  {Object.entries(NODE_TYPES).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      className={`node-type-button ${newNode.type === key ? 'selected' : ''}`}
                      onClick={() => setNewNode({ ...newNode, type: key })}
                    >
                      <span className="node-icon">{value.icon}</span>
                      <span className="node-label">{value.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary">Add Node</button>
                <button type="button" onClick={() => setShowAddNodeForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddEdgeForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Connection</h3>
            <form onSubmit={handleAddEdge}>
              <div className="form-group">
                <label>From:</label>
                <select
                  value={newEdge.from}
                  onChange={(e) => setNewEdge({ ...newEdge, from: e.target.value })}
                  required
                >
                  <option value="">Select source node</option>
                  {nodeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>To:</label>
                <select
                  value={newEdge.to}
                  onChange={(e) => setNewEdge({ ...newEdge, to: e.target.value })}
                  required
                >
                  <option value="">Select target node</option>
                  {nodeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Relationship:</label>
                <select
                  value={newEdge.label}
                  onChange={(e) => setNewEdge({ ...newEdge, label: e.target.value })}
                >
                  {RELATIONSHIP_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {newEdge.label === 'custom' && (
                  <input
                    type="text"
                    value={customRelationship}
                    onChange={(e) => setCustomRelationship(e.target.value)}
                    placeholder="Enter custom relationship"
                    className="custom-relationship-input"
                  />
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="primary">Add Connection</button>
                <button type="button" onClick={() => setShowAddEdgeForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedNode && (
        <div className="node-details">
          <h3>Node Details</h3>
          <p><strong>Label:</strong> {selectedNode.label}</p>
          <p><strong>Type:</strong> {NODE_TYPES[selectedNode.group]?.label || selectedNode.group}</p>
          <div className="node-actions">
            <button onClick={() => navigate('/', { state: { target: selectedNode.label } })}>
              <i className="fas fa-search"></i> Search
            </button>
            <button onClick={() => navigate('/', { state: { target: selectedNode.label, filterType: selectedNode.group } })}>
              <i className="fas fa-tools"></i> Run Tools
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchBoardPage; 