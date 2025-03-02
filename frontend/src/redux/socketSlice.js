import { createSlice } from "@reduxjs/toolkit";
import { setLikeNotification } from "./rtnSlice"; // Import notification actions

const socketSlice = createSlice({
    name: "socketio",
    initialState: {
        socket: null,
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    },
});

// Middleware to handle real-time notifications
export const socketMiddleware = (socket) => (dispatch) => {
    if (!socket) return;

    // 🔔 Listen for like notification
    socket.on("like", (notificationData) => {
        dispatch(setLikeNotification({ type: "like", ...notificationData }));
    });

    // 🔕 Listen for dislike (remove notification)
    socket.on("dislike", (notificationData) => {
        dispatch(setLikeNotification({ type: "dislike", ...notificationData }));
    });
};

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
