import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, Pressable, Image, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Camera, ChevronDown, ChevronUp, Delete, Users, X} from 'lucide-react-native';
import { useAuth } from '@/context/AuthProvider';
import api from '@/services/api';
import { router } from 'expo-router';
import ChannelListItem from "@/components/ChanelListItem";

const UserListScreen = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [showChats, setShowChats] = useState(true);
    const [showRequests, setShowRequests] = useState(false);


    // Fetch friend requests
    const fetchRequests = async () => {
        try {
            const res = await api.get('/get-requests');

            setRequests(res.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const res = await api.get('/friends');
            console.log('friend list', res.data)
            setFriends(res.data);
        } catch (error) {
            console.error('Error fetching connections:', error);
        }
    };


    useEffect(() => {
        fetchFriends();
        fetchRequests();
    }, []);

    // ACCEPT REQUESTS
    const handleAcceptRequest =   async (request_id) => {
        console.log({request_id})
        try{
            await api.post(`/accept-request/${request_id}`)
            await fetchRequests();
            await fetchFriends();
            Alert.alert("Request accepted")
        }catch (error){
            console.log("Accepting request failed", error)
            Alert.alert("Accepting request failed", error?.response?.data?.error)
        }

    }



    return (
        <SafeAreaView className="flex-1 bg-white px-4">
            {/* Header */}
            <View className="flex-row items-center justify-between py-2">
                <Pressable onPress={() => router.push('/profile')}>
                    <Image
                        source={{ uri: user?.avatar || 'https://avatar.iran.liara.run/public/boy' }}
                        className="w-10 h-10 rounded-full"
                    />
                </Pressable>
                <Pressable onPress={() => router.push('/users')}>
                    <Users size={28} color="black" />
                </Pressable>
            </View>

            {/* Chats Section */}
            <Pressable
                className="flex-row justify-between items-center py-3 border-b border-gray-200"
                onPress={() => setShowChats(!showChats)}
            >
                <Text className="text-lg font-semibold">Chats</Text>
                {showChats ? <ChevronUp size={20} color="black" /> : <ChevronDown size={20} color="black" />}
            </Pressable>


                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                       <ChannelListItem item={item} key={item?.id} />
                    )}
                    ListEmptyComponent={()=> (
                        <View>
                            <Text>No chats</Text>
                        </View>
                    )}
                />


            {/* Requests Section (Only shown if there are requests) */}
            {requests.length > 0 && (
                <>
                    <Pressable
                        className="flex-row justify-between items-center py-3 border-b border-gray-200 mb-5"
                        onPress={() => setShowRequests(!showRequests)}
                    >
                        <Text className="text-lg font-semibold">You have ({requests.length}) chat requests</Text>
                        {showRequests ? <ChevronUp size={20} color="black" /> : <ChevronDown size={20} color="black" />}
                    </Pressable>

                    {showRequests && (
                        <FlatList
                            data={requests}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                    <Pressable>
                                        <Image
                                            source={{uri: "https://avatar.iran.liara.run/public/girl"}}
                                            style={{width: 40, height: 40, borderRadius: 20}}
                                        />
                                    </Pressable>

                                    <View style={{flex: 1}}>
                                        <Text className="text-2xl">{item?.username}</Text>
                                        <Text className="text-gray-400">{item?.message}</Text>
                                    </View>
<View className="flex-row gap-4 items-center">
    <Pressable
        onPress={()=>
            handleAcceptRequest(item.id)
        }
        style={{
            padding: 10,
            width: 80,
            backgroundColor: '#005187',
            borderRadius: 4,
        }}>
        <Text style={{textAlign: 'center', color: 'white'}}>Accept</Text>
    </Pressable>
    <X size={24} color="red" />
</View>

                                </View>

                            )}
                        />
                    )}
                </>
            )}
        </SafeAreaView>
    );
};

export default UserListScreen;