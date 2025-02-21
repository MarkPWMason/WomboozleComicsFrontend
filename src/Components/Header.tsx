import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsername, removeUserValues } from '../redux/slices/userSlice';
import Cookies from 'js-cookie';

const Header = () => {
  // Get the username from the Redux store
  const userNameFromStore = useSelector(selectUsername);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const csrfToken = Cookies.get('XSRF-TOKEN');
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'X-XSRF-TOKEN': csrfToken || '',
        },
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      dispatch(removeUserValues()); // Clear Redux state

      window.location.href = '/'; // Redirect after successful logout
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
    }
  };

  return (
    <div>
      {userNameFromStore && (
        <div>
          <p>Welcome, {userNameFromStore}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Header;
