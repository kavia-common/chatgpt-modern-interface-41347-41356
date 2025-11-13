import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Hello from './routes/Hello';
import Chat from './routes/Chat';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'auto', paddingBottom: 24, position: 'relative' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <NavBar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/hello" element={<Hello />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
