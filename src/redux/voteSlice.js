import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const url = import.meta.env.VITE_BACKEND_URL; // replace with your actual API base URL

export const userVoting = createAsyncThunk(
  "user/voting",
  async (voteData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.post(
        `${url}api/student/vote`,
        voteData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response)

      return response.data;

    } catch (error) {
        console.log(error)
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message
      );
    }
  }
);


const votingSlice = createSlice({
    name: "voteSlice",
    initialState:{
        loading: false,
        error: null,
        message: null

    },
    reducers:{},

    extraReducers: (builder)=>{
        builder
            .addCase(userVoting.pending, (state)=>{
                state.loading = true
            })
            .addCase(userVoting.fulfilled, (state,action)=>{
                state.loading = false
                state.message = action.payload.message
            })
            .addCase(userVoting.rejected, (state,action)=>{
                state.loading = false
                state.error = action.payload?.message
            })
    }
})


export default votingSlice.reducer

