import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL

const getCategoryFunc= createAsyncThunk(
    "student/getCategory",
    async(_,thunkAPI)=>{
        try {
            const response = await axios.get(`${url}api/student/get-category`)
            console.log(response)
            return response.data
            
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(
                error?.response?.date?.message || error.message
            )            
        }
    }
)


const getCategorySlice = createSlice({
    name: "getCategory",
    initialState:{
        loading: false,
        category: [],
        error: null,
        message: null
    },

    reducers:{},

    extraReducers: (builder)=>{
        builder
            .addCase(getCategoryFunc.pending, (state)=>{
                state.loading = false
            })
            .addCase(getCategoryFunc.fulfilled, (state,action)=>{
                state.loading = false
                state.category = action.payload.category
            })
            .addCase(getCategoryFunc.rejected,(state,action)=>{
                state.loading = false
                state.error = action.payload?.message
            })
    }
})


export default getCategorySlice.reducer

export {getCategoryFunc}
