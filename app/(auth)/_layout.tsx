import {Tabs, useSegments} from "expo-router";
import {MaterialIcons} from "@expo/vector-icons";
import {Home} from "lucide-react-native";


const AuthLayout = () => {
    const segment = useSegments()

    //get current page
    const page = segment[segment.length - 1]

    //const
    const pagesToHideTabBar = ['chats',  'requestChatRoom', 'chatRoom'];


    return (
        <Tabs initialRouteName='home' screenOptions={{ tabBarStyle: {

            //check if the current page is in the list and hide
                display: pagesToHideTabBar.includes(page) ? 'none' : 'flex'
        }
        }} >
            <Tabs.Screen  name="requestChatRoom" options={{
                href: null
            }} />
            <Tabs.Screen  name="users" options={{
               href: null,
                headerShown: false
            }} />
            <Tabs.Screen name="home" options={{
                title: "Home",
                headerShown:false,
                tabBarIcon:({color, })=> <Home size={30} color={color}  />
            }} />
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon:()=> <MaterialIcons name='person' size={30} />
            }} />
            <Tabs.Screen name="chats" options={{
             href: null
            }} />
            <Tabs.Screen name="chatRoom" options={{
             href: null
            }} />

        </Tabs>
    )
}

export default AuthLayout;