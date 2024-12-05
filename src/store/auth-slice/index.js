import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (credentials) => {
        const response = await axios.post(
            'http://localhost:5000/api/auth/register',
            credentials,
            {
                withCredentials: true
            }
        );
        return response.data
    }
)

// export const loginUser = createAsyncThunk(
//     'auth/login',
//     async (credentials) => {
//         const response = await axios.post(
//             'http://localhost:5000/api/auth/login',
//             credentials,
//             {
//                 withCredentials: true
//             }
//         );
//         console.log(response.data);
//         return response.data
//     }
// )

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/login',
          credentials,
          { withCredentials: true }
        );
  
        // If the backend indicates success, return the data
        return response.data;
      } catch (error) {
        // If the backend responds with an error, pass it to rejectWithValue
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data); // Pass backend response (success, message)
        }
  
        // For unexpected errors, pass a generic message
        return rejectWithValue({
          success: false,
          message: 'An unexpected error occurred',
        });
      }
    }
  );
  

// Thunk for logging out a user
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        const response = await axios.post(
            'http://localhost:5000/api/auth/logout', {},
            {
                withCredentials: true,
            }
        );
        
        return response.data;
    }
);


export const checkAuth = createAsyncThunk(
    'auth/checkauth',
    async () => {
        const response = await axios.get(
            'http://localhost:5000/api/auth/check-auth',
            {
                withCredentials: true,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    Expires: '0'

                }
            }
        );
        return response.data
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
        }
    },
    extraReducers: (builder) => {
        // Handle registerUser pending state
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true; // Set loading state to true
            })
            // Handle successful registration
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false; // Set loading state to false
                state.user = state.user; // set to state.user
                state.isAuthenticated = true; // Set authentication to true
            })
            // Handle registration failure
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false; // Set loading state to false
                state.user = state.user; // user.state
                state.isAuthenticated = true; // Set authentication to true
            })
        // Handle loginUser pending state
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true; // Set loading state to true
        })
            // Handle successful login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false; // Set loading state to false
                state.user = action.payload.success ? action.payload.user : null; // Clear user data
                state.isAuthenticated = action.payload.success; // Set authentication to true
            })
            // Handle registration failure
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false; // Set loading state to false
                state.user = null; // Clear user data
                state.isAuthenticated = false; // Set authentication to false
            });
        // Handle loginUser pending state
        builder.addCase(checkAuth.pending, (state) => {
            state.isLoading = true; // Set loading state to true
        })
            // Handle successful login
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false; // Set loading state to false
                state.user = action.payload.success ? action.payload.user : null; // Clear user data
                state.isAuthenticated = action.payload.success; // Set authentication to true
            })
            // Handle registration failure
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false; // Set loading state to false
                state.user = null; // Clear user data
                state.isAuthenticated = false; // Set authentication to false
            })

            // Handle logoutUser
            .addCase(logoutUser.fulfilled, (state, action) => {
                console.log('Logout Successful', action.payload);
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false; // User is logged out
            })
    }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer