import {createClient} from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage'

const isSSR = typeof window === 'undefined'

const ExpoWebSecureStoreAdapter = {
    getItem: (key: string) => {
        if (isSSR) return null
        console.debug('getItem', { key })
        return AsyncStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
        if (isSSR) return
        return AsyncStorage.setItem(key, value)
    },
    removeItem: (key: string) => {
        if (isSSR) return
        return AsyncStorage.removeItem(key)
    },
}

export const supabase = createClient(
process.env.EXPO_PUBLIC_SUPABASE_URL!,
process.env.EXPO_PUBLIC_SUPABASE_KEY!,
{
    auth: {
        storage: ExpoWebSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})