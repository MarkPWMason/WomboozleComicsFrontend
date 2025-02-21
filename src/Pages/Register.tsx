import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserValues } from '../redux/slices/userSlice';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  const dispatch = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      username,
      email,
      password,
      password_confirmation,
    };

    try {
      const csrfToken = Cookies.get('XSRF-TOKEN');
      console.log('CSRF Token in handleRegister:', csrfToken);

      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': csrfToken || '', // Fallback to empty string if csrfToken is undefined
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error('Validation Errors:', errorData);
        throw new Error('Server Error');
      }

      const result = await response.json();
      console.log(result);

      dispatch(
        setUserValues({
          username: result.user.username,
          user_id: result.user.id,
        })
      );

      window.location.href = '/';
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
      console.error('Error during registration:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
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
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
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
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          value={password_confirmation}
          onChange={(e) => {
            setPasswordConfirmation(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
