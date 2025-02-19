import {View, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {Redirect, router} from "expo-router";
import {useAuth} from "@/context/AuthProvider";

export default function EntryScreen() {
const {user, loading} = useAuth()

    console.log({user, loading})


    if(loading){
        return <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
        </View>
    }

    if(user){
        return <Redirect href='/home' />
    }


    return (
        <View className="flex-1 items-center justify-center bg-blue-500 px-6">
            <Text className="text-4xl font-bold text-white mb-6">CHAT APP</Text>

            <TouchableOpacity
                className="w-full bg-white p-4 rounded-lg mb-4"
                onPress={() => router.navigate("/login")}
            >
                <Text className="text-center text-blue-500 font-bold">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full bg-white p-4 rounded-lg"
                onPress={() => router.navigate("/register")}
            >
                <Text className="text-center text-blue-500 font-bold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}