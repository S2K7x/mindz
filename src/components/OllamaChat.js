import React, { useState, useEffect } from 'react';
import { ollamaService } from '../utils/ollamaService';
import '../styles/OllamaChat.css';

const OllamaChat = ({ selectedCategory }) => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const availableModels = await ollamaService.listModels();
      setModels(availableModels);
      if (availableModels.length > 0) {
        setSelectedModel(availableModels[0].name);
      }
    } catch (error) {
      setError('Failed to load models. Make sure Ollama is running locally.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !selectedModel) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    
    setIsLoading(true);
    setError(null);
    try {
      const fullPrompt = selectedCategory && selectedCategory !== 'All Tools' 
        ? `User is currently viewing the \'${selectedCategory}\' section. ${userMessage}` 
        : userMessage;

      const result = await ollamaService.generateResponse(selectedModel, fullPrompt);
      setMessages(prev => [...prev, { type: 'assistant', content: result }]);
    } catch (error) {
      setError('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ollama-chat-bot ${isOpen ? 'open' : ''}`}>
      <button 
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        <i className={`fas fa-${isOpen ? 'times' : 'robot'}`}></i>
      </button>

      <div className="chat-window">
        <div className="chat-header">
          <div className="model-selector">
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="model-select"
            >
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="messages-container">
          {error && <div className="error-message">{error}</div>}
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading || !prompt.trim()}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OllamaChat; 