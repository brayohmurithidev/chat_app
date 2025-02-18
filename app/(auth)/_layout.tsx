import {TabList, Tabs, TabSlot, TabTrigger} from "expo-router/ui";
import {Text} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";


const AuthLayout = () => {
   const {bottom} = useSafeAreaInsets()
    return (

        <Tabs style={{flex: 1, padding:10}}>
            <TabSlot/>
            <TabList>
                <TabTrigger name="index" href="/">
                    <Text>Home</Text>
                </TabTrigger>
                <TabTrigger name="profile" href="/profile">
                    <Text>Profile</Text>
                </TabTrigger>
            </TabList>
        </Tabs>

    )
}

export default AuthLayout;