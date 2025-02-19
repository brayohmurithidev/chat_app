import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import  api  from '../services/api';
import {router} from "expo-router";

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            console.log({username, password});
            const response = await api.post('/register', { username, password });
            router.navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <View className="flex-1 justify-center p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">Register</Text>
            <TextInput
                className="border h-12 p-2 mb-4 rounded"
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
                onPress={handleRegister}
            >
                <Text className="text-white">Register</Text>
            </Pressable>
            <Pressable
                className="mt-4"
                onPress={() => router.navigate('/login')}
            >
                <Text className="text-blue-500">Already have an account? Login</Text>
            </Pressable>
        </View>
    );
};

export default RegisterScreen;