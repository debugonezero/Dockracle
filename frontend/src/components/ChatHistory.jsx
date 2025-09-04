import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown'; // We summon the new scribe!

const ChatHistory = forwardRef(({ messages }, ref) => {
  return (
    <div ref={ref} className="chat-history">
      {messages.map((msg, index) => (
        <div key={index} style={{
          marginBottom: '15px',
          textAlign: msg.sender === 'user' ? 'right' : 'left'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '10px 15px',
            borderRadius: '10px',
            backgroundColor: msg.sender === 'user' ? 'var(--message-user-bg)' : 'var(--message-oracle-bg)',
            color: msg.sender === 'user' ? 'var(--message-user-text)' : 'var(--message-oracle-text)',
            maxWidth: '80%',
            textAlign: 'left',
          }}>
            {/* We now use the magnificent ReactMarkdown component for the oracle's messages! */}
            {msg.sender === 'oracle' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChatHistory;
