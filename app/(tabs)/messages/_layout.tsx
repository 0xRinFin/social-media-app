// app/(tabs)/profile/_layout.tsx

import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="messages/[conversation]" />
            <Stack.Screen name="messages" />
            <Stack.Screen name="profile/[handle]" />
        </Stack>
    )
}