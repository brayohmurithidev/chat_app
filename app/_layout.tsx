import {Slot, Stack} from "expo-router";

// Import your global CSS file
import "../global.css";
import {AuthProvider} from "@/context/AuthProvider";
import {ChatProvider} from "@/context/ChatProvider";

export default function RootLayout() {
  return <AuthProvider>
    <ChatProvider>
      <Stack  screenOptions={{headerShown: false}} />
    </ChatProvider>
  </AuthProvider> ;
}
