import React, { useEffect } from 'react';
import styles from './App.module.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import Cookies from 'js-cookie';

function App() {
  useEffect(() => {
    async function fetchCsrfToken() {
      try {
        const response = await fetch(
          'http://localhost:8000/sanctum/csrf-cookie',
          {
            credentials: 'include', // Include cookies
          }
        );

        if (response.ok) {
          console.log('CSRF token fetched successfully');

          // Use js-cookie to check if the XSRF-TOKEN cookie is set
          const csrfToken = Cookies.get('XSRF-TOKEN');
          console.log('CSRF Token:', csrfToken);
        } else {
          console.error('Failed to fetch CSRF token');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    }

    fetchCsrfToken();
  }, []);

  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
