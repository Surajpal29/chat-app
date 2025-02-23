import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

import { io } from "socket.io-client"

const BASE_URL= import.meta.env.MODE==="development"?"http://localhost:5001":"/"

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigninUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            
            set({ authUser: res.data })
            
            get().connectSocket()
        } catch (error) {
            console.log('====================================');
            console.log("Error in checkauth: " + error);
            console.log('====================================');
            set({authUser:null})
        } finally {
            set({isCheckingAuth:false})
        }
    },

    signup: async (data) => {
        set({isSigninUp:true})
       try {
           const res = await axiosInstance.post("/auth/signup", data)
           set({ authUser: res.data })
           toast.success("Account created successfully")

           get().connectSocket()
       } catch (error) {
        toast.error("Error in signup: " + error.response.data.message)
       } finally {
           set({ isSigninUp: false })
       }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error("Error in logout: " + error.response.data.message)
        }
    },

    login: async (data) => {
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")

            get().connectSocket()
        } catch (error) {
            toast.error("Error in login: " + error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log('====================================');
            console.log("Error in update-profile: " + error);
            console.log('====================================');
            toast.error("Error in updateProfile: " + error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        
        if (!authUser || get().socket?.connected) return

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        })
        socket.connect()

        set({ socket: socket })
        
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: () => {

        if(get().socket?.connected) get().socket.disconnect()
    }
    
}))