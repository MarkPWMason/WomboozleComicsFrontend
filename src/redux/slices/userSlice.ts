import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type Data = {
  user_id: number;
  username: string;
  auth_token: string;
};

const initialState: Data = {
  user_id: 0,
  username: '',
  auth_token: '',
};

// Store to sessionStorage
const storeInLocalStorage = (state: Data) => {
  sessionStorage.setItem('auth', JSON.stringify(state));
};

// Remove from sessionStorage
const removeFromLocalStorage = () => {
  sessionStorage.removeItem('auth');
};

// Load from sessionStorage (if available)
const loadFromLocalStorage = (): Data => {
  const savedAuth = sessionStorage.getItem('auth');
  return savedAuth ? JSON.parse(savedAuth) : initialState; // Use `initialState` as fallback
};

export const userSlice = createSlice({
  name: 'userSlice', // has to match the name of the reducer in store.ts
  initialState: loadFromLocalStorage(), // Load user data if it's available in sessionStorage
  reducers: {
    setUserValues: (state, action) => {
      const { user_id, username, auth_token } = action.payload;
      state.user_id = user_id;
      state.username = username;
      state.auth_token = auth_token;
      storeInLocalStorage(state); // Store updated state in sessionStorage
    },
    removeUserValues: (state) => {
      state.user_id = 0;
      state.username = '';
      state.auth_token = '';
      removeFromLocalStorage(); // Remove data from sessionStorage
    },
  },
});

export const { setUserValues, removeUserValues } = userSlice.actions;
export const selectUsername = (state: RootState) => state.userSlice.username;
export const selectUserID = (state: RootState) => state.userSlice.user_id;
export const selectAuthToken = (state: RootState) => state.userSlice.auth_token;
export default userSlice.reducer;
