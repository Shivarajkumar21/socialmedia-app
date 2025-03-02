import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [], // Stores notifications
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {
                // Prevent duplicate notifications
                const exists = state.likeNotification.some(
                    (item) => item.userId === action.payload.userId && item.postId === action.payload.postId
                );
                if (!exists) {
                    state.likeNotification.push(action.payload);
                }
            } else if (action.payload.type === 'dislike') {
                // Remove only the specific post's notification
                state.likeNotification = state.likeNotification.filter(
                    (item) => item.userId !== action.payload.userId || item.postId !== action.payload.postId
                );
            }
        },
        clearNotifications: (state) => {
            state.likeNotification = [];
        }
    }
});

export const { setLikeNotification, clearNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
