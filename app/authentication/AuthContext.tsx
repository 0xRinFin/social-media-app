import { AuthContext } from './use-auth-context'
import { supabase } from '../utils/supabase'
import {PropsWithChildren, useCallback, useEffect, useState} from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
    const [claims, setClaims] = useState<Record<string, any> | undefined | null>()
    const [profile, setProfile] = useState<any>()
    const [session, setSession] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (claims == undefined) return;

        const fetchSession = async () => {
            const {data, error} = await supabase.auth.getSession()
            if (error) console.error('Error fetching session:', error)

            setSession(data.session)
        }

        console.log("haii")
        fetchSession()
    }, [claims])

    useEffect(() => {
        const fetchClaims = async () => {
            setIsLoading(true)

            const { data, error } = await supabase.auth.getClaims()
            if (error) console.error('Error fetching claims:', error)

            setClaims(data?.claims ?? null)
            setIsLoading(false)
        }

        fetchClaims()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, _session) => {
            console.log('Auth state changed:', { event: _event })

            if (_event === 'SIGNED_OUT' || !_session) {
                setClaims(null)
                return
            }

            // const { data } = await supabase.auth.getClaims()
            fetchClaims()
        })

        // supabase.auth.on

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const fetchProfile = async () => {
        let rawr = {};
        if (claims) {
            const { data } = await supabase.from('profiles').select('*').eq('id', claims.sub).single()
            console.log("NEW DATA", data)
            rawr = data

            setProfile(data)
        } else {
            setProfile(null)
        }

        console.log("NEW PROFILE", profile, rawr)
    }

    useEffect(() => {
        setIsLoading(true)

        fetchProfile()

        setIsLoading(false)
    }, [claims])

    return (
        <AuthContext.Provider
            value={{
                claims,
                isLoading,
                profile,
                session,
                fetchProfile,
                isLoggedIn: claims != undefined,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}