import { createSlice } from "@reduxjs/toolkit";

// Helper function to get initial state from localStorage
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      suggestedUsers: [],
      userProfile: null,
      selectedUser: null,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return {
      user: null,
      suggestedUsers: [],
      userProfile: null,
      selectedUser: null,
      loading: false,
      error: "Failed to load user data",
    };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
      // Save to localStorage
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    logout: (state) => {
      state.user = null;
      state.userProfile = null;
      state.selectedUser = null;
      state.error = null;
      localStorage.removeItem("user");
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload !== undefined ? action.payload : true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    // New reducer to handle follow status updates
    updateFollowStatus: (state, action) => {
      const { suggestedUserId, currentUserId, isFollowing } = action.payload;
      
      // Update the suggestedUsers array
      state.suggestedUsers = state.suggestedUsers.map(user => {
        if (user._id === suggestedUserId) {
          return {
            ...user,
            followers: isFollowing 
              ? [...user.followers, currentUserId]
              : user.followers.filter(id => id !== currentUserId)
          };
        }
        return user;
      });

      // Also update the user profile if it's the same user
      if (state.userProfile && state.userProfile._id === suggestedUserId) {
        state.userProfile = {
          ...state.userProfile,
          followers: isFollowing
            ? [...state.userProfile.followers, currentUserId]
            : state.userProfile.followers.filter(id => id !== currentUserId)
        };
      }
    },
  },
});

export const {
  setAuthUser,
  logout,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  setLoading,
  setError,
  clearError,
  updateFollowStatus,
} = authSlice.actions;

export default authSlice.reducer;
