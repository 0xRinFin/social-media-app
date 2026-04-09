import {Slot, Stack, useRouter} from 'expo-router';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {useContext, useMemo, useEffect, useState} from "react";

import AuthProvider from "./authentication/AuthContext";
import {useAuthContext} from "./authentication/use-auth-context";

const RootNavigator = () => {
    const router = useRouter();
    const { isLoggedIn, isLoading, claims } = useAuthContext();

    const loggedOutHandler = () => {
        if (isLoading) return;
        if (!isLoggedIn) return router.replace('/(welcome)/AboutLinque');


    }
    const checkLogged = () => {
        if (isLoggedIn) return router.replace("/home")
        loggedOutHandler();
    }

    useEffect(checkLogged, [isLoggedIn]);
    useEffect(loggedOutHandler, [isLoading]);

    return (
        <Stack>
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>

            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
    )
}

const RootLayout = () => {
    return (
        <SafeAreaProvider className="h-full flex-1">
            <AuthProvider>
                <RootNavigator/>
            </AuthProvider>
            <StatusBar style="light" />
        </SafeAreaProvider>
    );
};

export default RootLayout;
