// app/(tabs)/profile/_layout.tsx

import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="profile/[handle]" />
            <Stack.Screen name="following/[handle]" />
            <Stack.Screen name="editprofile"  />
            <Stack.Screen name="updatedetail" />
        </Stack>
    )
}