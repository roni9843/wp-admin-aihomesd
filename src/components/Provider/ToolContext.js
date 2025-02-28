// ToolContext.js
import React, { createContext, useContext, useState } from 'react';

const ToolContext = createContext();

export function ToolProvider({ children }) {
  const [floatingTools, setFloatingTools] = useState({
    calculator: false,
    timer: false,
    converter: false,
    notes: false,
  });

  const toggleFloat = (tool) => {
    setFloatingTools(prev => ({ ...prev, [tool]: !prev[tool] }));
  };

  return (
    <ToolContext.Provider value={{ floatingTools, toggleFloat }}>
      {children}
    </ToolContext.Provider>
  );
}

export const useTools = () => useContext(ToolContext);