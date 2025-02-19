import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

import {router} from "expo-router";
import api from "@/services/api";
import * as SecureStore from 'expo-secure-store';
import {useAuth} from "@/context/AuthProvider";


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
   const {login} = useAuth()

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { username, password });
            const {token, user} = response.data;
           await login(token, user)
            // Save token to AsyncStorage or context
            router.replace('/(auth)');
        } catch (error) {
            // @ts-ignore
            console.error('Login failed:', error?.response?.data);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">Login</Text>
            <TextInput
                className="border px-2 h-12 mb-4 rounded"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                className="border p-2 h-12 mb-4 rounded"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Pressable
                className="bg-blue-500 p-3 rounded items-center"
                onPress={handleLogin}
            >
                <Text className="text-white text-2xl">Login</Text>
            </Pressable>
            <Pressable
                className="mt-4"
                onPress={() => router.navigate('/register')}
            >
                <Text className="text-blue-500">Don't have an account? Register</Text>
            </Pressable>
        </View>
    );
};

export default LoginScreen;