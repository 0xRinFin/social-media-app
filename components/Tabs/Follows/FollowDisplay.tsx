import { View } from "react-native"
import { WrappedButton } from "@/components/WrappedButton"
import { baseButtonStyle } from "@/app/(tabs)/profile/editprofile"
import { useContext, useEffect, useState } from "react"
import { supabase } from "@/app/utils/supabase"
import { AuthContext } from "@/app/authentication/use-auth-context"
import { requestFollow } from "../Profile/Viewprofile"
import UserDisplay from "@/components/UserDisplay"

const FollowDisplay = (props: {targetId: string}) => {
    const {session, profile} = useContext(AuthContext)
    const [handle, setHandle] = useState("")

    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [refreshCounter, setRefreshCounter] = useState(0)

    const [isSelf, setIsSelf] = useState(false)

    const fetchIsFollowing = async () => {
        if (profile == undefined) return

        const {success} = await supabase.from("follows").select("*").eq("follower_id", profile.id).eq("following_id", props.targetId).single()
        setIsFollowing(success)   
    }

    const fetchProfileData = async () => {
        const {data, success} = await supabase.from("profiles").select("*").eq("id", props.targetId).single()    
        if (!success)
            return

        setIsSelf(profile.handle == data.handle)
        setHandle(data.handle)
    }

    const follow = () => {
        requestFollow(session, handle, setIsLoading, setRefreshCounter)
    }

    useEffect(() => {
        fetchIsFollowing()
    }, [profile, refreshCounter])

    useEffect(() => {
        fetchProfileData()
    }, [fetchProfileData])


    return (
        <UserDisplay targetId={props.targetId}>
            <View className={`w-40 ${isSelf && "hidden"}`}>
                <WrappedButton isLoading={isLoading} title={isFollowing ? "Following" : "Follow"} isActive={true} isAnimated={true} onClick={follow} extraClassName={"w-full " + baseButtonStyle + ` ${ isFollowing && "bg-neutral-600" }`}/>
            </View>
        </UserDisplay>
    )
}

export default FollowDisplay