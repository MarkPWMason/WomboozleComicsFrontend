import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthToken,
  selectUsername,
  setUserValues,
  removeUserValues,
} from '../redux/slices/userSlice';

const Header = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Always call useSelector at the top of the component (unconditionally)
  const authToken = useSelector(selectAuthToken);
  const userNameFromStore = useSelector(selectUsername);
  const dispatch = useDispatch();

  // useEffect to check if we have user data in sessionStorage
  useEffect(() => {
    if (!authToken) {
      const savedUserData = sessionStorage.getItem('auth');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        if (parsedData.auth_token) {
          dispatch(setUserValues(parsedData)); // Set user data from sessionStorage if present
        }
      }
    }
  }, [authToken, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.status === 404) {
        throw new Error('User not found');
      } else if (!response.ok) {
        throw new Error('Server error');
      }

      const result = await response.json();
      console.log(result);

      // Save the user data in Redux and sessionStorage
      dispatch(
        setUserValues({
          username: result.user.username,
          user_id: result.user.id,
          auth_token: result.token,
        })
      );

      window.location.href = '/'; // Redirect after successful login
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/user/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`, // Send the token in the Authorization header
          Accept: 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      sessionStorage.removeItem('auth'); // Remove auth data from sessionStorage
      dispatch(removeUserValues()); // Clear Redux state

      window.location.href = '/'; // Redirect after successful logout
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };

  return (
    <div>
      {authToken ? (
        <div>
          <p>Welcome, {userNameFromStore}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Header;
