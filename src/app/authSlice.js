const { createSlice } = require("@reduxjs/toolkit");

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    error: null,
    authenticated: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    authenticate: (state) => {
      state.authenticated = true;
    },
    deAuthenticate: (state) => {
      state.authenticated = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addUser, authenticate, deAuthenticate, setError } =
  authSlice.actions;

export default authSlice.reducer;
