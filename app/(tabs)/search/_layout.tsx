// app/(tabs)/profile/_layout.tsx

import { Stack } from 'expo-router';

export default function SearchLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="search/[handle]" />
            <Stack.Screen name="search" />
        </Stack>
    )
}