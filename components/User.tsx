import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {router} from "expo-router";

const User = ({item}) => {

    return (
        <View style={{padding: 10, marginTop: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Pressable>
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/girl"}}
                        style={{width: 40, height: 40, borderRadius: 20}}
                    />
                </Pressable>

                <View style={{flex: 1}}>
                    <Text>{item?.username}</Text>
                </View>

                <Pressable
                    onPress={() =>
                        router.navigate('/requestChatRoom', {
                            name: item?.username,
                            receiver_id: item?.id,
                        })
                    }
                    style={{
                        padding: 10,
                        width: 80,
                        backgroundColor: '#005187',
                        borderRadius: 4,
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>Chat</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default User;

const styles = StyleSheet.create({});