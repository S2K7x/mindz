const OLLAMA_API_URL = 'http://localhost:11434/api';

export const ollamaService = {
  async generateResponse(model, prompt) {
    try {
      const response = await fetch(`${OLLAMA_API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw error;
    }
  },

  async listModels() {
    try {
      const response = await fetch(`${OLLAMA_API_URL}/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      throw error;
    }
  }
}; 