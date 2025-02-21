import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserValues } from '../redux/slices/userSlice';
import Cookies from 'js-cookie';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      username,
      password,
    };

    try {
      const csrfToken = Cookies.get('XSRF-TOKEN');

      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          //Add if statement making alert to user telling them they cannot log in :)
          'X-XSRF-TOKEN': csrfToken || '',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(data),
      });

      if (response.status === 404) {
        throw new Error('User not found');
      } else if (!response.ok) {
        throw new Error('Server error');
      }

      const result = await response.json();
      console.log(result);

      // Save the user data in Redux (excluding the token)
      dispatch(
        setUserValues({
          username: result.user.username,
          user_id: result.user.id,
        })
      );

      console.log('User stored in Redux:', result.user.username);

      window.location.href = '/'; // Redirect after successful login
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <div>
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
      </div>
      <div></div>
    </div>
  );
};

export default Login;
