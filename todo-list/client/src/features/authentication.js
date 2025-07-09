// src/features/authentication/loginSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to handle login API call
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message);
      }

      localStorage.setItem('token', data.token); // Save token
      return data;
    } catch (err) {
      if(err) {
        return thunkAPI.rejectWithValue('An error occurred');
      }
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    token: '',
    status: 'idle',
    message: '',
  },
  reducers: {
    logout: (state) => {
      state.token = '';
      state.email = '';
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.message = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.message = 'Successful Login';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.payload || 'Login failed';
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
