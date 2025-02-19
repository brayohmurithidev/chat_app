import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import api from "@/services/api";
import {useLocalSearchParams} from "expo-router";
import {socket} from "@/services/socket";



const ChatScreen = () => {
    const { receiverId } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await api.get(`/messages?receiver_id=${receiverId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };
        fetchMessages();

        socket.on('receiveMessage', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [receiverId]);

    const handleSendMessage = () => {
        if (message.trim()) {
            socket.emit('sendMessage', {
                sender_id: 1, // Replace with logged-in user ID
                receiver_id: receiverId,
                message,
            });
            setMessage('');
        }
    };

    return (
        <View className="flex-1 p-4 bg-white">
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="p-2 border-b">
                        <Text className="text-lg">{item.message}</Text>
                    </View>
                )}
            />
            <View className="flex-row mt-4">
                <TextInput
                    className="flex-1 border p-2 rounded"
                    placeholder="Type a message"
                    value={message}
                    onChangeText={setMessage}
                />
                <Pressable
                    className="bg-blue-500 p-3 rounded ml-2"
                    onPress={handleSendMessage}
                >
                    <Text className="text-white">Send</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ChatScreen;