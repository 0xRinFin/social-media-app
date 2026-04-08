import { AuthContext } from './use-auth-context'
import { supabase } from '../utils/supabase'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
    const [claims, setClaims] = useState<Record<string, any> | undefined | null>()
    const [profile, setProfile] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchClaims = async () => {
            setIsLoading(true)

            const { data, error } = await supabase.auth.getClaims()

            if (error) {
                console.error('Error fetching claims:', error)
            }

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
            setClaims(_session.user)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)

            if (claims) {
                const { data } = await supabase.from('profiles').select('*').eq('id', claims.id).single()

                setProfile(data)
            } else {
                setProfile(null)
            }

            setIsLoading(false)
        }

        fetchProfile()
    }, [claims])

    return (
        <AuthContext.Provider
            value={{
                claims,
                isLoading,
                profile,
                isLoggedIn: claims != undefined,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}