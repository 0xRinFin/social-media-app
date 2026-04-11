import { fetchProfileImage, formatDate } from "@/app/utils/postUtils"
import { supabase } from "@/app/utils/supabase"
import { Image } from "expo-image"
import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { formatDistanceToNow } from "date-fns"

export type commentData = {
    id: string,
    post_id: string,
    user_id: string,
    content: string,
    created_at: string
}

type commentProps = {
  commentData: commentData
}

const PostComment = (props: commentProps) => {
    const commentData = props.commentData

    const [commentProfile, setCommentProfile] = useState<any>()

    const [imageUrl, setImageUrl] = useState<string>("")
    const [displayName, setDisplayName] = useState<string>("")
    const [handle, setHandle] = useState<string>("")

    const fetchCommentData = async () => {
        const {data} = await supabase.from("profiles").select("*").eq("id", commentData.user_id).single()
        if (data == undefined) return

        setCommentProfile(data)
    }

    const renderCommentData = async () => {
        if (commentProfile == undefined) return;

        const imageUrl = await fetchProfileImage(commentData.user_id)

        setImageUrl(imageUrl)
        setDisplayName(commentProfile.display_name)
        setHandle(commentProfile.handle)
    }

    useEffect(() => {
        fetchCommentData()
    }, [fetchCommentData])

    useEffect(() => {
        renderCommentData()
    }, [commentProfile])

    return (
         <View className="flex gap-4">
            <View className="flex flex-row gap-2">
                <Image source={imageUrl}  style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 1, borderColor: "#2f2f2f" }} />

              <View className="w-[85%]">
                <View className="flex flex-row justify-between items-center grow">
                    <View className="flex flex-row items-center gap-1">
                        <Text className="color-white text-md font-bold">{displayName}</Text>
                        <Text className="color-amber-400 opacity-50 text-sm">@{handle}</Text>
                    </View>

                    <Text className="color-neutral-400">{formatDistanceToNow(commentData.created_at, { addSuffix: true })}</Text>

                </View>

                <Text className="text-white font-light">{commentData.content}</Text>
              </View>
            </View>

        </View>
    )
}

export default PostComment