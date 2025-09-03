import React, { useState } from 'react';
import PromptInput from './components/PromptInput';
import ChatHistory from './components/ChatHistory';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'oracle', text: 'The 0racle Interface is 0nline. Awaiting Commands.' }
  ]);

  const handleSendMessage = async (promptText) => {
    // 1. Add the user's message to the history immediately
    const newUserMessage = { sender: 'user', text: promptText };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    // 2. Send the summons to the Titan Forge backend
    try {
      const response = await fetch('http://localhost:5100/summon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2:3b', // We'll keep this hardcoded for now
          prompt: promptText,
        }),
      });

      if (!response.ok) {
        throw new Error('The titan did not respond correctly.');
      }

      const data = await response.json();
      const titanResponse = { sender: 'oracle', text: data.response };

      // 3. Add the titan's response to the history
      setMessages(prevMessages => [...prevMessages, titanResponse]);

    } catch (error) {
      console.error("Error summoning the titan:", error);
      const errorResponse = { sender: 'oracle', text: 'Error: Could not summon the titan. Is the forge running?' };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#282c34',
      color: 'white',
      fontFamily: 'monospace',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <ChatHistory messages={messages} />
      <PromptInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;