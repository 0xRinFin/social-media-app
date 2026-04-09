// app/(tabs)/profile/_layout.tsx

import { Stack } from 'expo-router';
import Profile from "@/app/(tabs)/profile/profile";

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name="profile" />
            <Stack.Screen name="editprofile" />

        </Stack>
    )
}