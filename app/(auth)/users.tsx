import React, {useEffect, useState} from 'react';
import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, FlatList, Pressable, Text, View} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "@/services/api";
import {router} from "expo-router";
import User from "@/components/User";

type  UserType = {
    id: number,
    username: string,
    password: string,
}


const Users = () => {
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await  SecureStore.getItemAsync('token');
                const response = await api.get('/users', {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleConnect =  (item:any) => {
  router.navigate({
      pathname: '/requestChatRoom',
      params: {
          name:item.username,
          receiver_id: item.id
      }
  })
    };

    console.log({users})
    return (
      <SafeAreaView className="flex-1 p-4 bg-white">
          <Text className="text-2xl font-bold mb-4">Users</Text>
          <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) =>  <User item={item} key={item?.id} />

              }
          />
      </SafeAreaView>
    );
};

export default Users;
