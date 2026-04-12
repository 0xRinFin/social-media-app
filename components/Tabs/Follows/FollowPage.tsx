import { supabase } from "@/app/utils/supabase";
import TabPage from "@/components/Tabs/TabPage";
import { WrappedButton } from "@/components/WrappedButton";
import { useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { defaultIcon } from "@/app/utils/postUtils";
import { baseButtonStyle } from "@/app/(tabs)/profile/editprofile";
import FollowDisplay from "./FollowDisplay";

type followPageProps = {
    type: "followers" | "followings"
}

export type followerInfo = {
    follower_id: string,
    following_id: string,
    created_at: string
}

const FollowPage = (props: followPageProps) => {
    const params = useLocalSearchParams<{handle: string}>();

    const [targetProfile, setTargetProfile] = useState<any>(undefined)
    const [followingList, setFollowingList] = useState<any>([])

    const [refreshCount, setRefreshCount] = useState(0)

    const isFollowerPage = props.type == "followers" 

    const fetchTargetProfile = async () => {
        const {data, success} = await supabase.from("profiles").select("*").eq("handle", params.handle).single()
        if (success != true)
            return

        setTargetProfile(data)
    }

    const fetchFollowerList = async () => {
        if (targetProfile == undefined) return
        const {data} = await supabase.from("follows").select("*").eq(isFollowerPage ? "following_id" : "follower_id", targetProfile.id)
        setFollowingList(data)
    }

    const refresh = async () => {
        setRefreshCount(past => past + 1)
    }

    useEffect(() => {
        fetchFollowerList()
    }, [targetProfile, refreshCount])

    useEffect(() => {
        fetchTargetProfile()
    }, [params.handle])

    return (
        <TabPage onRefresh={refresh} title={`@${params.handle}'s ${isFollowerPage ? "Followers" : "Followings"}`} titleVisible={true}>
            <View className="p-4 flex gap-2">
                {
                    followingList.map((x: followerInfo, i: number) => {
                        return (
                            <FollowDisplay targetId={isFollowerPage ? x.follower_id : x.following_id} key={i}/>
                        )
                    })
                }
            </View>
        </TabPage>
    )
}

export default FollowPage