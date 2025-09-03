import React, { useState } from 'react';

// We now accept the 'onSendMessage' function as a prop!
function PromptInput({ onSendMessage }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (prompt.trim() === '') return; // Don't send empty messages

    // Call the function passed down from the App component!
    onSendMessage(prompt);

    setPrompt(''); // Clear the input box
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '80%', maxWidth: '800px' }}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Speak your command to the titan..."
        style={{
          width: '100%',
          padding: '15px',
          fontSize: '1.2em',
          backgroundColor: '#404452',
          color: 'white',
          border: '1px solid #61dafb',
          borderRadius: '5px',
          boxSizing: 'border-box'
        }}
      />
    </form>
  );
}

export default PromptInput;
