import { createSlice } from '@reduxjs/toolkit';

const loadUserFromLocalStorage = () => {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : { username: '', user_id: 0 };
};

const initialState = loadUserFromLocalStorage();

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserValues: (state, action) => {
      const { username, user_id } = action.payload;
      state.username = username;
      state.user_id = user_id;
      // Save user data to localStorage
      sessionStorage.setItem('user', JSON.stringify({ username, user_id }));
    },
    removeUserValues: (state) => {
      state.username = '';
      state.user_id = 0;
      // Remove user data from localStorage
      sessionStorage.removeItem('user');
    },
  },
});

export const { setUserValues, removeUserValues } = userSlice.actions;
export const selectUsername = (state: any) => state.userSlice.username;
export default userSlice.reducer;
