import { configureStore } from "@reduxjs/toolkit";
import verifyOtpSlice from './authSlice'
import getCategorySlice from './categorySlice'
import getCandidateSlice from './getCandidateSlice'
import votingSlice from './voteSlice'

const getPersistedAuth = () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        return JSON.parse(auth);
      } catch {
        return null;
      }
    }
    return null;
  };
  
  const persistedAuth = getPersistedAuth();

export const store = configureStore({
    reducer: {
        verifyOtp: verifyOtpSlice,
        getCategory: getCategorySlice,
        getCandidate: getCandidateSlice,
        voteSlice: votingSlice 


    },
    preloadedState:{
        verifyOtp: {
          loading: false,
          user: persistedAuth?.user || null,
          message: null,
          error: null
        }
      }
})