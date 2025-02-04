import React from 'react';
import styles from './App.module.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import { Register } from './Pages/Register';

function App() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
