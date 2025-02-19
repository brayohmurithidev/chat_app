import React from 'react';
import {Image, Pressable, Text, View} from "react-native";
import {router} from "expo-router";

const ChannelListItem = ({item}) => {
    return (
        <Pressable
            onPress={() =>
                router.navigate({pathname:'/chatRoom', params: {
                username: item?.username,
                receiver_id: item?.id,
                image: "https://avatar.iran.liara.run/public/girl",
            }})
            }
            style={{marginVertical: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <Pressable>
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/girl"}}
                        style={{width: 40, height: 40, borderRadius: 20}}
                    />
                </Pressable>

                <View>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>{item?.username}</Text>
                    <Text style={{marginTop: 4, color: 'gray'}}>
                        {/*{lastMessage*/}
                        {/*    ? lastMessage.message*/}
                        {/*    :*/}
                        { `Start chat with ${item?.username}`}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ChannelListItem;
