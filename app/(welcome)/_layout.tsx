import {Stack} from "expo-router";

const WelcomeLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="index" />
        </Stack>
    )
}

export default WelcomeLayout;