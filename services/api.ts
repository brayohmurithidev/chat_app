import axios from "axios";
import * as SecureStore from 'expo-secure-store'
import {Platform} from "react-native";


const BASE_URL = Platform.OS === "android" ? "http://192.168.0.103:5454": 'http://127.0.0.1:5454';
export const SOCKET_URL = Platform.OS === "android" ? "http://192.168.0.103:6000": 'http://127.0.0.1:6000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json'
    }
})


api.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync('token');

        // // Check if the device is offline
        // const state = await NetInfo.fetch();
        // if (!state.isConnected) {
        //     return Promise.reject({
        //         message: "No internet connection",
        //         status: 503
        //     });
        // }

        // Attach the access token if available
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            // config.headers['content-type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);  // Correctly rejecting the error
    }
);



export default api