import {Stack, Tabs} from "expo-router";
import {ReactNode, useState} from "react";

const WelcomeLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="test"/>
            <Stack.Screen name="AboutLinque" />
            <Stack.Screen name="rawr" />
            <Stack.Screen name="Browse" />
        </Stack>
    )
}

export default WelcomeLayout;