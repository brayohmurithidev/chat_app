import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthProvider";
import { Camera, ChevronLeft, Mic, Smile } from "lucide-react-native";
import api from "@/services/api";
import { useChatContext } from "@/context/ChatProvider";

const ChatRoom = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const scrollViewRef = useRef(null); // Reference for auto-scrolling
    const navigation = useNavigation();
    const { username, receiver_id } = useLocalSearchParams();
    const { user } = useAuth();
    const { socket } = useChatContext();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View className="flex-row items-center gap-5">
                    <TouchableOpacity onPress={() => router.navigate('/home')}>
                        <ChevronLeft size={30} />
                    </TouchableOpacity>
                    <View className="flex-row items-center gap-4">
                        <Image
                            source={{ uri: "https://avatar.iran.liara.run/public/girl" }}
                            style={{ width: 30, height: 30, borderRadius: 20 }}
                        />
                        <Text className="text-blue-500">{username}</Text>
                    </View>
                </View>
            ),
            title: ""
        });
    }, [navigation, username]);

    // Real-time message listener (Fixed re-renders)
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (!newMessage.created_at) {
                newMessage.created_at = new Date().toISOString(); // Ensure valid timestamp
            }
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => socket.off("newMessage", handleNewMessage);
    }, [socket]);

    //  Send Message
    const sendMessage = async () => {
        if (!message.trim()) return;
        try {
            const messageData = {
                sender_id: user?.id,
                receiver_id,
                message,
                created_at: new Date().toISOString()
            };
            await api.post('/send-message', messageData);
            socket.emit("sendMessage", messageData);
            setMessage('');
            fetchMessages(); // Fetch latest messages after sending
        } catch (error) {
            console.log("Error sending message", error);
        }
    };

    // Fetch Messages
    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages', {
                params: {
                    sender_id: user?.id,
                    receiver_id,
                }
            });
            setMessages(response.data);
        } catch (error) {
            console.log("Error fetching messages", error);
            Alert.alert("Error", "Error fetching messages");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [receiver_id]);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // Format Time Function
    const formatTime = (time) => {
        if (!time) return "";
        return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Messages List */}
                <ScrollView
                    ref={scrollViewRef}
                    className="p-4 flex-1 mb-6"
                    keyboardShouldPersistTaps="handled"
                >
                    {messages.map((item, index) => (
                        <View
                            key={index}
                            className={`p-3 mb-2 max-w-[80%] rounded-lg ${
                                item.sender_id === user?.id ? 'bg-blue-500 self-end' : 'bg-gray-300 self-start'
                            }`}
                        >
                            <Text className={`text-white ${item.sender_id !== user?.id ? 'text-black' : ''}`}>
                                {item.message}
                            </Text>
                            <Text className="text-xs text-gray-600 self-end">{formatTime(item.created_at)}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input & Send Button */}
                <View className="bg-white flex-row items-center p-3 border-t border-gray-400 ">
                    <Smile size={24} color="#333" />
                    <TextInput
                        placeholder="Type your message ..."
                        className="flex-1 border border-gray-400 rounded-2xl px-4 h-10 ml-3"
                        value={message}
                        onChangeText={setMessage}
                        onSubmitEditing={sendMessage} // Allow sending by pressing Enter
                        returnKeyType="send"
                    />
                    <View className='flex-row items-center gap-4 mx-4'>
                        <Camera size={24} color="#333" />
                        <Mic size={24} color="#333" />
                    </View>
                    <Pressable
                        onPress={sendMessage}
                        disabled={!message.trim()}
                        className={`px-3 py-2 rounded-lg ${message.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
                    >
                        <Text className="text-center text-white">Send</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default ChatRoom;