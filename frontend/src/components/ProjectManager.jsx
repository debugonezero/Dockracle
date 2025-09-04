import React from 'react';

function ProjectManager({ onSave, onNewProject, savedProjects, onLoadProject }) {
  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      left: '20px', 
      zIndex: 10
    }}>
      <div className="button-group" style={{ marginBottom: '10px' }}>
        <button onClick={onNewProject} className="button">
          New Project
        </button>
        <button onClick={onSave} className="button">
          Save Project
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
        {savedProjects.map((project) => (
          <li 
            key={project.id} 
            onClick={() => onLoadProject(project.id)}
            style={{
              cursor: 'pointer',
              padding: '5px 10px',
              backgroundColor: 'var(--secondary-accent-color)',
              marginBottom: '5px',
              borderRadius: '5px',
              fontSize: '0.7em',
            }}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectManager;