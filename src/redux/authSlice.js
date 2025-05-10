import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const url = import.meta.env.VITE_BACKEND_URL
const verifyOtp = createAsyncThunk(
    "student/verifyOtp",
    async(data, {rejectWithValue})=>{
        try {
            const response = await axios.post(`${url}api/auth/verify-otp`,data)
            console.log(response)
            return response.data

        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data.message || err.message);

            
        }
    }
)


const verifyOtpSlice = createSlice({
    name: "verifyOtp",
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null, 
        message: null
    },

    reducers: {
        clearError: (state) => {
            state.error = null;
          },
    },

    extraReducers: (builder)=>{
        builder
            .addCase(verifyOtp.pending, (state)=>{
                state.loading = true
            })
            .addCase(verifyOtp.fulfilled, (state,action)=>{
                state.loading = false,
                state.message = action.payload.message 
                state.token = action.payload.token
                state.user = action.payload.studentData
                localStorage.setItem("auth", JSON.stringify({
                    user: action.payload.studentData,
                  }));
            })
            .addCase(verifyOtp.rejected, (state,action)=>{
                state.loading = false
                state.error = action.payload
                state.message = action.payload.message
            })
    }
})

export default verifyOtpSlice.reducer 
export { verifyOtp }
