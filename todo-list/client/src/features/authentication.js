import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    password: ''
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    clearLogin: (state) => {
      state.email = '';
      state.password = '';
    }
  }
});

// Export actions
export const { setEmail, setPassword, clearLogin } = loginSlice.actions;

// Export reducer
export default loginSlice.reducer;
