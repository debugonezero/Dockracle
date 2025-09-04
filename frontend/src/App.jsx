import React, { useState } from 'react';
import PromptInput from './components/PromptInput';
import ChatHistory from './components/ChatHistory';
import DivergenceMeter from './components/DivergenceMeter';
import WorldlineSelector from './components/WorldlineSelector'; // We summon the new selector!

function App() {
  const [divergence, setDivergence] = useState('1.048596');
  const [messages, setMessages] = useState([
    { sender: 'oracle', text: 'The Oracle Interface is Online. Awaiting Commands.' }
  ]);
  // The new memory for holding the three choices in superposition!
  const [pendingWorldlines, setPendingWorldlines] = useState([]);

  const handleSendMessage = async (promptText) => {
    const newUserMessage = { sender: 'user', text: promptText };
    // We add the user's message and a "thinking" message
    setMessages(prev => [...prev, newUserMessage, { sender: 'oracle', text: 'Observing divergent possibilities...' }]);

    try {
      const response = await fetch('http://localhost:5100/summon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3.2:3b', prompt: promptText }),
      });

      if (!response.ok) throw new Error('The titan did not respond correctly.');

      const data = await response.json();
      // Instead of picking one, we place all three in our pending state!
      setPendingWorldlines(data.worldlines);
      // We remove the "thinking..." message
      setMessages(prev => prev.slice(0, -1));

    } catch (error) {
      console.error("Error summoning the titan:", error);
      const errorResponse = { sender: 'oracle', text: 'Error: Could not summon the titan. Is the forge running?' };
      setMessages(prev => [...prev.slice(0, -1), errorResponse]);
    }
  };

  // This function collapses the waveform when a choice is made!
  const handleSelectWorldline = (worldline) => {
    const titanResponse = { sender: 'oracle', text: worldline.text };
    setMessages(prev => [...prev, titanResponse]);
    setDivergence(worldline.divergence);
    setPendingWorldlines([]); // Clear the choices, returning to the normal prompt
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#282c34',
      color: 'white',
      fontFamily: 'monospace',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <DivergenceMeter divergenceNumber={divergence} />
      <ChatHistory messages={messages} />
      {/* We now conditionally render either the selector or the prompt! */}
      {pendingWorldlines.length > 0 ? (
        <WorldlineSelector worldlines={pendingWorldlines} onSelect={handleSelectWorldline} />
      ) : (
        <PromptInput onSendMessage={handleSendMessage} />
      )}
    </div>
  );
}

export default App;