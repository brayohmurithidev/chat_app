import {
    Alert,
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets} from "react-native-safe-area-context";
import {Camera, ChevronLeft, Mic, Smile} from "lucide-react-native";
import {useLayoutEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {router, useLocalSearchParams} from "expo-router";
import {useAuth} from "@/context/AuthProvider";
import api from "@/services/api";

const RequestsChatScreen = () => {
    const [message, setMessage] = useState('');
    const navigation = useNavigation()
    const {name, receiver_id} =useLocalSearchParams()
   const {user} = useAuth()
const route = useRoute()
    console.log({route})

    useLayoutEffect(() => {
        return navigation.setOptions({
            headerLeft: ()=>(
                <View className="flex-row items-center gap-5">
                    <TouchableOpacity onPress={()=> router.navigate('/home')}>
                        <ChevronLeft size={30} />
                    </TouchableOpacity>

                    <View>
                        <Text className="text-blue-500">{name}</Text>
                    </View>
                </View>
            ),
            title: ""
        })
    }, []);

    const sendMessage = async () =>{

        try {
            const userData = {
                sender_id: user?.id,
                receiver_id,
                message
            }
            const response = await  api.post('/send-request', userData)
            if(response.status === 200){
                setMessage('')
                Alert.alert("Your message was sent.", "Wait for the user to accept your request.")
            }

        }catch (error){
console.log("error sending message", error)
        }
    }


    return (
    <KeyboardAvoidingView className="flex-1"  >
        <ScrollView></ScrollView>
        <View className="bg-white flex-row items-center p-3 border-t border-t-gray-400 mb-5">
            <Smile size={24} color="#333" />
            <TextInput placeholder="Type your message ..." className="flex-1 border border-gray-400 rounded-2xl px-4 h-10 ml-3"  value={message} onChangeText={setMessage} />

            <View className='flex-row items-center gap-4 mx-4'>
                <Camera size={24} color="#333" />
                <Mic size={24} color="#333" />
            </View>
            <Pressable disabled={message.length === 0} onPress={sendMessage} className="bg-blue-500 px-3 py-2 rounded-lg">
                <Text className="text-center text-white">Send</Text>
            </Pressable>
        </View>

    </KeyboardAvoidingView>
    );
};

export default RequestsChatScreen;
