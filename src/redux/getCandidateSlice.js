import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const url = import.meta.env.VITE_BACKEND_URL

const getCandidateFunc= createAsyncThunk(
    "student/getCandidate",
    async(id,thunkAPI)=>{
        try {
            const response = await axios.get(`${url}api/student/get-candidate`,{
                params: {id}
            })
            return response.data
            
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(
                error?.response?.date?.message || error.message
            )            
        }
    }
)


const getCandidateSlice = createSlice({
    name: "getCandidate",
    initialState:{
        loading: false,
        candidate: [],
        error: null,
        message: null
    },

    reducers:{
        resetCandidates: (state) => {
            state.candidate = [];
            state.error = null;
            state.loading = false;
          },
    },

    extraReducers: (builder)=>{
        builder
            .addCase(getCandidateFunc.pending, (state)=>{
                state.loading = false
            })
            .addCase(getCandidateFunc.fulfilled, (state,action)=>{
                state.loading = false
                state.candidate = action.payload.candidate
            })
            .addCase(getCandidateFunc.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload?.message
            })
    }
})


export const { resetCandidates } = getCandidateSlice.actions;

export default getCandidateSlice.reducer

export {getCandidateFunc}
