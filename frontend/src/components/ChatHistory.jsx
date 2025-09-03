import React from 'react';

function ChatHistory({ messages }) {
  return (
    <div style={{
      width: '80%',
      maxWidth: '800px',
      flexGrow: 1, // This makes the history fill the available space
      overflowY: 'auto', // Adds a scrollbar if the content overflows
      padding: '20px',
      border: '1px solid #61dafb',
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      {messages.map((msg, index) => (
        <div key={index} style={{
          marginBottom: '15px',
          textAlign: msg.sender === 'user' ? 'right' : 'left'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '10px 15px',
            borderRadius: '10px',
            backgroundColor: msg.sender === 'user' ? '#61dafb' : '#404452',
            color: msg.sender === 'user' ? '#282c34' : 'white',
            maxWidth: '80%'
          }}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatHistory;
