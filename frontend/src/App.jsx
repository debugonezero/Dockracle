import React, { useState, useEffect, useRef } from 'react';
import PromptInput from './components/PromptInput';
import ChatHistory from './components/ChatHistory';
import ProjectManager from './components/ProjectManager';

function App() {
  // ... (all state and logic functions remain the same)
  const [messages, setMessages] = useState([]);
  const [undoneMessages, setUndoneMessages] = useState([]);
  const [tokensPerSecond, setTokensPerSecond] = useState(0);
  const [savedProjects, setSavedProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const loadedProjects = JSON.parse(localStorage.getItem('dockracle_projects')) || [];
    setSavedProjects(loadedProjects);
    if (loadedProjects.length > 0) {
      handleLoadProject(loadedProjects[0].id);
    } else {
      handleNewProject();
    }
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      const { scrollHeight, clientHeight } = chatHistoryRef.current;
      chatHistoryRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  const handleSaveProject = () => {
    const projectName = prompt("Enter a name for this project:", `Project ${Date.now()}`);
    if (!projectName) return;
    const newProject = { id: currentProjectId || Date.now(), name: projectName, messages: messages };
    const updatedProjects = savedProjects.filter(p => p.id !== newProject.id);
    updatedProjects.unshift(newProject);
    setSavedProjects(updatedProjects);
    localStorage.setItem('dockracle_projects', JSON.stringify(updatedProjects));
    alert(`Project "${projectName}" saved!`);
  };

  const handleLoadProject = (projectId) => {
    const projectToLoad = savedProjects.find(p => p.id === projectId);
    if (projectToLoad) {
      setMessages(projectToLoad.messages);
      setCurrentProjectId(projectToLoad.id);
      setUndoneMessages([]);
    }
  };

  const handleNewProject = () => {
    setMessages([{ sender: 'oracle', text: 'New Project Initialized. Awaiting Commands.' }]);
    setCurrentProjectId(null);
    setUndoneMessages([]);
  };

  const handleUndo = () => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const secondLastMessage = messages[messages.length - 2];
      if (lastMessage.sender === 'oracle' && secondLastMessage.sender === 'user') {
        setUndoneMessages([secondLastMessage, lastMessage]);
        setMessages(prev => prev.slice(0, -2));
      }
    }
  };

  const handleRedo = () => {
    if (undoneMessages.length > 0) {
      setMessages(prev => [...prev, ...undoneMessages]);
      setUndoneMessages([]);
    }
  };

  const handleSendMessage = async (promptText) => {
    setUndoneMessages([]);
    const newUserMessage = { sender: 'user', text: promptText };
    setMessages(prev => [...prev, newUserMessage, { sender: 'oracle', text: '' }]);

    let model = 'llama3.2:3b';
    let prompt = promptText;

    if (promptText.startsWith('@')) {
      const parts = promptText.split(' ');
      const modelMention = parts.shift();
      model = modelMention.substring(1);
      prompt = parts.join(' ');
    }

    try {
      const response = await fetch('http://localhost:5100/summon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model, prompt: prompt }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let boundary = buffer.indexOf('\n\n');
          while (boundary !== -1) {
            const chunk = buffer.substring(0, boundary);
            buffer = buffer.substring(boundary + 2);
            if (chunk.startsWith('data:')) {
              const jsonString = chunk.substring(5);
              if (jsonString.trim()) {
                const data = JSON.parse(jsonString);
                if (data.done) {
                  reader.cancel();
                  return;
                }
                if (data.token) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text += data.token;
                    return newMessages;
                  });
                }
              }
            }
            boundary = buffer.indexOf('\n\n');
          }
        }
      };
      await processStream();
    } catch (error) {
      console.error("Error summoning the titan:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = 'Error: Could not connect to the forge.';
        return newMessages;
      });
    }
  };

  return (
    <div className="app-container">
      <ProjectManager 
        onSave={handleSaveProject} 
        onNewProject={handleNewProject}
        savedProjects={savedProjects}
        onLoadProject={handleLoadProject}
      />
      {/* The Chronometer can be added back here if desired */}
      <ChatHistory messages={messages} ref={chatHistoryRef} />
      <PromptInput onSendMessage={handleSendMessage} />
      <div className="button-group">
        <button className="button" onClick={handleUndo}>
          Undo
        </button>
        <button className="button" onClick={handleRedo} disabled={undoneMessages.length === 0}>
          Redo
        </button>
      </div>
    </div>
  );
}

export default App;
