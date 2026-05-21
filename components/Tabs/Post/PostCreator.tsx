import { baseButtonStyle } from "@/app/(tabs)/profile/editprofile"
import { AuthContext } from "@/app/authentication/use-auth-context"
import { formatDate } from "@/app/utils/postUtils"
import { supabase } from "@/app/utils/supabase"
import { WrappedButton } from "@/components/WrappedButton"
import { Image } from "expo-image"
import { Link, usePathname } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { Text, View } from "react-native"
import { requestFollow } from "../Profile/Viewprofile"

export type postProps = {
    postCreator: string, imageUrl: string, handle: string, displayName: string, postDate: string
}

const PostCreator = (props: postProps) => {
    const {profile, session} = useContext(AuthContext)

    const pathName = usePathname()
    const routeOpened = pathName.split("/")[1]

    const [isSelf, setIsSelf] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshCounter, setRefreshCounter] = useState(0)
    const [isFollowing, setIsFollowing] = useState(false)

    const fetchIsFollowing = async () => {
        if (profile == undefined) return

        const {data} = await supabase.from("follows").select("*").eq("follower_id", profile.id).eq("following_id", props.postCreator).maybeSingle()

        setIsSelf(profile.id == props.postCreator)
        setIsFollowing(data != null)
    }

    const handleFollowPress = async () => {
        if (isLoading) return

        const didUpdate = await requestFollow(session, props.handle, setIsLoading, setRefreshCounter)
        if (didUpdate)
            setIsFollowing(prev => !prev)
    }

    useEffect(() => {
        fetchIsFollowing()
    }, [profile, props.postCreator, refreshCounter])

    return (
        <View className="flex items-start w-full">
            <View className="flex flex-row items-center w-full justify-between">
                <Link href={`${routeOpened}/profile/${props.handle}`}>
                    <View className="flex flex-row items-center gap-2">
                        <Image source={props.imageUrl}  style={{ width: 80, height: 80, borderRadius: 50, borderWidth: 2, borderColor: "#2f2f2f" }} />

                        <View>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="color-white text-xl font-bold">{props.displayName}</Text>
                                <Text className="color-amber-400 opacity-50">@{props.handle}</Text>
                            </View>

                            <Text className="color-neutral-400">{formatDate(props.postDate)}</Text>
                        </View>
                    </View>
                </Link>

                <View className={`w-40 ${isSelf && "hidden"}`}>
                    <WrappedButton isLoading={isLoading} title={isFollowing ? "Следваш" : "Последвай"} isActive={true} isAnimated={true} onClick={handleFollowPress} extraClassName={"w-full " + baseButtonStyle + ` ${ isFollowing && "bg-neutral-600" }`}/>
                </View>
            </View>
        </View>
    )
}

export default PostCreator
