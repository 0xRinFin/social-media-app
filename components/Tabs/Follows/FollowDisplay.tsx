import { Pressable, Text, View } from "react-native"
import { followerInfo } from "./FollowPage"
import { Image } from "expo-image"
import { WrappedButton } from "@/components/WrappedButton"
import { baseButtonStyle } from "@/app/(tabs)/profile/editprofile"
import { useContext, useEffect, useState } from "react"
import { supabase } from "@/app/utils/supabase"
import { fetchProfileImage } from "@/app/utils/postUtils"
import { AuthContext } from "@/app/authentication/use-auth-context"
import { requestFollow } from "../Profile/Viewprofile"
import { usePathname, useRouter } from "expo-router"

const FollowDisplay = (props: {targetId: string}) => {
    const router = useRouter()
    const {session, profile} = useContext(AuthContext)
    const pathName = usePathname()
    const routeOpened = pathName.split("/")[1]
    
    const [handle, setHandle] = useState("")
    const [display, setDisplay] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    
    const [profileData, setProfileData] = useState<any>(undefined)

    const [isFollowing, setIsFollowing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [refreshCounter, setRefreshCounter] = useState(0)

    const [isSelf, setIsSelf] = useState(false)

    const fetchIsFollowing = async () => {
        if (profile == undefined) return

       const {success} = await supabase.from("follows").select("*").eq("follower_id", profile.id).single()

       setIsSelf(profile.handle == handle)
       setIsFollowing(success)   
    }

    const fetchProfileData = async () => {
        const {data, success} = await supabase.from("profiles").select("*").eq("id", props.targetId).single()    
        if (!success)
            return

        setProfileData(data)
    }

    const renderProfile = async () => {
        if (profileData == undefined) return

        const image = await fetchProfileImage(props.targetId)
        setImageUrl(image)

        setHandle(profileData.handle)
        setDisplay(profileData.display_name)
    }

    useEffect(() => {
        fetchIsFollowing()
    }, [profile, refreshCounter])

    useEffect(() => {
        renderProfile()
    }, [profileData])

    useEffect(() => {
        fetchProfileData()
    }, [fetchProfileData])

    return (
        <View className="w-full h-24 border border-neutral-800 rounded-xl flex flex-row justify-between items-center p-2">
          <Pressable onPress={() => router.push(`${routeOpened}/profile/${handle}`)}>
              <View className="flex flex-row gap-3">
                <Image source={imageUrl} style={{ width:70, height: 70, borderRadius:100, borderWidth:1, borderColor:"#2f2f2f" }}/>

                <View className="flex items-start gap-1 justify-center">
                    <Text className="color-white text-xl font-bold">{display}</Text>
                    <Text className="color-amber-400 opacity-50">@{handle}</Text>
                </View>
            </View>
          </Pressable>

            <View className={`w-40 ${isSelf && "hidden"}`}>
                <WrappedButton isLoading={isLoading} title={isFollowing ? "Following" : "Follow"} isActive={true} isAnimated={true} onClick={() => requestFollow(session, handle, setIsLoading, setRefreshCounter)} extraClassName={"w-full " + baseButtonStyle + ` ${ isFollowing && "bg-neutral-600" }`}/>
            </View>
        </View>
    )
}

export default FollowDisplay