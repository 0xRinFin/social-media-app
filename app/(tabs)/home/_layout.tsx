// app/(tabs)/profile/_layout.tsx

import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="index"  />
            <Stack.Screen name="post/[post]" />
        </Stack>
    )
}