import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DataSet } from 'vis-network/standalone';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'kyozResearchBoardData';
const LOCAL_STORAGE_CUSTOM_DORKS_KEY = 'kyozCustomDorks';

const ResearchBoardContext = createContext(null);

export const useResearchBoard = () => {
  const context = useContext(ResearchBoardContext);
  if (!context) {
    throw new Error('useResearchBoard must be used within a ResearchBoardProvider');
  }
  return context;
};

export const ResearchBoardProvider = ({ children }) => {
  // Initialize boardData with mutable DataSets
  const [boardData, setBoardData] = useState({
    nodes: new DataSet(),
    edges: new DataSet(),
  });

  // Save to localStorage whenever boardData changes
  const saveBoardDataToLocalStorage = useCallback(() => {
    // Check if nodes or edges DataSets have any items before saving
    if ((boardData.nodes instanceof DataSet && boardData.nodes.length > 0) || (boardData.edges instanceof DataSet && boardData.edges.length > 0)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        nodes: boardData.nodes.get(),
        edges: boardData.edges.get()
      }));
      console.log("Board data saved to localStorage.");
    } else if ((boardData.nodes instanceof DataSet && boardData.nodes.length === 0) && (boardData.edges instanceof DataSet && boardData.edges.length === 0)) {
       // Explicitly clear localStorage if board becomes empty
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        console.log("Board data cleared from localStorage (via empty state save).");
    }
  }, [boardData]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && Array.isArray(parsedData.nodes) && Array.isArray(parsedData.edges)) {
          // Validate that all nodes and edges are objects
          const validNodes = parsedData.nodes.filter(item => item !== null && typeof item === 'object' && !Array.isArray(item));
          const validEdges = parsedData.edges.filter(item => item !== null && typeof item === 'object' && !Array.isArray(item));

          if (validNodes.length === parsedData.nodes.length && validEdges.length === parsedData.edges.length) {
             setBoardData({ nodes: new DataSet(validNodes), edges: new DataSet(validEdges) });
          } else {
              console.error("Loaded data contains invalid items (not objects). Initializing with empty board.");
              // If invalid items are found, initialize with empty DataSets
              setBoardData({ nodes: new DataSet(), edges: new DataSet() });
          }
        } else {
           console.error("Invalid data format in localStorage (nodes or edges not arrays). Initializing with empty board.");
           setBoardData({ nodes: new DataSet(), edges: new DataSet() });
        } // --- End validation --- 

      } catch (error) {
        console.error("Failed to parse board data from localStorage:", error);
        setBoardData({ nodes: new DataSet(), edges: new DataSet() });
      }
    } else {
      setBoardData({ nodes: new DataSet(), edges: new DataSet() });
    }
  }, []); // Empty dependency array so it runs only once on mount

  // Trigger localStorage save whenever boardData changes after initial load
  useEffect(() => {
      // Avoid saving on the initial load, only save on subsequent changes
      if (boardData.nodes.length > 0 || boardData.edges.length > 0 || localStorage.getItem(LOCAL_STORAGE_KEY) !== null) {
         saveBoardDataToLocalStorage();
      }
  }, [boardData, saveBoardDataToLocalStorage]);

  // Function to add a node
  const addNodeToBoard = useCallback((node) => {
    // Use the existing DataSet instance and add the node
    boardData.nodes.add(node);
    // No need to call setBoardData here, Vis handles network updates based on DataSet changes
    // and the useEffect hook above will handle localStorage saving based on boardData reference change
  }, [boardData]);

  // Function to add an edge
  const addEdgeToBoard = useCallback((edge) => {
    // Use the existing DataSet instance and add the edge
    boardData.edges.add(edge);
     // No need to call setBoardData here
  }, [boardData]);

  // Function to clear the board
  const clearBoard = useCallback(() => {
    boardData.nodes.clear();
    boardData.edges.clear();
    // Creating new DataSets ensures the reference changes, triggering effects if needed
    setBoardData({ nodes: new DataSet(), edges: new DataSet() });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log("Board data cleared from localStorage.");
  }, [boardData]);

   // Function to save the current board data to a JSON file
   const saveBoardToFile = useCallback(() => {
       try {
           const dataToSave = {
               nodes: boardData.nodes.get(),
               edges: boardData.edges.get(),
               timestamp: new Date().toISOString() // Add a timestamp
           };
           const jsonString = JSON.stringify(dataToSave, null, 2); // Pretty print JSON
           const blob = new Blob([jsonString], { type: 'application/json' });
           const url = URL.createObjectURL(blob);

           const link = document.createElement('a');
           link.href = url;
           link.download = `kyoz_research_board_${Date.now()}.json`; // Generate a unique filename
           document.body.appendChild(link); // Required for Firefox
           link.click();

           document.body.removeChild(link); // Clean up
           URL.revokeObjectURL(url); // Free up memory

           console.log("Research board data exported to file.");
           alert("Research board data saved to file!");

       } catch (error) {
           console.error("Failed to save board data to file:", error);
           alert("Failed to save research board data.");
       }
   }, [boardData]);

    // Function to load board data from a JSON file
    const loadBoardFromFile = useCallback(() => {
        // Create an input element to select a file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json'; // Only accept JSON files

        input.onchange = (event) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const fileContent = e.target?.result;
                    if (typeof fileContent !== 'string') {
                        alert("Error reading file.");
                        return;
                    }
                    const parsedData = JSON.parse(fileContent);

                    // Validate the loaded data structure
                    if (parsedData && Array.isArray(parsedData.nodes) && Array.isArray(parsedData.edges)) {
                        // Optional: More rigorous validation of node/edge properties if needed
                        const validNodes = parsedData.nodes.filter(item => item !== null && typeof item === 'object' && !Array.isArray(item));
                        const validEdges = parsedData.edges.filter(item => item !== null && typeof item === 'object' && !Array.isArray(item));

                        if (validNodes.length === parsedData.nodes.length && validEdges.length === parsedData.edges.length) {
                             // Clear current board and set new data
                             boardData.nodes.clear();
                             boardData.edges.clear();
                             boardData.nodes.add(validNodes);
                             boardData.edges.add(validEdges);
                              // Trigger state update to ensure components re-render and localStorage saves
                             setBoardData({ nodes: boardData.nodes, edges: boardData.edges });
                             alert("Research board data loaded successfully!");
                        } else {
                            console.error("Loaded data contains invalid node or edge objects.");
                            alert("Error: File contains invalid data.");
                        }

                    } else {
                        console.error("Invalid file format. Expected JSON with 'nodes' and 'edges' arrays.");
                        alert("Error: Invalid file format.");
                    }

                } catch (error) {
                    console.error("Error parsing or processing file:", error);
                    alert("Error processing file.");
                }
            };

            reader.onerror = () => {
                console.error("Error reading file.", reader.error);
                alert("Error reading file.");
            };

            reader.readAsText(file); // Read the file as text
        };

        // Programmatically click the input to open the file dialog
        input.click();
    }, [boardData]); // Dependency on boardData to ensure we interact with the current DataSet instances

  const value = {
    boardData,
    setBoardData, // Keep setBoardData for initial loading if needed
    addNodeToBoard,
    addEdgeToBoard,
    clearBoard,
    saveBoardToFile, // Expose the save function
    loadBoardFromFile, // Expose the load function
  };

  return (
    <ResearchBoardContext.Provider value={value}>
      {children}
    </ResearchBoardContext.Provider>
  );
}; 