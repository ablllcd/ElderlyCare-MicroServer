import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logoutSuccess: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        },
        tokenExpired: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        }
    },
});

export const { loginSuccess, logoutSuccess, tokenExpired } = authSlice.actions;
export default authSlice.reducer;